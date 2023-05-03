import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class ProductParamDto {
  @IsNumberString({}, { message: 'معرف المنتج يجب أن يكون رقمًا' })
  @IsNotEmpty({ message: 'معرف المنتج مطلوب' })
  // This regular expression matches only positive integers
  @Matches(/^[1-9][0-9]*$/, { message: 'معرف المنتج يجب أن يكون رقمًا موجبًا' })
  id: number;
}

export class ProductQueryDto {
  @IsNotEmpty({ message: 'البحث مطلوب' })
  @IsString({ message: 'البحث يجب أن يكون نصًا' })
  // This regular expression matches only Arabic letters
  @Matches(/^[a-zA-Z\s\u0600-\u06FF]+$/, {
    message: 'البحث يجب أن يكون نصًا عربيًا أو إنجليزيًا',
  })
  @MaxLength(255, { message: 'البحث يجب أن يكون أقل من 255 حرفًا' })
  like: string;
}
