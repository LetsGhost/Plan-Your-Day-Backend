import { Injectable, Dependencies, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

type DoneFunction = (err: Error | null, user?: any | null) => void;

@Injectable()
@Dependencies(UserService)
export class AuthService {
  private userService: UserService;

  constructor(usersService) {
    this.userService = usersService;
  }

  async validateUser(email, pass) {
    const { user } = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      Logger.log('User validated successfully', 'AuthService');
      return result;
    }
    Logger.error('Invalid credentials', 'AuthService');
    return null;
  }

  serializeUser(user: any, done: DoneFunction) {
    done(null, user.id);
  }

  async deserializeUser(id: string, done: DoneFunction) {
    const user = await this.userService.findById(id);
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'), null);
    }
  }
}
