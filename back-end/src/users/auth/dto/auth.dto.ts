import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsString({ message: 'الاسم يجب أن يكون نصًا' })
  @IsNotEmpty({ message: 'الاسم مطلوب' })
  // This regular expression matches only English and Arabic letters
  @Matches(/^[a-zA-Z\s\u0600-\u06FF]+$/, { message: 'الاسم يجب أن يكون نصًا' })
  @MaxLength(255, { message: 'الاسم يجب أن يكون أقل من 255 حرفًا' })
  name: string;

  @MaxLength(255, { message: 'العنوان يجب أن يكون أقل من 255 حرفًا' })
  @IsString({ message: 'العنوان يجب أن يكون نصًا' })
  @IsNotEmpty({ message: 'العنوان يجب ان يحتوي على نص' })
  @IsOptional()
  address: string;

  @IsPhoneNumber('MA', { message: 'رقم الهاتف يجب أن يكون رقم هاتف مغربي' })
  @IsNotEmpty({ message: 'رقم الهاتف مطلوب' })
  @MaxLength(255, { message: 'رقم الهاتف يجب أن يكون أقل من 255 حرفًا' })
  phoneNumber: string;

  @IsString({ message: 'كلمة المرور يجب أن تكون نصًا' })
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @MaxLength(255, { message: 'كلمة المرور طويلة جدًا (بحد أقصى 255 حرفًا)' })
  @MinLength(6, { message: 'كلمة المرور قصيرة جدًا (6 أحرف على الأقل)' })
  password: string;
}

export class SignInDto {
  @IsPhoneNumber('MA', { message: 'رقم الهاتف يجب أن يكون رقم هاتف مغربي' })
  @IsNotEmpty({ message: 'رقم الهاتف مطلوب' })
  @MaxLength(255, { message: 'رقم الهاتف يجب أن يكون أقل من 255 حرفًا' })
  phoneNumber: string;

  @IsString({ message: 'كلمة المرور يجب أن تكون نصًا' })
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @MaxLength(255, { message: 'كلمة المرور طويلة جدًا (بحد أقصى 255 حرفًا)' })
  @MinLength(6, { message: 'كلمة المرور قصيرة جدًا (6 أحرف على الأقل)' })
  password: string;
}
