import { IsString, IsNotEmpty } from 'class-validator';
export class PostAssetDto {
  @IsString()
  @IsNotEmpty()
  postId: string = '';
  @IsString({ each: true })
  assetId: string = '';
}
