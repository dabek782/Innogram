import { Message } from '@prisma/client';

export type MessageResponseData = Pick<
  Message,
  | 'id'
  | 'content'
  | 'chatId'
  | 'profileId'
  | 'isEdited'
  | 'deleted'
  | 'replyToMessageId'
  | 'createdAt'
>;

export const toMessageResponseData = (
  entity: Message
): MessageResponseData => ({
  id: entity.id,
  content: entity.content,
  chatId: entity.chatId,
  profileId: entity.profileId,
  isEdited: entity.isEdited,
  deleted: entity.deleted,
  replyToMessageId: entity.replyToMessageId,
  createdAt: entity.createdAt,
});
