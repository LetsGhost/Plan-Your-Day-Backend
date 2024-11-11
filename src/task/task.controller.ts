import {
  Controller,
  Post,
  UseGuards,
  Logger,
  Param,
  Body,
} from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create:id')
  async create(@Body() taskData: any, @Param('id') userId: string) {
    try {
      // Create the task
      const { success, code, message, task } = await this.taskService.create(
        taskData,
        userId,
      );
      if (success) {
        Logger.log('Task created successfully', 'TaskController');
        return {
          success,
          code,
          message,
          task,
        };
      }

      Logger.error(message, 'TaskController');
      return {
        success,
        code,
        message,
      };
    } catch (error) {
      Logger.error(error, 'TaskController');
      return {
        success: false,
        code: 500,
        message: 'Internal server error',
      };
    }
  }
}
