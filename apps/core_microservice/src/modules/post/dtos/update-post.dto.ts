import { IsOptional, IsString, IsArray } from 'class-validator';

export class updatePost {
  @IsString()
  @IsOptional()
  content?: string;
  @IsString({ each: true })
  @IsOptional()
  @IsArray()
  assetIds?: string[];
}
