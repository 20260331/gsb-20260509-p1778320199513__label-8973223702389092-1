# Docker 配置思考轨迹

本文档记录了为 133 项目配置 Docker 的完整思考过程。

---

## 第一阶段：项目识别与分析

### 1.1 初始探索

**执行命令**: `ls -la /Users/syefeng/Desktop/works-6849/133`

**发现的关键文件**:
- `package.json` - 表明这是一个 Node.js 项目
- `next.config.js` - 确认是 Next.js 框架
- `tailwind.config.ts` - 使用 Tailwind CSS
- `tsconfig.json` - TypeScript 项目
- `pnpm-lock.yaml` - 使用 pnpm 包管理器

### 1.2 依赖分析

**读取 `package.json`**:
```json
{
  "dependencies": {
    "next": "^14.2.0",
    "@prisma/client": "^5.10.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "prisma": "^5.10.0",
    "typescript": "^5.3.0"
  }
}
```

**关键发现**:
- Next.js 14 版本 → 支持 App Router
- Prisma ORM → 需要处理数据库
- 有 `db:generate` 和 `db:push` 脚本 → 需要在构建时处理

### 1.3 数据库分析

**读取 `lib/db/prisma/schema.prisma`**:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**关键发现**:
- 使用 SQLite 数据库 → 文件型数据库，需要 Volume 持久化
- 环境变量 `DATABASE_URL` 控制数据库路径

### 1.4 项目结构分析

```
app/
├── (auth)/     # Route Group - 认证页面
├── api/        # API Routes
│   ├── auth/   # 认证 API
│   └── posts/  # 文章 API
├── blog/       # 博客页面
│   └── [slug]/ # 动态路由
```

**结论**: 这是一个带认证的博客应用

---

## 第二阶段：Docker 策略制定

### 2.1 遵循的规范要求

根据 `CLAUDE.md` 规范:

| 要求 | 实现策略 |
|------|----------|
| 前端端口 3000 | docker-compose 中映射 `3000:3000` |
| 零依赖原则 | 多阶段构建，所有依赖打包进镜像 |
| 数据持久化 | Docker Volume 存储 SQLite 文件 |

### 2.2 Next.js 部署策略选择

**可选方案**:

| 方案 | 优点 | 缺点 |
|------|------|------|
| 标准构建 | 简单 | 镜像大 (1GB+) |
| **Standalone 输出** | 镜像小 (~200MB) | 需要配置 |
| 静态导出 | 最小 | 不支持 API Routes |

**选择**: Standalone 输出模式
- 原因: 项目有 API Routes，需要服务端渲染
- 需要修改 `next.config.js` 添加 `output: 'standalone'`

### 2.3 多阶段构建设计

```
Stage 1: deps      → 安装依赖
Stage 2: builder   → 构建应用
Stage 3: runner    → 运行时镜像
```

**优势**:
- 最终镜像只包含运行时必需文件
- 构建工具不会进入生产镜像
- 镜像体积显著减小

---

## 第三阶段：具体实现

### 3.1 Dockerfile 设计

**关键决策**:

1. **基础镜像选择**: `node:20-alpine`
   - 理由: Alpine 轻量，Node 20 是 LTS 版本

2. **pnpm 安装方式**: `corepack enable`
   - 理由: Node 16.13+ 内置 corepack，无需额外安装

3. **Prisma 处理**:
   ```dockerfile
   RUN pnpm run db:generate
   ```
   - 必须在构建阶段生成 Prisma Client

4. **安全措施**:
   ```dockerfile
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   USER nextjs
   ```
   - 非 root 用户运行，提高安全性

5. **健康检查**:
   ```dockerfile
   HEALTHCHECK --interval=30s --timeout=10s ...
   ```
   - 容器编排可感知应用状态

### 3.2 docker-compose.yml 设计

**关键配置**:

```yaml
volumes:
  - sqlite_data:/app/data
```

- SQLite 文件存储在命名卷中
- 容器删除重建后数据保留

```yaml
restart: unless-stopped
```

- 异常退出自动重启
- 手动停止不重启

### 3.3 .dockerignore 设计

**排除的内容**:
- `node_modules/` - 镜像内重新安装
- `.next/` - 镜像内重新构建
- `*.db` - 使用 Volume 中的数据库
- 开发配置文件

**目的**: 减少构建上下文，加速构建

### 3.4 next.config.js 修改

```javascript
output: 'standalone'
```

**作用**:
- Next.js 构建时生成 `.next/standalone` 目录
- 包含最小化的 `node_modules` 和 `server.js`
- 可独立运行，无需完整 `node_modules`

---

## 第四阶段：文件清单

### 创建的文件

| 文件 | 作用 |
|------|------|
| `Dockerfile` | 多阶段构建配置 |
| `docker-compose.yml` | 服务编排与 Volume |
| `.dockerignore` | 构建上下文优化 |

### 修改的文件

| 文件 | 修改内容 |
|------|----------|
| `next.config.js` | 添加 `output: 'standalone'` |
| `README.md` | 完善中文文档 |

---

## 第五阶段：验证与部署

### 5.1 启动命令

```bash
cd /Users/syefeng/Desktop/works-6849/133
docker-compose up -d --build
```

### 5.2 预期结果

- 镜像构建成功
- 容器启动，监听 3000 端口
- 访问 http://localhost:3000 显示首页
- SQLite 数据持久化在 `sqlite_data` Volume

### 5.3 可能遇到的问题

| 问题 | 解决方案 |
|------|----------|
| Prisma 生成失败 | 检查 schema.prisma 路径 |
| 端口占用 | 修改 docker-compose 端口映射 |
| 权限问题 | 检查 Volume 权限设置 |

---

## 总结

### 技术决策理由

1. **Standalone 模式**: 平衡了功能完整性和镜像大小
2. **多阶段构建**: 分离构建环境和运行环境
3. **Docker Volume**: SQLite 数据持久化的最佳实践
4. **非 root 用户**: 容器安全最佳实践

### 符合规范情况

- ✅ 端口映射: 3000
- ✅ 零依赖原则: 所有环境封装在镜像
- ✅ 数据持久化: Docker Volume
- ✅ README 文档: 清晰标注部署方式
