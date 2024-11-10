import { Injectable, Dependencies } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
@Dependencies(UserService)
export class AuthService {
  private userService: UserService;
  private jwtService: JwtService;

  constructor(usersService) {
    this.userService = usersService;
    this.jwtService = new JwtService();
  }

  async validateUser(email, pass) {
    const { user } = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // Correct password comparison
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: 'secretKey',
      }),
    };
  }
}
