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
import { IUserConfirmation } from '../types/user.type';

/**
 * Service to handle user authentication, sign up and sign in.
 * @function signUp sign up a new user
 * @function signIn sign in a user
 * @function signOut sign out a user
 * @function checkUserConfirmation check if the user is confirmed by the admin
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
  public async signUp(user: SignUpDto, res: Response): Promise<UserEntity> {
    try {
      const existedUser = await this.userRepository.findOne({
        where: { phoneNumber: user.phoneNumber },
      });
      if (existedUser)
        throw new InternalServerErrorException('Phone number already exists');
      user.password = await this.hashPassword(user.password);
      if (!user.address) user.address = '';
      const userEntity = this.userRepository.create(user);
      userEntity.avatarURL = this.configService.get<string>(
        'USER_DEFAULT_AVATAR',
      );
      const newUser = await this.userRepository.save(userEntity);

      /**
       * Set cookie with jwt access token with httpOnly flag to
       * disable access from client side.
       */
      res.cookie(
        'access_token',
        await this.jwtAccessToken(userEntity.phoneNumber, userEntity.id),
        { httpOnly: true },
      );
      return newUser;
    } catch (error) {
      console.log(error);
      if (error.message === 'Phone number already exists')
        throw new InternalServerErrorException('رقم الهاتف موجود');
      throw new InternalServerErrorException('تعذر إنشاء المستخدم');
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
  public async signIn(
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
        throw new NotFoundException('لم يتم العثور على المستخدم');
      }
      /* Check if the user is not confirmed by the admin */
      if (!userEntity.confirmedByAdmin) {
        throw new UnauthorizedException('المستخدم غير مؤكد');
      }
      /* Compare password with hashed password */
      const isMatch = await bcrypt.compare(password, userEntity.password);

      /* If password does not match throw UnauthorizedException */
      if (!isMatch) {
        throw new UnauthorizedException('كلمة مرور خاطئة');
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
      throw new InternalServerErrorException('تعذر تسجيل دخول المستخدم');
    }
  }

  /**
   * Sign out a user, clear cookie and close socket connection.
   * @param {Response} res response object
   * @returns {IConfirmationMessage} confirmation message
   */
  public signOut(res: Response): IConfirmationMessage {
    res.clearCookie('access_token');
    // TODO: close the user socket connection
    return { message: 'تم تسجيل الخروج بنجاح' };
  }

  /**
   * Check if the user is confirmed by the admin.
   * @param {number} userId user id
   * @returns {Promise<IUserConfirmation>} user confirmation
   * @throws {NotFoundException} if user not found
   * @throws {InternalServerErrorException} if could not check user confirmation
   */
  public async checkUserConfirmation(
    userId: number,
  ): Promise<IUserConfirmation> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) throw new NotFoundException('لم يتم العثور على المستخدم');
      return { userConfirmed: user.confirmedByAdmin };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('تعذر التحقق من تأكيد المستخدم');
    }
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
