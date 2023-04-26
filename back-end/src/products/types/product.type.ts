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
// TODO: Limit the number of images uploaded to 1 if the product is a top market product.
