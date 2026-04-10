import { Comment } from '@prisma/client';

export type CommentResponseData = Pick<
  Comment,
  | 'id'
  | 'postId'
  | 'content'
  | 'parentCommentId'
  | 'createdAt'
  | 'updatedAt'
  | 'createdById'
  | 'updatedById'
> & {
  replies?: CommentResponseData[];
};
