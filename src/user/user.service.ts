import { Injectable } from '@nestjs/common';
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
  ): Promise<{ success: boolean; user?: User; code: number; message: string }> {
    try {
      // Check if the user already exists
      const existingUser = await this.userModel.findOne({ email: user.email });
      if (existingUser) {
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
      return {
        success: false,
        code: 500,
        message: 'Internal server error',
      };
    }
  }
}
