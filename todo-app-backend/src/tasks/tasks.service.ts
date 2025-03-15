import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.task.findMany();
  }

  async findOne(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: createTaskDto,
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    console.log('Aktualizacja zadania z ID:', id, updateTaskDto);

    try {
      return this.prisma.task.update({
        where: { id },
        data: updateTaskDto,
      });
    } catch (error) {
      console.error('Błąd Prisma:', error);
      throw error;
    }
  }

  async remove(id: string) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}