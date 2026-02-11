import { IsOptional, IsString } from 'class-validator';

export class updatePost {
  @IsString()
  @IsOptional()
  content?: string;
}
