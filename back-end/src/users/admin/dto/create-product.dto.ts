import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  // This regular expression matches only Arabic, English letters
  // and spaces.
  @Matches(/^[a-zA-Z \u0600-\u06FF]+$/)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(Fruits|Vegetables|Herbes)$/)
  category: string;

  @IsNumber()
  @IsNotEmpty()
  // TODO: Add a custom validation to check if the price is a positive number
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  isTopMarketProduct: boolean;

  @IsNumber()
  @IsNotEmpty()
  //TODO: Add a custom validation to check if the stock is a positive number
  stock: number;
}
