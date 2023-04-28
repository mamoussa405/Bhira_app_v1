import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsPhoneNumber,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  totalPrice: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;
}

export class CreateOrderQueryDto {
  @IsNotEmpty()
  @IsNumberString()
  @Matches(/^[1-9][0-9]*$/)
  productId: number;
}

export class CreateOrderParamDto {
  @IsNotEmpty()
  @IsNumberString()
  @Matches(/^[1-9][0-9]*$/)
  id: number;
}

export class ItemDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  totalPrice: number;
}

export class ConfirmOrdersBuyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  // This regular expression matches only English and Arabic letters
  @Matches(/^[a-zA-Z\s\u0600-\u06FF]+$/)
  buyerName: string;

  @IsPhoneNumber('MA')
  @IsNotEmpty()
  @MaxLength(255)
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  shipmentAddress: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  orders: ItemDto[];
}
