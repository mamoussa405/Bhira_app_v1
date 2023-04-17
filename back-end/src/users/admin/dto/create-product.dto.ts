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
  // This regular expression matches only Arabic letters
  @Matches(/^[\u0600-\u06FF]+$/)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^Fruits|Vegetables|Herbs$/)
  category: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  isNormalProduct: boolean;

  @IsNumber()
  @IsNotEmpty()
  stock: number;
}
