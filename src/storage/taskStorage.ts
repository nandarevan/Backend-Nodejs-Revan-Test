import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus, TaskPriority } from '../types/task.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'tasks.json');

const initialTasks: Task[] = [
  {
    id: 'f83a4848-3112-4217-91a7-19e489c7ad12',
    title: 'Design API Architecture',
    description: 'Define REST API endpoints, entity schemas, and HTTP status handling.',
    status: 'COMPLETED',
    priority: 'HIGH',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'c29b7194-68ab-4f1b-871d-55e1c4b7890a',
    title: 'Implement Task Management API',
    description: 'Build CRUD endpoints using Express and TypeScript.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export class TaskStorage {
  private static async ensureFileExists(): Promise<void> {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      try {
        await fs.access(FILE_PATH);
      } catch {
        await fs.writeFile(FILE_PATH, JSON.stringify(initialTasks, null, 2), 'utf-8');
      }
    } catch (error) {
      console.error('Failed to initialize task storage file:', error);
    }
  }

  public static async getAll(): Promise<Task[]> {
    await this.ensureFileExists();
    try {
      const data = await fs.readFile(FILE_PATH, 'utf-8');
      return JSON.parse(data) as Task[];
    } catch (error) {
      console.error('Error reading tasks file:', error);
      return [];
    }
  }

  public static async getById(id: string): Promise<Task | null> {
    const tasks = await this.getAll();
    const task = tasks.find(t => t.id === id);
    return task || null;
  }

  public static async create(dto: CreateTaskDto): Promise<Task> {
    const tasks = await this.getAll();
    const now = new Date().toISOString();

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: dto.title.trim(),
      description: dto.description.trim(),
      status: dto.status || 'PENDING',
      priority: dto.priority || 'MEDIUM',
      createdAt: now,
      updatedAt: now
    };

    tasks.push(newTask);
    await fs.writeFile(FILE_PATH, JSON.stringify(tasks, null, 2), 'utf-8');
    return newTask;
  }

  public static async update(id: string, dto: UpdateTaskDto): Promise<Task | null> {
    const tasks = await this.getAll();
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
      return null;
    }

    const currentTask = tasks[index];
    const updatedTask: Task = {
      ...currentTask,
      title: dto.title !== undefined ? dto.title.trim() : currentTask.title,
      description: dto.description !== undefined ? dto.description.trim() : currentTask.description,
      status: dto.status !== undefined ? dto.status : currentTask.status,
      priority: dto.priority !== undefined ? dto.priority : currentTask.priority,
      updatedAt: new Date().toISOString()
    };

    tasks[index] = updatedTask;
    await fs.writeFile(FILE_PATH, JSON.stringify(tasks, null, 2), 'utf-8');
    return updatedTask;
  }

  public static async updateStatus(id: string, status: TaskStatus): Promise<Task | null> {
    return this.update(id, { status });
  }

  public static async delete(id: string): Promise<boolean> {
    const tasks = await this.getAll();
    const initialLength = tasks.length;
    const filteredTasks = tasks.filter(t => t.id !== id);

    if (filteredTasks.length === initialLength) {
      return false;
    }

    await fs.writeFile(FILE_PATH, JSON.stringify(filteredTasks, null, 2), 'utf-8');
    return true;
  }
}
