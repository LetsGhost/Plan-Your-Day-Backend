import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  UnauthorizedException,
  Dependencies,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
@Dependencies(AuthService)
export class LocalStrategy extends PassportStrategy(Strategy) {
  private authService: AuthService;

  constructor(authService) {
    super({ usernameField: 'email' });
    this.authService = authService;
  }

  async validate(email, password) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      Logger.error('Invalid credentials', 'LocalStrategy');
      throw new UnauthorizedException();
    }
    Logger.log('User validated successfully', 'LocalStrategy');
    return user;
  }
}
