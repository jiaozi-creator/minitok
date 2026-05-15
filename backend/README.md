# MiniTok

MiniTok 是一个仿 TikTok / 小红书的全栈内容社区项目，支持用户注册登录、图文发布、图片上传、首页 Feed、帖子详情、点赞、评论、删除评论、删除帖子等核心功能。

项目采用前后端分离架构，前端使用 React + TypeScript + Vite，后端使用 NestJS + Prisma + MySQL，图片上传使用 Cloudinary，前端部署在 Vercel，后端和数据库部署在 Railway。

---

## Online Demo

- Frontend: https://minitok-psi.vercel.app
- API Docs: https://minitok-production.up.railway.app/api-docs
- Repository: https://github.com/jiaozi-creator/minitok

---

## Features

### User

- 用户注册
- 用户登录
- JWT 登录态管理
- 获取当前登录用户信息
- 刷新页面后保持登录状态

### Post

- 发布图文帖子
- 上传本地图片作为封面图
- 首页 Feed 展示帖子列表
- 查看帖子详情
- 删除自己的帖子
- 作者权限校验

### Comment

- 查看帖子评论
- 登录用户发表评论
- 删除自己的评论
- 评论权限校验

### Like

- 点赞帖子
- 取消点赞
- 获取当前用户对帖子的点赞状态
- 防止重复点赞

### Upload

- 支持本地选择图片
- 后端接收图片文件
- 上传图片到 Cloudinary
- 返回线上图片地址
- 帖子封面图使用 Cloudinary URL

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Zustand
- Axios
- Tailwind CSS

### Backend

- NestJS
- TypeScript
- Prisma
- MySQL
- JWT
- Passport
- Swagger
- Multer
- Cloudinary

### Deployment

- Frontend: Vercel
- Backend: Railway
- Database: Railway MySQL
- Image Storage: Cloudinary

---

## Project Structure

```text
minitok/
  backend/
    prisma/
      schema.prisma
      migrations/
    src/
      auth/
      users/
      posts/
      comments/
      likes/
      upload/
      prisma/
      app.module.ts
      main.ts
    package.json
    .env.example

  frontend/
    src/
      components/
      pages/
      services/
      store/
      types/
      App.tsx
      main.tsx
    package.json
    .env.development

  README.md
```

---

## Core Modules

### Auth Module

The auth module handles user registration, login, JWT token generation, and current user retrieval.

Main APIs:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Posts Module

The posts module handles post creation, list query, detail query, update, and deletion.

Main APIs:

```text
POST   /api/posts
GET    /api/posts
GET    /api/posts/:id
PATCH  /api/posts/:id
DELETE /api/posts/:id
```

### Comments Module

The comments module handles creating comments, querying comments by post, and deleting comments.

Main APIs:

```text
POST   /api/posts/:id/comments
GET    /api/posts/:id/comments
DELETE /api/comments/:id
```

### Likes Module

The likes module handles like, unlike, and like status query.

Main APIs:

```text
POST   /api/posts/:id/like
DELETE /api/posts/:id/like
GET    /api/posts/:id/like-status
```

### Upload Module

The upload module handles image upload to Cloudinary.

Main API:

```text
POST /api/upload/image
```

---

## Database Design

The project uses MySQL as the database and Prisma as the ORM.

Main models:

```text
User
Post
Comment
Like
```

### User

Stores user information.

Main fields:

```text
id
email
username
passwordHash
avatar
bio
createdAt
updatedAt
```

### Post

Stores post content.

Main fields:

```text
id
authorId
title
content
coverImage
createdAt
updatedAt
```

### Comment

Stores post comments.

Main fields:

```text
id
postId
userId
content
createdAt
updatedAt
```

### Like

Stores user likes on posts.

Main fields:

```text
id
userId
postId
createdAt
```

The Like table uses a unique constraint on `userId + postId` to prevent duplicate likes.

---

## Local Development

### Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- MySQL
- Git

---

## Clone Project

```bash
git clone https://github.com/jiaozi-creator/minitok.git
cd minitok
```

---

## Backend Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

Create a `.env` file in the `backend` directory.

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/minitok"

DATABASE_HOST="localhost"
DATABASE_PORT="3306"
DATABASE_USER="USER"
DATABASE_PASSWORD="PASSWORD"
DATABASE_NAME="minitok"

PORT=3000
JWT_SECRET="your_jwt_secret"

FRONTEND_URL="http://localhost:5173"

CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
```

### 3. Run database migration

```bash
npx prisma migrate dev
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Start backend

```bash
npm run start:dev
```

Backend will run at:

```text
http://localhost:3000
```

Swagger API docs:

```text
http://localhost:3000/api-docs
```

---

## Frontend Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment variables

Create a `.env.development` file in the `frontend` directory.

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Start frontend

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

---

## Production Environment Variables

### Railway Backend Variables

