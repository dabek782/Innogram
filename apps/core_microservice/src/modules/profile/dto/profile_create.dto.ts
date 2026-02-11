import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  username: string;

  @IsString()
  displayName: string;

  @IsDateString()
  birthday: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
