import { Injectable, Logger } from '@nestjs/common';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(
    user: User,
  ): Promise<{ success: boolean; code: number; message: string }> {
    try {
      // Check if the user already exists
      const existingUser = await this.userModel.findOne({ email: user.email });
      if (existingUser) {
        console.log(existingUser);
        return {
          success: false,
          code: 409,
          message: 'User already exists',
        };
      }

      const createdUser = new this.userModel(user);
      await createdUser.save();

      return {
        success: true,
        code: 201,
        message: 'User created successfully',
      };
    } catch (error) {
      Logger.error(error, 'UserService');
      return {
        success: false,
        code: 500,
        message: 'Internal server error',
      };
    }
  }

  async findByEmail(email: string): Promise<{
    success: boolean;
    code: number;
    message?: string;
    user?: User;
  }> {
    try {
      const user = await this.userModel.findOne({ email: email.toString() });
      if (!user) {
        return {
          success: false,
          code: 404,
          message: 'User not found',
        };
      }

      return {
        success: true,
        code: 200,
        user,
      };
    } catch (error) {
      Logger.error(error, 'UserService');
      return {
        success: false,
        code: 500,
        message: 'Internal server error',
      };
    }
  }

  async findById(id: string): Promise<User> {
    try {
      return await this.userModel.findById(id);
    } catch (error) {
      Logger.error(error, 'UserService');
      return null;
    }
  }
}
