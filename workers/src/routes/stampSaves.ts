// 印章保存记录路由

import { addCorsHeaders, handleCors } from '../middleware/cors';
import { createStampSave, getTodaySaveCount } from '../utils/db';
import type { Env, ApiResponse, SaveStampRequest, StampSaveResponse } from '../types';

/**
 * 获取客户端 IP 地址
 */
function getClientIp(request: Request): string {
  // 从 Cloudflare Workers 的请求头中获取真实 IP
  const cfConnectingIp = request.headers.get('CF-Connecting-IP');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // 从 X-Forwarded-For 头获取（如果有）
  const xForwardedFor = request.headers.get('X-Forwarded-For');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  // 从 X-Real-IP 头获取（如果有）
  const xRealIp = request.headers.get('X-Real-IP');
  if (xRealIp) {
    return xRealIp;
  }

  // 如果都没有，返回 unknown
  return 'unknown';
}

/**
 * 保存印章记录
 */
export async function handleSaveStamp(
  request: Request,
  env: Env,
  auth: { userId: string; email: string } | null
): Promise<Response> {
  // 处理 CORS
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const body: SaveStampRequest = await request.json();

    if (!body.image_base64) {
      const response: ApiResponse = {
        success: false,
        error: '缺少图片数据',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    // 验证 base64 格式（简单检查是否以 data:image 开头）
    if (!body.image_base64.startsWith('data:image/')) {
      const response: ApiResponse = {
        success: false,
        error: '图片数据格式错误，必须是 base64 格式的图片',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    // 获取客户端 IP
    const ipAddress = getClientIp(request);
    const userId = auth?.userId || null;
    const userEmail = auth?.email || null; // 从 auth 对象获取用户邮箱

    // 创建保存记录（包含用户 ID、IP 地址、图片 base64 和时间戳）
    const stampSave = await createStampSave(
      env.DB,
      userId,
      ipAddress,
      body.image_base64
    );

    const response: ApiResponse<StampSaveResponse> = {
      success: true,
      data: {
        id: stampSave.id,
        user_id: stampSave.user_id,
        user_email: userEmail, // 用户邮箱（如果已登录）
        ip_address: stampSave.ip_address, // IP 地址
        created_at: stampSave.created_at, // 保存时间（时间戳，毫秒）
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
    console.error('保存印章记录失败:', error);
    const response: ApiResponse = {
      success: false,
      error: '保存印章记录失败',
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
 * 获取今日保存次数
 */
export async function handleGetTodaySaveCount(
  request: Request,
  env: Env,
  auth: { userId: string; email: string } | null
): Promise<Response> {
  // 处理 CORS
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const ipAddress = getClientIp(request);
    const userId = auth?.userId || null;

    const count = await getTodaySaveCount(env.DB, userId, ipAddress);

    const response: ApiResponse<{ count: number }> = {
      success: true,
      data: { count },
    };

    return addCorsHeaders(
      new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
      request
    );
  } catch (error) {
    console.error('获取今日保存次数失败:', error);
    const response: ApiResponse = {
      success: false,
      error: '获取今日保存次数失败',
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

