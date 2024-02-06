import { User } from '../../ts-models/user';
import { AppDataSource } from '../../data-source';
import { HttpCode } from '../../ts-models/app-error';
import { Users } from '../../entities/Users';
import { AppError } from '../../errors/AppErrors';
import bcrypt from 'bcrypt';

export class UserService {
  private userRepository = AppDataSource.getRepository(Users);

  hashPassword = async (password: string) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  };

  async signup({ username, password }: User) {
    try {
      const foundUser = await this.userRepository.findOneBy({
        username: username,
      });
      if (foundUser) {
        throw new AppError({
          httpCode: HttpCode.BAD_REQUEST,
          description: 'User already exists!',
        });
      }
      const newUser = Object.assign(new Users(), {
        username: username,
        password: await this.hashPassword(password),
      });
      await this.userRepository.save(newUser);
      const userResponse = newUser.toResponseObject();
      return userResponse;
    } catch (err) {
      throw err;
    }
  }

  async login({ username, password }: User) {
    try {
    } catch (err) {
      throw err;
    }
  }
}
