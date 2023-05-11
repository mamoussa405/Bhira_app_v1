import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateNameDto {
  @IsString({ message: 'الاسم يجب أن يكون نصًا' })
  @IsNotEmpty({ message: 'الاسم مطلوب' })
  // This regular expression matches only English and Arabic letters
  @Matches(/^[a-zA-Z\s\u0600-\u06FF]+$/, {
    message: 'الاسم يجب أن يحتوي على أحرف إنجليزية أو عربية فقط',
  })
  @MaxLength(255, { message: 'الاسم طويل جدًا (بحد أقصى 255 حرفًا)' })
  name: string;
}

export class UpdatePhoneNumberDto {
  @IsPhoneNumber('MA', { message: 'رقم الهاتف يجب أن يكون رقم هاتف مغربي' })
  @IsNotEmpty({ message: 'رقم الهاتف مطلوب' })
  @MaxLength(255, { message: 'رقم الهاتف طويل جدًا (بحد أقصى 255 حرفًا)' })
  phoneNumber: string;
}

export class UpdateAddressDto {
  @IsString({ message: 'العنوان يجب أن يكون نصًا' })
  @IsNotEmpty({ message: 'العنوان مطلوب' })
  @MaxLength(255, { message: 'العنوان طويل جدًا (بحد أقصى 255 حرفًا)' })
  address: string;
}

export class UpdatePasswordDto {
  @IsString({ message: 'كلمة المرور يجب أن تكون نصًا' })
  @IsNotEmpty({ message: 'كلمة المرور القديمة مطلوبة' })
  @MaxLength(255, { message: 'كلمة المرور طويلة جدًا (بحد أقصى 255 حرفًا)' })
  oldPassword: string;

  @IsString({ message: 'كلمة المرور يجب أن تكون نصًا' })
  @IsNotEmpty({ message: 'كلمة المرور الجديدة مطلوبة' })
  @MaxLength(255, { message: 'كلمة المرور طويلة جدًا (بحد أقصى 255 حرفًا)' })
  @MinLength(6, { message: 'كلمة المرور قصيرة جدًا (6 أحرف على الأقل)' })
  newPassword: string;
}
