import { TaskStatus, TaskPriority, Task as PrismaTask } from '@prisma/client';

export { TaskStatus, TaskPriority };
export type Task = PrismaTask;

export interface CreateTaskDto {
  title: string;
  description: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}
