import supertest from 'supertest';
import app from '../../../../app';
import { HttpCode } from '../../../../ts-models/app-error';
import { mockUser } from '../../../../__mocks__/user';

describe('POST /signup', () => {
  describe('when the signup endpoint responds with JSON', () => {
    test('should include "json" in the Content-Type header', async () => {
      const response = await supertest(app).post('/signup');
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json'),
      );
    });
  });

  describe('when the username, password, or both are missing in the request body', () => {
    test('should respond with a 400 status code and provide an error message', async () => {
      const bodyData = [
        { username: mockUser.username },
        { password: mockUser.password },
        {},
      ];
      for (const body of bodyData) {
        const response = await supertest(app).post('/signup').send(body);
        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
        expect(response.body.error).toBeDefined();
      }
    });
  });
});
