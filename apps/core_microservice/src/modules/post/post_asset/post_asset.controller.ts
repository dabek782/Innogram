import {
  BadGatewayException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostAssetService } from './post_asset.service';
import { PostAssetDto } from './dto/post_asset.dto';
import * as authGuard from '../../../common/auth_guard';
import { Routes } from 'src/routes/Routes';

@Controller({
  path: Routes.Post,
  version: '3',
})
@UseGuards(authGuard.JwtAuthGuard)
export class PostAssetController {
  constructor(private readonly postAsset: PostAssetService) {}
  @Post(':postId/assets/:assetId')
  async attach(
    @Param('postId') postId: string,
    @Param('asssetId') assetId: string,
    profileId: string,
    @Req() req: authGuard.AuthenticatedRequest
  ) {
    if (!req.user?.userId) {
      throw new BadGatewayException('Something went wrong');
    }
    const dto: PostAssetDto = { postId, assetId };
    return await this.postAsset.attach(dto, profileId, req.user?.userId);
  }
  @Delete(':postId/assets/:assetId')
  async detach(
    @Param('postId') postId: string,
    @Param('asssetId') assetId: string,
    profileId: string,
    @Req() req: authGuard.AuthenticatedRequest
  ) {
    if (!req.user?.userId) {
      throw new BadGatewayException('Something went wrong');
    }
    const dto: PostAssetDto = { postId, assetId };
    return await this.postAsset.detach(dto, profileId, req.user?.userId);
  }
  @Get(':postId/assets')
  async getAll(dto: PostAssetDto) {
    return await this.postAsset.getAll(dto);
  }
}
