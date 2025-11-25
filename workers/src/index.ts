// Workers 入口文件

import { handleRegister, handleLogin, handleGetMe } from './routes/auth';
import {
  handleGetTemplates,
  handleGetTemplate,
  handleCreateTemplate,
  handleUpdateTemplate,
  handleDeleteTemplate,
} from './routes/templates';
import { verifyAuth } from './middleware/auth';
import { handleCors, addCorsHeaders } from './middleware/cors';
import type { Env } from './types';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return handleCors(request) || new Response(null, { status: 204 });
    }

    // 路由处理
    try {
      // 认证相关路由
      if (path === '/api/auth/register' && request.method === 'POST') {
        return handleRegister(request, env);
      }

      if (path === '/api/auth/login' && request.method === 'POST') {
        return handleLogin(request, env);
      }

      if (path === '/api/auth/me' && request.method === 'GET') {
        const auth = await verifyAuth(request, env);
        if (!auth) {
          return addCorsHeaders(
            new Response(
              JSON.stringify({ success: false, error: '未授权访问' }),
              {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
              }
            ),
            request
          );
        }
        return handleGetMe(request, env, auth);
      }

      // 模板管理路由
      if (path === '/api/templates' && request.method === 'GET') {
        const auth = await verifyAuth(request, env);
        if (!auth) {
          return addCorsHeaders(
            new Response(
              JSON.stringify({ success: false, error: '未授权访问' }),
              {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
              }
            ),
            request
          );
        }
        return handleGetTemplates(request, env, auth);
      }

      if (path === '/api/templates' && request.method === 'POST') {
        const auth = await verifyAuth(request, env);
        if (!auth) {
          return addCorsHeaders(
            new Response(
              JSON.stringify({ success: false, error: '未授权访问' }),
              {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
              }
            ),
            request
          );
        }
        return handleCreateTemplate(request, env, auth);
      }

      // 模板详情、更新、删除路由
      const templateMatch = path.match(/^\/api\/templates\/([^/]+)$/);
      if (templateMatch) {
        const templateId = templateMatch[1];
        const auth = await verifyAuth(request, env);
        
        if (!auth) {
          return addCorsHeaders(
            new Response(
              JSON.stringify({ success: false, error: '未授权访问' }),
              {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
              }
            ),
            request
          );
        }

        if (request.method === 'GET') {
          return handleGetTemplate(request, env, auth, templateId);
        }

        if (request.method === 'PUT') {
          return handleUpdateTemplate(request, env, auth, templateId);
        }

        if (request.method === 'DELETE') {
          return handleDeleteTemplate(request, env, auth, templateId);
        }
      }

      // 404 处理
      return addCorsHeaders(
        new Response(
          JSON.stringify({ success: false, error: '接口不存在' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        ),
        request
      );
    } catch (error) {
      console.error('Error handling request:', error);
      return addCorsHeaders(
        new Response(
          JSON.stringify({ success: false, error: '服务器内部错误' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        ),
        request
      );
    }
  },
};

