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
  @IsNumber({}, { message: 'الثمن يجب أن يكون رقمًا' })
  @IsNotEmpty({ message: 'الثمن مطلوب' })
  @IsPositive({ message: 'الثمن يجب أن يكون رقما موجبًا' })
  totalPrice: number;

  @IsNumber({}, { message: 'الكمية يجب أن تكون رقمًا' })
  @IsNotEmpty({ message: 'الكمية مطلوبة' })
  @IsPositive({ message: 'الكمية يجب أن تكون رقما موجبًا' })
  quantity: number;
}

export class CreateOrderQueryDto {
  @IsNotEmpty({ message: 'معرف المنتج مطلوب' })
  @IsNumberString({}, { message: 'معرف المنتج يجب أن يكون رقمًا' })
  @Matches(/^[1-9][0-9]*$/, { message: 'معرف المنتج يجب أن يكون رقمًا موجبًا' })
  productId: number;
}

export class CreateOrderParamDto {
  @IsNotEmpty({ message: 'معرف الطلب مطلوب' })
  @IsNumberString({}, { message: 'معرف الطلب يجب أن يكون رقمًا' })
  @Matches(/^[1-9][0-9]*$/, { message: 'معرف الطلب يجب أن يكون رقمًا موجبًا' })
  id: number;
}

export class ItemDto {
  @IsNumber({}, { message: 'معرف الطلب يجب أن يكون رقمًا' })
  @IsNotEmpty({ message: 'معرف الطلب مطلوب' })
  @IsPositive({ message: 'معرف الطلب يجب أن يكون رقمًا موجبًا' })
  id: number;

  @IsNumber({}, { message: 'كمية الطلب يجب أن تكون رقمًا' })
  @IsNotEmpty({ message: 'كمية الطلب مطلوبة' })
  @IsPositive({ message: 'كمية الطلب يجب أن تكون رقمًا موجبًا' })
  quantity: number;

  @IsNumber({}, { message: 'ثمن الطلب يجب أن يكون رقمًا' })
  @IsNotEmpty({ message: 'ثمن الطلب مطلوب' })
  @IsPositive({ message: 'ثمن الطلب يجب أن يكون رقمًا موجبًا' })
  totalPrice: number;
}

export class ConfirmOrdersBuyDto {
  @IsString({ message: 'اسم المشتري يجب أن يكون نصًا' })
  @IsNotEmpty({ message: 'اسم المشتري مطلوب' })
  @MaxLength(255, { message: 'اسم المشتري يجب أن يكون أقل من 255 حرفًا' })
  // This regular expression matches only English and Arabic letters
  @Matches(/^[a-zA-Z\s\u0600-\u06FF]+$/, {
    message: 'اسم المشتري يجب أن يتكون من حروف عربية أو إنجليزية فقط',
  })
  buyerName: string;

  @IsPhoneNumber('MA', { message: 'رقم الهاتف يجب أن يكون رقم هاتف مغربي' })
  @IsNotEmpty({ message: 'رقم الهاتف مطلوب' })
  @MaxLength(255, { message: 'رقم الهاتف يجب أن يكون أقل من 255 حرفًا' })
  phoneNumber: string;

  @IsString({ message: 'عنوان الشحن يجب أن يكون نصًا' })
  @IsNotEmpty({ message: 'عنوان الشحن مطلوب' })
  @MaxLength(255, { message: 'عنوان الشحن يجب أن يكون أقل من 255 حرفًا' })
  shipmentAddress: string;

  @IsNotEmpty({ message: 'الطلبات مطلوبة' })
  @IsArray({ message: 'الطلبات يجب أن تكون مصفوفة' })
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  orders: ItemDto[];
}
