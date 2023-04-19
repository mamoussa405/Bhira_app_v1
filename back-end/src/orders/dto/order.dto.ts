import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsPositive,
  Matches,
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
