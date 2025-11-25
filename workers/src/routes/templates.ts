// 模板管理路由

import { verifyAuth } from '../middleware/auth';
import { handleCors, addCorsHeaders } from '../middleware/cors';
import { validateTemplateName, validateFileSize, validateFileType } from '../utils/validation';
import {
  createTemplate,
  getUserTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  getPublicTemplateBySourceTemplateId,
  deletePublicTemplate,
  getUserTemplateCount,
} from '../utils/db';
import type { Env, TemplateResponse, ApiResponse, UpdateTemplateRequest } from '../types';

/**
 * 获取用户模板列表
 */
export async function handleGetTemplates(request: Request, env: Env, auth: { userId: string }): Promise<Response> {
  // 处理 CORS
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const templates = await getUserTemplates(env.DB, auth.userId);

    const response: ApiResponse<TemplateResponse[]> = {
      success: true,
      data: templates.map(t => ({
        id: t.id,
        user_id: t.user_id,
        name: t.name,
        description: t.description,
        file_size: t.file_size,
        created_at: t.created_at,
        updated_at: t.updated_at,
      })),
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
      error: '获取模板列表失败',
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
 * 获取模板详情
 */
export async function handleGetTemplate(request: Request, env: Env, auth: { userId: string }, templateId: string): Promise<Response> {
  // 处理 CORS
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const template = await getTemplateById(env.DB, templateId);
    
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

    // 检查权限
    if (template.user_id !== auth.userId) {
      const response: ApiResponse = {
        success: false,
        error: '无权访问此模板',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

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

    const response: ApiResponse<TemplateResponse & { content: string }> = {
      success: true,
      data: {
        id: template.id,
        user_id: template.user_id,
        name: template.name,
        description: template.description,
        file_size: template.file_size,
        created_at: template.created_at,
        updated_at: template.updated_at,
        content: fileContent,
      },
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

/**
 * 上传新模板
 */
export async function handleCreateTemplate(request: Request, env: Env, auth: { userId: string }): Promise<Response> {
  // 处理 CORS
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    // 限制每个用户最多保存 5 个模板
    const templateCount = await getUserTemplateCount(env.DB, auth.userId);
    if (templateCount >= 5) {
      const response: ApiResponse = {
        success: false,
        error: '模板数量已达到上限（最多 5 个）',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null;
    const file = formData.get('file') as File;

    if (!name || !file) {
      const response: ApiResponse = {
        success: false,
        error: '模板名称和文件都是必填项',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    // 验证模板名称
    const nameValidation = validateTemplateName(name);
    if (!nameValidation.valid) {
      const response: ApiResponse = {
        success: false,
        error: nameValidation.error,
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    // 验证文件类型
    const fileTypeValidation = validateFileType(file.type);
    if (!fileTypeValidation.valid) {
      const response: ApiResponse = {
        success: false,
        error: fileTypeValidation.error,
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    // 验证文件大小（最大 10MB）
    const fileSizeValidation = validateFileSize(file.size, 10 * 1024 * 1024);
    if (!fileSizeValidation.valid) {
      const response: ApiResponse = {
        success: false,
        error: fileSizeValidation.error,
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    // 生成 R2 存储键
    const r2Key = `${auth.userId}/${crypto.randomUUID()}.json`;

    // 上传到 R2
    await env.TEMPLATES_BUCKET.put(r2Key, file, {
      httpMetadata: {
        contentType: 'application/json',
      },
    });

    // 保存到数据库
    const template = await createTemplate(
      env.DB,
      auth.userId,
      name,
      description || undefined,
      r2Key,
      file.size
    );

    const response: ApiResponse<TemplateResponse> = {
      success: true,
      data: {
        id: template.id,
        user_id: template.user_id,
        name: template.name,
        description: template.description,
        file_size: template.file_size,
        created_at: template.created_at,
        updated_at: template.updated_at,
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
      error: '上传模板失败',
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
 * 更新模板信息
 */
export async function handleUpdateTemplate(
  request: Request,
  env: Env,
  auth: { userId: string },
  templateId: string
): Promise<Response> {
  // 处理 CORS
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    // 检查模板是否存在且属于当前用户
    const template = await getTemplateById(env.DB, templateId);
    
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

    if (template.user_id !== auth.userId) {
      const response: ApiResponse = {
        success: false,
        error: '无权修改此模板',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    const body: UpdateTemplateRequest = await request.json();

    // 验证模板名称（如果提供）
    if (body.name !== undefined) {
      const nameValidation = validateTemplateName(body.name);
      if (!nameValidation.valid) {
        const response: ApiResponse = {
          success: false,
          error: nameValidation.error,
        };
        return addCorsHeaders(
          new Response(JSON.stringify(response), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }),
          request
        );
      }
    }

    // 更新模板
    const success = await updateTemplate(env.DB, templateId, body.name, body.description);

    if (!success) {
      const response: ApiResponse = {
        success: false,
        error: '更新模板失败',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    // 获取更新后的模板
    const updatedTemplate = await getTemplateById(env.DB, templateId);

    const response: ApiResponse<TemplateResponse> = {
      success: true,
      data: {
        id: updatedTemplate!.id,
        user_id: updatedTemplate!.user_id,
        name: updatedTemplate!.name,
        description: updatedTemplate!.description,
        file_size: updatedTemplate!.file_size,
        created_at: updatedTemplate!.created_at,
        updated_at: updatedTemplate!.updated_at,
      },
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
      error: '更新模板失败',
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
 * 删除模板
 */
export async function handleDeleteTemplate(
  request: Request,
  env: Env,
  auth: { userId: string },
  templateId: string
): Promise<Response> {
  // 处理 CORS
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    // 检查模板是否存在且属于当前用户
    const template = await getTemplateById(env.DB, templateId);
    
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

    if (template.user_id !== auth.userId) {
      const response: ApiResponse = {
        success: false,
        error: '无权删除此模板',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    // 从 R2 删除文件
    await env.TEMPLATES_BUCKET.delete(template.r2_key);

    // 如果模板已分享，删除公共模板及其文件
    const sharedTemplate = await getPublicTemplateBySourceTemplateId(env.DB, templateId);
    if (sharedTemplate) {
      try {
        await env.TEMPLATES_BUCKET.delete(sharedTemplate.r2_key);
      } catch (err) {
        console.error('删除共享模板文件失败:', err);
      }

      const sharedDeleted = await deletePublicTemplate(env.DB, sharedTemplate.id);
      if (!sharedDeleted) {
        console.warn(`删除共享模板记录失败: ${sharedTemplate.id}`);
      }
    }

    // 从数据库删除记录
    const success = await deleteTemplate(env.DB, templateId);

    if (!success) {
      const response: ApiResponse = {
        success: false,
        error: '删除模板失败',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    const response: ApiResponse = {
      success: true,
      message: '模板已删除',
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
      error: '删除模板失败',
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

