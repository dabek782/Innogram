import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('asset')
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
    file: Express.Multer.File
  ) {
    return await this.assetService.uploadFile(file);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.assetService.deleteAsset(id);
  }
}
