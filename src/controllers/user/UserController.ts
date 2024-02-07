import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../services/user/UserService';
import { HttpCode } from '../../ts-models/app-error';
import CustomRequest from '../../../index';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.signup(req.body);
      return res
        .status(HttpCode.CREATED)
        .send({ message: 'User successfully created!', user });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.login(req.body);
      return res
        .status(HttpCode.OK)
        .send({ message: 'Successful login!', ...user });
    } catch (error) {
      next(error);
    }
  }

  async me(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.me(req.jwtPayload.username);
      return res.status(HttpCode.OK).send({ user });
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      await this.userService.updatePassword(req.jwtPayload.username, req.body);
      return res
        .status(HttpCode.OK)
        .send({ message: 'Password successfully updated!' });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId: number = parseInt(req.params.id, 10);
      const user = await this.userService.getUserById(userId);
      return res.status(HttpCode.OK).send({ user });
    } catch (error) {
      next(error);
    }
  }

  async followUser(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const userId: number = parseInt(req.params.id, 10);
      const user = await this.userService.followUser(
        req.jwtPayload.username,
        userId,
      );
      return res
        .status(HttpCode.OK)
        .send({ message: `You are following ${user?.username}` });
    } catch (error) {
      next(error);
    }
  }

  async unfollowUser(req: Request, res: Response, next: NextFunction) {
    try {
      //userService
    } catch (error) {
      next(error);
    }
  }

  async listMostFollowed(req: Request, res: Response, next: NextFunction) {
    try {
      //userService
    } catch (error) {
      next(error);
    }
  }
}
