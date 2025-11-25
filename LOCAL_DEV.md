# 本地开发配置指南

## 使用本地 Workers 开发服务器

### 1. 启动本地 Workers 服务器

在 `workers` 目录下运行：

```bash
cd workers
npm run dev
```

默认情况下，Workers 会在 `http://127.0.0.1:8787` 启动。

### 2. 启动前端开发服务器

在项目根目录运行：

```bash
npm run dev
```

前端会自动检测开发环境，并使用 `http://127.0.0.1:8787` 作为 API 地址。

### 3. 自定义 API 地址

如果需要使用不同的 API 地址，可以创建 `.env.local` 文件（在项目根目录）：

```bash
# .env.local
VITE_API_BASE_URL=http://127.0.0.1:8787
```

或者使用远程服务器：

```bash
# .env.local
VITE_API_BASE_URL=https://sealmaker-api.xxss0903.workers.dev
```

### 4. 配置说明

- **开发环境**：默认使用 `http://127.0.0.1:8787`（本地 Workers）
- **生产环境**：默认使用 `https://sealmaker-api.xxss0903.workers.dev`
- **环境变量**：如果设置了 `VITE_API_BASE_URL`，则优先使用环境变量的值

### 5. 注意事项

1. 确保本地 Workers 服务器已启动（`npm run dev` 在 workers 目录）
2. 确保本地 Workers 已配置好 D1 数据库和 R2 存储桶（在 `wrangler.toml` 中）
3. 如果遇到 CORS 错误，检查 Workers 的 CORS 配置是否正确
4. `.env.local` 文件不会被提交到 Git（已在 `.gitignore` 中）

### 6. 验证配置

在浏览器控制台中，你可以看到实际使用的 API 地址：

```javascript
console.log(import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8787 (dev)')
```

或者在 Network 标签中查看实际的请求 URL。

