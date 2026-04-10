import { IsNotEmpty, IsString } from 'class-validator';

export class updateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string = '';
}
