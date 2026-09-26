# Task Management REST API (Practical Test)

Backend REST API for Task Management built with **Node.js**, **Express.js**, and **TypeScript**.

---

## 📌 Features & Requirements Implemented

- **Task Entity Attributes**:
  - `id`: Unique identifier (UUID v4)
  - `title`: Task title (string)
  - `description`: Detailed task description (string)
  - `status`: Task status (`PENDING` | `IN_PROGRESS` | `COMPLETED`)
  - `priority`: Task priority (`LOW` | `MEDIUM` | `HIGH`)
  - `createdAt`: Timestamp when task was created (ISO 8601 string)
  - `updatedAt`: Timestamp when task was last updated (ISO 8601 string)

- **API Endpoints**:
  - `GET /api/tasks` - Get all tasks (supports query filtering by `status` and `priority`)
  - `GET /api/tasks/:id` - Get a task by ID
  - `POST /api/tasks` - Create a new task
  - `PUT /api/tasks/:id` - Update an existing task
  - `PATCH /api/tasks/:id/status` - Update task status only
  - `DELETE /api/tasks/:id` - Delete a task by ID

- **Core Capabilities**:
  - ✅ **Request Validation**: Validates payload fields and enum values. Returns HTTP 400 Bad Request on invalid input.
  - ✅ **Error Handling**: Centralized error handling middleware with standard HTTP status codes (`200`, `201`, `400`, `404`, `500`).
  - ✅ **Basic Logging**: Request logger middleware outputting HTTP method, route, status code, and response latency.
  - ✅ **Persistent Data Storage**: File-based persistent storage (`data/tasks.json`), eliminating external DB setup requirements while ensuring data persists across restarts.

---

## 🛠️ Project Structure

```text
Backend/
├── data/
│   └── tasks.json             # Persistent JSON database
├── src/
│   ├── controllers/
│   │   └── taskController.ts  # Route handlers & validation logic
│   ├── middleware/
│   │   ├── errorHandler.ts    # Centralized error handling
│   │   └── logger.ts          # Custom request logger middleware
│   ├── routes/
│   │   └── taskRoutes.ts      # Express route definitions
│   ├── storage/
│   │   └── taskStorage.ts     # Persistent JSON file storage manager
│   ├── types/
│   │   └── task.ts            # TypeScript interfaces & types
│   └── index.ts               # Express server entry point
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

---

## 🚀 Setup & Execution

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Mode (Hot Reloading)

Runs the server in development mode using `tsx`:

```bash
npm run dev
```

The server will be accessible at `http://localhost:3000`.

### 3. Build for Production

Compiles TypeScript down to JavaScript in the `dist` directory:

```bash
npm run build
```

### 4. Start Production Server

```bash
npm start
```

---

## 📖 API Documentation

### 1. Get All Tasks
- **URL**: `GET /api/tasks`
- **Query Parameters (Optional)**:
  - `status`: `PENDING` | `IN_PROGRESS` | `COMPLETED`
  - `priority`: `LOW` | `MEDIUM` | `HIGH`
- **Response (200 OK)**:
```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      "id": "f83a4848-3112-4217-91a7-19e489c7ad12",
      "title": "Design API Architecture",
      "description": "Define REST API endpoints and schema.",
      "status": "COMPLETED",
      "priority": "HIGH",
      "createdAt": "2026-09-26T12:00:00.000Z",
      "updatedAt": "2026-09-26T12:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Task by ID
- **URL**: `GET /api/tasks/:id`
- **Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "id": "f83a4848-3112-4217-91a7-19e489c7ad12",
    "title": "Design API Architecture",
    "description": "Define REST API endpoints and schema.",
    "status": "COMPLETED",
    "priority": "HIGH",
    "createdAt": "2026-09-26T12:00:00.000Z",
    "updatedAt": "2026-09-26T12:00:00.000Z"
  }
}
```
- **Error Response (404 Not Found)**:
```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Task with ID 'invalid-id' not found"
}
```

---

### 3. Create Task
- **URL**: `POST /api/tasks`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "title": "Implement Unit Tests",
  "description": "Write automated test coverage for controllers.",
  "status": "PENDING",
  "priority": "HIGH"
}
```
- **Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Task created successfully",
  "data": {
    "id": "d98336c1-75a3-4111-a650-c9d487c4a5e6",
    "title": "Implement Unit Tests",
    "description": "Write automated test coverage for controllers.",
    "status": "PENDING",
    "priority": "HIGH",
    "createdAt": "2026-09-26T12:10:04.056Z",
    "updatedAt": "2026-09-26T12:10:04.056Z"
  }
}
```

---

### 4. Update Task (PUT)
- **URL**: `PUT /api/tasks/:id`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "title": "Implement Integration Tests",
  "description": "Write full endpoint test suite",
  "status": "IN_PROGRESS",
  "priority": "HIGH"
}
```
- **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Task updated successfully",
  "data": {
    "id": "d98336c1-75a3-4111-a650-c9d487c4a5e6",
    "title": "Implement Integration Tests",
    "description": "Write full endpoint test suite",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "createdAt": "2026-09-26T12:10:04.056Z",
    "updatedAt": "2026-09-26T12:15:00.000Z"
  }
}
```

---

### 5. Update Task Status (PATCH)
- **URL**: `PATCH /api/tasks/:id/status`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "status": "COMPLETED"
}
```
- **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Task status updated successfully",
  "data": {
    "id": "d98336c1-75a3-4111-a650-c9d487c4a5e6",
    "title": "Implement Integration Tests",
    "description": "Write full endpoint test suite",
    "status": "COMPLETED",
    "priority": "HIGH",
    "createdAt": "2026-09-26T12:10:04.056Z",
    "updatedAt": "2026-09-26T12:20:00.000Z"
  }
}
```

---

### 6. Delete Task
- **URL**: `DELETE /api/tasks/:id`
- **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Task with ID 'd98336c1-75a3-4111-a650-c9d487c4a5e6' deleted successfully"
}
```

---

## 🧪 Testing with cURL / Postman

### Example cURL commands:

```bash
# Get all tasks
curl -X GET http://localhost:3000/api/tasks

# Create a task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Task description","priority":"MEDIUM"}'

# Update status
curl -X PATCH http://localhost:3000/api/tasks/<TASK_ID>/status \
  -H "Content-Type: application/json" \
  -d '{"status":"COMPLETED"}'

# Delete task
curl -X DELETE http://localhost:3000/api/tasks/<TASK_ID>
```
