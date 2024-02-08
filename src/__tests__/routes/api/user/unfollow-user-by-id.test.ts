import supertest from 'supertest';
import app from '../../../../app';
import { HttpCode } from '../../../../ts-models/app-error';
import { generateMockToken } from '../../../../__mocks__/jwt';
import { mockUser } from '../../../../__mocks__/user';

describe('DELETE /user/:id/unfollow', () => {
  const mockToken = generateMockToken();
  describe('when a valid JWT token is provided', () => {
    test('should respond with a 404 status code and provide an error message if the user to follow does not exist', async () => {
      const followResponse = await supertest(app)
        .delete(`/user/${mockUser.id}/unfollow`)
        .set('Authorization', `Bearer ${mockToken}`);
      expect(followResponse.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(followResponse.body.error).toBeDefined();
    });
  });

  describe('when no JWT token is provided', () => {
    test('should respond with a 401 status code and provide an error message request not authorised', async () => {
      const followResponse = await supertest(app).delete(
        `/user/${mockUser.id}/unfollow`,
      );
      expect(followResponse.statusCode).toBe(HttpCode.UNAUTHORIZED);
      expect(followResponse.body.error).toBeDefined();
    });
  });
});
