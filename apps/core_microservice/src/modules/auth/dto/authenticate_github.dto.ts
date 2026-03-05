import { IsOptional, IsString } from 'class-validator';
import { Provider } from '@prisma/client';

export class AuthenticateGithubAccountDto {
  @IsString()
  provider: Provider = 'github';
  @IsString()
  providerId: string;
  @IsOptional()
  @IsString()
  email: string | null;
  username?: string;
  displayName?: string;
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
