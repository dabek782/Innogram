export type account = {
  id: string;
  userId: string;
};
export type AuthenticateCallResponse = {
  accessToken: string;
  refreshToken: string;
  account: account;
};

export type AuthenticateCallResult = {
  accessToken: string;
  refreshToken: string;
  userId: string;
};
export type ProfileResult = {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string | null;
};

export type DeletePostResponse = {
  id: string;
  deleted: boolean;
};

export type ArchivePostResponse = {
  id: string;
  isArchived: boolean;
};
export type ProfileNameCallResponse = {
  username: string;
};

// lib/types/chat.types.ts
export type ChatRole = "admin" | "member";
export type ChatType = "private" | "group";

export type ChatParticipant = {
  id: string;
  profileId: string;
  chatId: string;
  role: ChatRole;
  joinedAt: string;
  leftAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ChatResponseData = {
  id: string;
  name: string;
  description: string | null;
  type: ChatType;
  createdAt: string;
};

export type ChatWithParticipant = {
  participant: ChatParticipant;
  chat: ChatResponseData;
};

export type MessageResponseData = {
  id: string;
  content: string;
  chatId: string | null;
  profileId: string | null;
  isEdited: boolean;
  deleted: boolean;
  replyToMessageId: string | null;
  createdAt: string;
};
