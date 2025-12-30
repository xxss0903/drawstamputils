// API 工具函数

// 自动检测开发环境：如果设置了环境变量则使用，否则在开发模式下使用本地 Workers
const getApiBaseUrl = () => {
  // 优先使用环境变量
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }
  
  // 开发环境默认使用本地 Workers
  if (import.meta.env.DEV) {
    return 'http://127.0.0.1:8787'
  }
  
  // 生产环境使用部署的 Workers
  return 'https://sealmaker-api.xxss0903.workers.dev'
}

const API_BASE_URL = getApiBaseUrl()

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
  }
}

export interface Template {
  id: string
  user_id: string
  name: string
  description?: string
  file_size: number
  created_at: number
  updated_at: number
  content?: string
  preview_url?: string
}

export interface PublicTemplate {
  id: string
  user_id: string | null
  source_template_id?: string | null
  name: string
  description?: string
  file_size: number
  is_system: boolean
  view_count: number
  collect_count: number
  created_at: number
  updated_at: number
  is_collected?: boolean
  author_email?: string
  content?: string
  preview_url?: string
}

// 通用请求函数
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('auth_token')
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token && !options.headers?.['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // 允许发送 cookies 和 credentials
    })

    const data: ApiResponse<T> = await response.json()

    if (!response.ok) {
      throw new Error(data.error || '请求失败')
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('网络错误')
  }
}

// 认证相关 API
export const authApi = {
  // 注册
  register: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    return request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  // 登录
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    return request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  // 获取当前用户信息
  getMe: async (): Promise<ApiResponse<{ id: string; email: string }>> => {
    return request<{ id: string; email: string }>('/api/auth/me', {
      method: 'GET',
    })
  },
}

// 模板相关 API
export const templateApi = {
  // 获取模板列表
  getTemplates: async (): Promise<ApiResponse<Template[]>> => {
    return request<Template[]>('/api/templates', {
      method: 'GET',
    })
  },

  // 获取模板详情
  getTemplate: async (id: string): Promise<ApiResponse<Template & { content: string }>> => {
    return request<Template & { content: string }>(`/api/templates/${id}`, {
      method: 'GET',
    })
  },

  // 上传模板
  uploadTemplate: async (
    name: string,
    description: string | undefined,
    file: File,
    preview: File
  ): Promise<ApiResponse<Template>> => {
    const formData = new FormData()
    formData.append('name', name)
    if (description) {
      formData.append('description', description)
    }
    formData.append('file', file)
    formData.append('preview', preview)

    const token = localStorage.getItem('auth_token')
    const headers: HeadersInit = {}
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/api/templates`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include', // 允许发送 cookies 和 credentials
    })

    const data: ApiResponse<Template> = await response.json()

    if (!response.ok) {
      throw new Error(data.error || '上传失败')
    }

    return data
  },

  // 更新模板
  updateTemplate: async (
    id: string,
    name?: string,
    description?: string
  ): Promise<ApiResponse<Template>> => {
    return request<Template>(`/api/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, description }),
    })
  },

  // 删除模板
  deleteTemplate: async (id: string): Promise<ApiResponse> => {
    return request(`/api/templates/${id}`, {
      method: 'DELETE',
    })
  },

  // 上传证书模板
  uploadCertificateTemplate: async (
    name: string,
    description: string | undefined,
    templateData: any,
    preview: File | null
  ): Promise<ApiResponse<Template>> => {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('type', 'certificate')
    if (description) {
      formData.append('description', description)
    }
    formData.append('file', new Blob([JSON.stringify(templateData)], { type: 'application/json' }), `${name}.json`)
    if (preview) {
      formData.append('preview', preview)
    }

    const token = localStorage.getItem('auth_token')
    const headers: HeadersInit = {}
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/api/templates`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    })

    const data: ApiResponse<Template> = await response.json()

    if (!response.ok) {
      throw new Error(data.error || '上传失败')
    }

    return data
  },

  // 获取证书模板列表
  getCertificateTemplates: async (): Promise<ApiResponse<Template[]>> => {
    return request<Template[]>('/api/templates?type=certificate', {
      method: 'GET',
    })
  },
}

// 公共模板相关 API
export const publicTemplateApi = {
  // 获取公共模板列表
  getPublicTemplates: async (
    limit: number = 50,
    offset: number = 0,
    orderBy: 'created_at' | 'collect_count' | 'view_count' = 'created_at'
  ): Promise<ApiResponse<PublicTemplate[]>> => {
    return request<PublicTemplate[]>(
      `/api/public-templates?limit=${limit}&offset=${offset}&orderBy=${orderBy}`,
      {
        method: 'GET',
      }
    )
  },

  // 获取公共模板详情
  getPublicTemplate: async (id: string): Promise<ApiResponse<PublicTemplate & { content: string }>> => {
    return request<PublicTemplate & { content: string }>(`/api/public-templates/${id}`, {
      method: 'GET',
    })
  },

  // 分享模板到公共模板
  shareTemplate: async (
    templateId: string,
    name?: string,
    description?: string
  ): Promise<ApiResponse<PublicTemplate>> => {
    return request<PublicTemplate>('/api/public-templates/share', {
      method: 'POST',
      body: JSON.stringify({ template_id: templateId, name, description }),
    })
  },

  // 收藏模板
  collectTemplate: async (templateId: string): Promise<ApiResponse> => {
    return request(`/api/public-templates/${templateId}/collect`, {
      method: 'POST',
    })
  },

  // 取消收藏模板
  uncollectTemplate: async (templateId: string): Promise<ApiResponse> => {
    return request(`/api/public-templates/${templateId}/uncollect`, {
      method: 'POST',
    })
  },

  // 获取用户收藏的模板列表
  getCollections: async (): Promise<ApiResponse<PublicTemplate[]>> => {
    return request<PublicTemplate[]>('/api/collections', {
      method: 'GET',
    })
  },
}

// 印章保存记录相关 API
export interface StampSaveResponse {
  id: string
  user_id: string | null
  user_email: string | null // 用户邮箱（如果已登录）
  ip_address: string
  created_at: number // 时间戳（毫秒）
}

export const stampSaveApi = {
  // 保存印章记录
  saveStamp: async (imageBase64: string): Promise<ApiResponse<StampSaveResponse>> => {
    // 验证参数
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      throw new Error('图片 base64 数据无效')
    }
    
    if (!imageBase64.startsWith('data:image/')) {
      throw new Error('图片 base64 数据格式错误，必须以 data:image/ 开头')
    }

    // 发送请求，传入图片 base64 数据
    return request<StampSaveResponse>('/api/stamp-saves', {
      method: 'POST',
      body: JSON.stringify({ 
        image_base64: imageBase64 
      }),
    })
  },

  // 获取今日保存次数
  getTodaySaveCount: async (): Promise<ApiResponse<{ count: number }>> => {
    return request<{ count: number }>('/api/stamp-saves/today-count', {
      method: 'GET',
    })
  },
}

