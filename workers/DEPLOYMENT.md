# 部署指南

## 前置要求

1. Cloudflare 账户
2. 已安装 Wrangler CLI (`npm install -g wrangler`)
3. 已登录 Cloudflare (`wrangler login`)

## 部署步骤

### 1. 创建 D1 数据库

```bash
cd workers
npm run db:create
```

命令执行后会输出类似以下内容：
```
✅ Successfully created DB 'sealmaker-db'!

[[d1_databases]]
binding = "DB"
database_name = "sealmaker-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

将 `database_id` 复制到 `wrangler.toml` 文件中。

### 2. 创建 R2 存储桶

在 Cloudflare Dashboard 中：
1. 进入 R2 页面
2. 点击 "Create bucket"
3. 输入 bucket 名称：`sealmaker-templates`
4. 选择位置（建议选择离用户最近的位置）
5. 创建

或者使用命令行：
```bash
wrangler r2 bucket create sealmaker-templates
```

### 3. 配置环境变量

编辑 `wrangler.toml`，设置 `JWT_SECRET`：

```toml
[vars]
JWT_SECRET = "your-strong-random-secret-key-here"
JWT_EXPIRES_IN = "7d"
```

**重要**：生产环境请使用强随机字符串作为 `JWT_SECRET`。可以使用以下命令生成：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. 运行数据库迁移

```bash
npm run db:migrate
```

这会执行 `migrations/0001_initial.sql` 创建数据库表结构。

### 5. 部署 Workers

```bash
npm run deploy
```

部署成功后，会显示 Workers 的 URL，例如：
```
https://sealmaker-api.your-subdomain.workers.dev
```

## 环境配置

### 开发环境

开发环境使用 `wrangler.toml` 中的 `[env.development]` 配置。

本地开发：
```bash
npm run dev
```

### 生产环境

生产环境使用 `wrangler.toml` 中的 `[env.production]` 配置。

部署到生产环境：
```bash
wrangler deploy --env production
```

## 验证部署

部署完成后，可以测试 API：

```bash
# 测试注册接口
curl -X POST https://sealmaker-api.your-subdomain.workers.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}'
```

## 常见问题

### 1. 数据库迁移失败

如果迁移失败，检查：
- `database_id` 是否正确配置
- 数据库是否已创建
- 是否有权限访问数据库

### 2. R2 存储桶访问失败

检查：
- R2 存储桶名称是否正确
- 存储桶是否已创建
- Workers 绑定配置是否正确

### 3. JWT 验证失败

检查：
- `JWT_SECRET` 是否已正确设置
- 请求头中是否包含 `Authorization: Bearer <token>`
- Token 是否已过期

## 监控和日志

在 Cloudflare Dashboard 中：
- Workers 页面可以查看请求日志
- Analytics 页面可以查看性能指标
- D1 页面可以查看数据库使用情况
- R2 页面可以查看存储使用情况

## 更新部署

当代码更新后，重新运行：

```bash
npm run deploy
```

如果需要更新数据库结构，创建新的迁移文件并运行：

```bash
npm run db:migrate
```

