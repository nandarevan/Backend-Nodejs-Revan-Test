import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';
import { loggerMiddleware } from './middleware/logger.js';
import { errorHandler, AppError } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Task Management REST API',
    version: '1.0.0',
    status: 'running',
    endpoints: '/api/tasks'
  });
});

app.use('/api/tasks', taskRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Task Management API Server listening on port ${PORT}`);
});

export default app;
