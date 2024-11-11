import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Task, TaskSchema } from 'src/task/task.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ type: TaskSchema })
  tasks: Task[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save hook to hash the password
UserSchema.pre('save', async function (next) {
  const user = this as UserDocument;
  if (!user.isModified('password')) {
    return next();
  }

  user.password = await bcrypt.hash(user.password, 10);
  next();
});
