import { Injectable, NestMiddleware, HttpException, HttpStatus, UnauthorizedException, ExecutionContext, CanActivate } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class HeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Mengecek apakah ada key pada header
    const apiKey = req.headers['x-key'];

    if (!apiKey) {
      throw new HttpException('API Key is missing', HttpStatus.UNAUTHORIZED);
    }
    const validApiKey = 'hasdjjkkndfbn3mhjfh'; 

    if (apiKey !== validApiKey) {
      throw new HttpException('Invalid API Key', HttpStatus.FORBIDDEN);
    }

    next();
  }
}

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers['authorization'];

    if (!auth || !this.isValidBasicAuth(auth)) {
      throw new HttpException('Authorization is missing', HttpStatus.UNAUTHORIZED);
    }

    next();
  }

  private isValidBasicAuth(auth: string): boolean {
    const [scheme, credentials] = auth.split(' ');

    if (scheme !== 'Basic' || !credentials) return false;

    const [username, password] = Buffer.from(credentials, 'base64')
      .toString()
      .split(':');

    // Validasi username dan password (misalnya, hardcoded)
    return username === 'abcd' && password === 'abcd';
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const secretKey = process.env.JWT_SECRET || 'defaultSecretKey';
      const decoded = jwt.verify(token, secretKey);
      request.user = decoded; // Simpan informasi user di request untuk controller
      return true; // Izinkan akses jika token valid
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
  }
}