import { IsNotEmpty, IsString } from 'class-validator';

export class createPost {
  @IsString()
  @IsNotEmpty()
  content: string;
}
