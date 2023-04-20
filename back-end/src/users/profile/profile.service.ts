import * as bcrypt from 'bcrypt';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'nestjs-cloudinary';
import { OrderService } from 'src/orders/order.service';
import { IProfile } from '../types/profile.type';
import { IConfirmationMessage } from 'src/types/response.type';
import { UpdatePasswordDto } from './dto/profile.dto';

/**
 * The profile service it will be responsible for the user profile operations.
 * @function getProfile - Get the user profile with the orders of the user.
 * @function getAdminProfile - Get the admin profile with the orders of all users.
 * @function updateName - Update the user name.
 * @function updateAvatar - Update the user avatar.
 * @function updatePhoneNumber - Update the user phone number.
 * @function updateAddress - Update the user address.
 */
@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly orderService: OrderService,
  ) {}

  /**
   * Get the user profile with the orders of the user.
   * @param {number} id - The user id.
   * @returns {Promise<IProfile>} - The user profile.
   */
  public async getProfile(id: number): Promise<IProfile> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
      if (!user) throw new NotFoundException('User not found');
      const orders = await this.orderService.getUserProfileOrders(id);

      return {
        name: user.name,
        avatarURL: user.avatarURL,
        phoneNumber: user.phoneNumber,
        address: user.address,
        orders,
      };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('Error getting profile');
    }
  }

  /**
   * Get the admin profile with the orders of all users.
   * @param {number} id - The admin id.
   * @returns {Promise<IProfile>} - The admin profile.
   */
  public async getAdminProfile(id: number): Promise<IProfile> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
      if (!user) throw new NotFoundException('User not found');
      if (!user.isAdmin)
        throw new UnauthorizedException('User is not an admin');
      const orders = await this.orderService.getAdminProfileOrders();

      return {
        name: user.name,
        avatarURL: user.avatarURL,
        phoneNumber: user.phoneNumber,
        address: user.address,
        orders,
      };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      if (error.status === HttpStatus.UNAUTHORIZED)
        throw new UnauthorizedException(error.message);
      throw new InternalServerErrorException('Error getting profile');
    }
  }

  /**
   * Update the user name.
   * @param {number} id - The user id.
   * @param {string} name - The new name.
   * @returns {Promise<IConfirmationMessage>} - The confirmation message.
   */
  public async updateName(
    id: number,
    name: string,
  ): Promise<IConfirmationMessage> {
    try {
      await this.userRepository.update(id, { name });

      return { message: 'Name updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error updating name');
    }
  }

  /**
   * Update the user avatar.
   * @param {number} id - The user id.
   * @param {Express.Multer.File} avatar - The new avatar.
   * @returns {Promise<IConfirmationMessage>} - The confirmation message.
   */
  public async updateAvatar(
    id: number,
    avatar: Express.Multer.File,
  ): Promise<any> {
    try {
      const avatarURL = await this.uploadAvatar(avatar);
      await this.userRepository.update(id, { avatarURL });

      return { message: 'Image updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error updating image');
    }
  }

  /**
   * Update the user phone number.
   * @param {number} id - The user id.
   * @param {string} phoneNumber - The new phone number.
   * @returns {Promise<IConfirmationMessage>} - The confirmation message.
   */
  public async updatePhoneNumber(
    id: number,
    phoneNumber: string,
  ): Promise<any> {
    try {
      await this.userRepository.update(id, { phoneNumber });

      return { message: 'Phone number updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error updating phone number');
    }
  }

  /**
   * Update the user address.
   * @param {number} id - The user id.
   * @param {string} address - The new address.
   * @returns {Promise<IConfirmationMessage>} - The confirmation message.
   */
  public async updateAddress(id: number, address: string): Promise<any> {
    try {
      await this.userRepository.update(id, { address });

      return { message: 'Address updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error updating address');
    }
  }

  /**
   * Update the user password, the old password must be provided.
   * @param {number} id - The user id.
   * @param {UpdatePasswordDto} body - The new password.
   * @returns {Promise<IConfirmationMessage>} - The confirmation message.
   */
  async updatePassword(
    id: number,
    body: UpdatePasswordDto,
  ): Promise<IConfirmationMessage> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new NotFoundException('User not found');
      const isMatch = await bcrypt.compare(body.oldPassword, user.password);
      if (!isMatch) throw new UnauthorizedException('Wong password');
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(body.newPassword, salt);
      await this.userRepository.update(id, { password });

      return { message: 'Password updated successfully' };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      if (error.status === HttpStatus.UNAUTHORIZED)
        throw new UnauthorizedException(error.message);
      throw new InternalServerErrorException('Error updating password');
    }
  }

  /**
   * Upload the avatar to the cloudinary service.
   * @param {Express.Multer.File} avatar - The avatar.
   * @returns {Promise<string>} - The avatar URL.
   */
  private async uploadAvatar(avatar: Express.Multer.File): Promise<string> {
    const result = await this.cloudinaryService.uploadFile(avatar, {
      public_id: avatar.originalname.replace(/\.jpeg|\.png|\.jpg/g, ''),
      resource_type: 'image',
    });

    return result.url;
  }
}
