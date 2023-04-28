import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateNameDto {
  @IsString()
  @IsNotEmpty()
  // This regular expression matches only English and Arabic letters
  @Matches(/^[a-zA-Z\s\u0600-\u06FF]+$/)
  @MaxLength(255)
  name: string;
}

export class UpdatePhoneNumberDto {
  @IsPhoneNumber('MA')
  @IsNotEmpty()
  @MaxLength(255)
  phoneNumber: string;
}

export class UpdateAddressDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;
}

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  @MaxLength(255)
  newPassword: string;
}
