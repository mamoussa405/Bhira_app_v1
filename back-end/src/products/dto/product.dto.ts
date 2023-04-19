import { IsNumberString, IsString, Matches } from 'class-validator';

export class ProductParamDto {
  @IsNumberString()
  // This regular expression matches only positive integers
  @Matches(/^[1-9][0-9]*$/)
  id: number;
}

export class ProductQueryDto {
  @IsString()
  @Matches(/^(Fruits|Vegetables|Herbes)$/)
  category: string;
}
