import { Response, NextFunction } from 'express';
import { AppError } from '../errors/AppErrors';
import { HttpCode } from '../ts-models/app-error';
import jwt from 'jsonwebtoken';
import CustomRequest from '../../index';

export const checkJWT = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    throw new AppError({
      httpCode: HttpCode.UNAUTHORIZED,
      description: 'Request not authorised.',
    });
  }

  const token = req.headers.authorization?.split(' ')[1] as string;
  try {
    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET!) as string;
    req.jwtPayload = jwtPayload;
    next();
  } catch (err) {
    throw new AppError({
      httpCode: HttpCode.UNAUTHORIZED,
      description: 'Invalid token provided.',
    });
  }
};
