# 部署 stamp_saves 表到生产环境

本指南说明如何将 `stamp_saves` 表部署到生产环境。

## 前置要求

1. **Cloudflare 账户**：确保已登录
2. **Wrangler CLI**：已安装并登录
   ```bash
   npm install -g wrangler
   wrangler login
   ```
3. **数据库已创建**：确保 D1 数据库 `sealmaker-db` 已创建
4. **wrangler.toml 配置**：确保 `database_id` 已正确配置

## 部署步骤

### 1. 检查当前数据库状态

首先，检查数据库是否已存在 `stamp_saves` 表：

```bash
cd workers
wrangler d1 execute sealmaker-db --command "SELECT name FROM sqlite_master WHERE type='table' AND name='stamp_saves';"
```

如果表已存在，会显示表名；如果不存在，则无输出。

### 2. 运行数据库迁移

Wrangler 会按顺序执行 `migrations/` 目录下的所有迁移文件。`stamp_saves` 表相关的迁移文件包括：

- `0005_stamp_saves.sql` - 创建初始表结构
- `0006_update_stamp_saves_to_image_base64.sql` - 更新表结构（如果表已存在会删除重建）

**执行迁移：**

```bash
cd workers
npm run db:migrate
```

或者直接使用 wrangler 命令：

```bash
wrangler d1 migrations apply sealmaker-db
```

**注意**：如果这是首次部署，迁移会按顺序执行所有迁移文件（0001-0006）。如果表已存在，`0006` 迁移会删除旧表并重建。

### 3. 验证表结构

迁移完成后，验证表是否正确创建：

```bash
# 查看表结构
wrangler d1 execute sealmaker-db --command "PRAGMA table_info(stamp_saves);"

# 查看索引
wrangler d1 execute sealmaker-db --command "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='stamp_saves';"
```

预期输出应该包含以下字段：
- `id` (TEXT PRIMARY KEY)
- `user_id` (TEXT)
- `ip_address` (TEXT)
- `image_base64` (TEXT NOT NULL)
- `created_at` (INTEGER NOT NULL)

以及以下索引：
- `idx_stamp_saves_user_id`
- `idx_stamp_saves_ip_address`
- `idx_stamp_saves_created_at`

### 4. 部署 Workers（如果需要）

如果代码有更新，需要重新部署 Workers：

```bash
# 部署到生产环境
wrangler deploy --env production

# 或者使用默认环境
npm run deploy
```

### 5. 测试 API

部署完成后，测试 `stamp_saves` 相关的 API：

```bash
# 保存印章（需要先登录获取 token）
curl -X POST https://your-api-url.workers.dev/api/stamp-saves \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "image_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }'
```

## 迁移文件说明

### 0005_stamp_saves.sql
创建 `stamp_saves` 表的初始结构，包含：
- 主键 `id`
- 用户 ID（可为空）
- IP 地址
- 图片 base64 数据
- 创建时间戳
- 相关索引

### 0006_update_stamp_saves_to_image_base64.sql
更新表结构，将字段从 `stamp_config` 改为 `image_base64`。

**重要**：此迁移会删除旧表并重建，**会丢失所有现有数据**。如果生产环境已有重要数据，请先备份。

## 生产环境注意事项

### 1. 数据备份

在执行 `0006` 迁移前（如果表已存在），建议先备份数据：

```bash
# 方法1：导出为 JSON 格式（推荐）
wrangler d1 execute sealmaker-db --command "SELECT * FROM stamp_saves;" --json > stamp_saves_backup.json

# 方法2：导出为文本格式（默认格式）
wrangler d1 execute sealmaker-db --command "SELECT * FROM stamp_saves;" > stamp_saves_backup.txt
```

**注意**：
- 使用 `--json` 参数（不是 `--output`）来获取 JSON 格式输出
- 如果表为空或不存在，命令会正常执行但不会输出数据
- 在 Windows PowerShell 中，重定向符号 `>` 可以正常使用

### 2. 迁移顺序

Wrangler 会按文件名顺序执行迁移。确保迁移文件命名正确：
- `0005_stamp_saves.sql`
- `0006_update_stamp_saves_to_image_base64.sql`

### 3. 回滚方案

如果需要回滚，可以：

1. **删除表**（会丢失数据）：
   ```bash
   wrangler d1 execute sealmaker-db --command "DROP TABLE IF EXISTS stamp_saves;"
   ```

2. **重新运行迁移**：
   ```bash
   npm run db:migrate
   ```

### 4. 监控

部署后，在 Cloudflare Dashboard 中监控：
- **D1 数据库**：查看数据库使用情况和查询性能
- **Workers 日志**：查看 API 请求和错误日志
- **Analytics**：查看 API 调用统计

## 常见问题

### Q: 迁移失败怎么办？

**A:** 检查：
1. 是否已登录 Cloudflare (`wrangler login`)
2. `database_id` 是否正确
3. 是否有权限访问数据库
4. 查看错误日志：`wrangler d1 migrations list sealmaker-db`

### Q: 表已存在但结构不同怎么办？

**A:** `0006` 迁移会自动删除旧表并重建。如果担心数据丢失，请先备份。

### Q: 如何查看已执行的迁移？

**A:** 
```bash
wrangler d1 migrations list sealmaker-db
```

### Q: 备份命令报错 "Unknown argument: output"？

**A:** `wrangler d1 execute` 不支持 `--output` 参数，应该使用 `--json` 参数：

```bash
# 正确的方式
wrangler d1 execute sealmaker-db --command "SELECT * FROM stamp_saves;" --json > backup.json

# 错误的方式（会报错）
wrangler d1 execute sealmaker-db --command "SELECT * FROM stamp_saves;" --output json > backup.json
```

### Q: 生产环境迁移会影响服务吗？

**A:** 迁移执行时间很短（通常几秒），但建议在低峰期执行。迁移期间，相关的 API 操作可能会短暂失败。

## 完整部署命令总结

```bash
# 1. 进入 workers 目录
cd workers

# 2. 检查登录状态
wrangler whoami

# 3. 运行迁移
npm run db:migrate

# 4. 验证表结构
wrangler d1 execute sealmaker-db --command "PRAGMA table_info(stamp_saves);"

# 5. 部署 Workers（如果需要）
wrangler deploy --env production
```

## 相关文件

- 迁移文件：`workers/migrations/0005_stamp_saves.sql`
- 迁移文件：`workers/migrations/0006_update_stamp_saves_to_image_base64.sql`
- API 路由：`workers/src/routes/stampSaves.ts`
- 数据库工具：`workers/src/utils/db.ts`
- 部署配置：`workers/wrangler.toml`

