import { Injectable, Logger } from '@nestjs/common';
import { Task } from './task.schema';
import { User } from 'src/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(
    task: Task,
    userId: string,
  ): Promise<{ success: boolean; code: number; message: string; task: Task }> {
    try {
      // Check if task is valid
      if (!task.title || !task.description) {
        return {
          success: false,
          code: 400,
          message: 'Title and description are required',
          task: null,
        };
      }

      const createdTask = new this.taskModel(task);
      const savedTask = await createdTask.save();

      // Save the task _id in the user's tasks array
      const user = await this.userModel.findById(userId);
      if (!user) {
        return {
          success: false,
          code: 404,
          message: 'User not found',
          task: null,
        };
      }

      user.tasks.push(savedTask._id);
      await user.save();

      return {
        success: true,
        code: 201,
        message: 'Task created successfully',
        task: savedTask,
      };
    } catch (error) {
      Logger.error(error, 'TaskService');
      return {
        success: false,
        code: 500,
        message: 'Internal server error',
        task: null,
      };
    }
  }
}
