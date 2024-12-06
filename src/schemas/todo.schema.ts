import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ToDo extends Document {
  @Prop({ required: true })
  _id: number;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, default: Date.now })
  createAt: Date;
}

const todoSchema = SchemaFactory.createForClass(ToDo);

todoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const ToDoSchema = todoSchema;