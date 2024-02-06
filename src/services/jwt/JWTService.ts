import jwt from 'jsonwebtoken';

export class JWTService {
  async generateAuthToken({ id, username }: { id: number; username: string }) {
    const token = jwt.sign({ id, username }, process.env.JWT_SECRET!, {
      expiresIn: '4h',
    });
    return token;
  }
}
