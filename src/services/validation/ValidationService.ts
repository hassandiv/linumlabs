import { AppError } from '../../errors/AppErrors';
import { HttpCode } from '../../ts-models/app-error';
import bcrypt from 'bcrypt';
import { User } from '../../ts-models/user';

const usernameRegex = /^[a-zA-Z0-9._%+-]{2,}$/;
const passwordRegex = /^[a-zA-Z0-9._%+-]{4,}$/;

export class ValidationService {
  validateRequestBody(body: User, isSignup: { isSignup: boolean }) {
    const errors = [];
    if (!usernameRegex.test(body.username))
      errors.push({ message: 'Username min 2 chars' });
    if (!passwordRegex.test(body.password))
      errors.push({
        message: 'Password min 4 chars',
      });
    if (errors.length > 0)
      throw new AppError({
        httpCode: isSignup.isSignup
          ? HttpCode.BAD_REQUEST
          : HttpCode.UNAUTHORIZED,
        errors: errors,
      });

    const receivedProperties = Object.keys(body);
    const allowedProperties = ['username', 'password'];
    const invalidProperties = receivedProperties.filter(
      (prop) => !allowedProperties.includes(prop),
    );
    if (
      invalidProperties.length > 0 ||
      receivedProperties.length !== allowedProperties.length
    ) {
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        description: 'Invalid request body',
      });
    }
  }
}
