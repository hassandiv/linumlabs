import supertest from 'supertest';
import app from '../../../../app';
import { HttpCode } from '../../../../ts-models/app-error';

describe('GET /user/:id', () => {
  describe('when attempting to retrieve a user by ID', () => {
    test('should respond with a 404 status code and provide an error message if the user does not exist', async () => {
      const response = await supertest(app).get('/user/99');
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(response.body.error).toBeDefined();
    });
  });
});
