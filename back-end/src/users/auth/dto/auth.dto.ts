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
  @MaxLength(255, { message: 'Password is too long (255 characters max)' })
  @MinLength(6, { message: 'Password is too short (6 characters min)' })
  password: string;
}

export class SignInDto {
  @IsPhoneNumber('MA')
  @IsNotEmpty()
  @MaxLength(255)
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'Password is too long (255 characters max)' })
  @MinLength(6, { message: 'Password is too short (6 characters min)' })
  password: string;
}
