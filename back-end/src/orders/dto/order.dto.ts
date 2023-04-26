import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsPhoneNumber,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import { ICartOrder } from 'src/types/order.type';

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

export class ConfirmOrdersBuyDto {
  @IsString()
  @IsNotEmpty()
  // This regular expression matches only English and Arabic letters
  @Matches(/^[a-zA-Z\s\u0600-\u06FF]+$/)
  buyerName: string;

  @IsPhoneNumber('MA')
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  shipmentAddress: string;

  @IsNotEmpty()
  @IsArray()
  // TODO: Add validation for the array items
  orders: Omit<ICartOrder, 'product'>[];
}
