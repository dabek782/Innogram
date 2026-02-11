import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma.service';
import { createPost } from './dtos/create-post.dto';
import { updatePost } from './dtos/update-post.dto';
import { ArchivePostDto } from './dtos/archive-post.dto';
import { Post } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: createPost,
    userId: string,
    profileId: string
  ): Promise<Post> {
    const post = await this.prisma.post.create({
      data: {
        content: dto.content,
        profileId: profileId,
        createdById: userId,
      },
    });
    return post;
  }
  async update(
    dto: updatePost,
    id: string,
    userId: string
  ): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });
    if (!post) {
      return null;
    }
    return await this.prisma.post.update({
      where: { id },
      data: {
        ...(dto.content && { content: dto.content }),
        updatedById: userId,
      },
    });
  }
  async archive(
    dto: ArchivePostDto,
    id: string,
    profileId: string
  ): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`A post with ${id} was not found`);
    }
    if (post.profileId !== profileId) {
      throw new UnauthorizedException(
        'You are not authorized to update this post'
      );
    }
    return await this.prisma.post.update({
      where: { id },
      data: {
        ...(dto.isArchived !== undefined && { isArchived: dto.isArchived }),
        updatedById: id,
      },
    });
  }
  async delete(profileId: string, id: string): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`A post with ${id} was not found`);
    }
    if (post.profileId !== profileId) {
      throw new UnauthorizedException(
        'You are not authorized to update this post'
      );
    }
    return await this.prisma.post.delete({
      where: { id },
    });
  }
  async getPost(id: string): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`A post with ${id} was not found`);
    }

    return await this.prisma.post.findUnique({ where: { id } });
  }
  async getAllPost(): Promise<Post[]> {
    return await this.prisma.post.findMany();
  }
}
