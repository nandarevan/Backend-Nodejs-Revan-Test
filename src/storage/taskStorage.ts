import { prisma } from '../prisma.js';
import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '../types/task.js';

export class TaskStorage {
  private static async seedInitialData(): Promise<void> {
    try {
      const count = await prisma.task.count();
      if (count === 0) {
        await prisma.task.createMany({
          data: [
            {
              id: 'f83a4848-3112-4217-91a7-19e489c7ad12',
              title: 'Design API Architecture',
              description: 'Define REST API endpoints, entity schemas, and HTTP status handling.',
              status: TaskStatus.COMPLETED,
              priority: 'HIGH'
            },
            {
              id: 'c29b7194-68ab-4f1b-871d-55e1c4b7890a',
              title: 'Implement Task Management API',
              description: 'Build CRUD endpoints using Express, TypeScript, and PostgreSQL.',
              status: TaskStatus.IN_PROGRESS,
              priority: 'HIGH'
            }
          ]
        });
      }
    } catch (error) {
      console.error('Error seeding initial data:', error);
    }
  }

  public static async getAll(): Promise<Task[]> {
    await this.seedInitialData();
    return prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  public static async getById(id: string): Promise<Task | null> {
    await this.seedInitialData();
    return prisma.task.findUnique({
      where: { id }
    });
  }

  public static async create(dto: CreateTaskDto): Promise<Task> {
    return prisma.task.create({
      data: {
        title: dto.title.trim(),
        description: dto.description.trim(),
        status: dto.status || TaskStatus.PENDING,
        priority: dto.priority || 'MEDIUM'
      }
    });
  }

  public static async update(id: string, dto: UpdateTaskDto): Promise<Task | null> {
    const existing = await this.getById(id);
    if (!existing) {
      return null;
    }

    return prisma.task.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title.trim() }),
        ...(dto.description !== undefined && { description: dto.description.trim() }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.priority !== undefined && { priority: dto.priority })
      }
    });
  }

  public static async updateStatus(id: string, status: TaskStatus): Promise<Task | null> {
    return this.update(id, { status });
  }

  public static async delete(id: string): Promise<boolean> {
    const existing = await this.getById(id);
    if (!existing) {
      return false;
    }

    await prisma.task.delete({
      where: { id }
    });
    return true;
  }
}
