/// <reference lib="dom" />
// Workers 入口文件

import { handleRegister, handleLogin, handleGetMe } from './routes/auth';
import {
  handleGetTemplates,
  handleGetTemplate,
  handleCreateTemplate,
  handleUpdateTemplate,
  handleDeleteTemplate,
  handleGetTemplatePreview,
} from './routes/templates';
import {
  handleGetPublicTemplates,
  handleGetPublicTemplate,
  handleShareTemplate,
  handleCollectTemplate,
  handleUncollectTemplate,
  handleGetCollections,
  handleGetPublicTemplatePreview,
} from './routes/publicTemplates';
import { handleInitPublicTemplates, handleListR2Files } from './routes/admin';
import { verifyAuth } from './middleware/auth';
import { handleCors, addCorsHeaders } from './middleware/cors';
import type { Env } from './types';

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    let path = url.pathname;
    if (path.length > 1 && path.endsWith('/')) {
      path = path.replace(/\/+$/, '');
    }

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

      const templatePreviewMatch = path.match(/^\/api\/templates\/([^/]+)\/preview$/);
      if (templatePreviewMatch && request.method === 'GET') {
        const templateId = templatePreviewMatch[1];
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
        return handleGetTemplatePreview(request, env, auth, templateId);
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

      // 公共模板路由
      if (path === '/api/public-templates' && request.method === 'GET') {
        const auth = await verifyAuth(request, env); // 可选认证
        return handleGetPublicTemplates(request, env, auth);
      }

      const publicTemplatePreviewMatch = path.match(/^\/api\/public-templates\/([^/]+)\/preview$/);
      if (publicTemplatePreviewMatch && request.method === 'GET') {
        const templateId = publicTemplatePreviewMatch[1];
        return handleGetPublicTemplatePreview(request, env, templateId);
      }

      if (path === '/api/public-templates/share' && request.method === 'POST') {
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
        return handleShareTemplate(request, env, auth);
      }

      if (path === '/api/collections' && request.method === 'GET') {
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
        return handleGetCollections(request, env, auth);
      }

      // 公共模板详情、收藏/取消收藏路由
      const publicTemplateMatch = path.match(/^\/api\/public-templates\/([^/]+)$/);
      if (publicTemplateMatch) {
        const templateId = publicTemplateMatch[1];
        const auth = await verifyAuth(request, env); // 可选认证

        if (request.method === 'GET') {
          return handleGetPublicTemplate(request, env, auth, templateId);
        }
      }

      const collectMatch = path.match(/^\/api\/public-templates\/([^/]+)\/(collect|uncollect)$/);
      if (collectMatch) {
        const templateId = collectMatch[1];
        const action = collectMatch[2];
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

        if (action === 'collect') {
          return handleCollectTemplate(request, env, auth, templateId);
        } else if (action === 'uncollect') {
          return handleUncollectTemplate(request, env, auth, templateId);
        }
      }

      // 管理接口
      if (path === '/api/admin/list-files' && request.method === 'GET') {
        // 列出 R2 文件（调试用）
        return handleListR2Files(request, env);
      }

      if (path === '/api/admin/init-public-templates' && request.method === 'POST') {
        // 注意：生产环境应该添加管理员认证
        return handleInitPublicTemplates(request, env);
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

