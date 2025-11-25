// CORS 中间件

export interface CorsOptions {
  origin?: string | string[];
  methods?: string[];
  headers?: string[];
  maxAge?: number;
}

const defaultOptions: CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  headers: ['Content-Type', 'Authorization'],
  maxAge: 86400,
};

/**
 * 处理 CORS 请求
 */
export function handleCors(request: Request, options: CorsOptions = {}): Response | null {
  const opts = { ...defaultOptions, ...options };
  const origin = request.headers.get('Origin');

  // 处理预检请求
  if (request.method === 'OPTIONS') {
    const headers = new Headers();

    // 设置允许的来源
    if (opts.origin === '*' || (origin && isOriginAllowed(origin, opts.origin))) {
      headers.set('Access-Control-Allow-Origin', origin || '*');
    }

    if (opts.methods) {
      headers.set('Access-Control-Allow-Methods', opts.methods.join(', '));
    }

    if (opts.headers) {
      headers.set('Access-Control-Allow-Headers', opts.headers.join(', '));
    }

    if (opts.maxAge) {
      headers.set('Access-Control-Max-Age', opts.maxAge.toString());
    }

    headers.set('Access-Control-Allow-Credentials', 'true');

    return new Response(null, { status: 204, headers });
  }

  return null;
}

/**
 * 添加 CORS 头到响应
 */
export function addCorsHeaders(response: Response, request: Request, options: CorsOptions = {}): Response {
  const opts = { ...defaultOptions, ...options };
  const origin = request.headers.get('Origin');
  const newResponse = new Response(response.body, response);

  if (opts.origin === '*' || (origin && isOriginAllowed(origin, opts.origin))) {
    newResponse.headers.set('Access-Control-Allow-Origin', origin || '*');
  }

  newResponse.headers.set('Access-Control-Allow-Credentials', 'true');

  return newResponse;
}

/**
 * 检查来源是否允许
 */
function isOriginAllowed(origin: string, allowed: string | string[]): boolean {
  if (typeof allowed === 'string') {
    return allowed === '*' || allowed === origin;
  }

  return allowed.includes(origin);
}

