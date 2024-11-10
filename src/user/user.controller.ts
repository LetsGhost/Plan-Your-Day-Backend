import { Controller, Post, Body, Logger, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() userData: any) {
    try {
      // check if userData is valid
      if (!userData) {
        Logger.error('Invalid user data', 'UserController');
        return {
          success: false,
          code: 400,
          message: 'Invalid user data',
        };
      }

      // Create the user
      const { success, code, message } =
        await this.userService.create(userData);
      if (success) {
        Logger.log('User created successfully', 'UserController');
        return {
          success,
          code,
          message,
        };
      }

      Logger.error(message, 'UserController');
      return {
        success,
        code,
        message,
      };
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('findByEmail')
  async findByEmail(@Body() email: string) {
    try {
      // Check if email is valid
      if (!email) {
        Logger.error('Invalid email', 'UserController');
        return {
          success: false,
          code: 400,
          message: 'Invalid email',
        };
      }

      // Find the user by email
      const { success, code, message, user } =
        await this.userService.findByEmail(email);
      if (success) {
        Logger.log('User found successfully', 'UserController');
        return {
          success,
          code,
          user,
        };
      }

      Logger.error(message, 'UserController');
      return {
        success,
        code,
        message,
      };
    } catch (error) {
      Logger.error(error, 'UserController');
      return {
        success: false,
        code: 500,
        message: 'Internal server error',
      };
    }
  }
}
