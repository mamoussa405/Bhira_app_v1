import { IAdminProfileOrder } from 'src/types/order.type';
import { IUserProfileOrder } from 'src/types/order.type';

/**
 * This interface represents the profile of a user or the admin.
 */
export interface IProfile {
  name: string;
  phoneNumber: string;
  address: string;
  avatarURL: string;
  orders: IUserProfileOrder[] | IAdminProfileOrder[];
}

export interface IUpdateAvatar {
  message: string;
  avatarURL: string;
}
