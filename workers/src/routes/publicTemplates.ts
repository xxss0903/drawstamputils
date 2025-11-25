// 公共模板相关路由

import { verifyAuth } from '../middleware/auth';
import { handleCors, addCorsHeaders } from '../middleware/cors';
import {
  createPublicTemplate,
  getPublicTemplates,
  getPublicTemplateById,
  getPublicTemplateBySourceTemplateId,
  incrementPublicTemplateViewCount,
  collectTemplate,
  uncollectTemplate,
  isTemplateCollected,
  getUserCollections,
  getTemplateById,
  getUserSharedPublicTemplateCount,
} from '../utils/db';
import { findUserById } from '../utils/db';
import type { Env, PublicTemplateResponse, ApiResponse, ShareTemplateRequest } from '../types';

const buildPublicTemplatePreviewUrl = (request: Request, templateId: string) => {
  const base = new URL(request.url);
  base.pathname = `/api/public-templates/${templateId}/preview`;
  base.search = '';
  return base.toString();
};

/**
 * 获取公共模板列表
 */
export async function handleGetPublicTemplates(request: Request, env: Env, auth: { userId: string } | null): Promise<Response> {
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const orderBy = (url.searchParams.get('orderBy') || 'created_at') as 'created_at' | 'collect_count' | 'view_count';

    const templates = await getPublicTemplates(env.DB, limit, offset, orderBy);

    // 如果用户已登录，检查是否已收藏
    const templatesWithCollectionStatus: PublicTemplateResponse[] = await Promise.all(
      templates.map(async (template) => {
        const response: PublicTemplateResponse = {
          id: template.id,
          user_id: template.user_id,
          source_template_id: template.source_template_id,
          name: template.name,
          description: template.description,
          file_size: template.file_size,
          is_system: template.is_system,
          view_count: template.view_count,
          collect_count: template.collect_count,
          created_at: template.created_at,
          updated_at: template.updated_at,
          is_collected: false,
          preview_url: template.preview_r2_key ? buildPublicTemplatePreviewUrl(request, template.id) : undefined,
        };

        if (auth) {
          response.is_collected = await isTemplateCollected(env.DB, auth.userId, template.id);
        }

        // 如果有分享者，获取分享者邮箱
        if (template.user_id) {
          const user = await findUserById(env.DB, template.user_id);
          if (user) {
            response.author_email = user.email;
          }
        }

        return response;
      })
    );

    const response: ApiResponse<PublicTemplateResponse[]> = {
      success: true,
      data: templatesWithCollectionStatus,
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
      error: '获取公共模板列表失败',
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
 * 获取公共模板详情
 */
export async function handleGetPublicTemplate(
  request: Request,
  env: Env,
  auth: { userId: string } | null,
  templateId: string
): Promise<Response> {
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const template = await getPublicTemplateById(env.DB, templateId);

    if (!template) {
      const response: ApiResponse = {
        success: false,
        error: '模板不存在',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    // 增加查看次数
    await incrementPublicTemplateViewCount(env.DB, templateId);

    // 从 R2 获取文件内容
    const r2Object = await env.TEMPLATES_BUCKET.get(template.r2_key);

    if (!r2Object) {
      const response: ApiResponse = {
        success: false,
        error: '模板文件不存在',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    const fileContent = await r2Object.text();

    const templateResponse: PublicTemplateResponse & { content: string } = {
      id: template.id,
      user_id: template.user_id,
      source_template_id: template.source_template_id,
      name: template.name,
      description: template.description,
      file_size: template.file_size,
      is_system: template.is_system,
      view_count: template.view_count + 1, // 已增加
      collect_count: template.collect_count,
      created_at: template.created_at,
      updated_at: template.updated_at,
      content: fileContent,
      is_collected: false,
      preview_url: template.preview_r2_key ? buildPublicTemplatePreviewUrl(request, template.id) : undefined,
    };

    // 如果用户已登录，检查是否已收藏
    if (auth) {
      templateResponse.is_collected = await isTemplateCollected(env.DB, auth.userId, templateId);
    }

    // 如果有分享者，获取分享者邮箱
    if (template.user_id) {
      const user = await findUserById(env.DB, template.user_id);
      if (user) {
        templateResponse.author_email = user.email;
      }
    }

    const response: ApiResponse<PublicTemplateResponse & { content: string }> = {
      success: true,
      data: templateResponse,
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
      error: '获取模板详情失败',
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

export async function handleGetPublicTemplatePreview(request: Request, env: Env, templateId: string): Promise<Response> {
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const template = await getPublicTemplateById(env.DB, templateId);
    if (!template) {
      return addCorsHeaders(
        new Response(JSON.stringify({ success: false, error: '模板不存在' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    if (!template.preview_r2_key) {
      return addCorsHeaders(
        new Response(JSON.stringify({ success: false, error: '预览图不存在' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    const r2Object = await env.TEMPLATES_BUCKET.get(template.preview_r2_key);
    if (!r2Object || !r2Object.body) {
      return addCorsHeaders(
        new Response(JSON.stringify({ success: false, error: '预览图不存在' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    return addCorsHeaders(
      new Response(r2Object.body, {
        status: 200,
        headers: {
          'Content-Type': r2Object.httpMetadata?.contentType || 'image/png',
          'Cache-Control': 'public, max-age=31536000',
        },
      }),
      request
    );
  } catch (error) {
    return addCorsHeaders(
      new Response(JSON.stringify({ success: false, error: '获取预览图失败' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }),
      request
    );
  }
}

/**
 * 分享模板到公共模板
 */
export async function handleShareTemplate(request: Request, env: Env, auth: { userId: string }): Promise<Response> {
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const body: ShareTemplateRequest = await request.json();

    const sharedCount = await getUserSharedPublicTemplateCount(env.DB, auth.userId);
    if (sharedCount >= 5) {
      const response: ApiResponse = {
        success: false,
        error: '分享数量已达到上限（最多 5 个）',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    // 获取用户的模板
    const userTemplate = await getTemplateById(env.DB, body.template_id);
    // 检查是否已经分享过
    const existingPublicTemplate = await getPublicTemplateBySourceTemplateId(env.DB, body.template_id);
    if (existingPublicTemplate) {
      const response: ApiResponse = {
        success: false,
        error: '该模板已分享至公共模板',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }


    if (!userTemplate) {
      const response: ApiResponse = {
        success: false,
        error: '模板不存在',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    // 检查权限
    if (userTemplate.user_id !== auth.userId) {
      const response: ApiResponse = {
        success: false,
        error: '无权分享此模板',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    // 从 R2 复制文件到公共模板存储
    const sourceObject = await env.TEMPLATES_BUCKET.get(userTemplate.r2_key);
    if (!sourceObject) {
      const response: ApiResponse = {
        success: false,
        error: '模板文件不存在',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    const fileContent = await sourceObject.text();
    const publicR2Key = `public/${crypto.randomUUID()}.json`;

    let publicPreviewR2Key: string | null = null;
    if (userTemplate.preview_r2_key) {
      try {
        const previewObject = await env.TEMPLATES_BUCKET.get(userTemplate.preview_r2_key);
        if (previewObject && previewObject.body) {
          const ext = userTemplate.preview_r2_key.split('.').pop() || 'png';
          publicPreviewR2Key = `public/previews/${crypto.randomUUID()}.${ext}`;
          await env.TEMPLATES_BUCKET.put(publicPreviewR2Key, previewObject.body, {
            httpMetadata: previewObject.httpMetadata,
          });
        }
      } catch (error) {
        console.error('复制预览图失败:', error);
      }
    }

    // 上传到 R2
    await env.TEMPLATES_BUCKET.put(publicR2Key, fileContent, {
      httpMetadata: {
        contentType: 'application/json',
      },
    });

    // 创建公共模板记录
    const publicTemplate = await createPublicTemplate(
      env.DB,
      auth.userId,
      body.name || userTemplate.name,
      body.description || userTemplate.description,
      publicR2Key,
      publicPreviewR2Key,
      userTemplate.file_size,
      false,
      body.template_id
    );

    const response: ApiResponse<PublicTemplateResponse> = {
      success: true,
      data: {
        id: publicTemplate.id,
        user_id: publicTemplate.user_id,
        source_template_id: publicTemplate.source_template_id,
        name: publicTemplate.name,
        description: publicTemplate.description,
        file_size: publicTemplate.file_size,
        is_system: publicTemplate.is_system,
        view_count: publicTemplate.view_count,
        collect_count: publicTemplate.collect_count,
        created_at: publicTemplate.created_at,
        updated_at: publicTemplate.updated_at,
        preview_url: publicTemplate.preview_r2_key ? buildPublicTemplatePreviewUrl(request, publicTemplate.id) : undefined,
      },
    };

    return addCorsHeaders(
      new Response(JSON.stringify(response), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
      request
    );
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: '分享模板失败',
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
 * 收藏模板
 */
export async function handleCollectTemplate(
  request: Request,
  env: Env,
  auth: { userId: string },
  templateId: string
): Promise<Response> {
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const success = await collectTemplate(env.DB, auth.userId, templateId);

    if (!success) {
      const response: ApiResponse = {
        success: false,
        error: '模板已收藏或不存在',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    const response: ApiResponse = {
      success: true,
      message: '收藏成功',
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
      error: '收藏失败',
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
 * 取消收藏模板
 */
export async function handleUncollectTemplate(
  request: Request,
  env: Env,
  auth: { userId: string },
  templateId: string
): Promise<Response> {
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const success = await uncollectTemplate(env.DB, auth.userId, templateId);

    if (!success) {
      const response: ApiResponse = {
        success: false,
        error: '取消收藏失败',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    const response: ApiResponse = {
      success: true,
      message: '取消收藏成功',
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
      error: '取消收藏失败',
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
 * 获取用户收藏的模板列表
 */
export async function handleGetCollections(request: Request, env: Env, auth: { userId: string }): Promise<Response> {
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const templates = await getUserCollections(env.DB, auth.userId);

    const templatesWithCollectionStatus: PublicTemplateResponse[] = templates.map((template) => ({
      id: template.id,
      user_id: template.user_id,
      source_template_id: template.source_template_id,
      name: template.name,
      description: template.description,
      file_size: template.file_size,
      is_system: template.is_system,
      view_count: template.view_count,
      collect_count: template.collect_count,
      created_at: template.created_at,
      updated_at: template.updated_at,
      is_collected: true, // 收藏列表中的都是已收藏的
      preview_url: template.preview_r2_key ? buildPublicTemplatePreviewUrl(request, template.id) : undefined,
    }));

    const response: ApiResponse<PublicTemplateResponse[]> = {
      success: true,
      data: templatesWithCollectionStatus,
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
      error: '获取收藏列表失败',
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

