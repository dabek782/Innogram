import { IsEnum, IsString } from 'class-validator';
import { ChatRole } from '@prisma/client/client';
export class CreateChatParticipantDto {
  @IsString()
  profileId: string;
  @IsString()
  chatId: string;
  @IsEnum(ChatRole)
  role: ChatRole;
}
