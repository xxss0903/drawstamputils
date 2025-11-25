# SealMaker Cloudflare Workers API

这是一个用于管理印章模板的 Cloudflare Workers 后端 API，提供用户认证、模板上传、管理和使用功能。

## 功能特性

- 用户注册和登录（邮箱 + 密码）
- JWT 认证
- 模板上传到 Cloudflare R2
- 模板列表查询
- 模板详情获取
- 模板信息更新
- 模板删除
- CORS 支持

## 技术栈

- Cloudflare Workers
- Cloudflare D1 (SQLite 数据库)
- Cloudflare R2 (对象存储)
- TypeScript
- JWT 认证
- PBKDF2 密码加密

## 项目结构

```
workers/
├── src/
│   ├── index.ts              # Workers 入口
│   ├── routes/               # 路由处理
│   │   ├── auth.ts          # 认证相关路由
│   │   └── templates.ts     # 模板管理路由
│   ├── middleware/          # 中间件
│   │   ├── auth.ts          # JWT 验证中间件
│   │   └── cors.ts          # CORS 处理
│   ├── utils/               # 工具函数
│   │   ├── db.ts           # 数据库操作
│   │   ├── jwt.ts          # JWT 工具
│   │   ├── password.ts     # 密码加密
│   │   └── validation.ts   # 数据验证
│   └── types.ts            # 类型定义
├── migrations/             # 数据库迁移文件
│   └── 0001_initial.sql
├── wrangler.toml           # Workers 配置
├── package.json            # 依赖管理
└── tsconfig.json           # TypeScript 配置
```

## 安装和配置

### 1. 安装依赖

```bash
cd workers
npm install
```

### 2. 创建 D1 数据库

```bash
npm run db:create
```

这会在 Cloudflare 中创建一个名为 `sealmaker-db` 的 D1 数据库。创建后，将返回的 `database_id` 填入 `wrangler.toml` 中的 `database_id` 字段。

### 3. 创建 R2 存储桶

在 Cloudflare Dashboard 中创建 R2 存储桶，命名为 `sealmaker-templates`，或修改 `wrangler.toml` 中的 `bucket_name`。

### 4. 配置环境变量

在 `wrangler.toml` 中设置 `JWT_SECRET`（生产环境建议使用强随机字符串）。

### 5. 运行数据库迁移

```bash
npm run db:migrate
```

## 开发

### 本地开发

```bash
npm run dev
```

### 部署

```bash
npm run deploy
```

## API 端点

### 认证相关

#### 用户注册
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 用户登录
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

响应：
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com"
    }
  }
}
```

#### 获取当前用户信息
```
GET /api/auth/me
Authorization: Bearer <token>
```

### 模板管理

#### 获取模板列表
```
GET /api/templates
Authorization: Bearer <token>
```

#### 获取模板详情
```
GET /api/templates/:id
Authorization: Bearer <token>
```

#### 上传模板
```
POST /api/templates
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: "模板名称"
description: "模板描述（可选）"
file: <JSON文件>
```

#### 更新模板信息
```
PUT /api/templates/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "新名称",
  "description": "新描述"
}
```

#### 删除模板
```
DELETE /api/templates/:id
Authorization: Bearer <token>
```

## 响应格式

所有 API 响应都遵循以下格式：

成功响应：
```json
{
  "success": true,
  "data": { ... }
}
```

错误响应：
```json
{
  "success": false,
  "error": "错误信息"
}
```

## 安全说明

- 密码使用 PBKDF2 算法加密存储
- JWT token 用于用户认证
- 所有需要认证的接口都需要在请求头中携带 `Authorization: Bearer <token>`
- 模板文件存储在 R2 中，只有模板所有者可以访问

## 注意事项

1. 确保在生产环境中设置强密码的 `JWT_SECRET`
2. 模板文件大小限制为 10MB
3. 只支持 JSON 格式的模板文件
4. 所有 API 都支持 CORS，可以在前端直接调用

