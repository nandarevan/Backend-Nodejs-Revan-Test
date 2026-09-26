import { Router } from 'express';
import { TaskController } from '../controllers/taskController.js';

const router = Router();

router.get('/', TaskController.getTasks);
router.get('/:id', TaskController.getTaskById);
router.post('/', TaskController.createTask);
router.put('/:id', TaskController.updateTask);
router.patch('/:id/status', TaskController.updateTaskStatus);
router.delete('/:id', TaskController.deleteTask);

export default router;
