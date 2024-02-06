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
        .send({ message: 'Successful login!', user });
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

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      //userService
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      //userService
    } catch (error) {
      next(error);
    }
  }

  async followUser(req: Request, res: Response, next: NextFunction) {
    try {
      //userService
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
