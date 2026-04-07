import { IsNotEmpty, IsString } from 'class-validator';

export class MessageAssetDto {
  @IsString()
  @IsNotEmpty()
  messageId: string = '';
  @IsString()
  @IsNotEmpty()
  assetId: string = '';
}
