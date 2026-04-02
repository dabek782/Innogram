import { IsString } from 'class-validator';

export class getChatParticipantByBothProfileIds {
  @IsString()
  creatorProfileId: string;
  @IsString()
  targetProfileId: string;
}
