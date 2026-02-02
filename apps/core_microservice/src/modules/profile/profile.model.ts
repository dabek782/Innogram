export type ProfileResponseData = {
  userId: string;
  bio: string | null;
  username: string;
  displayName: string;
  birthday: Date;
  avatarUrl: string | null;
  isPublic: boolean;
};
