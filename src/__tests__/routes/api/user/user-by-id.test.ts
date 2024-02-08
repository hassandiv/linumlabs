import supertest from 'supertest';
import app from '../../../../app';
import { HttpCode } from '../../../../ts-models/app-error';

describe('GET /user/:id', () => {
  describe('find a specific user information by ID', () => {
    test('should respond with a status code 404 if user dont exist', async () => {
      const response = await supertest(app).get('/user/99');
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(response.body.error).toBeDefined();
    });
  });
});
