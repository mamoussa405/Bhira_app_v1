import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  // This regular expression matches only Arabic, English letters
  // and spaces.
  @Matches(/^[a-zA-Z\s\u0600-\u06FF]+$/)
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(Fruits|Vegetables|Herbes)$/)
  category: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  isTopMarketProduct: boolean;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  stock: number;
}
