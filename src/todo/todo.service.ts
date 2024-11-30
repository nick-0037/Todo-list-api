import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ToDo } from '../schemas/todo.schema';
import { Model } from 'mongoose';
import { createDto, updateDto } from './todo.dto';
import { TaskCounterService } from './counter.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(ToDo.name) private readonly todoModel: Model<ToDo>,
    private readonly taskCounterService: TaskCounterService,
  ) {}

  async create(createDto: createDto, userId: string): Promise<ToDo> {
    const taskId = await this.taskCounterService.getNextTaskId(userId);

    const newTodo = new this.todoModel({
      _id: taskId,
      ...createDto,
      userId,
    });
    
    return newTodo.save();
  }

  async findAll(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.todoModel.find({ userId }).skip(skip).limit(limit).exec(),
      this.todoModel.countDocuments({ userId }),
    ]);

    return { data, page, limit, total };
  }

  async update(id: string, updateDto: updateDto,userId: string): Promise<ToDo> {
    const todo = await this.todoModel.findOne({ _id: id, userId });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    if (todo.userId.toString() !== userId) {
      throw new ForbiddenException();
    }

    return this.todoModel.findByIdAndUpdate(id, updateDto, { new: true })
  }

  async delete(id: string, userId: string): Promise<void> {
    const todo = await this.todoModel.findOne({ _id: id, userId })

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    if (todo.userId.toString() !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this todo',
      );
    }

    await this.todoModel.findByIdAndDelete(id);
  }
}
