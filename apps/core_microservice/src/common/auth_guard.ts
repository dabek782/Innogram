import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// import jwt from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest<Request>();
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
    const jwtSecret = process.env.JWT_TOKEN;
    if (!jwtSecret) {
      throw new UnauthorizedException('Error with secret');
    }
    try {
      // const payload = jwt.verify(token, jwtSecret);
      //  = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
