/**
 * This interface is used to define the structure of the order object
 * that will be displayed in the cart page.
 */
export interface ICartOrder {
  id: number;
  quantity: number;
  totalPrice: number;
  product: {
    name: string;
    imageURL: string;
    price: number;
  };
}

/**
 * This interface is used to define the structure of the order object
 * that will be displayed in the user profile page.
 */
export interface IUserProfileOrder {
  id: number;
  quantity: number;
  totalPrice: number;
  shipmentAddress: string;
  orderTime: Date;
  confirmedByAdmin: boolean;
  product: {
    name: string;
    imageURL: string;
  };
}

/**
 * This interface is used to define the structure of the order object
 * that will be displayed in the admin profile page.
 */
export interface IAdminProfileOrder {
  id: number;
  quantity: number;
  totalPrice: number;
  buyerName: string;
  buyerPhoneNumber: string;
  shipmentAddress: string;
  orderTime: Date;
  confirmedByAdmin: boolean;
  product: {
    name: string;
    imageURL: string;
  };
}

export interface ICancelOrConfirmOrder {
  message: string;
  id: number;
}

export interface IDeleteOrder {
  message: string;
  id: number;
}
