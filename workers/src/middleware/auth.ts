// 认证中间件

import { verifyToken, extractTokenFromHeader } from '../utils/jwt';
import type { Env, JWTPayload } from '../types';

export interface AuthContext {
  userId: string;
  email: string;
}

/**
 * 验证请求的认证信息
 */
export async function verifyAuth(request: Request, env: Env): Promise<AuthContext | null> {
  const authHeader = request.headers.get('Authorization');
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token, env.JWT_SECRET);
  
  if (!payload || !payload.userId || !payload.email) {
    return null;
  }

  return {
    userId: payload.userId,
    email: payload.email,
  };
}

/**
 * 认证中间件包装器
 */
export function withAuth(
  handler: (request: Request, env: Env, ctx: ExecutionContext, auth: AuthContext) => Promise<Response>
) {
  return async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> => {
    const auth = await verifyAuth(request, env);
    
    if (!auth) {
      return new Response(
        JSON.stringify({ success: false, error: '未授权访问' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return handler(request, env, ctx, auth);
  };
}

