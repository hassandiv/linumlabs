import { Request } from 'express';

interface CustomRequest extends Request {
  jwtPayload?: any;
}

export default CustomRequest;
