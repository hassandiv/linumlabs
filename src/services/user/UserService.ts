import {
  LoginResponse,
  User,
  UserInfo,
  UpdatePassword,
} from '../../ts-models/user';
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

  async signup(body: User): Promise<UserInfo> {
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
    } catch (error) {
      throw error;
    }
  }

  async login(body: User): Promise<LoginResponse> {
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
      const loginResponse: LoginResponse = {
        token,
        user: userResponse,
      };
      return loginResponse;
    } catch (error) {
      throw error;
    }
  }

  async me(username: string): Promise<UserInfo> {
    try {
      const user = await this.userRepository.findOneBy({ username });
      const userResponse = this.responseObject(user!);
      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(username: string, body: UpdatePassword): Promise<void> {
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
        await this.userRepository.save(user);
      }
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: number): Promise<UserInfo> {
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

  async followUser(username: string, id: number): Promise<UserInfo> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new AppError({
          httpCode: HttpCode.NOT_FOUND,
          description: 'User not found.',
        });
      }
      const isAlreadyFollowing = user.followers?.some(
        (follower) =>
          follower?.username.toLowerCase() === username.toLowerCase(),
      );
      if (isAlreadyFollowing) {
        throw new AppError({
          httpCode: HttpCode.BAD_REQUEST,
          description: 'You are already following this user.',
        });
      }
      user.followers = [...(user.followers || []), { username: username }];
      await this.userRepository.save(user);
      const userResponse = this.responseObject(user);
      return userResponse;
    } catch (error) {
      throw error;
    }
  }
}
