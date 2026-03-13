import { Profile as ProfileEntity } from '@prisma/client';
export type ProfileResponseData = {
  userId: string;
  bio: string | null;
  username: string;
  displayName: string;
  birthday: Date;
  avatarUrl: string | null;
  isPublic: boolean;
};

export const toProfileResponseData = (entity: ProfileEntity) => ({
  userId: entity.userId,
  bio: entity.bio,
  username: entity.username,
  displayName: entity.displayName,
  birthday: entity.birthday,
  avatarUrl: entity.avatarUrl,
  isPublic: entity.isPublic,
});
