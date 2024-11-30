import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ToDo } from '../schemas/todo.schema';

@Injectable()
export class TaskCounterService {
  constructor(
    @InjectModel(ToDo.name) private readonly todoModel: Model<ToDo>,
  ) {}

  async getNextTaskId(userId: string): Promise<number> {
    const taskCount = await this.todoModel.countDocuments({ userId });
    return taskCount + 1;
  }
}
