# LMS Backend API (MERN Stack)

A scalable Learning Management System backend built with Node.js, Express, MongoDB and Cloudinary.

## Features

- User Authentication (JWT Access + Refresh Token)
- Role Based Authorization (Admin / Student)
- Course CRUD (Create, Update, Delete)
- Category Management
- Cloudinary Media Upload (Thumbnail + Preview Video)
- Search & Pagination
- Latest Courses API
- Zod Validation

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Zod (Validation)
- Multer (File Upload)
- Cloudinary (Media Storage)
- JWT Authentication

## Installation

1. Clone the repository

git clone https://github.com/ArshadZeya45/Academix.git

2. Install dependencies

npm install

3. Create a .env file

---

# Environment Variables

Create a `.env` file in root directory:

PORT=
MONGO_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
ACCESS_TOKEN_EXPIRES_IN=
REFRESH_TOKEN_EXPIRES_IN=
ACCESS_COOKIE_MAX_AGE=
REFRESH_COOKIE_MAX_AGE=
BCRYPT_SALT=
CLOUDINARY_CLOUD=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

## Run Server

npm run dev

## API Endpoints

### Auth

- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/logout
- POST /api/v1/auth/refresh

## User

- GET /api/v1/users/me

### Courses

- GET /api/v1/courses/suggestions?q=
- GET /api/v1/courses?type=
- GET /api/v1/courses/:id
- POST /api/v1/courses
- PATCH /api/v1/courses/:id
- DELETE /api/v1/courses/:id

### Category

- GET /api/v1/categories
- POST /api/v1/categories
- GET /api/v1/categories/:categoryId
- PATCH /api/v1/categories/:categoryId
- DELETE /api/v1/categories/:categoryId

### Lecture

- GET /api/v1/courses/:courseId/lectures?page=&limit=
- GET /api/v1/courses/:courseId/lectures/:lectureId
- POST /api/v1/courses/:courseId/lectures
- PATCH /api/v1/courses/:courseId/lectures/:lectureId
- DELETE /api/v1/courses/:courseId/lectures/:lectureId

## Project Structure

src/
modules/
auth/
course/  
 middlewares/
├── utils/
├── config/
└── server.js

## Sample Response

{
"success": true,
"message": "courses fetched successfully",
"data": {
"totalCourses": 10,
"currentPage": 1,
"totalPages": 2,
"courses": [...]
}
}

## Author

Md Arshad Zeya  
BTech CSE | MERN Stack Developer
