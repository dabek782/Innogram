import { Post } from '@prisma/client';

export type PostResponseData = Pick<
  Post,
  'id' | 'content' | 'profileId' | 'isArchived'
>;
