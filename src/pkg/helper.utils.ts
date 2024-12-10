import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Tipe data untuk 'user', bisa disesuaikan sesuai kebutuhan Anda
    }
  }
}