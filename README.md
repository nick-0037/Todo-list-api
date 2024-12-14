# Todo-list-api

This API provides CRUD operations and authentication functionality for managing a system of tasks. It is built **NestJS** and uses **MongoDB** for data storage.

## Features

- **CRUD operations**: Create, Read, Update, and Delete tasks.
- **Authentication**: Secure login with JWT, including access token and refresh tokens.
- **Token management**: Automatically refresh access token using refresh token.
- **Search & Pagination**: Filter tasks by title, paginate results, and sort by creation date.
- **Scalable architecture**: Built with modularity and maintainability in mind.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nick-0037/Todo-list-api.git
   cd todo-list-api
   ```

2. Install dependencies:
   ```bash
   npm install  
   ```

3. Configure environment variables:
   - Create a .env file in the root of the project.
   - Add the following variables:
   ```bash
   DB_URI=your_mongoDb
   JWT_SECRET=your_Jwt_Secret
   ```

4. Run the application:
   ```bash
   npm run start
   ```

5. Access the API at `http://localhost:3000`

## API Endpoints

### Authentication
| Method | Endpoint | Description
| --- | --- | --- |
| POST | `/auth/register` |	Register a new user |
| POST | `/auth/login` | Log in with credentials |
| POST | `/auth/refresh-token`| Refresh access token
### Tasks

| Method | Endpoint |	Description
| --- | --- | --- |
| POST |	`/todo` |	Create a new task |
| GET | `/todo`	| Get all tasks with pagination and optional filters |
| PUT | `/todo/:id` |	Update a task by ID |
| DELETE | `/todo/:id` | Delete a task by ID |

## Task Retrieval with Filters and Pagination

### GET /todo
**Description**: Retrieve a paginated and filtered list of tasks for the authenticated user. You can filter by title, sort results, and specify pagination parameters.

**Query Parameters**
| Parameter |	Type | Default | Description |
| --- | --- | --- | --- |
| page |	number | 1 | The page number for pagination. |
| limit | number | 10 | The number of tasks per page. |
| sortOrder | string | desc |	The order of the tasks: asc for ascending or desc for descending. |
| title |	string | null | Optional. Filters tasks by titles containing the specified string (case-insensitive). |

### Example request

```http

GET /todo?page=1&limit=5&sortOrder=asc&title=meeting
```
