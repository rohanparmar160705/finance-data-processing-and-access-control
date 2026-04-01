# API Documentation - Zorvyn Finance Backend

This document provides a detailed guide on how to interact with the Finance Data Processing API.

## Global Standard Features
Every API in this system (unless specified otherwise) adheres to these standards:
- **Authentication**: Required via `Authorization: Bearer <token>` header.
- **Rate Limiting**: Protected by a global limiter (100 req/15m).
- **Response Format**: All responses are JSON.
- **Error Handling**: Standard HTTP status codes (400, 401, 403, 404, 422, 500) with descriptive messages.

---

## 1. Authentication Module
Endpoints for user onboarding and session management.

### Register User
Create a new account in the system.
- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Auth**: `None` (Public)
- **Rate Limiting**: `Strict` (5 req/15m)
- **Request Body**:
  ```json
  {
    "name": "Rohan Parmar",
    "email": "rohan@gmail.com",
    "password": "password123"
  }
  ```
- **Curl Command**:
  ```bash
  curl.exe -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"Rohan Parmar\", \"email\": \"rohan@gmail.com\", \"password\": \"password123\"}"
  ```

### Login
Authenticate and receive a JWT access token.
- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Auth**: `None` (Public)
- **Rate Limiting**: `Strict` (5 req/15m)
- **Request Body**:
  ```json
  {
    "email": "rohan@gmail.com",
    "password": "password123"
  }
  ```
- **Curl Command**:
  ```bash
  curl.exe -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"rohan@gmail.com\", \"password\": \"password123\"}"
  ```

---

## 2. User Management Module
Manage users and their access levels.

### Get My Profile
Retrieve current user details and permissions.
- **Method**: `GET`
- **URL**: `/api/users/me`
- **Auth**: `Required`
- **RBAC**: `Any Role`
- **Curl Command**:
  ```bash
  curl.exe -X GET http://localhost:5000/api/users/me \
    -H "Authorization: Bearer <YOUR_TOKEN>"
  ```

### List All Users
Retrieve a paginated list of all users.
- **Method**: `GET`
- **URL**: `/api/users`
- **Auth**: `Required`
- **RBAC**: `Admin`
- **Pagination**: `Required`
- **Query Parameters**:
    - `page` (optional): Page number (default: 1)
    - `limit` (optional): Items per page (default: 10)
- **Curl Command**:
  ```bash
  curl.exe -X GET "http://localhost:5000/api/users?page=1&limit=10" \
    -H "Authorization: Bearer <ADMIN_TOKEN>"
  ```

### Update User Status/Role
Update a user's role or active status.
- **Method**: `PATCH`
- **URL**: `/api/users/:id`
- **Auth**: `Required`
- **RBAC**: `Admin`
- **Request Body**:
  ```json
  {
    "role_id": "uuid-of-role", (optional)
    "status": "inactive" (optional)
  }
  ```
- **Curl Command**:
  ```bash
  curl.exe -X PATCH http://localhost:5000/api/users/<USER_ID> \
    -H "Authorization: Bearer <ADMIN_TOKEN>" \
    -H "Content-Type: application/json" \
    -d "{\"status\": \"inactive\"}"
  ```

---

## 3. Financial Records Module
Core CRUD operations for income and expenses.

### List Records
Retrieve financial records with filters and pagination.
- **Method**: `GET`
- **URL**: `/api/records`
- **Auth**: `Required`
- **RBAC**: `Any Role`
- **Pagination**: `Supported`
- **Filtering**: `Supported`
- **Query Parameters**:
    - `page` (optional): Page number
    - `limit` (optional): Records per page
    - `type` (optional): `income` or `expense`
    - `category` (optional): Filter by category string
    - `startDate` (optional): YYYY-MM-DD
    - `endDate` (optional): YYYY-MM-DD
- **Curl Command**:
  ```bash
  curl.exe -X GET "http://localhost:5000/api/records?type=expense&category=Food" \
    -H "Authorization: Bearer <YOUR_TOKEN>"
  ```

### Create Record
Add a new financial transaction.
- **Method**: `POST`
- **URL**: `/api/records`
- **Auth**: `Required`
- **RBAC**: `Analyst`, `Admin`
- **Request Body**:
  ```json
  {
    "amount": 2500.00,
    "type": "expense",
    "category": "Rent",
    "record_date": "2026-04-01",
    "notes": "Payment for April" (optional)
  }
  ```
- **Curl Command**:
  ```bash
  curl.exe -X POST http://localhost:5000/api/records \
    -H "Authorization: Bearer <ANALYST_TOKEN>" \
    -H "Content-Type: application/json" \
    -d "{\"amount\": 2500, \"type\": \"expense\", \"category\": \"Rent\", \"record_date\": \"2026-04-01\"}"
  ```

### Delete Record (Soft Delete)
Mark a record as deleted. It will no longer appear in lists or dashboard totals.
- **Method**: `DELETE`
- **URL**: `/api/records/:id`
- **Auth**: `Required`
- **RBAC**: `Admin`
- **Soft Delete**: `Yes`
- **Curl Command**:
  ```bash
  curl.exe -X DELETE http://localhost:5000/api/records/<RECORD_ID> \
    -H "Authorization: Bearer <ADMIN_TOKEN>"
  ```

---

## 4. Dashboard Summary Module
Aggregated insights for frontend visualization.

### Financial Summary
Get Total Income, Total Expenses, and Net Balance.
- **Method**: `GET`
- **URL**: `/api/dashboard/summary`
- **Auth**: `Required`
- **RBAC**: `Any Role`
- **Curl Command**:
  ```bash
  curl.exe -X GET http://localhost:5000/api/dashboard/summary \
    -H "Authorization: Bearer <YOUR_TOKEN>"
  ```

### Monthly Trends
Get income vs expense data grouped by month for the last 12 months.
- **Method**: `GET`
- **URL**: `/api/dashboard/trends`
- **Auth**: `Required`
- **RBAC**: `Any Role`
- **Curl Command**:
  ```bash
  curl.exe -X GET http://localhost:5000/api/dashboard/trends \
    -H "Authorization: Bearer <YOUR_TOKEN>"
  ```
