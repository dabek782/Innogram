import { Injectable, NotFoundException } from '@nestjs/common';
import { Asset } from '@prisma/client';
import { PrismaService } from 'src/databases/prisma.service';
import * as path from 'path';
import { promises as fs } from 'fs';
import { nanoid } from 'nanoid';

@Injectable()
export class AssetService {
  constructor(private readonly prismaService: PrismaService) {}
  async uploadFile(file: Express.Multer.File): Promise<Asset> {
    const fileExtension: string = path.extname(file.originalname);
    const assetId: string = nanoid();
    const uniqueFileName: string = `${assetId}${fileExtension}`;
    const uploadDir = path.join(process.cwd(), 'uploads', 'assets');
    const filePath = path.join(uploadDir, uniqueFileName);
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, file.buffer);
    const asset = await this.prismaService.asset.create({
      data: {
        fileName: file.originalname,
        filePath: `uploads/assets/${uniqueFileName}`,
        fileSize: file.size,
        fileType: file.mimetype,
        orderIndex: 0,
      },
    });
    return asset;
  }
  async getAsset(id: string): Promise<Asset | null> {
    const asset = await this.prismaService.asset.findUnique({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Did not found asset with ${id} like that`);
    }
    return asset;
  }
  async getAssets(): Promise<Asset[]> {
    return await this.prismaService.asset.findMany();
  }
  async deleteAsset(id: string): Promise<Asset | null> {
    const asset = await this.prismaService.asset.delete({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Did not found asset with ${id} like that`);
    }
    return asset;
  }
}
