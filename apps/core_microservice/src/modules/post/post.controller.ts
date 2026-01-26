import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Put,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Routes } from 'src/routes/Routes';
import { PostService } from './post.service';
import { Post as PostEntity } from '@prisma/client';
import { PostResponseData } from './post.model';
import { createPost } from './dtos/create-post.dto';
import * as auth_guard from 'src/common/auth_guard';
import { UnauthorizedException } from '@nestjs/common';
import { updatePost } from './dtos/update-post.dto';

const toPostResponseData = (entity: PostEntity): PostResponseData => ({
  content: entity.content,
  profileId: entity.profileId,
  isArchived: entity.isArchived,
  id: entity.id,
});
@UseGuards(auth_guard.JwtAuthGuard)
@Controller({
  path: Routes.Post,
  version: '3',
})
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Get()
  async getAllPosts(): Promise<PostResponseData[]> {
    const res = await this.postService.getAllPost();
    return res.map(toPostResponseData);
  }
  @Get(':id')
  async getPost(@Param('id') id: string): Promise<PostResponseData | null> {
    const post: PostEntity | null = await this.postService.getPost(id);
    return post ? toPostResponseData(post) : null;
  }
  @Post('create')
  async createPost(
    @Body() dto: createPost,
    @Req() req: auth_guard.AuthenticatedRequest
  ): Promise<PostResponseData> {
    if (!req?.user?.userId) {
      throw new UnauthorizedException('User ID not found in token');
    }
    const userId = req.user.userId;
    const entity: PostEntity = await this.postService.create(dto, userId);
    return toPostResponseData(entity);
  }
  @Put('update/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() dto: updatePost
  ): Promise<PostResponseData | null> {
    const entity: PostEntity | null = await this.postService.update(dto, id);
    return entity ? toPostResponseData(entity) : null;
  }
  @Delete('delete/:id')
  async deletePost(@Param('id') id: string): Promise<PostResponseData | null> {
    const entity: PostEntity | null = await this.postService.delete(id);
    return entity ? toPostResponseData(entity) : null;
  }
}
