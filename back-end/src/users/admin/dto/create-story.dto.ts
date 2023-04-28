import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateStoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
