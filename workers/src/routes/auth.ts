// 认证相关路由

import { createToken } from '../utils/jwt';
import { hashPassword, verifyPassword } from '../utils/password';
import { validateEmail, validatePassword } from '../utils/validation';
import { createUser, findUserByEmail, findUserById } from '../utils/db';
import { handleCors, addCorsHeaders } from '../middleware/cors';
import type { Env, RegisterRequest, LoginRequest, AuthResponse, ApiResponse } from '../types';

/**
 * 用户注册
 */
export async function handleRegister(request: Request, env: Env): Promise<Response> {
  // 处理 CORS
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    let body: RegisterRequest;
    try {
      body = await request.json();
    } catch {
      const response: ApiResponse = {
        success: false,
        error: '请求体必须是 JSON',
        code: 'invalid_json',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    if (!body || typeof body.email !== 'string' || typeof body.password !== 'string') {
      const response: ApiResponse = {
        success: false,
        error: '参数错误',
        code: 'invalid_params',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    // 验证邮箱
    if (!validateEmail(body.email)) {
      const response: ApiResponse = {
        success: false,
        error: '邮箱格式不正确',
        code: 'invalid_email',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    // 验证密码
    const passwordValidation = validatePassword(body.password);
    if (!passwordValidation.valid) {
      const response: ApiResponse = {
        success: false,
        error: passwordValidation.error,
        code: 'invalid_password',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    // 检查用户是否已存在
    const existingUser = await findUserByEmail(env.DB, body.email);
    if (existingUser) {
      const response: ApiResponse = {
        success: false,
        error: '该邮箱已被注册',
        code: 'email_exists',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    // 创建用户
    const passwordHash = await hashPassword(body.password);
    let user;
    try {
      user = await createUser(env.DB, body.email, passwordHash);
    } catch (error) {
      if (error instanceof Error && error.message === 'USER_EMAIL_EXISTS') {
        const response: ApiResponse = {
          success: false,
          error: '该邮箱已被注册',
          code: 'email_exists',
        };
        return addCorsHeaders(
          new Response(JSON.stringify(response), {
            status: 409,
            headers: { 'Content-Type': 'application/json' },
          }),
          request
        );
      }
      throw error;
    }

    // 生成 token
    const token = await createToken(
      { userId: user.id, email: user.email },
      env.JWT_SECRET,
      env.JWT_EXPIRES_IN
    );

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
        },
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
    const requestId = crypto.randomUUID();
    const message = error instanceof Error ? error.message : String(error);
    console.error('register_failed', { requestId, message });
    const response: ApiResponse = {
      success: false,
      error: '注册失败，请稍后重试',
      code: 'register_failed',
      requestId,
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
 * 用户登录
 */
export async function handleLogin(request: Request, env: Env): Promise<Response> {
  // 处理 CORS
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const body: LoginRequest = await request.json();

    // 验证邮箱格式
    if (!validateEmail(body.email)) {
      const response: ApiResponse = {
        success: false,
        error: '邮箱格式不正确',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    // 查找用户
    const user = await findUserByEmail(env.DB, body.email);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: '邮箱或密码错误',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    // 验证密码
    const isValid = await verifyPassword(body.password, user.password_hash);
    if (!isValid) {
      const response: ApiResponse = {
        success: false,
        error: '邮箱或密码错误',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    // 生成 token
    const token = await createToken(
      { userId: user.id, email: user.email },
      env.JWT_SECRET,
      env.JWT_EXPIRES_IN
    );

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
        },
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
      error: '登录失败，请稍后重试',
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
 * 获取当前用户信息
 */
export async function handleGetMe(request: Request, env: Env, auth: { userId: string; email: string }): Promise<Response> {
  // 处理 CORS
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const user = await findUserById(env.DB, auth.userId);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: '用户不存在',
      };
      return addCorsHeaders(
        new Response(JSON.stringify(response), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }),
        request
      );
    }

    const response: ApiResponse<{ id: string; email: string }> = {
      success: true,
      data: {
        id: user.id,
        email: user.email,
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
      error: '获取用户信息失败',
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

