# API Integration Guide

## Table of Contents

1. [Overview](#overview)
2. [API Configuration](#api-configuration)
3. [Required Endpoints](#required-endpoints)
4. [Request/Response Format](#requestresponse-format)
5. [Authentication Flow](#authentication-flow)
6. [Error Handling](#error-handling)
7. [CORS Configuration](#cors-configuration)
8. [Sample Backend Implementation](#sample-backend-implementation)
9. [Testing the API](#testing-the-api)

---

## Overview

This Angular application expects a REST API backend. All API calls use:
- **Base URL**: Configured in `app-config.json`
- **Content-Type**: `application/json`
- **Authentication**: JWT Bearer tokens
- **Credentials**: Cookies included for refresh tokens

---

## API Configuration

### Runtime Configuration

The API URL is loaded from `/assets/config/app-config.json`:

```json
{
  "apiUrl": "http://localhost:3000/api",
  "appName": "Labyrinth Nexus",
  "sessionTimeout": 1800000,
  "inactivityTimeout": 1800000,
  "refreshBeforeExpiry": 120000
}
```

### Environment Variables (Docker)

When deploying with Docker:

```bash
docker run -d \
  -e API_URL=https://api.yourdomain.com \
  -p 80:80 \
  labyrinth-nexus:latest
```

---

## Required Endpoints

### Authentication Endpoints

#### POST /auth/login

Authenticate a user with email/password.

**Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123!"
}
```

**Success Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "roles": ["USER"],
    "permissions": ["users:read", "profile:write"],
    "isActive": true,
    "emailVerified": true,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-08T12:00:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Important:**
- `refreshToken` should also be set as HTTP-only cookie
- `accessToken` expires in 15-30 minutes (configurable)
- `refreshToken` expires in 7-30 days (configurable)

**Error Response (401 Unauthorized):**
```json
{
  "error": {
    "message": "Invalid username or password",
    "code": "INVALID_CREDENTIALS"
  }
}
```

---

#### POST /auth/register

Register a new user.

**Request:**
```http
POST /auth/register
Content-Type: application/json

{
  "username": "new_user",
  "email": "newuser@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (201 Created):**
```json
{
  "user": {
    "id": 2,
    "username": "new_user",
    "email": "newuser@example.com",
    "roles": ["USER"],
    "permissions": ["users:read", "profile:write"],
    "isActive": true,
    "emailVerified": false,
    "createdAt": "2025-01-08T12:00:00Z",
    "updatedAt": "2025-01-08T12:00:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": {
    "message": "Username already exists",
    "code": "USERNAME_EXISTS",
    "details": {
      "field": "username"
    }
  }
}
```

---

#### POST /auth/refresh

Refresh the access token using refresh token.

**Request:**
```http
POST /auth/refresh
Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": {
    "message": "Invalid or expired refresh token",
    "code": "INVALID_REFRESH_TOKEN"
  }
}
```

---

#### POST /auth/logout

Logout the current user.

**Request:**
```http
POST /auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (204 No Content):**
```http
HTTP/1.1 204 No Content
Set-Cookie: refreshToken=; Max-Age=0
```

---

#### GET /auth/profile

Get the current user's profile.

**Request:**
```http
GET /auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "roles": ["USER", "ADMIN"],
  "permissions": ["users:read", "users:write", "users:delete"],
  "isActive": true,
  "emailVerified": true,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-08T12:00:00Z"
}
```

---

### User Management Endpoints

#### GET /users

Get paginated list of users.

**Request:**
```http
GET /users?page=1&limit=10&search=john
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**
- `page` (number, optional): Page number, default: 1
- `limit` (number, optional): Items per page, default: 10
- `search` (string, optional): Search term
- `sortBy` (string, optional): Field to sort by
- `sortOrder` (string, optional): 'asc' or 'desc'

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "roles": ["USER"],
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-08T12:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

#### GET /users/:id

Get a single user by ID.

**Request:**
```http
GET /users/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "roles": ["USER"],
  "permissions": ["users:read"],
  "isActive": true,
  "emailVerified": true,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-08T12:00:00Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": {
    "message": "User not found",
    "code": "USER_NOT_FOUND"
  }
}
```

---

#### POST /users

Create a new user.

**Request:**
```http
POST /users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "username": "new_user",
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "roles": ["USER"]
}
```

**Success Response (201 Created):**
```json
{
  "id": 2,
  "username": "new_user",
  "email": "newuser@example.com",
  "roles": ["USER"],
  "isActive": true,
  "emailVerified": false,
  "createdAt": "2025-01-08T12:00:00Z",
  "updatedAt": "2025-01-08T12:00:00Z"
}
```

---

#### PUT /users/:id

Update an existing user.

**Request:**
```http
PUT /users/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "email": "newemail@example.com",
  "roles": ["USER", "ADMIN"],
  "isActive": true
}
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "newemail@example.com",
  "roles": ["USER", "ADMIN"],
  "isActive": true,
  "updatedAt": "2025-01-08T13:00:00Z"
}
```

---

#### DELETE /users/:id

Delete a user.

**Request:**
```http
DELETE /users/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (204 No Content):**
```http
HTTP/1.1 204 No Content
```

**Error Response (403 Forbidden):**
```json
{
  "error": {
    "message": "Cannot delete your own account",
    "code": "CANNOT_DELETE_SELF"
  }
}
```

---

### Role Management Endpoints

#### GET /roles

Get all roles.

**Request:**
```http
GET /roles?page=1&limit=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "ADMIN",
      "description": "Administrator role",
      "permissions": ["users:read", "users:write", "users:delete"],
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-08T12:00:00Z"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

#### POST /roles

Create a new role.

**Request:**
```http
POST /roles
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "MODERATOR",
  "description": "Moderator role",
  "permissions": ["users:read", "users:write"]
}
```

**Success Response (201 Created):**
```json
{
  "id": 2,
  "name": "MODERATOR",
  "description": "Moderator role",
  "permissions": ["users:read", "users:write"],
  "createdAt": "2025-01-08T12:00:00Z",
  "updatedAt": "2025-01-08T12:00:00Z"
}
```

---

#### PUT /roles/:id

Update a role.

**Request:**
```http
PUT /roles/2
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "description": "Updated moderator role",
  "permissions": ["users:read", "users:write", "posts:moderate"]
}
```

---

#### DELETE /roles/:id

Delete a role.

**Request:**
```http
DELETE /roles/2
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (204 No Content)**

---

### Session Management Endpoints

#### GET /sessions

Get current user's sessions.

**Request:**
```http
GET /sessions
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": "session-uuid-1",
      "userId": 1,
      "username": "john_doe",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2025-01-08T10:00:00Z",
      "expiresAt": "2025-01-15T10:00:00Z",
      "lastActivity": "2025-01-08T12:00:00Z",
      "isActive": true
    }
  ]
}
```

---

#### DELETE /sessions/:id

Terminate a specific session.

**Request:**
```http
DELETE /sessions/session-uuid-1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (204 No Content)**

---

#### GET /admin/sessions

Get all active sessions (admin only).

**Request:**
```http
GET /admin/sessions?page=1&limit=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": "session-uuid-1",
      "userId": 1,
      "username": "john_doe",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2025-01-08T10:00:00Z",
      "expiresAt": "2025-01-15T10:00:00Z",
      "lastActivity": "2025-01-08T12:00:00Z",
      "isActive": true
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

## Request/Response Format

### Standard List Response

```typescript
interface ListResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

### Standard Error Response

```typescript
interface ErrorResponse {
  error: {
    message: string;
    code: string;
    details?: Record<string, any>;
  };
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Invalid username/password |
| `INVALID_TOKEN` | 401 | Invalid or expired access token |
| `INVALID_REFRESH_TOKEN` | 401 | Invalid or expired refresh token |
| `UNAUTHORIZED` | 401 | Missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `USERNAME_EXISTS` | 400 | Username already taken |
| `EMAIL_EXISTS` | 400 | Email already registered |
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Authentication Flow

### Initial Login

```
Client                          Server
  │                               │
  │ POST /auth/login              │
  │ { username, password }        │
  ├──────────────────────────────>│
  │                               │
  │ 200 OK                        │
  │ { user, accessToken, ... }    │
  │ Set-Cookie: refreshToken      │
  │<──────────────────────────────┤
  │                               │
  │ Store accessToken in memory   │
  │                               │
```

### Authenticated Request

```
Client                          Server
  │                               │
  │ GET /users                    │
  │ Authorization: Bearer token   │
  ├──────────────────────────────>│
  │                               │
  │ 200 OK                        │
  │ { data: [...] }               │
  │<──────────────────────────────┤
  │                               │
```

### Token Refresh

```
Client                          Server
  │                               │
  │ POST /auth/refresh            │
  │ Cookie: refreshToken=...      │
  ├──────────────────────────────>│
  │                               │
  │ 200 OK                        │
  │ { accessToken: "..." }        │
  │<──────────────────────────────┤
  │                               │
  │ Update accessToken in memory  │
  │                               │
```

### Logout

```
Client                          Server
  │                               │
  │ POST /auth/logout             │
  │ Authorization: Bearer token   │
  │ Cookie: refreshToken=...      │
  ├──────────────────────────────>│
  │                               │
  │ 204 No Content                │
  │ Set-Cookie: refreshToken=;... │
  │<──────────────────────────────┤
  │                               │
  │ Clear tokens & redirect       │
  │                               │
```

---

## Error Handling

### Client-Side Handling

The application handles errors in the following order:

1. **HTTP Interceptor** (logging.interceptor.ts)
   - Logs all errors to console
   - Measures request duration

2. **Auth Interceptor** (from ng-admin-core)
   - Handles 401 errors
   - Attempts token refresh
   - Redirects to login if refresh fails

3. **Service Level**
   - API services handle errors
   - Transform to user-friendly messages

4. **Component Level**
   - Display error messages to user
   - Update UI state (loading, error flags)

### Expected Error Responses

**Validation Error (400):**
```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "username": "Username must be at least 3 characters",
      "email": "Invalid email format"
    }
  }
}
```

**Unauthorized (401):**
```json
{
  "error": {
    "message": "Authentication required",
    "code": "UNAUTHORIZED"
  }
}
```

**Forbidden (403):**
```json
{
  "error": {
    "message": "Insufficient permissions",
    "code": "FORBIDDEN",
    "details": {
      "required": ["admin"],
      "actual": ["user"]
    }
  }
}
```

**Not Found (404):**
```json
{
  "error": {
    "message": "Resource not found",
    "code": "NOT_FOUND"
  }
}
```

---

## CORS Configuration

### Backend CORS Requirements

The backend must allow:
- **Origin**: Your frontend domain
- **Credentials**: `true` (for cookies)
- **Methods**: `GET, POST, PUT, DELETE, OPTIONS`
- **Headers**: `Content-Type, Authorization`

### Express.js Example

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### NestJS Example

```typescript
// main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
```

---

## Sample Backend Implementation

### Minimal Express.js Backend

```javascript
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const SECRET = 'your-secret-key';

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Mock database
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    roles: ['ADMIN'],
    permissions: ['users:read', 'users:write', 'users:delete']
  }
];

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({
      error: {
        message: 'Invalid username or password',
        code: 'INVALID_CREDENTIALS'
      }
    });
  }

  const accessToken = jwt.sign(
    { id: user.id, username: user.username, roles: user.roles },
    SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions,
      isActive: true,
      emailVerified: true
    },
    accessToken,
    refreshToken
  });
});

