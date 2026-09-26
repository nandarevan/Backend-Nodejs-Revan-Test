# Task Management REST API

Task Management REST API built with Node.js, Express, and TypeScript.

## Features

- Task attributes: id, title, description, status, priority, createdAt, updatedAt
- GET /api/tasks
- GET /api/tasks/:id
- POST /api/tasks
- PUT /api/tasks/:id
- PATCH /api/tasks/:id/status
- DELETE /api/tasks/:id
- Request validation
- Error handling with appropriate HTTP status codes
- Basic logging
- Persistent data storage (JSON file database)

## Requirements

- Node.js (v18+)
- npm

## How to Run

1. Install dependencies:
npm install

2. Run development mode:
npm run dev

3. Build production bundle:
npm run build

4. Run production server:
npm start

## API Endpoints

### GET /api/tasks
Get all tasks.

### GET /api/tasks/:id
Get task by ID.

### POST /api/tasks
Create task.
Body:
{
  "title": "Task Title",
  "description": "Task Description",
  "status": "PENDING",
  "priority": "HIGH"
}

### PUT /api/tasks/:id
Update full task details.
Body:
{
  "title": "Updated Title",
  "description": "Updated Description",
  "status": "IN_PROGRESS",
  "priority": "HIGH"
}

### PATCH /api/tasks/:id/status
Update task status only.
Body:
{
  "status": "COMPLETED"
}

### DELETE /api/tasks/:id
Delete task by ID.
