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
  @IsString({ message: 'اسم المنتج يجب أن يكون نصًا' })
  @IsNotEmpty({ message: 'اسم المنتج مطلوب' })
  // This regular expression matches only Arabic, English letters
  // and spaces.
  @Matches(/^[a-zA-Z\s\u0600-\u06FF]+$/, {
    message: 'اسم المنتج يجب أن يكون نصًا',
  })
  @MaxLength(255, { message: 'اسم المنتج يجب أن يكون أقل من 255 حرفًا' })
  name: string;

  @IsString({ message: 'صنف المنتج يجب أن يكون نصًا' })
  @IsNotEmpty({ message: 'صنف المنتج مطلوب' })
  @Matches(/^(Fruits|Vegetables|Herbes)$/, { message: 'صنف المنتج غير معروف' })
  category: string;

  @IsNumber({}, { message: 'الثمن يجب أن يكون رقمًا' })
  @IsNotEmpty({ message: 'الثمن مطلوب' })
  @IsPositive({ message: 'الثمن يجب أن يكون موجبًا' })
  price: number;

  @IsString({ message: 'وصف المنتج يجب أن يكون نصًا' })
  @IsNotEmpty({ message: 'وصف المنتج مطلوب' })
  description: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'حالة المنتج مطلوبة' })
  isTopMarketProduct: boolean;

  @IsNumber({}, { message: 'الكمية يجب أن تكون رقمًا' })
  @IsNotEmpty()
  @IsPositive({ message: 'الكمية يجب أن تكون موجبة' })
  stock: number;
}
