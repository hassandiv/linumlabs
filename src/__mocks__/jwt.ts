import jwt from 'jsonwebtoken';
import { mockUser } from './user';

const secret = process.env.JWT_SECRET!;

export const generateMockToken = () => {
  return jwt.sign({ id: mockUser.id, username: mockUser.username }, secret, {
    expiresIn: '1h',
  });
};
