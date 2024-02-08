import supertest from 'supertest';
import app from '../../../../app';
import { HttpCode } from '../../../../ts-models/app-error';

describe('GET /most-followed', () => {
  describe('when attempting to retrieve most followed users', () => {
    test('should respond with a 200 status code and provide an array of most followed users', async () => {
      const response = await supertest(app).get('/most-followed');
      expect(response.statusCode).toBe(HttpCode.OK);
      expect(response.body.mostFollowed).toBeDefined();
    });
  });
});
