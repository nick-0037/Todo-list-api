import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ToDo, ToDoSchema } from '../schemas/todo.schema';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TaskCounterService } from './counter.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ToDo.name, schema: ToDoSchema }]),
  ],
  controllers: [TodoController],
  providers: [TodoService, TaskCounterService],
})
export class TodoModule {}
