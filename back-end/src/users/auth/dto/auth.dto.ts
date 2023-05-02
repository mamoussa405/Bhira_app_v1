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
  @IsString()
  @IsNotEmpty()
  // This regular expression matches only English and Arabic letters
  @Matches(/^[a-zA-Z\s\u0600-\u06FF]+$/)
  @MaxLength(255)
  name: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address: string;

  @IsPhoneNumber('MA')
  @IsNotEmpty()
  @MaxLength(255)
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'كلمة المرور طويلة جدًا (بحد أقصى 255 حرفًا)' })
  @MinLength(6, { message: 'كلمة المرور قصيرة جدًا (6 أحرف على الأقل)' })
  password: string;
}

export class SignInDto {
  @IsPhoneNumber('MA')
  @IsNotEmpty()
  @MaxLength(255)
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'كلمة المرور طويلة جدًا (بحد أقصى 255 حرفًا)' })
  @MinLength(6, { message: 'كلمة المرور قصيرة جدًا (6 أحرف على الأقل)' })
  password: string;
}
