export interface INormalProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  imagesURL: string[] | string;
  ordersInCart?: number;
}

export interface ITopMarketProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  totalStock: number;
  remainingStock: number;
  imageURL: string;
}

export interface IFoundProducts {
  fruits: INormalProduct[];
  vegetables: INormalProduct[];
  herbes: INormalProduct[];
}
