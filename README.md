# Next.js 博客应用

一个基于 Next.js 14 构建的现代化全栈博客应用，采用 App Router 架构，集成 TypeScript、Tailwind CSS 和 Prisma ORM。

## 技术栈

| 类别   | 技术                    |
| ------ | ----------------------- |
| 框架   | Next.js 14 (App Router) |
| 语言   | TypeScript              |
| 样式   | Tailwind CSS            |
| 数据库 | SQLite + Prisma ORM     |
| 验证   | Zod                     |

## 功能特性

- 用户认证系统 (登录/注册)
- 博客文章 CRUD 操作
- 动态路由 (`/blog/[slug]`)
- RESTful API 接口
- 响应式 UI 设计

## 项目结构

```
133/
├── app/                        # Next.js App Router 目录
│   ├── (auth)/                # 认证相关页面组
│   │   ├── login/             # 登录页
│   │   └── register/          # 注册页
│   ├── api/                   # API 路由
│   │   ├── auth/              # 认证 API
│   │   └── posts/             # 文章 API
│   ├── blog/                  # 博客页面
│   │   ├── [slug]/            # 文章详情 (动态路由)
│   │   └── page.tsx           # 文章列表
│   ├── globals.css            # 全局样式
│   ├── layout.tsx             # 根布局
│   ├── page.tsx               # 首页
│   ├── error.tsx              # 错误处理
│   ├── loading.tsx            # 加载状态
│   └── not-found.tsx          # 404 页面
├── components/                 # React 组件
│   ├── ui/                    # 基础 UI 组件
│   ├── layout/                # 布局组件
│   ├── features/              # 功能组件
│   └── lib/                   # 组件工具库
├── lib/                        # 工具库
│   ├── api/                   # API 客户端
│   ├── db/                    # 数据库配置
│   │   └── prisma/            # Prisma Schema
│   ├── types/                 # TypeScript 类型
│   └── utils/                 # 工具函数
├── public/                     # 静态资源
├── Dockerfile                  # Docker 镜像配置
├── docker-compose.yml          # Docker Compose 编排
└── package.json                # 项目依赖
```

## 数据模型

```prisma
model User {
  id        String   @id
  email     String   @unique
  name      String?
  password  String
  posts     Post[]
  createdAt DateTime
  updatedAt DateTime
}

model Post {
  id        String   @id
  title     String
  content   String
  slug      String   @unique
  published Boolean
  author    User
  authorId  String
  createdAt DateTime
  updatedAt DateTime
}
```

---

## 🔐 测试账号

Docker 首次启动时会自动初始化数据库并创建测试账号:

| 字段   | 值                  |
| ------ | ------------------- |
| 邮箱   | `admin@example.com` |
| 密码   | `admin123`          |

> 注意: 生产环境请及时修改默认密码

---

## 🐳 Docker 部署 (推荐)

> **零依赖部署**: 无需在本地安装 Node.js、npm 或任何开发环境，所有依赖已封装在 Docker 镜像中。

### 一键启动

```bash
# 构建并启动
docker compose up -d --build

# 查看运行状态
docker compose ps

# 查看实时日志
docker compose logs -f
```

### 端口映射

| 服务     | 容器端口 | 宿主机端口 | 访问地址              |
| -------- | -------- | ---------- | --------------------- |
| Web 应用 | 3000     | **3000**   | http://localhost:3000 |

### 数据持久化

| 存储类型      | 说明                                     |
| ------------- | ---------------------------------------- |
| Docker Volume | `sqlite_data` 卷用于持久化 SQLite 数据库 |
| 数据路径      | 容器内 `/app/data/prod.db`               |
| 特性          | 容器重启后数据不丢失                     |

### Docker 常用命令

```bash
# 构建镜像
docker compose build

# 启动服务 (后台运行)
docker compose up -d

# 停止服务
docker compose down

# 查看日志
docker compose logs -f

# 重新构建并启动
docker compose up -d --build

# 进入容器
docker exec -it nextjs-app sh

# 清理数据卷 (⚠️ 会删除所有数据)
docker compose down -v
```

---

## 💻 本地开发

如需本地开发调试，请确保已安装以下环境:

- Node.js 18+
- pnpm (推荐) 或 npm

### 安装与启动

```bash
# 安装依赖
pnpm install

# 生成 Prisma Client
pnpm run db:generate

# 初始化数据库
pnpm run db:push

# 启动开发服务器
pnpm run dev
```

访问 http://localhost:3000 查看应用。

### 可用脚本

| 命令                   | 说明                                |
| ---------------------- | ----------------------------------- |
| `pnpm run dev`         | 启动开发服务器 (热重载)             |
| `pnpm run build`       | 构建生产版本                        |
| `pnpm run start`       | 启动生产服务器                      |
| `pnpm run lint`        | 运行 ESLint 代码检查                |
| `pnpm run db:generate` | 生成 Prisma Client                  |
| `pnpm run db:push`     | 同步数据库 Schema                   |
| `pnpm run db:seed`     | 填充测试数据                        |
| `pnpm run db:studio`   | 打开 Prisma Studio (数据库管理界面) |

---

## 环境变量

| 变量              | 说明                 | 默认值          |
| ----------------- | -------------------- | --------------- |
| `DATABASE_URL`    | SQLite 数据库路径    | `file:./dev.db` |
| `NODE_ENV`        | 运行环境             | `development`   |
| `NEXTAUTH_SECRET` | NextAuth 密钥 (可选) | -               |
| `NEXTAUTH_URL`    | 应用 URL (可选)      | -               |

---

## API 接口

| 方法   | 路径                 | 说明         |
| ------ | -------------------- | ------------ |
| POST   | `/api/auth/register` | 用户注册     |
| POST   | `/api/auth/login`    | 用户登录     |
| GET    | `/api/posts`         | 获取文章列表 |
| POST   | `/api/posts`         | 创建文章     |
| GET    | `/api/posts/[id]`    | 获取文章详情 |
| PUT    | `/api/posts/[id]`    | 更新文章     |
| DELETE | `/api/posts/[id]`    | 删除文章     |

---

## License

MIT
