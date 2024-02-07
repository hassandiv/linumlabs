import { AppError } from '../../errors/AppErrors';
import { HttpCode } from '../../ts-models/app-error';
import bcrypt from 'bcrypt';
import { User, UpdatePassword } from '../../ts-models/user';

const usernameRegex = /^[a-zA-Z0-9._%+-]{2,}$/;
const passwordRegex = /^[a-zA-Z0-9._%+-]{4,}$/;

export class ValidationService {
  validateBodyRequest(body: User) {
    const requiredProperties = ['username', 'password'];
    const missingProperties = requiredProperties.filter(
      (prop) => !(prop in body),
    );
    if (missingProperties.length > 0) {
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        description: `Missing required properties: ${missingProperties.join(
          ', ',
        )}`,
      });
    }
    const invalidProperties = Object.keys(body).filter(
      (prop) => !requiredProperties.includes(prop),
    );
    if (invalidProperties.length > 0) {
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        description: `Invalid properties: ${invalidProperties.join(', ')}`,
      });
    }
    const isUsernameValid = (username: string) => usernameRegex.test(username);
    const isPasswordValid = (password: string) => passwordRegex.test(password);
    const errors = [];
    if (!isUsernameValid(body.username)) {
      errors.push({
        message: 'Username should be at least 2 characters long.',
      });
    }
    if (!isPasswordValid(body.password)) {
      errors.push({
        message: 'Password should be at least 4 characters long.',
      });
    }
    if (errors.length > 0) {
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        errors: errors,
      });
    }
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      if (!isMatch) {
        throw new AppError({
          httpCode: HttpCode.UNAUTHORIZED,
          description: 'Incorrect password. Please try again.',
        });
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  validateUpdatePassword(body: UpdatePassword) {
    const requiredProperties = ['oldPassword', 'newPassword'];
    const missingProperties = requiredProperties.filter(
      (prop) => !(prop in body),
    );

    if (missingProperties.length > 0) {
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        description: `Missing required properties: ${missingProperties.join(
          ', ',
        )}`,
      });
    }

    const invalidProperties = Object.keys(body).filter(
      (prop) => !requiredProperties.includes(prop),
    );
    if (invalidProperties.length > 0) {
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        description: `Invalid properties: ${invalidProperties.join(', ')}`,
      });
    }

    const isPasswordValid = (password: string) => passwordRegex.test(password);
    if (
      !isPasswordValid(body.oldPassword) ||
      !isPasswordValid(body.newPassword)
    ) {
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        description:
          'Both passwords are required, and each should be at least 4 characters long.',
      });
    }
  }
}
