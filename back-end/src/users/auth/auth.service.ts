import * as bcrypt from 'bcrypt';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { IConfirmationMessage } from 'src/types/response.type';

/**
 * Service to handle user authentication, sign up and sign in.
 * @function signUp sign up a new user
 * @function signIn sign in a user
 * @function signOut sign out a user
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   *  Sign up a new user, hash password and save to database.
   * @param {SignUpDto} user user data
   * @returns {Promise<UserEntity>} user entity
   * @throws {InternalServerErrorException} if could not create user
   */
  async signUp(user: SignUpDto): Promise<UserEntity> {
    try {
      user.password = await this.hashPassword(user.password);
      const userEntity = this.userRepository.create(user);

      userEntity.avatarURL = this.configService.get<string>(
        'USER_DEFAULT_AVATAR',
      );
      return await this.userRepository.save(userEntity);
    } catch (error) {
      /**
       * If the error is due to duplicate phone number throw
       * InternalServerErrorException with message.
       * the contraint name should be changed if the database table name
       * of the column name is changed.
       */
      if (error.constraint === 'user_entity_phoneNumber_key')
        throw new InternalServerErrorException('Phone number already exists');
      throw new InternalServerErrorException('Could not create user');
    }
  }

  /**
   * Sign in a user, generate jwt access token and set cookie.
   * @param {SignInDto} param0 user data
   * @param {Response} res response object
   * @returns {Promise<UserEntity>} user entity
   * @throws {NotFoundException} if user not found
   * @throws {UnauthorizedException} if user not confirmed or wrong password
   * @throws {InternalServerErrorException} if could not sign in
   */
  async signIn(
    { phoneNumber, password }: SignInDto,
    res: Response,
  ): Promise<UserEntity> {
    try {
      /* First lets find the user by phone number */
      const userEntity = await this.userRepository.findOne({
        where: { phoneNumber },
      });

      /* If user not found throw NotFoundException */
      if (!userEntity) {
        throw new NotFoundException('User not found');
      }
      /* Check if the user is not confirmed by the admin */
      if (!userEntity.confirmedByAdmin) {
        throw new UnauthorizedException('User not confirmed');
      }
      /* Compare password with hashed password */
      const isMatch = await bcrypt.compare(password, userEntity.password);

      /* If password does not match throw UnauthorizedException */
      if (!isMatch) {
        throw new UnauthorizedException('Wrong password');
      }
      /**
       * Set cookie with jwt access token with httpOnly flag to
       * disable access from client side.
       */
      res.cookie(
        'access_token',
        await this.jwtAccessToken(userEntity.phoneNumber, userEntity.id),
        { httpOnly: true },
      );
      return userEntity;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      if (error.status === HttpStatus.UNAUTHORIZED)
        throw new UnauthorizedException(error.message);
      throw new InternalServerErrorException('Could not sign in user');
    }
  }

  /**
   * Sign out a user, clear cookie and close socket connection.
   * @param {Response} res response object
   * @returns {IConfirmationMessage} confirmation message
   */
  signOut(res: Response): IConfirmationMessage {
    res.clearCookie('access_token');
    // TODO: close the user socket connection
    return { message: 'Logged out successfully' };
  }

  /**
   * Private method to hash password with bcrypt
   * @param {string} password  string to hash
   * @returns {Promise<string>} hashed password
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  /**
   * Private method to generate jwt access token
   * @param {string} phoneNumber registered phone number
   * @param {number} id user id
   * @returns {Promise<string>} jwt access token
   */
  private async jwtAccessToken(
    phoneNumber: string,
    id: number,
  ): Promise<string> {
    const payload = { username: phoneNumber, sub: id };
    return await this.jwtService.signAsync(payload);
  }
}
