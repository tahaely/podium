# Gamification Backend API

A comprehensive Node.js backend application for a gamification system with team management, task tracking, scoring, and real-time leaderboards. Built with Express.js, MySQL, and WebSocket for real-time updates.

---

## the front-end repo url : https://github.com/Abdellahi-yuki/poduim-front-end.git
## the front-end url: https://poduim-front-end.vercel.app

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Teams](#teams)
  - [Members](#members)
  - [Tasks](#tasks)
  - [Leaderboard](#leaderboard)
- [WebSocket Events](#websocket-events)
- [Middleware](#middleware)
- [Services](#services)
- [Utilities](#utilities)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Deployment](#deployment)

---

## ✨ Features

- **User Authentication**: JWT-based authentication with role-based access control (Admin/Member)
- **Team Management**: Create, update, delete, and retrieve teams
- **Member Management**: Add members to teams with user associations
- **Task Management**: Create tasks, assign to members, track status, upload proof
- **Scoring System**: Automatic point calculation with bonuses and streak rewards
- **Real-time Leaderboard**: WebSocket-powered live updates for team rankings
- **File Upload**: Support for task proof uploads (images and PDFs)
- **Flexible Filtering**: Query tasks by team, member, or status
- **Time-based Leaderboards**: Daily, weekly, and all-time rankings

---

## 🛠 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: MySQL 2 (with mysql2 driver)
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **Real-time Communication**: WebSocket (ws library)
- **File Upload**: Multer
- **Validation**: express-validator
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Development**: Nodemon
- **Testing**: Jest, Supertest

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                 # MySQL database connection pool
│   │   ├── schema.sql            # Database schema definition
│   │   └── socket.js             # WebSocket server initialization
│   ├── controllers/
│   │   ├── authController.js     # Authentication endpoints
│   │   ├── teamController.js     # Team CRUD operations
│   │   ├── memberController.js   # Member management
│   │   ├── taskController.js     # Task operations
│   │   └── leaderboardController.js # Leaderboard retrieval
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & role checks
│   │   └── validate.js           # Request validation
│   ├── models/
│   │   ├── Team.js               # Team model
│   │   ├── Member.js             # Member model
│   │   ├── Task.js               # Task model
│   │   └── PointsLog.js          # Points logging model
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── teamRoutes.js         # /api/teams routes
│   │   ├── memberRoutes.js       # /api/members routes
│   │   ├── taskRoutes.js         # /api/tasks routes
│   │   └── leaderboardRoutes.js  # /api/leaderboard routes
│   ├── services/
│   │   ├── authService.js        # Authentication logic
│   │   ├── teamService.js        # Team business logic
│   │   ├── memberService.js      # Member business logic
│   │   ├── taskService.js        # Task business logic
│   │   ├── scoringService.js     # Points calculation & streak detection
│   │   └── leaderboardService.js # Leaderboard aggregation
│   ├── utils/
│   │   ├── upload.js             # Multer file upload configuration
│   │   ├── roles.js              # Role definitions
│   │   └── calculateBonus.js     # Bonus calculation utilities
│   ├── scripts/
│   │   └── initDb.js             # Database initialization script
│   ├── uploads/                  # File upload directory
│   ├── app.js                    # Express app configuration
│   └── index.js                  # Server entry point
├── .env                          # Environment variables
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

---

## 🚀 Installation

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize the database**
   ```bash
   npm run db:init
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Start the production server**
   ```bash
   npm start
   ```

---

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=gamification_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
```

---

## 🗄 Database Schema

### Tables

#### **users**
Stores user authentication and role information.

| Column        | Type                      | Description                    |
|---------------|---------------------------|--------------------------------|
| id            | INT (PK, AUTO_INCREMENT)  | Unique user identifier         |
| email         | VARCHAR(255) UNIQUE       | User email address             |
| password_hash | VARCHAR(255)              | Bcrypt hashed password         |
| role          | ENUM('admin', 'member')   | User role                      |
| created_at    | TIMESTAMP                 | Account creation timestamp     |

#### **teams**
Stores team information.

| Column     | Type                     | Description                    |
|------------|--------------------------|--------------------------------|
| id         | INT (PK, AUTO_INCREMENT) | Unique team identifier         |
| name       | VARCHAR(255)             | Team name                      |
| color      | VARCHAR(50)              | Team color (hex code)          |
| created_at | TIMESTAMP                | Team creation timestamp        |

#### **members**
Links users to teams with additional member information.

| Column     | Type                     | Description                    |
|------------|--------------------------|--------------------------------|
| id         | INT (PK, AUTO_INCREMENT) | Unique member identifier       |
| team_id    | INT (FK → teams.id)      | Associated team                |
| user_id    | INT (FK → users.id)      | Associated user (unique)       |
| name       | VARCHAR(255)             | Member display name            |
| role       | VARCHAR(50)              | Team role (e.g., leader)       |
| avatar_url | VARCHAR(255)             | Avatar image URL               |

#### **tasks**
Stores task information and status.

| Column       | Type                                      | Description                    |
|--------------|-------------------------------------------|--------------------------------|
| id           | INT (PK, AUTO_INCREMENT)                  | Unique task identifier         |
| team_id      | INT (FK → teams.id)                       | Associated team                |
| member_id    | INT (FK → members.id)                     | Assigned member                |
| title        | VARCHAR(255)                              | Task title                     |
| description  | TEXT                                      | Task description               |
| points       | INT                                       | Base points for completion     |
| difficulty   | ENUM('easy', 'medium', 'hard')            | Task difficulty level          |
| priority     | ENUM('low', 'medium', 'high')             | Task priority                  |
| status       | ENUM('todo', 'doing', 'done', 'validated')| Current task status            |
| deadline     | TIMESTAMP                                 | Task deadline                  |
| proof_url    | VARCHAR(255)                              | Uploaded proof file URL        |
| created_at   | TIMESTAMP                                 | Task creation timestamp        |
| updated_at   | TIMESTAMP                                 | Last update timestamp          |
| validated_at | TIMESTAMP                                 | Validation timestamp           |

#### **points_log**
Tracks all point transactions.

| Column       | Type                     | Description                    |
|--------------|--------------------------|--------------------------------|
| id           | INT (PK, AUTO_INCREMENT) | Unique log entry identifier    |
| team_id      | INT (FK → teams.id)      | Team receiving points          |
| member_id    | INT (FK → members.id)    | Member earning points          |
| task_id      | INT (FK → tasks.id)      | Associated task (nullable)     |
| points_added | INT                      | Points awarded                 |
| reason       | VARCHAR(255)             | Reason for points              |
| created_at   | TIMESTAMP                | Points award timestamp         |

---

## 📡 API Documentation

Base URL: `http://localhost:5000/api`

### Authentication

#### Register User
**POST** `/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "member"  // Optional: "admin" or "member" (default: "member")
}
```

**Response (201):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "member"
}
```

**Validation:**
- Email must be valid format
- Password must be at least 6 characters

**Function Details:**
- **Controller**: `authController.register`
- **Service**: `authService.register`
- Checks if user already exists
- Hashes password using bcryptjs with salt rounds of 10
- Inserts user into database
- Returns user object without password

---

#### Login User
**POST** `/auth/login`

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "member",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Function Details:**
- **Controller**: `authController.login`
- **Service**: `authService.login`
- Validates credentials against database
- Compares password hash using bcrypt
- Generates JWT token with 30-day expiration
- Token payload includes: `{ id, role }`

---

### Teams

All team endpoints require authentication (`protect` middleware).

#### Get All Teams
**GET** `/teams`

Retrieves all teams.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Team Alpha",
    "color": "#FF5733",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

**Function Details:**
- **Controller**: `teamController.getTeams`
- **Service**: `teamService.getAllTeams`
- Executes: `SELECT * FROM teams`
- Returns array of all teams

---

#### Get Team by ID
**GET** `/teams/:id`

Retrieves a specific team with members and score.

**Response (200):**
```json
{
  "id": 1,
  "name": "Team Alpha",
  "color": "#FF5733",
  "created_at": "2024-01-01T00:00:00.000Z",
  "members": [
    {
      "id": 1,
      "team_id": 1,
      "user_id": 1,
      "name": "John Doe",
      "role": "leader",
      "avatar_url": "/uploads/avatar.jpg"
    }
  ],
  "score": 1250
}
```

**Function Details:**
- **Controller**: `teamController.getTeam`
- **Service**: `teamService.getTeamById`
- Fetches team details
- Joins with members table
- Calculates total score from points_log
- Returns 404 if team not found

---

#### Create Team
**POST** `/teams`

Creates a new team (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "Team Beta",
  "color": "#3498DB"
}
```

**Response (201):**
```json
{
  "id": 2,
  "name": "Team Beta",
  "color": "#3498DB"
}
```

**Function Details:**
- **Controller**: `teamController.createTeam`
- **Service**: `teamService.createTeam`
- **Middleware**: `protect`, `admin`
- Inserts new team into database
- Returns created team with generated ID

---

#### Update Team
**PUT** `/teams/:id`

Updates team information (Admin only).

**Request Body:**
```json
{
  "name": "Team Beta Updated",
  "color": "#2ECC71"
}
```

**Response (200):**
```json
{
  "id": 2,
  "name": "Team Beta Updated",
  "color": "#2ECC71"
}
```

**Function Details:**
- **Controller**: `teamController.updateTeam`
- **Service**: `teamService.updateTeam`
- **Middleware**: `protect`, `admin`
- Updates team name and color
- Returns updated team object

---

#### Delete Team
**DELETE** `/teams/:id`

Deletes a team (Admin only).

**Response (200):**
```json
{
  "message": "Team removed"
}
```

**Function Details:**
- **Controller**: `teamController.deleteTeam`
- **Service**: `teamService.deleteTeam`
- **Middleware**: `protect`, `admin`
- Cascades deletion to related members and tasks
- Removes all associated points_log entries

---

### Members

#### Get All Members
**GET** `/members`

Retrieves members, optionally filtered by team.

**Query Parameters:**
- `team_id` (optional): Filter by team ID

**Example:** `/members?team_id=1`

**Response (200):**
```json
[
  {
    "id": 1,
    "team_id": 1,
    "user_id": 1,
    "name": "John Doe",
    "role": "leader",
    "avatar_url": "/uploads/avatar.jpg"
  }
]
```

**Function Details:**
- **Controller**: `memberController.getMembers`
- **Service**: `memberService.getAllMembers`
- Builds dynamic SQL query based on filters
- Returns all members or filtered by team_id

---

#### Add Member
**POST** `/members`

Adds a new member to a team (Admin only).

**Request Body:**
```json
{
  "team_id": 1,
  "user_id": 2,
  "name": "Jane Smith",
  "role": "member",
  "avatar_url": "/uploads/avatar2.jpg"
}
```

**Response (201):**
```json
{
  "id": 2,
  "teamId": 1,
  "userId": 2,
  "name": "Jane Smith",
  "role": "member",
  "avatarUrl": "/uploads/avatar2.jpg"
}
```

**Function Details:**
- **Controller**: `memberController.addMember`
- **Service**: `memberService.addMember`
- **Middleware**: `protect`, `admin`
- Links user to team
- user_id must be unique (one user per team)

---

#### Update Member
**PUT** `/members/:id`

Updates member information (Admin only).

**Request Body:**
```json
{
  "name": "Jane Smith Updated",
  "role": "leader",
  "avatar_url": "/uploads/new-avatar.jpg"
}
```

**Function Details:**
- **Controller**: `memberController.updateMember`
- **Service**: `memberService.updateMember`
- **Middleware**: `protect`, `admin`
- Updates member name, role, and avatar

---

#### Remove Member
**DELETE** `/members/:id`

Removes a member from a team (Admin only).

**Response (200):**
```json
{
  "message": "Member removed"
}
```

**Function Details:**
- **Controller**: `memberController.removeMember`
- **Service**: `memberService.removeMember`
- **Middleware**: `protect`, `admin`
- Deletes member record
- Sets member_id to NULL in associated tasks

---

### Tasks

#### Get Tasks
**GET** `/tasks`

Retrieves tasks with optional filtering.

**Query Parameters:**
- `team_id` (optional): Filter by team
- `member_id` (optional): Filter by assigned member
- `status` (optional): Filter by status (todo, doing, done, validated)

**Example:** `/tasks?team_id=1&status=doing`

**Response (200):**
```json
[
  {
    "id": 1,
    "team_id": 1,
    "member_id": 1,
    "title": "Complete documentation",
    "description": "Write comprehensive API docs",
    "points": 100,
    "difficulty": "medium",
    "priority": "high",
    "status": "doing",
    "deadline": "2024-12-31T23:59:59.000Z",
    "proof_url": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-02T00:00:00.000Z",
    "validated_at": null
  }
]
```

**Function Details:**
- **Controller**: `taskController.getTasks`
- **Service**: `taskService.getTasks`
- Builds dynamic WHERE clause based on query params
- Returns filtered task list

---

#### Create Task
**POST** `/tasks`

Creates a new task (Admin only).

**Request Body:**
```json
{
  "team_id": 1,
  "member_id": 1,
  "title": "Implement feature X",
  "description": "Add new functionality",
  "points": 150,
  "difficulty": "hard",
  "priority": "high",
  "deadline": "2024-12-31T23:59:59.000Z"
}
```

**Response (201):**
```json
{
  "id": 2,
  "team_id": 1,
  "member_id": 1,
  "title": "Implement feature X",
  "description": "Add new functionality",
  "points": 150,
  "difficulty": "hard",
  "priority": "high",
  "deadline": "2024-12-31T23:59:59.000Z"
}
```

**Function Details:**
- **Controller**: `taskController.createTask`
- **Service**: `taskService.createTask`
- **Middleware**: `protect`, `admin`
- Inserts task with default status 'todo'
- Returns created task with ID

---

#### Update Task
**PUT** `/tasks/:id`

Updates task information (Members can update status).

**Request Body:**
```json
{
  "status": "doing",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "id": 1,
  "status": "doing",
  "description": "Updated description"
}
```

**Function Details:**
- **Controller**: `taskController.updateTask`
- **Service**: `taskService.updateTask`
- **Middleware**: `protect`
- Dynamically builds UPDATE query from request body
- Members can change status (todo → doing → done)
- Updates `updated_at` timestamp automatically

---

#### Upload Proof
**POST** `/tasks/:id/proof`

Uploads proof of task completion.

**Headers:**
```
Content-Type: multipart/form-data
```

**Form Data:**
- `proof`: File (image or PDF, max 5MB)

**Response (200):**
```json
{
  "id": 1,
  "proof_url": "/uploads/proof-1234567890-123456789.jpg",
  "status": "done"
}
```

**Function Details:**
- **Controller**: `taskController.uploadProof`
- **Service**: `taskService.uploadProof`
- **Middleware**: `protect`, `upload.single('proof')`
- Accepts images and PDFs only
- Stores file in `/uploads` directory
- Automatically sets task status to 'done'
- Returns 400 if no file uploaded

---

#### Validate Task
**PUT** `/tasks/:id/validate`

Validates a completed task and awards points (Admin only).

**Response (200):**
```json
{
  "id": 1,
  "status": "validated",
  "pointsAwarded": 120,
  "streakAwarded": false
}
```

**Function Details:**
- **Controller**: `taskController.validateTask`
- **Service**: `taskService.validateTask`
- **Middleware**: `protect`, `admin`
- **Process:**
  1. Checks if task already validated (throws error if yes)
  2. Calculates points with bonuses:
     - Base points from task
     - +20% if completed before deadline
  3. Updates task status to 'validated'
  4. Logs points to points_log table
  5. Checks for streak bonus (3 tasks in one day = +50 points)
  6. Broadcasts WebSocket event to all clients
- **WebSocket Event**: `TASK_VALIDATED` with task and points info
- Returns error if task not found or already validated

---

### Leaderboard

#### Get Leaderboard
**GET** `/leaderboard`

Retrieves team rankings with scores.

**Query Parameters:**
- `period` (optional): 'daily', 'weekly', or 'total' (default)

**Example:** `/leaderboard?period=weekly`

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Team Alpha",
    "color": "#FF5733",
    "total_score": 1250
  },
  {
    "id": 2,
    "name": "Team Beta",
    "color": "#3498DB",
    "total_score": 980
  }
]
```

**Function Details:**
- **Controller**: `leaderboardController.getLeaderboard`
- **Service**: `leaderboardService.getLeaderboard`
- **Middleware**: `protect`
- **Period Filters:**
  - `daily`: Points from today only (`DATE(created_at) = CURDATE()`)
  - `weekly`: Points from current week (`YEARWEEK(created_at) = YEARWEEK(CURDATE())`)
  - `total`: All-time points (no filter)
- Aggregates points from points_log table
- Groups by team and sums points_added
- Orders by total_score descending
- Returns teams with 0 points if no entries

---

## 🔌 WebSocket Events

### Connection

Connect to WebSocket server at: `ws://localhost:5000`

**On Connection:**
```json
{
  "type": "WELCOME",
  "message": "Connected to Gamification WebSocket"
}
```

### Server Events

#### TASK_VALIDATED
Broadcasted when an admin validates a task.

**Payload:**
```json
{
  "type": "TASK_VALIDATED",
  "taskId": 1,
  "teamId": 1,
  "points": 120,
  "streak": false
}
```

**Function Details:**
- **Triggered by**: `taskService.validateTask`
- **Broadcast function**: `broadcast()` from `config/socket.js`
- Sent to all connected WebSocket clients
- Use this to update leaderboard in real-time on frontend

### Implementation Details

**WebSocket Server (`config/socket.js`):**

#### `initWebSocket(server)`
Initializes WebSocket server attached to HTTP server.
- Creates WebSocket.Server instance
- Listens for new connections
- Sends welcome message to new clients
- Logs incoming messages from clients

#### `broadcast(data)`
Sends data to all connected clients.
- Checks if WebSocket server is initialized
- Iterates through all clients
- Only sends to clients with OPEN connection state
- Stringifies data to JSON before sending

---

## 🔒 Middleware

### Authentication Middleware (`middleware/authMiddleware.js`)

#### `protect(req, res, next)`
Verifies JWT token and attaches user to request.

**Process:**
1. Extracts token from Authorization header (`Bearer <token>`)
2. Verifies token using JWT_SECRET
3. Decodes token payload: `{ id, role }`
4. Attaches decoded user to `req.user`
5. Calls `next()` if valid
6. Returns 401 if token invalid or missing

**Usage:**
```javascript
router.get('/protected', protect, controller.method);
```

---

#### `admin(req, res, next)`
Ensures authenticated user has admin role.

**Process:**
1. Checks if `req.user.role === 'admin'`
2. Calls `next()` if admin
3. Returns 403 if not admin

**Usage:**
```javascript
router.post('/admin-only', protect, admin, controller.method);
```

**Note:** Always use `protect` before `admin` middleware.

---

### Validation Middleware

Uses `express-validator` for request validation.

**Example (authRoutes.js):**
```javascript
router.post(
  '/register',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
  ],
  authController.register
);
```

**Validation in Controller:**
```javascript
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}
```

---

## 🔧 Services

### Auth Service (`services/authService.js`)

#### `register(email, password, role)`
Creates a new user account.

**Parameters:**
- `email` (string): User email
- `password` (string): Plain text password
- `role` (string): 'admin' or 'member' (default: 'member')

**Returns:** `{ id, email, role }`

**Process:**
1. Checks if user exists with email
2. Generates salt (10 rounds)
3. Hashes password with bcrypt
4. Inserts user into database
5. Returns user object

**Throws:** Error if user already exists

---

#### `login(email, password)`
Authenticates user and generates JWT.

**Parameters:**
- `email` (string): User email
- `password` (string): Plain text password

**Returns:** `{ id, email, role, token }`

**Process:**
1. Queries user by email
2. Compares password with stored hash
3. Generates JWT with 30-day expiration
4. Returns user data with token

**Throws:** Error if credentials invalid

---

### Team Service (`services/teamService.js`)

#### `createTeam(name, color)`
Creates a new team.

**Returns:** `{ id, name, color }`

---

#### `getAllTeams()`
Retrieves all teams.

**Returns:** Array of team objects

---

#### `getTeamById(id)`
Retrieves team with members and score.

**Process:**
1. Fetches team by ID
2. Joins with members table
3. Calculates total score from points_log
4. Returns enriched team object

**Returns:** Team object with `members` array and `score` field, or `null` if not found

---

#### `updateTeam(id, name, color)`
Updates team information.

**Returns:** `{ id, name, color }`

---

#### `deleteTeam(id)`
Deletes a team (cascades to members and tasks).

**Returns:** void

---

### Member Service (`services/memberService.js`)

#### `addMember(teamId, userId, name, role, avatarUrl)`
Adds a member to a team.

**Returns:** `{ id, teamId, userId, name, role, avatarUrl }`

**Note:** userId must be unique across all members

---

#### `removeMember(id)`
Removes a member from database.

**Returns:** void

---

#### `updateMember(id, name, role, avatarUrl)`
Updates member information.

**Returns:** `{ id, name, role, avatarUrl }`

---

#### `getAllMembers(teamId)`
Retrieves members, optionally filtered by team.

**Parameters:**
- `teamId` (optional): Filter by team ID

**Returns:** Array of member objects

---

#### `getMemberById(id)`
Retrieves a single member.

**Returns:** Member object or undefined

---

### Task Service (`services/taskService.js`)

#### `createTask(data)`
Creates a new task.

**Parameters:**
- `data` (object): Task properties

**Returns:** Created task with ID

---

#### `updateTask(id, data)`
Updates task fields dynamically.

**Process:**
1. Builds UPDATE query from data object
2. Only updates provided fields
3. Auto-updates `updated_at` timestamp

**Returns:** Updated task object

---

#### `uploadProof(id, proofUrl)`
Attaches proof to task and marks as done.

**Parameters:**
- `id` (number): Task ID
- `proofUrl` (string): File path

**Process:**
1. Updates task with proof_url
2. Sets status to 'done'

**Returns:** `{ id, proof_url, status }`

---

#### `validateTask(id)`
Validates task and awards points.

**Process:**
1. Fetches task from database
2. Checks if already validated
3. Calculates points with bonuses:
   - Base points
   - +20% if before deadline
4. Updates status to 'validated'
5. Logs points via scoringService
6. Checks for streak bonus
7. Broadcasts WebSocket event

**Returns:** `{ id, status, pointsAwarded, streakAwarded }`

**Throws:** Error if task not found or already validated

---

#### `getTasks(filters)`
Retrieves tasks with filtering.

**Parameters:**
- `filters` (object): `{ team_id, member_id, status }`

**Returns:** Array of tasks

---

### Scoring Service (`services/scoringService.js`)

#### `addPoints(teamId, memberId, taskId, points, reason)`
Logs points to database.

**Parameters:**
- `teamId` (number): Team receiving points
- `memberId` (number): Member earning points
- `taskId` (number|null): Associated task
- `points` (number): Points to add
- `reason` (string): Description

**Returns:** void

**Process:**
Inserts record into points_log table

---

#### `checkStreak(memberId)`
Checks if member completed 3 tasks today and awards streak bonus.

**Parameters:**
- `memberId` (number): Member to check

**Returns:** `true` if streak awarded, `false` otherwise

**Process:**
1. Counts validated tasks for today
2. If count === 3:
   - Checks if streak already awarded today
   - Awards 50 bonus points with reason "Daily Streak Badge"
   - Returns true
3. Returns false otherwise

**Streak Bonus:** 50 points for completing 3 tasks in one day

---

### Leaderboard Service (`services/leaderboardService.js`)

#### `getLeaderboard(period)`
Retrieves team rankings.

**Parameters:**
- `period` (string): 'daily', 'weekly', or 'total'

**Returns:** Array of teams with scores, ordered by score descending

**SQL Query:**
```sql
SELECT t.id, t.name, t.color, COALESCE(SUM(pl.points_added), 0) as total_score
FROM teams t
LEFT JOIN points_log pl ON t.id = pl.team_id [DATE_CONDITION]
GROUP BY t.id
ORDER BY total_score DESC
```

---

## 🛠 Utilities

### Upload Utility (`utils/upload.js`)

Configures Multer for file uploads.

**Configuration:**
- **Storage**: Disk storage in `src/uploads/`
- **Filename**: `<fieldname>-<timestamp>-<random>.ext`
- **File Filter**: Images and PDFs only
- **Size Limit**: 5MB

**Accepted MIME Types:**
- `image/*` (all image formats)
- `application/pdf`

**Usage:**
```javascript
router.post('/upload', upload.single('proof'), controller.method);
```

**Auto-creates uploads directory** if it doesn't exist.

---

### Roles Utility (`utils/roles.js`)

Currently empty - reserved for role definitions and permissions.

---

### Calculate Bonus Utility (`utils/calculateBonus.js`)

Currently empty - reserved for bonus calculation logic.

---

## ❌ Error Handling

### Global Error Handler (`app.js`)

Catches all errors and returns consistent response:

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});
```

**Production:** Hides stack trace
**Development:** Shows full stack trace

### Common Error Responses

**400 Bad Request:**
```json
{
  "message": "Validation error message",
  "errors": [
    {
      "msg": "Please include a valid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "message": "Not authorized, no token"
}
```

**403 Forbidden:**
```json
{
  "message": "Not authorized as an admin"
}
```

**404 Not Found:**
```json
{
  "message": "Team not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Database connection failed",
  "stack": "Error: ..." // Only in development
}
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

Tests use **Jest** and **Supertest** for API testing.

**Example Test:**
```javascript
const request = require('supertest');
const app = require('../src/app');

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
```

---

## 🚀 Deployment

### Environment Setup

1. Set `NODE_ENV=production` in `.env`
2. Use strong `JWT_SECRET`
3. Configure production database credentials
4. Set up SSL/TLS for HTTPS
5. Configure CORS for specific origins

### Database Initialization

```bash
npm run db:init
```

This script:
1. Creates database if not exists
2. Runs schema.sql to create tables
3. Sets up indexes and foreign keys

### Production Server

```bash
npm start
```

### Process Management

Use PM2 for production:

```bash
npm install -g pm2
pm2 start src/index.js --name gamification-api
pm2 save
pm2 startup
```

### Nginx Configuration

```nginx
server {
  listen 80;
  server_name api.yourdomain.com;

  location / {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  location /ws {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
  }
}
```

---

## 📝 Scripts

| Script      | Command                  | Description                          |
|-------------|--------------------------|--------------------------------------|
| `start`     | `node src/index.js`      | Start production server              |
| `dev`       | `nodemon src/index.js`   | Start development server with reload |
| `db:init`   | `node src/scripts/initDb.js` | Initialize database and schema   |
| `test`      | `jest`                   | Run tests                            |

---

## 🔐 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Validation**: express-validator
- **SQL Injection Protection**: Parameterized queries
- **File Upload Validation**: Type and size restrictions

---

## 📊 Scoring Rules

### Base Points
Points are assigned per task based on difficulty and priority.

### Bonuses

1. **Early Completion Bonus**: +20% if completed before deadline
2. **Daily Streak Badge**: +50 points for completing 3 tasks in one day

### Points Flow

1. Task created with base points
2. Member completes task and uploads proof
3. Admin validates task
4. System calculates final points (base + bonuses)
5. Points logged to points_log table
6. Leaderboard updated automatically
7. WebSocket event broadcasted

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

ISC

---

## 👥 Support

For issues and questions, please open an issue on the repository.

---

## 🔄 API Response Codes

| Code | Meaning                  |
|------|--------------------------|
| 200  | Success                  |
| 201  | Created                  |
| 400  | Bad Request              |
| 401  | Unauthorized             |
| 403  | Forbidden                |
| 404  | Not Found                |
| 500  | Internal Server Error    |

---

**Built with ❤️ using Node.js, Express, and MySQL**
