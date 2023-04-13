import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Matches,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  // This regular expression matches only English and Arabic letters
  @Matches(/^[a-zA-Z\s\u0600-\u06FF]+$/)
  name: string;

  @IsString()
  address: string;

  @IsPhoneNumber('MA')
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}

export class SignInDto {
  @IsPhoneNumber('MA')
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
