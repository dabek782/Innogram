import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { authMiddleware } from 'src/common/auth_middleware';

@Module({
  controllers:[
    AuthController
  ],
  providers:[authMiddleware , AuthService]
})
export class AuthModule {}
