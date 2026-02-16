# 🎓 LMS Backend API (MERN Stack)

A scalable Learning Management System backend built with Node.js, Express, MongoDB and Cloudinary.

## 🚀 Features

- User Authentication (JWT Access + Refresh Token)
- Role Based Authorization (Admin / Student)
- Course CRUD (Create, Update, Delete)
- Category Management
- Cloudinary Media Upload (Thumbnail + Preview Video)
- Search, Filter & Pagination
- Latest Courses API
- Zod Validation

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Zod (Validation)
- Multer (File Upload)
- Cloudinary (Media Storage)
- JWT Authentication

## 📦 Installation

1. Clone the repository

git clone https://github.com/ArshadZeya45/Academix.git

2. Install dependencies

npm install

3. Create a .env file

---

# ✅ 5️⃣ Environment Variables

Create a `.env` file in root directory:

PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

## ▶️ Run Server

npm run dev

## 📚 API Endpoints

### Auth

- POST /api/v1/auth/register
- POST /api/v1/auth/login

### Courses

- GET /api/v1/courses
- GET /api/v1/courses?latest=true
- GET /api/v1/courses?search=mern
- PATCH /api/v1/courses/:id
- DELETE /api/v1/courses/:id

### Category

- GET /api/v1/categories

## 📂 Project Structure

src/
├── modules/
│ ├── auth/
│ ├── course/
├── middlewares/
├── utils/
├── config/
└── server.js

## 📤 Sample Response

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

## 👨‍💻 Author

Md Arshad Zeya  
BTech CSE | MERN Stack Developer
