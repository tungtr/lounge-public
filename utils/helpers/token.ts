// Essentials
import jwt, { Secret } from 'jsonwebtoken';

export const generateToken = (payload: string | object | Buffer, expiresIn: string) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET as Secret, { expiresIn });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.TOKEN_SECRET as Secret);
};