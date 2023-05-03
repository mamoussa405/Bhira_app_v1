import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateStoryDto {
  @IsString({ message: 'العنوان يجب أن يكون نصًا' })
  @IsNotEmpty({ message: 'العنوان مطلوب' })
  @MaxLength(255, { message: 'العنوان يجب أن يكون أقل من 255 حرفًا' })
  title: string;

  @IsString({ message: 'الوصف يجب أن يكون نصًا' })
  @IsNotEmpty({ message: 'الوصف مطلوب' })
  description: string;
}
