// 环境变量类型
export interface Env {
  DB: D1Database;
  TEMPLATES_BUCKET: R2Bucket;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

// 用户相关类型
export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: number;
  updated_at: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

// 模板相关类型
export interface Template {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  r2_key: string;
  file_size: number;
  created_at: number;
  updated_at: number;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  file: File;
}

export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
}

export interface TemplateResponse {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  file_size: number;
  created_at: number;
  updated_at: number;
  download_url?: string;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

