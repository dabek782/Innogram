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
import { Routes } from 'src/routes/routes';
import { PostService } from './post.service';
import { Asset, PostAsset, Post as PostEntity } from '@prisma/client';
import { PostResponseData } from './post.model';
import { createPost } from './dtos/create-post.dto';
import * as auth_guard from 'src/common/auth_guard';
import { UnauthorizedException } from '@nestjs/common';
import { updatePost } from './dtos/update-post.dto';
import { ArchivePostDto } from './dtos/archive-post.dto';

type PostWithAssets = PostEntity & {
  postAssets?: (PostAsset & { asset: Asset })[];
};

const toPostResponseData = (entity: PostWithAssets): PostResponseData => ({
  content: entity.content,
  profileId: entity.profileId,
  isArchived: entity.isArchived,
  id: entity.id,
  postAssets: entity.postAssets ?? undefined,
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
    if (!req.user?.userId) {
      throw new UnauthorizedException('Did not found id of that user');
    }
    if (!req.user?.profileId) {
      throw new UnauthorizedException('Did not found id of that profile');
    }
    const entity: PostEntity = await this.postService.create(
      dto,
      req.user.userId,
      req.user.profileId
    );
    return toPostResponseData(entity);
  }
  @Put('update/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() dto: updatePost,
    @Req() req: auth_guard.AuthenticatedRequest
  ): Promise<PostResponseData | null> {
    if (!req.user?.userId) {
      throw new UnauthorizedException('Did not found id of that user');
    }
    const entity: PostEntity | null = await this.postService.update(
      dto,
      id,
      req.user?.userId
    );
    return entity ? toPostResponseData(entity) : null;
  }
  @Delete('delete/:id')
  async deletePost(
    @Param('id') id: string,
    @Req() req: auth_guard.AuthenticatedRequest
  ): Promise<PostResponseData | null> {
    if (!req.user?.profileId) {
      throw new UnauthorizedException('Did not found id of that user');
    }
    const entity: PostEntity | null = await this.postService.delete(
      req.user?.profileId,
      id
    );
    return entity ? toPostResponseData(entity) : null;
  }
  @Get('profile/:profileId')
  async getAllPostsFromProfile(
    @Param('profileId') profileId: string
  ): Promise<PostResponseData[] | null> {
    if (!profileId) {
      throw new UnauthorizedException('Did not found profileId');
    }
    const posts = await this.postService.getPostsFromProfileId(profileId);
    return posts && posts.length > 0 ? posts.map(toPostResponseData) : null;
  }
  @Put('archive/:id')
  async archivePost(
    @Param('id') id: string,
    @Body() dto: ArchivePostDto,
    @Req() req: auth_guard.AuthenticatedRequest
  ): Promise<PostResponseData | null> {
    if (!req.user?.profileId) {
      throw new UnauthorizedException('Did not found id of that profile');
    }

    const entity: PostEntity | null = await this.postService.archive(
      dto,
      id,
      req.user.profileId
    );

    return entity ? toPostResponseData(entity) : null;
  }
}
