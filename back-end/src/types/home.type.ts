import {
  INormalProduct,
  ITopMarketProduct,
} from 'src/products/types/product.type';

/**
 * This interface is used to define the shape of the stories
 * data that will be returned to the client.
 */
export interface IStory {
  id: number;
  title: string;
  description: string;
  videoURL: string;
  imageURL: string;
  viewedByTheCurrentUser: boolean;
}

/**
 * This interface is used to define the shape of the home
 * data that will be returned to the client.
 */
export interface IHome {
  stories: IStory[];
  topMarketProduct: ITopMarketProduct;
  products: INormalProduct[];
}
