import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
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
// TODO: Remember to add messages for the user in arabic
export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'Password is too long (255 characters max)' })
  @MinLength(6, { message: 'Password is too short (6 characters min)' })
  newPassword: string;
}
