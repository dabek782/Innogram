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
import * as authGuard from '../../../common/auth_guard';
import { Routes } from '../../../routes/Routes';
import { MessageAssetService } from './message_asset.service';
import { MessageAssetDto } from './dto/message_asset.dto';

@UseGuards(authGuard.JwtAuthGuard)
@Controller({
  path: Routes.Chat,
  version: '3',
})
export class MessageAssetController {
  constructor(private readonly messageAssetService: MessageAssetService) {}

  @Post('message/:messageId/assets/:assetId')
  async attach(
    @Param('messageId') messageId: string,
    @Param('assetId') assetId: string,
    @Req() req: authGuard.AuthenticatedRequest
  ) {
    if (!req.user?.userId || !req.user?.profileId) {
      throw new BadGatewayException('Missing user identity');
    }

    const dto: MessageAssetDto = { messageId, assetId };
    return await this.messageAssetService.attach(
      dto,
      req.user.profileId,
      req.user.userId
    );
  }

  @Delete('message/:messageId/assets/:assetId')
  async detach(
    @Param('messageId') messageId: string,
    @Param('assetId') assetId: string,
    @Req() req: authGuard.AuthenticatedRequest
  ) {
    if (!req.user?.userId || !req.user?.profileId) {
      throw new BadGatewayException('Missing user identity');
    }

    const dto: MessageAssetDto = { messageId, assetId };
    return await this.messageAssetService.detach(dto, req.user.profileId);
  }

  @Get('message/:messageId/assets')
  async getAll(@Param('messageId') messageId: string) {
    return await this.messageAssetService.getAll(messageId);
  }
}
