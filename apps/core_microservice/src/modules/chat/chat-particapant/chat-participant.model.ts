import { ChatParticipant } from '@prisma/client';

export type ChatParticipantResponseData = Pick<
  ChatParticipant,
  'profileId' | 'chatId' | 'role' | 'createdAt' | 'id'
>;
export const toChatParticipantResponseData = (
  entity: ChatParticipant
): ChatParticipantResponseData => ({
  id: entity.id,
  profileId: entity.profileId,
  role: entity.role,
  createdAt: entity.createdAt,
  chatId: entity.chatId,
});
