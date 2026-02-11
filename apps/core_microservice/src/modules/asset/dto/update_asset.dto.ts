import { IsString, IsNumber } from 'class-validator';

export class updateAsset {
  @IsString()
  fileName: string;
  @IsString()
  filePath: string;
  @IsString()
  fileType: string;
  @IsNumber()
  fileSize: number;
  @IsNumber()
  orderIndex: number;
}
