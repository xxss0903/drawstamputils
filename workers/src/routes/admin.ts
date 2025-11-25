// 管理相关路由（用于初始化公共模板）

import { handleCors, addCorsHeaders } from '../middleware/cors';
import { createPublicTemplate } from '../utils/db';
import type { Env, ApiResponse } from '../types';

/**
 * 列出 R2 中的所有文件（调试用）
 */
export async function handleListR2Files(request: Request, env: Env): Promise<Response> {
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const url = new URL(request.url);
    const prefix = url.searchParams.get('prefix') || '';

    const objects = await env.TEMPLATES_BUCKET.list({ prefix });

    const files = objects.objects?.map(obj => ({
      key: obj.key,
      size: obj.size,
      uploaded: obj.uploaded,
    })) || [];

    const response: ApiResponse<{ files: any[]; total: number; prefix: string }> = {
      success: true,
      data: {
        files,
        total: files.length,
        prefix,
      },
    };

    return addCorsHeaders(
      new Response(JSON.stringify(response, null, 2), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
      request
    );
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `列出文件失败: ${error instanceof Error ? error.message : String(error)}`,
    };
    return addCorsHeaders(
      new Response(JSON.stringify(response), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }),
      request
    );
  }
}

/**
 * 初始化公共模板（从 R2 的 templates/ 目录）
 * 注意：这个接口应该在生产环境中禁用或添加管理员认证
 */
export async function handleInitPublicTemplates(request: Request, env: Env): Promise<Response> {
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    // 先列出所有文件，用于调试
    const allObjects = await env.TEMPLATES_BUCKET.list();
    
    // 列出 R2 中 templates/ 目录下的所有文件
    const objects = await env.TEMPLATES_BUCKET.list({ prefix: 'templates/' });

    // 如果 templates/ 下没有文件，尝试其他可能的路径
    if (!objects.objects || objects.objects.length === 0) {
      // 尝试列出所有文件，看看实际路径
      const debugInfo = {
        totalFiles: allObjects.objects?.length || 0,
        sampleKeys: allObjects.objects?.slice(0, 10).map(obj => obj.key) || [],
        templatesPrefixFiles: objects.objects?.length || 0,
      };

      const response: ApiResponse = {
        success: false,
        error: '未找到模板文件',
        data: debugInfo,
        message: `R2 中共有 ${debugInfo.totalFiles} 个文件。请检查文件路径是否正确。示例路径: ${debugInfo.sampleKeys.join(', ')}`,
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    const results = [];
    const errors = [];

    // 处理每个模板文件
    for (const obj of objects.objects) {
      try {
        // 跳过非 JSON 文件
        if (!obj.key.endsWith('.json')) {
          continue;
        }

        // 从 R2 读取文件
        const r2Object = await env.TEMPLATES_BUCKET.get(obj.key);
        if (!r2Object) {
          errors.push(`文件不存在: ${obj.key}`);
          continue;
        }

        const fileContent = await r2Object.text();
        let templateConfig: any;

        try {
          templateConfig = JSON.parse(fileContent);
        } catch (e) {
          errors.push(`JSON 解析失败: ${obj.key}`);
          continue;
        }

        // 从文件名或配置中获取模板名称
        const fileName = obj.key.split('/').pop() || '未命名模板';
        const templateName = templateConfig.name || fileName.replace('.json', '') || '未命名模板';
        const templateDescription = templateConfig.description || '';

        // 检查是否已存在同名模板
        const existingTemplates = await env.DB.prepare(
          `SELECT id FROM public_templates WHERE name = ? AND is_system = 1`
        ).bind(templateName).all();

        if (existingTemplates.results && existingTemplates.results.length > 0) {
          results.push({
            key: obj.key,
            name: templateName,
            status: '已存在',
            id: existingTemplates.results[0].id,
          });
          continue;
        }

        // 将文件复制到 public/ 目录
        const publicR2Key = `public/${crypto.randomUUID()}.json`;
        await env.TEMPLATES_BUCKET.put(publicR2Key, fileContent, {
          httpMetadata: {
            contentType: 'application/json',
          },
        });

        // 创建公共模板记录
        const publicTemplate = await createPublicTemplate(
          env.DB,
          null, // 系统模板，user_id 为 null
          templateName,
          templateDescription,
          publicR2Key,
          obj.size,
          true // 标记为系统模板
        );

        results.push({
          key: obj.key,
          name: templateName,
          status: '成功',
          id: publicTemplate.id,
        });
      } catch (error) {
        errors.push(`处理 ${obj.key} 时出错: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    const response: ApiResponse<{ results: any[]; errors: string[] }> = {
      success: true,
      data: {
        results,
        errors,
      },
      message: `处理完成: ${results.length} 个成功, ${errors.length} 个错误`,
    };

    return addCorsHeaders(
      new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
      request
    );
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `初始化失败: ${error instanceof Error ? error.message : String(error)}`,
    };
    return addCorsHeaders(
      new Response(JSON.stringify(response), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }),
      request
    );
  }
}

