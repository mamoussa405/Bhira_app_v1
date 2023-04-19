import { IsNotEmpty, IsPhoneNumber, IsString, Matches } from 'class-validator';

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