```env
PORT=3000
JWT_SECRET=your_production_jwt_secret

DATABASE_URL=${{MySQL.MYSQL_URL}}
DATABASE_HOST=${{MySQL.MYSQLHOST}}
DATABASE_PORT=${{MySQL.MYSQLPORT}}
DATABASE_USER=${{MySQL.MYSQLUSER}}
DATABASE_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DATABASE_NAME=${{MySQL.MYSQLDATABASE}}

FRONTEND_URL=https://minitok-psi.vercel.app

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Vercel Frontend Variables

```env
VITE_API_BASE_URL=https://minitok-production.up.railway.app/api
```

---

## Deployment

### Backend Deployment on Railway

The backend is deployed on Railway.

Recommended Railway configuration:

```text
Root Directory:
backend
```

```bash
Build Command:
npm install && npx prisma generate && npm run build
```

```bash
Pre-deploy Command:
npx prisma migrate deploy
```

```bash
Start Command:
node dist/src/main.js
```

Notes:

- `prisma migrate deploy` should be executed in the pre-deploy phase.
- Railway private database networking may not be available during the build phase.
- `FRONTEND_URL` must match the deployed Vercel frontend URL exactly.

### Frontend Deployment on Vercel

The frontend is deployed on Vercel.

Recommended Vercel configuration:

```text
Framework Preset:
Vite
```

```text
Root Directory:
frontend
```

```bash
Install Command:
npm install
```

```bash
Build Command:
npm run build
```

```text
Output Directory:
dist
```

Environment variable:

```env
VITE_API_BASE_URL=https://minitok-production.up.railway.app/api
```

---

## API Documentation

The backend uses Swagger to generate API documentation.

Local:

```text
http://localhost:3000/api-docs
```

Production:

```text
https://minitok-production.up.railway.app/api-docs
```

---

## Authentication Flow

1. User registers or logs in.
2. Backend validates credentials.
3. Backend returns an `accessToken`.
4. Frontend stores the token in `localStorage`.
5. Axios request interceptor automatically attaches the token.

Request header example:

```http
Authorization: Bearer <accessToken>
```

Protected APIs use NestJS guards to verify the token.

---

## Image Upload Flow

1. User selects an image on the post creation page.
2. Frontend sends the image as `multipart/form-data`.
3. Backend receives the file using Multer.
4. Backend uploads the image to Cloudinary.
5. Cloudinary returns a secure image URL.
6. Backend returns the image URL to frontend.
7. Frontend stores the URL as the post `coverImage`.

---

## Like Flow

1. User clicks the like button.
2. Frontend checks login status.
3. If not logged in, user is redirected to login.
4. If logged in, frontend calls like or unlike API.
5. Backend checks whether the post exists.
6. Backend creates or deletes the like record.
7. Frontend updates like status and like count.

---

## Permission Design

The project includes basic permission checks:

- Only logged-in users can create posts.
- Only logged-in users can comment.
- Only logged-in users can like posts.
- Only post authors can delete their own posts.
- Only comment authors can delete their own comments.

---

## Common Issues

### 1. CORS error in production

Check Railway backend variable:

```env
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

Do not add a trailing slash.

Correct:

```env
FRONTEND_URL=https://minitok-psi.vercel.app
```

Wrong:

```env
FRONTEND_URL=https://minitok-psi.vercel.app/
```

After changing Railway variables, redeploy the backend.

### 2. Frontend still requests localhost

Check Vercel environment variable:

```env
VITE_API_BASE_URL=https://your-railway-domain/api
```

After changing Vercel environment variables, redeploy the frontend.

### 3. Local backend cannot connect to Railway internal database

Do not use this host locally:

```text
mysql.railway.internal
```

That address only works inside Railway services.

For local development, use local MySQL:

```env
DATABASE_HOST=localhost
DATABASE_NAME=minitok
```

### 4. Cloudinary upload fails

Check backend environment variables:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Make sure `CLOUDINARY_CLOUD_NAME` is the actual Cloudinary cloud name, not the API key name.

---

## Scripts

### Backend

```bash
npm run start:dev
npm run build
npm run start:prod
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

---

## Project Highlights

- Built a full-stack content community app from scratch.
- Designed modular backend architecture with NestJS.
- Implemented JWT-based authentication and protected routes.
- Used Prisma to model relational data and operate MySQL.
- Implemented post creation, feed display, comments, likes, and deletion.
- Integrated Cloudinary for production-ready image upload.
- Deployed frontend to Vercel and backend/database to Railway.
- Added Swagger API documentation for backend testing and presentation.
- Separated local and production environment variables.
- Solved deployment issues such as CORS, database private networking, and production migration.

---

## Future Improvements

- Add user profile page
- Add follow system
- Add post search
- Add infinite scrolling
- Add pagination for comments
- Add edit post feature in frontend
- Add refresh token mechanism
- Add image compression before upload
- Add unit tests and e2e tests
- Add recommendation ranking logic
- Add CI/CD checks before deployment

---

## Interview Talking Points

This project can be introduced in interviews as:

```text
MiniTok is a full-stack content community project inspired by TikTok and Xiaohongshu. 
I implemented the complete content interaction flow, including authentication, post publishing, image upload, feed display, likes, comments, and deletion permissions.

The frontend is built with React, TypeScript, Vite, Zustand, Axios, and Tailwind CSS. 
The backend is built with NestJS, Prisma, MySQL, JWT, Swagger, and Cloudinary.

I deployed the frontend to Vercel, the backend and database to Railway, and used Cloudinary to handle image storage. During deployment, I solved issues such as CORS configuration, production database migration, and cloud file storage.
```

---

## License

This project is for learning and portfolio demonstration.