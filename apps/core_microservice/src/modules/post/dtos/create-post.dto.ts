import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class createPost {
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assetIds?: string[];
}
