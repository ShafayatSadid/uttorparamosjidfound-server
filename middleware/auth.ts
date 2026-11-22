import { Request, Response, NextFunction } from 'express';
import { createLocalJWKSet, jwtVerify } from 'jose';
import { env } from '../config/env';

let jwks: any = null;

async function getJWKS() {
  if (jwks) return jwks;
  const res = await fetch(`${env.CLIENT_URL}/api/auth/jwks`);
  if (!res.ok) throw new Error('Failed to fetch JWKS');
  jwks = createLocalJWKSet(await res.json());
  return jwks;
}

export async function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const keySet = await getJWKS();
    
    const { payload } = await jwtVerify(token, keySet);

    if (payload.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden: Admin only' });
      return;
    }

    (req as any).user = payload;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
} 