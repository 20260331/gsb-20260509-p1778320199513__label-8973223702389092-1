# 文章分类功能

> **Workspace:** d:\code\trae\gsb\20260509\B-133-feature迭代-1\TestM_2

---

## User
现在文章没有分类，管理起来不方便。给文章加上分类功能，创建和编辑文章时可以选择分类，列表页能按分类筛选文章。使用现有的Prisma ORM和SQLite存储分类数据，新增的API路由保持现有的Zod验证风格，前端用React Hook Form处理表单。

## Assistant
现在我已对代码库有了全面的了解。让我来规划一下实现方案。

**步骤 1：更新 Prisma schema** — 添加 `Category` 模型，并将 `categoryId` 外键添加到 `Post`。

**步骤2: 应用 Prisma schema 变更并安装 react-hook-form**

让我使用项目本地的 Prisma CLI 来代替：

沙盒对 pnpm 的符号链接存在权限问题。我先检查一下 node_modules 是否已经存在，然后继续进行代码修改。我会在所有代码更改之后尝试运行 prisma generate。

node_modules 尚不存在。我将继续进行代码更改，并在最后尝试安装依赖。让我继续进行实现。

**步骤3：创建分类API路由** — 遵循现有模式（Zod 验证、NextRequest/NextResponse、Prisma）。

**步骤4：更新文章API路由** — 添加 `categoryId` 到 Zod 模式，在查询中包含 `category`，支持分类过滤器。

现在更新 `[id]/route.ts` —— 添加 `categoryId` 到更新 schema 中，并在查询中包含 `category`：

**步骤 5: 更新 TypeScript 类型**

**步骤 7: 重构仪表盘页面** — 这是最大的改动。将原生的 `useState` 表单管理替换为 React Hook Form，添加分类选择器到文章表单，并添加分类筛选器到列表。

**第六步：更新 seed.ts 以包含分类**

现在更新种子文章，使其包含 `categoryId`:

**步骤 8：更新博客页面** — 这是一个服务器组件，它直接从 Prisma 读取数据。我将为文章查询添加 `category include`，并添加一个分类过滤器（使用 Next.js 中的 `searchParams`）。

**步骤9：更新 PostCard 组件**，使其显示分类。

还需要更新 `PostList` 以使其匹配：

**步骤10：安装 react-hook-form 并验证构建**

现在我来尝试安装依赖并运行构建：

npm install 执行成功（已添加 404 个包），但 Prisma 的 postinstall 钩子被沙盒拦截了。让我手动运行 Prisma generate：

Prisma Client 已成功生成。沙盒错误仅与缓存文件有关，不影响生成。现在让我推送 DB schema 并验证构建：

预期的错误 — `DATABASE_URL` 未在沙盒环境中配置。这没关系；在运行时，它将从 `.env.production` 或 `.env` 文件中设置。我来检查一下现有的环境文件：

现在让我来尝试构建：

构建成功，没有错误。所有新路由均已识别：

- `/api/categories` — 新增
- `/api/categories/[id]` — 新增
- `/dashboard` — 已更新 (11.9 kB, 包含 React Hook Form)
- `/blog` — 已更新

文章分类功能已完成实现，构建验证通过。以下是所有改动的概览：

---

### 数据库层 (Prisma + SQLite)

**`lib/db/prisma/schema.prisma`** — 新增 `Category` 模型，给 `Post` 模型添加了 `categoryId` 外键：
- `Category` 有 `id`、`name`(唯一)、`posts` 关系、时间戳
- `Post.categoryId` 为可选字段（`String?`），关联到 `Category`，即一篇文章可以有零或一个分类

**`lib/db/seed.ts`** — 种子数据新增3个分类（Technology、Tutorial、News），并把示例文章关联到对应分类

### API 层 (Zod 验证风格)

**`app/api/categories/route.ts`** — 新建，分类 CRUD：
- `GET /api/categories` — 获取全部分类（含文章计数 `_count.posts`）
- `POST /api/categories` — 创建分类（Zod 验证 `name` 字段，唯一性检查）

**`app/api/categories/[id]/route.ts`** — 新建：
- `PUT /api/categories/[id]` — 更新分类名（唯一性检查）
- `DELETE /api/categories/[id]` — 删除分类

**`app/api/posts/route.ts`** — 更新：
- `createPostSchema` 新增 `categoryId: z.string().nullable().optional()`
- `GET` 支持 `?categoryId=xxx` 筛选参数
- 查询和创建时 `include: { category: true }`

**`app/api/posts/[id]/route.ts`** — 更新：
- `updatePostSchema` 新增 `categoryId`
- `GET`/`PUT` 查询时 `include: { category: true }`

### 类型定义

**`lib/types/post.ts`** — 新增 `Category`、`CategoryWithCount` 接口，`Post` 加上 `categoryId`，新增 `PostWithAuthorAndCategory`

### 前端

**`app/dashboard/page.tsx`** — 重点改动：
- **React Hook Form** 替代了原来的 `useState` 手动表单管理，用 `useForm<PostFormData>` 管理表单状态、验证和提交
- 创建/编辑文章表单新增 **Category 下拉选择器**
- 列表页新增 **"Filter by Category"** 筛选下拉框
- 表格新增 **Category 列**，显示分类标签或"Uncategorized"

**`app/blog/page.tsx`** — 更新：
- 接收 `searchParams.categoryId` 进行分类筛选
- 顶部显示分类标签按钮（All / Technology / Tutorial / News），点击切换筛选
- 文章卡片标题旁显示分类标签

**`components/features/posts/PostCard.tsx`** — 更新：接口支持 `category` 字段，标题旁显示分类徽章

**`components/features/posts/PostList.tsx`** — 更新：接口同步支持 `category` 字段

### 依赖

**`package.json`** — 新增 `react-hook-form: ^7.50.0`

---

部署前记得执行：
```bash
npx prisma db push    # 同步数据库 schema
npx prisma generate   # 生成 Prisma Client
npm run db:seed       # 重新种子数据（含分类）
```

