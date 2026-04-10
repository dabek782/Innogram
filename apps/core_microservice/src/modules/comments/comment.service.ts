import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../databases/prisma.service';
import { createCommentDto } from './dto/create-comment.dto';
import { updateCommentDto } from './dto/update-comment.dto';
import { Comment, Prisma } from '@prisma/client';
import { CommentResponseData } from './comment.model';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(
    dto: createCommentDto,
    postId: string,
    userId: string
  ): Promise<CommentResponseData> {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    if (dto.parentCommentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: dto.parentCommentId },
      });
      if (!parentComment || parentComment.postId !== postId) {
        throw new NotFoundException(
          `Parent comment with id ${dto.parentCommentId} not found for this post`
        );
      }
    }

    const comment = await this.prisma.comment.create({
      data: {
        content: dto.content,
        postId,
        parentCommentId: dto.parentCommentId,
        createdById: userId,
        updatedById: userId,
      },
    });

    return this.toCommentResponse(comment);
  }

  async getCommentsByPostId(postId: string): Promise<CommentResponseData[]> {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    const comments = await this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
    });

    return this.buildCommentTree(comments);
  }

  async updateComment(
    dto: updateCommentDto,
    commentId: string,
    userId: string
  ): Promise<CommentResponseData | null> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) {
      return null;
    }
    if (comment.createdById !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this comment'
      );
    }

    const updated = await this.prisma.comment.update({
      where: { id: commentId },
      data: {
        content: dto.content,
        updatedById: userId,
      },
    });

    return this.toCommentResponse(updated);
  }

  async deleteComment(
    commentId: string,
    userId: string
  ): Promise<Comment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) {
      return null;
    }
    if (comment.createdById !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this comment'
      );
    }

    return await this.prisma.comment.delete({ where: { id: commentId } });
  }

  private buildCommentTree(comments: Comment[]): CommentResponseData[] {
    const commentMap = new Map<string, CommentResponseData>();
    const roots: CommentResponseData[] = [];

    comments.forEach(comment => {
      commentMap.set(comment.id, this.toCommentResponse(comment));
    });

    comments.forEach(comment => {
      const node = commentMap.get(comment.id);
      if (!node) {
        return;
      }
      if (comment.parentCommentId) {
        const parent = commentMap.get(comment.parentCommentId);
        if (parent) {
          parent.replies = parent.replies ?? [];
          parent.replies.push(node);
          return;
        }
      }
      roots.push(node);
    });

    return roots;
  }

  private toCommentResponse(comment: Comment): CommentResponseData {
    return {
      id: comment.id,
      content: comment.content,
      postId: comment.postId,
      parentCommentId: comment.parentCommentId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      createdById: comment.createdById,
      updatedById: comment.updatedById,
      replies: [],
    };
  }
}
