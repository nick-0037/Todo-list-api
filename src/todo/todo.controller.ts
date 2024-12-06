import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';
import { TodoService } from '../todo/todo.service';
import { CreateDto, UpdateDto } from './todo.dto';

@UseGuards(JwtAuthGuard)
@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  create(@Body() createDto: CreateDto, @Req() req) {
    return this.todoService.create(createDto, req.user.userId);
  }

  @Get()
  findAll(
    @Req() req,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Query('title') title?: string,
  ) {
    return this.todoService.findAll(req.user.userId, page, limit, sortOrder, title);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDto,
    @Req() req,
  ) {
    const updatedTodo = await this.todoService.update(
      id,
      updateDto,
      req.user.userId,
    );
    return {
      id: Number(id),
      title: updatedTodo.title,
      description: updatedTodo.description,
    };
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string, @Req() req) {
    return this.todoService.delete(id, req.user.userId);
  }
}
