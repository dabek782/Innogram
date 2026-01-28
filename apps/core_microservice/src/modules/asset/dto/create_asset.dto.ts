import { IsString, IsNumber } from 'class-validator';

export class createAsset {
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
