import { IsNotEmpty, IsNumberString, Matches } from 'class-validator';

export class HomeParamDto {
  @IsNumberString()
  @IsNotEmpty()
  // This regular expression matches only positive integers
  @Matches(/^[1-9][0-9]*$/)
  id: number;
}
