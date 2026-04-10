import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string = '';

  @IsOptional()
  @IsString()
  parentCommentId?: string;
}
