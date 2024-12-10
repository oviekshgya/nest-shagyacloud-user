import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createResponse } from 'src/pkg/response.utils';

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