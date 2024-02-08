import jwt from 'jsonwebtoken';

export const mockUser = {
  id: 1,
  password: 'somepassword',
  username: 'alex',
  followers: [{ username: 'sara' }, { username: 'monica' }],
};

const secret = process.env.JWT_SECRET!;

export const generateMockToken = () => {
  return jwt.sign({ id: mockUser.id, username: mockUser.username }, secret, {
    expiresIn: '1h',
  });
};
