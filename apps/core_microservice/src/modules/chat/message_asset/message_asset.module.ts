import { Module } from '@nestjs/common';
import { MessageAssetService } from './message_asset.service';
import { MessageAssetController } from './message_asset.controller';

@Module({
  providers: [MessageAssetService],
  controllers: [MessageAssetController]
})
export class MessageAssetModule {}
