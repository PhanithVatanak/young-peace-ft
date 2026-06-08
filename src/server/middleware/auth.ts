import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export enum UserRole {
  USER = 'User',
  ADMIN = 'Admin',
  SUPER_ADMIN = 'Administrator',
}

export interface AuthRequest extends Request {
  user?: {
    id: string | number;
    email: string;
    role: UserRole;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'your-secret-key');
    req.user = decoded as any;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    next();
  };
}
