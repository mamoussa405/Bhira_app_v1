import { IsNotEmpty, IsNumberString, Matches } from 'class-validator';

export class ParamDto {
  @IsNotEmpty()
  @IsNumberString()
  @Matches(/^[1-9][0-9]*$/)
  id: number;
}
