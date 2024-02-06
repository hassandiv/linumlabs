import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../../../controllers/user/UserController';
import { checkJWT } from '../../../middlewares/checkJWT';
const router = Router();
const userController = new UserController();

// @route POST /signup
// @desc Users signup
// @access Public
router.post('/signup', (req: Request, res: Response, next: NextFunction) =>
  userController.signup(req, res, next),
);

// @route POST /login
// @desc Users login
// @access Public
router.post('/login', (req: Request, res: Response, next: NextFunction) =>
  userController.login(req, res, next),
);

// @route GET /me
// @desc User information (username and number of followers)
// @access Private
router.get('/me', checkJWT, (req: Request, res: Response, next: NextFunction) =>
  userController.me(req, res, next),
);

// @route PUT /me/update-password
// @desc Update the current user password
// @access Private
router.put(
  '/me/update-password',
  checkJWT,
  (req: Request, res: Response, next: NextFunction) =>
    userController.updatePassword(req, res, next),
);

// @route GET /user/:id
// @desc List username & number of followers of a user
// @access Private
router.get(
  '/user/:id',
  checkJWT,
  (req: Request, res: Response, next: NextFunction) =>
    userController.getUser(req, res, next),
);

// @route POST /user/:id/follow
// @desc Like a user
// @access Private
router.post(
  '/user/:id/follow',
  checkJWT,
  (req: Request, res: Response, next: NextFunction) =>
    userController.followUser(req, res, next),
);

// @route DELETE /user/:id/unfollow
// @desc Un-Like a user
// @access Private
router.delete(
  '/user/:id/unfollow',
  checkJWT,
  (req: Request, res: Response, next: NextFunction) =>
    userController.unfollowUser(req, res, next),
);

// @route GET /most-followed
// @desc List users in a most liked to least liked
// @access Private
router.get(
  '/most-followed',
  checkJWT,
  (req: Request, res: Response, next: NextFunction) =>
    userController.listMostFollowed(req, res, next),
);

export default router;
