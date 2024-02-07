import { ValidationService } from '../../../services/validation/ValidationService';
import { AppError } from '../../../errors/AppErrors';
import bcrypt from 'bcrypt';

const validationService = new ValidationService();

describe('ValidationService - validateBodyRequest method', () => {
  test('throws AppError for request with an empty username and password', () => {
    const requestBody = { username: '', password: '' };
    expect(() => validationService.validateBodyRequest(requestBody)).toThrow(
      AppError,
    );
  });

  test('throws AppError for request with a username less than 2 characters', () => {
    const requestBody = { username: 'a', password: 'somepassword' };
    expect(() => validationService.validateBodyRequest(requestBody)).toThrow(
      AppError,
    );
  });

  test('throws AppError for request with a password less than 4 characters', () => {
    const requestBody = { username: 'alex', password: 'abc' };
    expect(() => validationService.validateBodyRequest(requestBody)).toThrow(
      AppError,
    );
  });

  test('does not throw an AppError for a request with valid username and password', () => {
    const requestBody = {
      username: 'alex',
      password: 'somepassword',
    };
    expect(() =>
      validationService.validateBodyRequest(requestBody),
    ).not.toThrow();
  });
});

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('ValidationService - comparePassword method', () => {
  test('throws AppError for non-matching passwords', async () => {
    const password = 'password';
    const hashedPassword = 'differentpassword';
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    await expect(
      validationService.comparePassword(password, hashedPassword),
    ).rejects.toThrow(AppError);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
  });

  test('throws AppError for invalid bcrypt.compare result', async () => {
    const password = 'somePassword';
    const hashedPassword = 'someHashedPassword';
    const expectedErrorMessage = 'Bcrypt comparison error';
    (bcrypt.compare as jest.Mock).mockRejectedValue(
      new Error(expectedErrorMessage),
    );
    await expect(
      validationService.comparePassword(password, hashedPassword),
    ).rejects.toThrow(expectedErrorMessage);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
  });

  test('does not throw an AppError for a valid matching passwords', async () => {
    const password = 'somepassword';
    const hashedPassword = 'somepassword';
    (bcrypt.compare as jest.Mock).mockImplementation(
      (providedPassword, storedPassword) => {
        return providedPassword === storedPassword;
      },
    );
    const result = await validationService.comparePassword(
      password,
      hashedPassword,
    );
    expect(result).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
  });
});

describe('ValidationService - validateUpdatePassword method', () => {
  test('throws AppError for invalid request with additional properties', () => {
    const requestBody = {
      oldPassword: 'someOldPassword',
      newPassword: 'someNewPassword',
      username: 'alex',
    };
    expect(() => validationService.validateUpdatePassword(requestBody)).toThrow(
      AppError,
    );
  });

  test('throws AppError for both passwords less than 4 characters long', () => {
    const requestBody = { oldPassword: 'abc', newPassword: '123' };
    expect(() => validationService.validateUpdatePassword(requestBody)).toThrow(
      AppError,
    );
  });

  test('throws AppError for old password less than 4 characters long', () => {
    const requestBody = { oldPassword: 'pas', newPassword: 'someNewPassword' };
    expect(() => validationService.validateUpdatePassword(requestBody)).toThrow(
      AppError,
    );
  });

  test('throws AppError for new password less than 4 characters long', () => {
    const requestBody = { oldPassword: 'someOldPassword', newPassword: 'pas' };
    expect(() => validationService.validateUpdatePassword(requestBody)).toThrow(
      AppError,
    );
  });

  test('does not throw AppError for valid old password and new password', () => {
    const requestBody = {
      oldPassword: 'oldPassword123',
      newPassword: 'newPassword789',
    };
    expect(() =>
      validationService.validateUpdatePassword(requestBody),
    ).not.toThrow();
  });
});
