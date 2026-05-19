# MiniTok 短内容社区

MiniTok 是一个基于 **React + TypeScript + NestJS** 的短内容社区项目，支持用户注册登录、图文发布、首页 Feed、关键词搜索、无限滚动、点赞、评论、图片上传和作者权限控制。

项目目标是模拟内容社区的核心业务流程，并重点展示：**前端工程化、接口联调、用户体验优化、基础性能优化、权限控制和全栈部署能力**。

## 在线体验

- 前端 Demo：https://minitok-psi.vercel.app
- 后端接口：https://minitok-production.up.railway.app/api
- API 文档：https://minitok-production.up.railway.app/api-docs
- GitHub 仓库：https://github.com/jiaozi-creator/minitok


## 项目截图


| 首页 Feed | 帖子详情 |
| --- | --- |
| ![首页 Feed](docs/images/home.png) | ![帖子详情](docs/images/detail.png) |

| 发布帖子 | API 文档 |
| --- | --- |
| ![发布帖子](docs/images/create.png) | ![API 文档](docs/images/swagger.png) |

## 核心功能

- 用户注册、登录、退出登录
- JWT 登录鉴权与登录态持久化
- 首页 Feed 列表展示
- 关键词搜索，支持标题和正文匹配
- 搜索防抖，减少高频输入带来的重复请求
- 分页加载与无限滚动
- 图片上传至 Cloudinary
- 发布图文内容、查看帖子详情、删除自己的帖子
- 点赞、取消点赞、点赞数量展示
- 评论、评论列表、删除自己的评论
- 前端权限路由与后端权限校验
- Swagger API 文档，方便接口调试和前后端联调

## 技术栈

### 前端

- React
- TypeScript
- Vite
- React Router
- Zustand
- Axios
- Tailwind CSS

### 后端

- Node.js
- NestJS
- Prisma
- MySQL / MariaDB
- JWT
- Passport
- bcrypt
- Swagger
- Cloudinary

### 工程化与部署

- ESLint
- Prettier
- Git / GitHub
- Vercel
- Railway

## 项目亮点

### 1. 前端工程化设计

项目按页面、组件、服务层、状态管理和类型定义拆分目录，整体结构清晰，便于维护和扩展。

- `services/`：统一封装后端 API 请求
- `store/`：使用 Zustand 管理登录状态
- `types/`：维护接口返回值和业务类型
- `components/`：复用导航栏、权限路由、点赞按钮等组件
- `pages/`：管理首页、登录、注册、发布、详情等业务页面

### 2. 登录鉴权与权限控制

前端使用 Zustand + localStorage 保存登录态，刷新页面后可以恢复登录状态。Axios 请求拦截器会在需要鉴权的请求中统一携带 JWT Token，减少业务组件中的重复代码。

后端使用 `JwtAuthGuard` 保护发帖、点赞、评论、删除等接口，并在删除帖子和删除评论时校验资源归属，避免用户越权操作。

### 3. Feed 流体验优化

首页 Feed 支持关键词搜索、分页加载、骨架屏和无限滚动。

- 使用 `useDebounce` 对搜索关键词进行防抖处理
- 使用 `IntersectionObserver` 监听底部加载元素，实现无限滚动
- 使用骨架屏优化首次加载体验
- 使用 `loading="lazy"` 延迟加载帖子图片，降低首屏资源压力
- 通过分页加载减少一次性请求的数据量

### 4. 图片上传体验

发布帖子时支持选择本地图片，并通过 `URL.createObjectURL` 实现上传前预览。提交时先将图片上传到 Cloudinary，获取图片 URL 后再创建帖子，提升发布体验。

### 5. 后端数据建模清晰

数据库包含 User、Post、Comment、Like 四个核心模型。

- User 与 Post 是一对多关系
- Post 与 Comment 是一对多关系
- User 与 Like、Post 与 Like 建立点赞关系
- Like 表通过 `userId + postId` 唯一索引避免重复点赞
- Post 表对 `authorId` 和 `createdAt` 建立索引，方便按作者和时间查询

## 项目结构

```txt
minitok
├── frontend                 # 前端项目
│   ├── src
│   │   ├── components       # 通用组件
│   │   ├── hooks            # 自定义 Hooks
│   │   ├── pages            # 页面组件
│   │   ├── services         # API 请求封装
│   │   ├── store            # Zustand 状态管理
│   │   ├── types            # TypeScript 类型定义
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend                  # 后端项目
│   ├── prisma
│   │   └── schema.prisma    # 数据库模型
│   ├── src
│   │   ├── auth             # 注册、登录、JWT 鉴权
│   │   ├── comments         # 评论模块
│   │   ├── likes            # 点赞模块
│   │   ├── posts            # 帖子模块
│   │   ├── upload           # 图片上传模块
│   │   ├── users            # 用户模块
│   │   ├── prisma           # Prisma Service
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
├── docs
│   └── images               # README 项目截图
│
└── README.md
```
## 环境变量说明

