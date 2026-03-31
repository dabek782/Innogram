import { IsString, IsOptional } from 'class-validator';

export class UpdateMessageDto {
  @IsString()
  content: string;
  @IsString()
  @IsOptional()
  replyToMessageId?: string;
}
