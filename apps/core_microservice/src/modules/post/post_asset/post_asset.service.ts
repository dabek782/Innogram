import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../databases/prisma.service';
import { PostAssetDto } from './dto/post_asset.dto';
import { PostAsset } from '@prisma/client';

@Injectable()
export class PostAssetService {
  constructor(private readonly prisma: PrismaService) {}
  async attach(
    dto: PostAssetDto,
    profileId: string,
    userId: string
  ): Promise<PostAsset> {
    const post = await this.prisma.post.findUnique({
      where: { id: dto.postId },
    });
    const asset = await this.prisma.asset.findUnique({
      where: { id: dto.assetId },
    });
    if (!post || !asset) {
      throw new BadRequestException(
        'Post or asset does not exist or they are not yours'
      );
    }

    const postAsset = await this.prisma.postAsset.create({
      data: {
        postId: dto.postId,
        assetId: dto.assetId,
        createdBy: userId,
        updatedBy: userId,
      },
    });
    return postAsset;
  }
  async detach(dto: PostAssetDto, profileId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: dto.postId },
    });
    const asset = await this.prisma.asset.findUnique({
      where: { id: dto.assetId },
    });
    console.log(post, asset);
    if (!post || !asset) {
      throw new BadRequestException('There is no asset or post with these ids');
    }
    if (profileId !== post.profileId) {
      throw new BadRequestException('This post does not belong to you');
    }
    if (userId !== asset.createdById) {
      throw new BadRequestException('This asset does not belong to you');
    }
    try {
      return await this.prisma.postAsset.delete({
        where: { postId_assetId: { postId: dto.postId, assetId: dto.assetId } },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new NotFoundException(
          'Asset is not attached to this post',
          error.message
        );
      }
    }
  }
  async getAll(dto: PostAssetDto): Promise<PostAsset[]> {
    return await this.prisma.postAsset.findMany({
      where: { postId: dto.postId, assetId: dto.assetId },
      orderBy: { orderIndex: 'asc' },
    });
  }
}
