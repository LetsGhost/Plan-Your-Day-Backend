import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class IsCompleted {
  @Prop({ required: true })
  status: boolean;

  @Prop()
  completedAt?: Date;
}

export const IsCompletedSchema = SchemaFactory.createForClass(IsCompleted);

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  dueDate?: Date;

  @Prop({ type: IsCompletedSchema })
  isCompleted: IsCompleted;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
