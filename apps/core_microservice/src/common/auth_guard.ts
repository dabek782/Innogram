import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

import { CustomJwtPayload } from 'src/types/custom-jwt';
import { ConfigService } from '@nestjs/config';
export interface AuthenticatedRequest extends Request {
  user?: CustomJwtPayload;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeaders = req.headers.authorization;
    if (!authHeaders || typeof authHeaders !== 'string') {
      throw new UnauthorizedException('No authorization header');
    }
    if (!authHeaders.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization header');
    }
    const token = authHeaders.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    const jwtSecret = this.configService.get<string>('JWT_TOKEN');

    if (!jwtSecret) {
      throw new UnauthorizedException('Error with secret');
    }
    try {
      const payload = jwt.verify(token, jwtSecret) as CustomJwtPayload & {
        userId: string;
        accountId: string;
        profileId: string | null;
      };
      req.user = payload;
      console.log(req.user);
      return true;
    } catch (error) {
      throw new UnauthorizedException(
        `Invalid token: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
