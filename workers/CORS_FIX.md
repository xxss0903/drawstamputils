# CORS 问题修复说明

## 问题描述

在本地开发时，前端运行在 `http://localhost:5173`，访问部署在 `https://sealmaker-api.xxss0903.workers.dev` 的 API 时，遇到了 CORS 错误。

## 修复内容

### 1. 修复 CORS 中间件 (`workers/src/middleware/cors.ts`)

**问题**：当使用 `Access-Control-Allow-Credentials: true` 时，不能使用通配符 `*` 作为 `Access-Control-Allow-Origin` 的值。

**修复**：
- 当请求包含 `Origin` 头时，使用具体的 origin 值而不是通配符
- 只有在没有 origin 时才使用通配符（但此时不设置 credentials）

### 2. 更新前端 API 调用 (`src/utils/api.ts`)

添加了 `credentials: 'include'` 选项，允许发送 cookies 和 credentials。

## 测试步骤

### 1. 重新部署 Workers

```bash
cd workers
npm run deploy
```

### 2. 测试本地开发

1. 启动前端开发服务器：
```bash
npm run dev
```

2. 打开浏览器访问 `http://localhost:5173`

3. 尝试注册或登录，应该不再出现 CORS 错误

### 3. 验证 CORS 头

在浏览器开发者工具的 Network 标签中：

1. 查看 OPTIONS 预检请求的响应头，应该包含：
   - `Access-Control-Allow-Origin: http://localhost:5173`
   - `Access-Control-Allow-Credentials: true`
   - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
   - `Access-Control-Allow-Headers: Content-Type, Authorization`

2. 查看实际请求的响应头，应该包含：
   - `Access-Control-Allow-Origin: http://localhost:5173`
   - `Access-Control-Allow-Credentials: true`

## 注意事项

1. **生产环境**：如果前端部署在不同的域名，需要在 `workers/src/middleware/cors.ts` 中配置允许的 origins 列表，而不是使用通配符。

2. **开发环境**：当前配置允许所有 origin，这在开发时是安全的。生产环境应该限制为具体的域名。

3. **Credentials**：由于使用了 credentials，所有响应都必须包含具体的 origin，不能使用通配符。

## 如果仍有问题

1. 检查 Workers 是否已正确部署
2. 清除浏览器缓存
3. 检查浏览器控制台和 Network 标签中的错误信息
4. 确认 API 地址是否正确配置在 `src/utils/api.ts` 中

