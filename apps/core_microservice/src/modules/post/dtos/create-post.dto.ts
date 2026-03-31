import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class createPost {
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assetIds?: string[];
  @IsBoolean()
  isArchived: boolean;
}