项目中使用 `.env` 和 `.env.example` 管理环境变量。

### `.env`

`.env` 是本地真实环境变量文件，用于项目运行。  
该文件可能包含数据库密码、JWT 密钥、Cloudinary 密钥等敏感信息，**不应该提交到 GitHub**。

例如：

```env
DATABASE_URL=mysql://root:password@localhost:3306/minitok

DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=minitok

PORT=3000
JWT_SECRET=dev_jwt_secret_change_me
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


## 本地运行

### 1. 克隆项目

```bash
git clone https://github.com/jiaozi-creator/minitok.git
cd minitok
```

### 2. 启动后端

进入后端目录：

```bash
cd backend
npm install
```

创建环境变量文件：

```bash
cp .env.example .env
```

如果使用 Windows PowerShell，也可以使用：

```powershell
Copy-Item .env.example .env
```

`.env` 示例：

```env
DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/DATABASE
PORT=3000
JWT_SECRET=replace_with_a_strong_secret
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

初始化数据库：

```bash
npx prisma generate
npx prisma migrate dev
```

启动后端服务：

```bash
npm run start:dev
```

后端默认运行在：

```txt
http://localhost:3000
```

本地 API 文档地址：

```txt
http://localhost:3000/api-docs
```

### 3. 启动前端

新开一个终端，进入前端目录：

```bash
cd frontend
npm install
```

创建环境变量文件：

```bash
cp .env.development .env.local
```

如果使用 Windows PowerShell，也可以使用：

```powershell
Copy-Item .env.development .env.local
```

`.env.local` 示例：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

启动前端：

```bash
npm run dev
```

前端默认运行在：

```txt
http://localhost:5173
```

## 常用脚本

### 前端

```bash
cd frontend
npm run dev       # 启动开发环境
npm run build     # 生产环境构建
npm run lint      # 代码检查
npm run preview   # 预览构建产物
```

### 后端

```bash
cd backend
npm run start:dev  # 启动开发环境
npm run build      # 构建后端项目
npm run start:prod # 启动生产环境服务
npm run lint       # 代码检查与自动修复
npm run test       # 单元测试
```

## API 说明

后端统一使用 `/api` 作为接口前缀。

### Auth

| 方法 | 路径 | 说明 | 是否需要登录 |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | 用户注册 | 否 |
| POST | `/api/auth/login` | 用户登录 | 否 |
| GET | `/api/auth/me` | 获取当前用户信息 | 是 |

### Posts

| 方法 | 路径 | 说明 | 是否需要登录 |
| --- | --- | --- | --- |
| GET | `/api/posts` | 获取帖子列表 | 否 |
| GET | `/api/posts/:id` | 获取帖子详情 | 否 |
| POST | `/api/posts` | 创建帖子 | 是 |
| DELETE | `/api/posts/:id` | 删除自己的帖子 | 是 |

> 如果后续实现了编辑帖子功能，可以再补充 `PATCH /api/posts/:id`。

### Comments

| 方法 | 路径 | 说明 | 是否需要登录 |
| --- | --- | --- | --- |
| GET | `/api/posts/:id/comments` | 获取帖子评论 | 否 |
| POST | `/api/posts/:id/comments` | 发表评论 | 是 |
| DELETE | `/api/comments/:id` | 删除自己的评论 | 是 |

### Likes

| 方法 | 路径 | 说明 | 是否需要登录 |
| --- | --- | --- | --- |
| POST | `/api/posts/:id/like` | 点赞帖子 | 是 |
| DELETE | `/api/posts/:id/like` | 取消点赞 | 是 |
| GET | `/api/posts/:id/like-status` | 获取当前用户点赞状态 | 是 |

### Upload

| 方法 | 路径 | 说明 | 是否需要登录 |
| --- | --- | --- | --- |
| POST | `/api/upload/image` | 上传图片 | 是 |

## 数据库模型

```txt
User
├── id
├── email
├── username
├── passwordHash
├── avatar
├── bio
├── createdAt
└── updatedAt

Post
├── id
├── authorId
├── title
├── content
├── coverImage
├── createdAt
└── updatedAt

Comment
├── id
├── postId
├── userId
├── content
└── createdAt

Like
├── id
├── postId
├── userId
└── createdAt
```

## 部署说明

### 前端部署

前端部署到 Vercel。

需要在 Vercel 中配置环境变量：

```env
VITE_API_BASE_URL=https://minitok-production.up.railway.app/api
```

构建配置：

```txt
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

### 后端部署

后端部署到 Railway。

需要在 Railway 中配置环境变量：

```env
DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/DATABASE
PORT=3000
JWT_SECRET=replace_with_a_strong_secret
FRONTEND_URL=https://minitok-psi.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```


## 作者

- GitHub：[@jiaozi-creator](https://github.com/jiaozi-creator)
