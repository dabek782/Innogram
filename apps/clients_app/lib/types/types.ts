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
export type Profile = {
  id: string;
  username?: string;
  displayName?: string;
  bio?: string | null;
  avatarUrl?: string | null;
  isPublic?: boolean;
  createdAt?: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
};
export type JwtPayload = { userId?: string };
export type AssetResponse = {
  filePath: string;
  id: string;
};

export type PostResponse = {
  id: string;
  profileId: string;
  isArchived: boolean;
};
export type ApiError = { message?: string };

export type TokenPayload = {
  userId: string;
  profileId: string;
  accountId: string;
  exp: number;
  iat: number;
};
export type Asset = {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  orderIndex: number;
  createdAt: string;
  createdById: string;
  updatedAt: string;
  updatedById: string | null;
};

export type PostAsset = {
  id: string;
  postId: string;
  assetId: string;
  asset?: Asset;
};

export type PostData = {
  id: string;
  content: string;
  profileId: string;
  isArchived: boolean;
  postAssets?: PostAsset[];
};
