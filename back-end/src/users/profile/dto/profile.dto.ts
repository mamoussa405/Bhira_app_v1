import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Matches,
} from 'class-validator';

export class UpdateNameDto {
  @IsString()
  @IsNotEmpty()
  // This regular expression matches only English and Arabic letters
  @Matches(/^[a-zA-Z\s\u0600-\u06FF]+$/)
  name: string;
}

export class UpdatePhoneNumberDto {
  @IsPhoneNumber('MA')
  @IsNotEmpty()
  phoneNumber: string;
}

export class UpdateAddressDto {
  @IsString()
  @IsNotEmpty()
  address: string;
}

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  newPassword: string;
}
