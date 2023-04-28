export interface INormalProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  imagesURL: string[] | string;
}

export interface ITopMarketProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageURL: string;
}

export interface IFoundProducts {
  fruits: INormalProduct[];
  vegetables: INormalProduct[];
  herbes: INormalProduct[];
}
// TODO: Limit the number of images uploaded to 1 if the product is a top market product.
