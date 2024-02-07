import { User, UpdatePassword } from '../../ts-models/user';
import { AppDataSource } from '../../data-source';
import { HttpCode } from '../../ts-models/app-error';
import { Users } from '../../entities/Users';
import { AppError } from '../../errors/AppErrors';
import { ValidationService } from '../validation/ValidationService';
import { JWTService } from '../jwt/JWTService';
import bcrypt from 'bcrypt';

export class UserService {
  private validationService = new ValidationService();
  private userRepository = AppDataSource.getRepository(Users);
  private jwtService = new JWTService();

  hashPassword = async (password: string) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  };

  responseObject = (user: Users) => {
    const response = user.toResponseObject();
    return response;
  };

  async signup(body: User) {
    try {
      this.validationService.validateRequestBody(body);
      const foundUser = await this.userRepository.findOneBy({
        username: body.username,
      });
      if (foundUser) {
        throw new AppError({
          httpCode: HttpCode.BAD_REQUEST,
          description: 'User already exists!',
        });
      }
      const newUser = Object.assign(new Users(), {
        username: body.username,
        password: await this.hashPassword(body.password),
      });
      await this.userRepository.save(newUser);
      const userResponse = this.responseObject(newUser);
      return userResponse;
    } catch (err) {
      throw err;
    }
  }

  async login(body: User) {
    try {
      this.validationService.validateRequestBody(body);
      const user = await this.userRepository.findOneBy({
        username: body.username,
      });
      if (!user) {
        throw new AppError({
          httpCode: HttpCode.NOT_FOUND,
          description: "User doesn't exist!",
        });
      }

      await this.validationService.comparePassword(
        body.password,
        user.password,
      );
      const token = await this.jwtService.generateAuthToken({
        id: user.id,
        username: user.username,
      });

      const userResponse = this.responseObject(user);
      return { token, ...userResponse };
    } catch (err) {
      throw err;
    }
  }

  async me(username: string) {
    try {
      const user = await this.userRepository.findOneBy({ username });
      const userResponse = this.responseObject(user!);
      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(username: string, body: UpdatePassword) {
    try {
      this.validationService.validateUpdatePassword(body);
      const user = await this.userRepository.findOneBy({ username });
      if (user) {
        await this.validationService.comparePassword(
          body.oldPassword,
          user.password,
        );
        const hashedPassword = await this.hashPassword(body.newPassword);
        user.password = hashedPassword;
        const updatedUser = await this.userRepository.save(user);
        return updatedUser;
      }
      return;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new AppError({
          httpCode: HttpCode.NOT_FOUND,
          description: "User doesn't exist!",
        });
      }
      const userResponse = this.responseObject(user);
      return userResponse;
    } catch (error) {
      throw error;
    }
  }
}
