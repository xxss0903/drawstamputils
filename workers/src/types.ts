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
  preview_r2_key?: string | null;
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
  preview_url?: string;
}

// 公共模板相关类型
export interface PublicTemplate {
  id: string;
  user_id: string | null;
  source_template_id?: string | null;
  name: string;
  description?: string;
  r2_key: string;
  preview_r2_key?: string | null;
  file_size: number;
  is_system: boolean;
  view_count: number;
  collect_count: number;
  created_at: number;
  updated_at: number;
}

export interface PublicTemplateResponse {
  id: string;
  user_id: string | null;
  source_template_id?: string | null;
  name: string;
  description?: string;
  file_size: number;
  is_system: boolean;
  view_count: number;
  collect_count: number;
  created_at: number;
  updated_at: number;
  is_collected?: boolean; // 当前用户是否已收藏
  author_email?: string; // 分享者邮箱（如果有）
  preview_url?: string;
}

export interface ShareTemplateRequest {
  template_id: string;
  name?: string; // 可选，如果不提供则使用原模板名称
  description?: string;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// 印章保存记录相关类型
export interface StampSave {
  id: string;
  user_id: string | null;
  ip_address: string;
  image_base64: string; // 图片 base64 数据
  created_at: number;
}

export interface SaveStampRequest {
  image_base64: string; // 图片 base64 数据
}

export interface StampSaveResponse {
  id: string;
  user_id: string | null;
  user_email: string | null; // 用户邮箱（如果已登录）
  ip_address: string;
  created_at: number; // 时间戳（毫秒）
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

