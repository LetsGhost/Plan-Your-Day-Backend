import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import * as passport from 'passport';

@Module({
  imports: [UserModule, PassportModule],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {
  constructor(private authService: AuthService) {
    passport.serializeUser((user, done) =>
      this.authService.serializeUser(user, done),
    );
    passport.deserializeUser((id, done) =>
      this.authService.deserializeUser(id as string, done),
    );
  }
}
