import supertest from 'supertest';
import app from '../../../../app';
import { HttpCode } from '../../../../ts-models/app-error';
import { mockUser } from '../../../../__mocks__/user';

describe('POST /signup', () => {
  describe('given username and password for signup', () => {
    test('should specify json in the content type header', async () => {
      const response = await supertest(app).post('/signup').send({
        username: mockUser.username,
        password: mockUser.password,
      });
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json'),
      );
    });
  });

  describe('when the username and password is missing', () => {
    test('should respond with a status code 400', async () => {
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
