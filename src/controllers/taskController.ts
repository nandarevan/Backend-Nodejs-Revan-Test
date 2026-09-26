import { Request, Response, NextFunction } from 'express';
import { TaskStorage } from '../storage/taskStorage.js';
import { AppError } from '../middleware/errorHandler.js';
import { TaskStatus, TaskPriority } from '../types/task.js';

const VALID_STATUSES: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
const VALID_PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

export class TaskController {
  public static async getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let tasks = await TaskStorage.getAll();
      const { status, priority } = req.query;

      if (status && typeof status === 'string') {
        tasks = tasks.filter(t => t.status === status.toUpperCase());
      }

      if (priority && typeof priority === 'string') {
        tasks = tasks.filter(t => t.priority === priority.toUpperCase());
      }

      res.status(200).json({
        status: 'success',
        results: tasks.length,
        data: tasks
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const task = await TaskStorage.getById(id);

      if (!task) {
        throw new AppError(`Task with ID '${id}' not found`, 404);
      }

      res.status(200).json({
        status: 'success',
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, description, status, priority } = req.body;

      if (!title || typeof title !== 'string' || title.trim() === '') {
        throw new AppError('Field "title" is required and must be a non-empty string', 400);
      }

      if (description === undefined || typeof description !== 'string') {
        throw new AppError('Field "description" is required and must be a string', 400);
      }

      if (status && !VALID_STATUSES.includes(status as TaskStatus)) {
        throw new AppError(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`, 400);
      }

      if (priority && !VALID_PRIORITIES.includes(priority as TaskPriority)) {
        throw new AppError(`Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`, 400);
      }

      const newTask = await TaskStorage.create({
        title,
        description,
        status: status as TaskStatus,
        priority: priority as TaskPriority
      });

      res.status(201).json({
        status: 'success',
        message: 'Task created successfully',
        data: newTask
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description, status, priority } = req.body;

      const existingTask = await TaskStorage.getById(id);
      if (!existingTask) {
        throw new AppError(`Task with ID '${id}' not found`, 404);
      }

      if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        throw new AppError('Field "title" must be a non-empty string', 400);
      }

      if (description !== undefined && typeof description !== 'string') {
        throw new AppError('Field "description" must be a string', 400);
      }

      if (status !== undefined && !VALID_STATUSES.includes(status as TaskStatus)) {
        throw new AppError(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`, 400);
      }

      if (priority !== undefined && !VALID_PRIORITIES.includes(priority as TaskPriority)) {
        throw new AppError(`Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`, 400);
      }

      const updatedTask = await TaskStorage.update(id, {
        title,
        description,
        status: status as TaskStatus,
        priority: priority as TaskPriority
      });

      res.status(200).json({
        status: 'success',
        message: 'Task updated successfully',
        data: updatedTask
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateTaskStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || typeof status !== 'string') {
        throw new AppError('Field "status" is required and must be a string', 400);
      }

      const formattedStatus = status.toUpperCase() as TaskStatus;
      if (!VALID_STATUSES.includes(formattedStatus)) {
        throw new AppError(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`, 400);
      }

      const updatedTask = await TaskStorage.updateStatus(id, formattedStatus);
      if (!updatedTask) {
        throw new AppError(`Task with ID '${id}' not found`, 404);
      }

      res.status(200).json({
        status: 'success',
        message: 'Task status updated successfully',
        data: updatedTask
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const success = await TaskStorage.delete(id);

      if (!success) {
        throw new AppError(`Task with ID '${id}' not found`, 404);
      }

      res.status(200).json({
        status: 'success',
        message: `Task with ID '${id}' deleted successfully`
      });
    } catch (error) {
      next(error);
    }
  }
}
