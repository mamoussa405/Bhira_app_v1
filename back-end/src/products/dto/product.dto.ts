import { IsNotEmpty, IsNumberString, IsString, Matches } from 'class-validator';

export class ProductParamDto {
  @IsNumberString()
  @IsNotEmpty()
  // This regular expression matches only positive integers
  @Matches(/^[1-9][0-9]*$/)
  id: number;
}

export class ProductQueryDto {
  @IsNotEmpty()
  @IsString()
  // This regular expression matches only Arabic letters
  @Matches(/^[\u0600-\u06FF]+$/)
  like: string;
}
