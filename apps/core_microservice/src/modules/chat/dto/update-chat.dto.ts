import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ChatType } from '@prisma/client/client';

export class UpdateChatDto {
  @IsString()
  name: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsEnum(ChatType)
  type: ChatType;
}
