import { Provider } from '@prisma/client';

export class AccountResponseData {
  email: string;
  passwordHash: string;
  provider: Provider;
}
