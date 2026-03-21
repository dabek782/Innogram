import {
  BadGatewayException,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Routes } from 'src/routes/coreRoutes';
import * as authGuard from '../../common/auth_guard';

@UseGuards(authGuard.JwtAuthGuard)
@Controller({
  path: Routes.Asset,
  version: '3',
})
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  async getAll() {
    return this.assetService.getAssets();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.assetService.getAsset(id);
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|gif|png|mp4|webm)$/ }),
        ],
      })
    )
    file: Express.Multer.File,
    @Req() req: authGuard.AuthenticatedRequest
  ) {
    if (!req.user?.userId) {
      throw new BadGatewayException('Something went wrong');
    }
    return await this.assetService.uploadFile(file, req.user.userId);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.assetService.deleteAsset(id);
  }
}
