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
