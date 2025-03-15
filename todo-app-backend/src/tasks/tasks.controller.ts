import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Get()
    async findAll() {
        return this.tasksService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const task = await this.tasksService.findOne(id);
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }

    @Post()
    async create(@Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.create(createTaskDto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
        console.log('Otrzymano żądanie aktualizacji:', id, updateTaskDto);

        // Upewnij się, że id jest przekazywane do serwisu zadań
        const task = await this.tasksService.update(id, updateTaskDto);

        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const task = await this.tasksService.remove(id);
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }
}