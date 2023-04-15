import * as bcrypt from 'bcrypt';
import {
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

/**
 * Service to handle user authentication, sign up and sign in.
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   *  Sign up a new user, hash password and save to database.
   * @param {SignUpDto} user user data
   * @returns {Promise<UserEntity>} user entity
   */
  async signUp(user: SignUpDto): Promise<UserEntity> {
    user.password = await this.hashPassword(user.password);
    try {
      const userEntity = this.userRepository.create(user);
      return await this.userRepository.save(userEntity);
    } catch (error) {
      if (error.constraint === 'user_entity_phoneNumber_key')
        throw new InternalServerErrorException('Phone number already exists');
      throw new InternalServerErrorException('Could not create user');
    }
  }

  /**
   *  Sign in a user, generate jwt access token and set cookie.
   * @param {SignInDto} param0 user data
   * @param {Response} res response object
   * @returns {Promise<UserEntity>} user entity
   */
  async signIn(
    { phoneNumber, password }: SignInDto,
    res: Response,
  ): Promise<UserEntity> {
    // First lets find the user by phone number
    const userEntity = await this.userRepository.findOne({
      where: { phoneNumber },
    });

    // If user not found throw NotFoundException
    if (!userEntity) {
      throw new NotFoundException('User not found');
    }
    // Check if the user is not confirmed by the admin
    if (!userEntity.confirmedByAdmin) {
      throw new UnauthorizedException('User not confirmed');
    }
    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, userEntity.password);
    // If password does not match throw UnauthorizedException
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
