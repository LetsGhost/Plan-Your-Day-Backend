import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { Logger } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: `${process.env.MONGO_URI}`,
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            Logger.log('MongoDB connected successfully', 'MongoDB');
          });
          connection.on('error', (err) => {
            Logger.error(`MongoDB connection error: ${err}`, 'MongoDB');
          });
          connection.on('disconnected', () => {
            Logger.warn('MongoDB disconnected', 'MongoDB');
          });
          return connection;
        },
      }),
    }),
    UserModule,
    AuthModule,
    TaskModule,
  ],
})
export class AppModule {}
