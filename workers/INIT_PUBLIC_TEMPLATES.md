# 初始化公共模板

## 说明

这个文档说明如何将 R2 存储桶中 `templates/` 目录下的模板文件导入到公共模板数据库中。

## 前提条件

1. 模板文件已上传到 R2 存储桶的 `templates/` 目录
2. Workers 已部署或本地开发服务器正在运行
3. 数据库迁移已执行（包含 `public_templates` 表）

## 方法 1：使用管理脚本（推荐）

### 步骤

1. **启动 Workers 开发服务器**（如果使用本地）：
```bash
cd workers
npm run dev
```

2. **运行初始化脚本**：
```bash
# 使用本地开发服务器
npm run init:templates

# 或使用生产环境 API
API_URL=https://sealmaker-api.xxss0903.workers.dev npm run init:templates
```

脚本会自动：
- 列出 R2 中 `templates/` 目录下的所有 JSON 文件
- 读取每个文件的内容
- 从文件名或 JSON 配置中提取模板名称
- 将文件复制到 `public/` 目录
- 在数据库中创建公共模板记录（标记为系统模板）

### 脚本输出示例

```
开始初始化公共模板...
API URL: http://127.0.0.1:8787
✅ 初始化成功！
处理结果: 处理完成: 12 个成功, 0 个错误

成功处理的模板:
  - 原型印章: 成功 (ID: xxx-xxx-xxx)
  - 矩形印章: 成功 (ID: xxx-xxx-xxx)
  ...
```

## 方法 2：直接调用 API

如果脚本无法运行，可以直接调用 API：

```bash
curl -X POST http://127.0.0.1:8787/api/admin/init-public-templates \
  -H "Content-Type: application/json"
```

或使用生产环境：

```bash
curl -X POST https://sealmaker-api.xxss0903.workers.dev/api/admin/init-public-templates \
  -H "Content-Type: application/json"
```

## 方法 3：通过界面手动上传

1. 登录系统
2. 在编辑器页面加载每个模板
3. 在"我的模板"页面，点击"分享"按钮，将模板分享到公共模板

## 注意事项

- 系统模板的 `user_id` 应该为 `NULL`
- 系统模板的 `is_system` 应该为 `1` (true)
- 模板文件会被从 `templates/` 复制到 `public/` 目录
- 如果模板名称已存在，脚本会跳过该模板
- 脚本会自动从 JSON 文件中提取模板名称和描述（如果存在）

## 安全提示

⚠️ **重要**：`/api/admin/init-public-templates` 接口在生产环境中应该：
1. 添加管理员认证
2. 限制访问 IP
3. 或完全禁用，只在需要时临时启用

建议在生产环境中添加认证检查：

```typescript
// 在 handleInitPublicTemplates 函数开头添加
const adminToken = request.headers.get('X-Admin-Token');
if (adminToken !== env.ADMIN_TOKEN) {
  return new Response(JSON.stringify({ success: false, error: '未授权' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

## 推荐流程

1. 先部署 Workers 和数据库
2. 运行数据库迁移：`npm run db:migrate`
3. 使用管理脚本或手动上传方式初始化公共模板
4. 验证公共模板页面可以正常显示

## 注意事项

- 系统模板的 `user_id` 应该为 `NULL`
- 系统模板的 `is_system` 应该为 `1` (true)
- 确保模板文件已上传到 R2 存储桶
- 模板文件的 `r2_key` 应该以 `public/` 开头

