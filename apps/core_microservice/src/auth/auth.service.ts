import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  register(): string | PromiseLike<string> {
    throw new Error('Method not implemented.');
  }
}
