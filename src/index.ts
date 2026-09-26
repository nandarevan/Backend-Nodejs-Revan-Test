import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';
import { loggerMiddleware } from './middleware/logger.js';
import { errorHandler, AppError } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Root & Health Check
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Task Management REST API',
    version: '1.0.0',
    status: 'running',
    endpoints: '/api/tasks'
  });
});

// API Routes
app.use('/api/tasks', taskRoutes);

// 404 Not Found Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Centralized Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 Task Management API Server`);
  console.log(`📡 Listening on http://localhost:${PORT}`);
  console.log(`=================================`);
});

export default app;
