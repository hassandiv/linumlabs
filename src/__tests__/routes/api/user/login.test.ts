import supertest from 'supertest';
import app from '../../../../app';
import { HttpCode } from '../../../../ts-models/app-error';
import { mockUser } from '../../../../__mocks__/user';

describe('POST /login', () => {
  describe('given username and password for login', () => {
    test('should respond with a status code 401 when a user dont exist', async () => {
      const response = await supertest(app).post('/login').send({
        username: mockUser.username,
        password: mockUser.password,
      });
      expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
      expect(response.body.error).toBeDefined();
    });

    test('should specify json in the content type header', async () => {
      const response = await supertest(app).post('/login').send({
        username: mockUser.username,
        password: mockUser.password,
      });
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json'),
      );
    });
  });

  describe('when the username and password are missing', () => {
    test('should respond with a status code 400', async () => {
      const bodyData = [
        { username: mockUser.username },
        { password: mockUser.password },
        {},
      ];
      for (const body of bodyData) {
        const response = await supertest(app).post('/login').send(body);
        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
        expect(response.body.error).toBeDefined();
      }
    });
  });
});
