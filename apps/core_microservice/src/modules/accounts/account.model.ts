import { Provider } from '@prisma/client';

export class AccountResponseData {
  email: string;
  password_hash: string;
  provider: Provider;
}
