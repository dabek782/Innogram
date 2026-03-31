import { Chat } from '@prisma/client';

export type ChatResponseData = Pick<
  Chat,
  'id' | 'name' | 'description' | 'type' | 'createdAt'
>;

export const toChatResponseData = (entity: Chat): ChatResponseData => ({
  id: entity.id,
  name: entity.name,
  description: entity.description,
  type: entity.type,
  createdAt: entity.createdAt,
});
