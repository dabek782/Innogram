import { IsString } from 'class-validator';
import { Provider } from '@prisma/client';

export class AuthenticateGithubAccountDto {
  @IsString()
  provider: Provider = 'github';
  providerId: string;
  email: string | null;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
}
