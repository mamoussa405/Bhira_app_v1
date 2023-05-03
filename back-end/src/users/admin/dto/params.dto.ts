import { IsNotEmpty, IsNumberString, Matches } from 'class-validator';

export class ParamDto {
  @IsNotEmpty({ message: 'المعرف مطلوب' })
  @IsNumberString({}, { message: 'المعرف يجب أن يكون رقمًا' })
  @Matches(/^[1-9][0-9]*$/, { message: 'المعرف يجب أن يكون رقمًا موجبًا' })
  id: number;
}
