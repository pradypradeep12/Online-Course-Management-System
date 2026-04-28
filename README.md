# EduFlow - Online Course Management System

A fullstack online course management system for educators and students.

## Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, React Router v6, React Hook Form + Zod, Axios
- **Backend**: Spring Boot 3.2, Spring Security, JWT, Spring Data JPA
- **Database**: H2 (in-memory, auto-seeded)

---

## Quick Start

### 1. Backend (Spring Boot)

```bash
cd demo
./mvnw spring-boot:run
```
Backend runs on **http://localhost:8080**

H2 Console: http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:coursedb`)

### 2. Frontend (React)

> Requires Node.js 18+. Download from https://nodejs.org

```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**

---

## Demo Accounts (auto-seeded)

| Role     | Email                  | Password  |
|----------|------------------------|-----------|
| Educator | educator@demo.com      | edu123    |
| Educator | educator2@demo.com     | edu123    |
| Student  | student@demo.com       | stu123    |
| Student  | student2@demo.com      | stu123    |
| Admin    | admin@demo.com         | admin123  |

> Quick login buttons are available on the login page.

---

## Features

### Educator
- Dashboard with course stats and student counts
- Create, edit, delete courses (title, description, category, level, price, thumbnail, status)
- Manage lessons per course (add, edit, delete, reorder)
- View enrolled students with progress tracking

### Student
- Browse and search/filter published courses
- Enroll in courses
- Track learning progress (0–100% slider)
- Unenroll from courses
- Dashboard with stats

### Admin
- View all users and courses
- Platform-wide statistics

### Auth
- JWT-based authentication
- Role-based access control (EDUCATOR, STUDENT, ADMIN)
- Protected routes on frontend
- Token stored in localStorage, auto-attached via Axios interceptor
- Auto-redirect on 401

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login

### Courses
- `GET /api/courses/public` — Browse published courses (search, filter)
- `GET /api/courses/public/{id}` — Course detail
- `GET /api/courses/my` — Educator's courses (auth)
- `POST /api/courses` — Create course (EDUCATOR)
- `PUT /api/courses/{id}` — Update course (EDUCATOR)
- `DELETE /api/courses/{id}` — Delete course (EDUCATOR)

### Lessons
- `GET /api/courses/{courseId}/lessons` — Get lessons
- `POST /api/courses/{courseId}/lessons` — Add lesson (EDUCATOR)
- `PUT /api/courses/{courseId}/lessons/{id}` — Update lesson (EDUCATOR)
- `DELETE /api/courses/{courseId}/lessons/{id}` — Delete lesson (EDUCATOR)

### Enrollments
- `GET /api/enrollments/my` — My enrollments (STUDENT)
- `POST /api/enrollments/course/{courseId}` — Enroll (STUDENT)
- `PATCH /api/enrollments/{id}/progress` — Update progress (STUDENT)
- `DELETE /api/enrollments/{id}` — Unenroll (STUDENT)
- `GET /api/enrollments/course/{courseId}` — Course students (EDUCATOR)

---

## Project Structure

```
demo/                          # Spring Boot backend
├── src/main/java/com/example/demo/
│   ├── controller/            # REST controllers
│   ├── service/               # Business logic
│   ├── repository/            # JPA repositories
│   ├── model/                 # JPA entities
│   ├── dto/                   # Request/Response DTOs
│   ├── security/              # JWT + Spring Security
│   └── exception/             # Global error handling

frontend/                      # React frontend
├── src/
│   ├── api/                   # Axios API client
│   ├── components/            # Reusable UI components
│   ├── context/               # Auth context
│   ├── hooks/                 # Custom hooks
│   └── pages/                 # Route pages
│       ├── auth/
│       ├── educator/
│       ├── student/
│       └── admin/
```
