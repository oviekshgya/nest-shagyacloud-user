import { Request } from 'express';
import { User } from '../user/user.entity'; // Sesuaikan dengan path ke entitas User

declare global {
  namespace Express {
    interface Request {
      user?: User; // Gunakan tipe 'User' yang sesuai
    }
  }
}
