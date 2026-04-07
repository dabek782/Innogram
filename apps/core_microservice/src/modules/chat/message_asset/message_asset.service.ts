import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../databases/prisma.service';
import { MessageAssetDto } from './dto/message_asset.dto';

@Injectable()
export class MessageAssetService {
  constructor(private readonly prisma: PrismaService) {}

  async attach(dto: MessageAssetDto, profileId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: dto.messageId },
    });
    const asset = await this.prisma.asset.findUnique({
      where: { id: dto.assetId },
    });

    if (!message || !asset) {
      throw new NotFoundException('Message or asset not found');
    }
    if (message.profileId !== profileId) {
      throw new UnauthorizedException('This message does not belong to you');
    }
    if (asset.createdById !== userId) {
      throw new UnauthorizedException('This asset does not belong to you');
    }

    const existing = await this.prisma.messageAsset.findFirst({
      where: { messageId: dto.messageId, assetId: dto.assetId },
    });
    if (existing) {
      return existing;
    }

    return await this.prisma.messageAsset.create({
      data: {
        messageId: dto.messageId,
        assetId: dto.assetId,
        createdById: userId,
        updatedById: userId,
      },
      include: { asset: true },
    });
  }

  async detach(dto: MessageAssetDto, profileId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: dto.messageId },
    });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    if (message.profileId !== profileId) {
      throw new UnauthorizedException('This message does not belong to you');
    }

    const link = await this.prisma.messageAsset.findFirst({
      where: { messageId: dto.messageId, assetId: dto.assetId },
    });
    if (!link) {
      throw new NotFoundException('Asset is not attached to this message');
    }

    return await this.prisma.messageAsset.delete({
      where: { id: link.id },
    });
  }

  async getAll(messageId: string) {
    if (!messageId) {
      throw new BadRequestException('messageId is required');
    }
    return await this.prisma.messageAsset.findMany({
      where: { messageId },
      include: { asset: true },
      orderBy: { orderIndex: 'asc' },
    });
  }
}
