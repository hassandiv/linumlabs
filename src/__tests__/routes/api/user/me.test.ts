import supertest from 'supertest';
import app from '../../../../app';
import { HttpCode } from '../../../../ts-models/app-error';

describe('GET /me', () => {
  describe('when no JWT token is provided', () => {
    test('should respond with a status code 401 authentication failed', async () => {
      const response = await supertest(app).get('/me');
      expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('when an invalid JWT token is provided', () => {
    test('should respond with a status code 401 authentication failed', async () => {
      const invalidToken = 'invalidjwttoken';
      const response = await supertest(app)
        .get('/me')
        .set('Authorization', `Bearer ${invalidToken}`);
      expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('when an expired JWT token is provided', () => {
    test('should respond with a status code 401 authentication failed', async () => {
      const expiredToken = 'expiredjwttoken';
      const response = await supertest(app)
        .get('/me')
        .set('Authorization', `Bearer ${expiredToken}`);
      expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
      expect(response.body.error).toBeDefined();
    });
  });
});
