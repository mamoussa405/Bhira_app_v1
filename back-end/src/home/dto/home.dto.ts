import { IsNotEmpty, IsNumberString, Matches } from 'class-validator';

export class HomeParamDto {
  @IsNumberString({}, { message: 'المعرف يجب أن يكون رقمًا' })
  @IsNotEmpty({ message: 'المعرف مطلوب' })
  // This regular expression matches only positive integers
  @Matches(/^[1-9][0-9]*$/, { message: 'المعرف يجب أن يكون رقمًا موجبًا' })
  id: number;
}
