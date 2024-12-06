import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { CreateDto } from './todo.dto';
import { UpdateDto } from './todo.dto';

describe('todoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            create: jest.fn().mockResolvedValue([{ id: 1, title: 'New task'}]),
            findAll: jest.fn().mockResolvedValue({
              data: [
                { 
                  id: 1, 
                  title: 'Test task',
                  userId: '123', 
                  description: 'Test description',
                  createAt: '2024-12-02T21:15:28.982Z', 
                }
              ],
              page: 1,
              limit: 5,
              total: 10,
            }),
            update: jest.fn().mockResolvedValue({ 
              id: 1, title: 'Updated task', description: 'Added description'
            }),
            delete: jest.fn().mockResolvedValue([{ delete: true }]),
          }
        }
      ]
    }).compile();
    
    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('Should defined', () => {
    expect(todoController).toBeDefined();
  });

  describe('create', () => {
    it('Should create a new task', async () => {
      const createDto: CreateDto = { title: 'New task', description: 'Test description'};
      const result = await todoController.create(createDto, { user: { userId: '123'} });

      expect(result[0]).toEqual({ id: 1, title: 'New task'});
      expect(todoService.create).toHaveBeenCalledWith(createDto, '123');
    });
  });

  describe('findAll', () => {
    it('Should return tasks with pagination and sortOrder when no title filter is applied', async () => {
      const req = { user: { userId: '123' } };
      const page = 1;
      const limit = 5;
      const sortOrder = 'asc';
      const title = undefined;

      const result = await todoController.findAll(req, page, limit, sortOrder); 
    
      expect(result).toEqual({
        data: [
          { 
            id: 1, 
            title: 'Test task',
            userId: '123', 
            description: 'Test description',
            createAt: '2024-12-02T21:15:28.982Z', 
          }
        ],
        page: 1,
        limit: 5,
        total: 10,
      });
      expect(todoService.findAll).toHaveBeenCalledWith('123', page, limit, sortOrder, title);
    });

    it('Should return filtered tasks by title with pagination and sortOrder', async () => {
      const req = { user: { userId: '123' } };
      const page = 1;
      const limit = 5;
      const sortOrder = 'asc';
      const title = 'Test';

      const result = await todoController.findAll(req, page, limit, sortOrder, title); 
    
      expect(result).toEqual({
        data: [
          { 
            id: 1, 
            title: 'Test task',
            userId: '123', 
            description: 'Test description',
            createAt: '2024-12-02T21:15:28.982Z', 
          }
        ],
        page: 1,
        limit: 5,
        total: 10,
      });
      expect(todoService.findAll).toHaveBeenCalledWith('123', page, limit, sortOrder, title);
    });
  });

  describe('update', () => {
    it('Should update a task', async () => {
      const taskId ='1';
      const userId = { user: { userId: '123' } };
      const updateDto: UpdateDto = { title: 'Updated task', description: 'Added description' };
      const result = await todoController.update(taskId, updateDto, userId);

      expect(result).toEqual({ id: 1, title: 'Updated task', description: 'Added description' });
      expect(todoService.update).toHaveBeenCalledWith(taskId, updateDto, '123');
    });
  });

  describe('delete', () => {
    it('Should delete a task', async () => {
      const taskId = '1';
      const userId = { user: { userId: '123' } };

      const result = await todoController.delete(taskId, userId);
      
      expect(result[0]).toEqual({ delete: true });
      expect(todoService.delete).toHaveBeenCalledWith(taskId, '123');
    });
  });
});