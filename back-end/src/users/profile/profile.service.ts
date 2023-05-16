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
import { IProfile, IUpdateAvatar } from '../types/profile.type';
import { IConfirmationMessage } from 'src/types/response.type';
import { UpdatePasswordDto } from './dto/profile.dto';
import { v4 as uuidv4 } from 'uuid';

/**
 * The profile service it will be responsible for the user profile operations.
 * @function getProfile - Get the user profile with the orders of the user.
 * @function getAdminProfile - Get the admin profile with the orders of all users.
 * @function updateName - Update the user name.
 * @function updateAvatar - Update the user avatar.
 * @function updatePhoneNumber - Update the user phone number.
 * @function updateAddress - Update the user address.
 * @function updatePassword - Update the user password, the old password must be provided.
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
   * @throws {NotFoundException} - If user not found.
   * @throws {InternalServerErrorException} - If error getting profile.
   */
  public async getProfile(id: number): Promise<IProfile> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
      if (!user) throw new NotFoundException('لم يتم العثور على المستخدم');
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
      throw new InternalServerErrorException('خطأ في الحصول على الملف الشخصي');
    }
  }

  /**
   * Get the admin profile with the orders of all users.
   * @param {number} id - The admin id.
   * @returns {Promise<IProfile>} - The admin profile.
   * @throws {NotFoundException} - If admin not found.
   * @throws {InternalServerErrorException} - If error getting profile.
   */
  public async getAdminProfile(id: number): Promise<IProfile> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
      if (!user) throw new NotFoundException('لم يتم العثور على المستخدم');
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
      throw new InternalServerErrorException('خطأ في الحصول على الملف الشخصي');
    }
  }

  /**
   * Update the user name.
   * @param {number} id - The user id.
   * @param {string} name - The new name.
   * @returns {Promise<IConfirmationMessage>} - The confirmation message.
   * @throws {InternalServerErrorException} - If error updating name.
   */
  public async updateName(
    id: number,
    name: string,
  ): Promise<IConfirmationMessage> {
    try {
      await this.userRepository.update(id, { name });
      return { message: 'تم تحديث الاسم بنجاح' };
    } catch (error) {
      throw new InternalServerErrorException('خطأ في تحديث الاسم');
    }
  }

  /**
   * Update the user avatar.
   * @param {number} id - The user id.
   * @param {Express.Multer.File} avatar - The new avatar.
   * @returns {Promise<IConfirmationMessage>} - The confirmation message.
   * @throws {InternalServerErrorException} - If error updating avatar.
   */
  public async updateAvatar(
    id: number,
    avatar: Express.Multer.File,
  ): Promise<IUpdateAvatar> {
    try {
      const avatarURL = await this.uploadAvatar(avatar);

      await this.userRepository.update(id, { avatarURL });
      return { message: 'تم تحديث الصورة بنجاح', avatarURL };
    } catch (error) {
      throw new InternalServerErrorException('خطأ في تحديث الصورة');
    }
  }

  /**
   * Update the user phone number.
   * @param {number} id - The user id.
   * @param {string} phoneNumber - The new phone number.
   * @returns {Promise<IConfirmationMessage>} - The confirmation message.
   * @throws {InternalServerErrorException} - If error updating phone number.
   */
  public async updatePhoneNumber(
    id: number,
    phoneNumber: string,
  ): Promise<any> {
    try {
      await this.userRepository.update(id, { phoneNumber });
      return { message: 'تم تحديث رقم الهاتف بنجاح' };
    } catch (error) {
      throw new InternalServerErrorException('خطأ في تحديث رقم الهاتف');
    }
  }

  /**
   * Update the user address.
   * @param {number} id - The user id.
   * @param {string} address - The new address.
   * @returns {Promise<IConfirmationMessage>} - The confirmation message.
   * @throws {InternalServerErrorException} - If error updating address.
   */
  public async updateAddress(id: number, address: string): Promise<any> {
    try {
      await this.userRepository.update(id, { address });
      return { message: 'تم تحديث العنوان بنجاح' };
    } catch (error) {
      throw new InternalServerErrorException('خطأ في تحديث العنوان');
    }
  }

  /**
   * Update the user password, the old password must be provided.
   * @param {number} id - The user id.
   * @param {UpdatePasswordDto} body - The new password.
   * @returns {Promise<IConfirmationMessage>} - The confirmation message.
   * @throws {NotFoundException} - If user not found.
   * @throws {UnauthorizedException} - If old password is wrong.
   * @throws {InternalServerErrorException} - If error updating password.
   */
  public async updatePassword(
    id: number,
    body: UpdatePasswordDto,
  ): Promise<IConfirmationMessage> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new NotFoundException('لم يتم العثور على المستخدم');
      const isMatch = await bcrypt.compare(body.oldPassword, user.password);
      if (!isMatch) throw new UnauthorizedException('كلمة مرور خاطئة');
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(body.newPassword, salt);

      await this.userRepository.update(id, { password });
      return { message: 'تم تحديث كلمة السر بنجاح' };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      if (error.status === HttpStatus.UNAUTHORIZED)
        throw new UnauthorizedException(error.message);
      throw new InternalServerErrorException('خطأ في تحديث كلمة المرور');
    }
  }

  /**
   * Upload the avatar to the cloudinary service.
   * @param {Express.Multer.File} avatar - The avatar.
   * @returns {Promise<string>} - The avatar URL.
   */
  private async uploadAvatar(avatar: Express.Multer.File): Promise<string> {
    const result = await this.cloudinaryService.uploadFile(avatar, {
      public_id:
        avatar.originalname.replace(/\.jpeg|\.png|\.jpg/g, '') + '-' + uuidv4(),
      resource_type: 'image',
    });

    return result.url;
  }
}
