import { Module } from '@nestjs/common';
import { PrismaService } from '../../databases/prisma.service';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';

@Module({
  controllers: [AssetController],
  providers: [AssetService, PrismaService],
})
export class AssetModule {}