// Refresh token
app.post('/api/auth/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      error: {
        message: 'Refresh token required',
        code: 'INVALID_REFRESH_TOKEN'
      }
    });
  }

  try {
    const payload = jwt.verify(refreshToken, SECRET);
    const user = users.find(u => u.id === payload.id);

    const accessToken = jwt.sign(
      { id: user.id, username: user.username, roles: user.roles },
      SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({
      error: {
        message: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      }
    });
  }
});

// Get users
app.get('/api/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  res.json({
    data: users.slice((page - 1) * limit, page * limit),
    meta: {
      total: users.length,
      page,
      limit,
      totalPages: Math.ceil(users.length / limit)
    }
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

---

## Testing the API

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c cookies.txt
```

**Get Users:**
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -b cookies.txt
```

### Using Postman

1. **Create Collection** - "Labyrinth Nexus API"

2. **Set Variables:**
   - `baseUrl`: `http://localhost:3000/api`
   - `accessToken`: (will be set automatically)

3. **Login Request:**
   - Method: POST
   - URL: `{{baseUrl}}/auth/login`
   - Body: `{"username":"admin","password":"admin123"}`
   - Tests: `pm.environment.set("accessToken", pm.response.json().accessToken)`

4. **Authenticated Request:**
   - Method: GET
   - URL: `{{baseUrl}}/users`
   - Headers: `Authorization: Bearer {{accessToken}}`

---

## Migration from Different API Structure

If your API uses different endpoint names or response formats, you can create adapter services:

```typescript
// user-adapter.service.ts
@Injectable({ providedIn: 'root' })
export class UserAdapter {
  adapt(apiUser: any): User {
    return {
      id: apiUser.user_id,
      username: apiUser.user_name,
      email: apiUser.user_email,
      roles: apiUser.user_roles,
      isActive: apiUser.is_active,
      createdAt: apiUser.created_at,
      updatedAt: apiUser.updated_at
    };
  }
}
```

---

*Last updated: 2025-01-08*
