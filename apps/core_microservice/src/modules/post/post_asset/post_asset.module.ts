import { Module } from '@nestjs/common';
import { PostAssetController } from './post_asset.controller';
import { PostAssetService } from './post_asset.service';
import { PrismaService } from '../../../databases/prisma.service';

@Module({
  controllers: [PostAssetController],
  providers: [PostAssetService, PrismaService],
})
export class PostAssetModule {}
