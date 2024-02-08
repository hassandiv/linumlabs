import supertest from 'supertest';
import app from '../../../../app';
import { HttpCode } from '../../../../ts-models/app-error';
import { generateMockToken } from '../../../../__mocks__/jwt';
import { mockUser } from '../../../../__mocks__/user';

describe('GET /me/update-password', () => {
  const mockToken = generateMockToken();
  describe('when a valid JWT token is provided to update password', () => {
    test('should respond with a status code 400 when password is less than 4 characters long', async () => {
      const response = await supertest(app)
        .put('/me/update-password')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          oldPassword: 'erw',
          newPassword: 'asq',
        });
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      expect(response.body.error).toBeDefined();
    });

    test('should respond with a status code 400 when the old password or new password or both are missing', async () => {
      const bodyData = [
        { oldPassword: mockUser.password },
        { newPassword: mockUser.password },
        {},
      ];
      for (const body of bodyData) {
        const response = await supertest(app)
          .put('/me/update-password')
          .set('Authorization', `Bearer ${mockToken}`)
          .send(body);
        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
        expect(response.body.error).toBeDefined();
      }
    });
  });
});
