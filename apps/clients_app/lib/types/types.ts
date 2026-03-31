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

export type TokenPayload = {
  userId: string;
  profileId: string;
  accountId: string;
  exp: number;
  iat: number;
};
export type DeletePostResponse = {
  id: string;
  deleted: boolean;
};

export type ArchivePostResponse = {
  id: string;
  isArchived: boolean;
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
