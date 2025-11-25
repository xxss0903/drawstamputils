// 数据验证工具函数

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: "密码不能为空" };
  }
  if (password.length < 6) {
    return { valid: false, error: "密码长度至少为6位" };
  }
  if (password.length > 128) {
    return { valid: false, error: "密码长度不能超过128位" };
  }
  return { valid: true };
}

export function validateTemplateName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: "模板名称不能为空" };
  }
  if (name.length > 100) {
    return { valid: false, error: "模板名称长度不能超过100个字符" };
  }
  return { valid: true };
}

export function validateFileSize(fileSize: number, maxSize: number = 10 * 1024 * 1024): { valid: boolean; error?: string } {
  if (fileSize > maxSize) {
    return { valid: false, error: `文件大小不能超过 ${maxSize / 1024 / 1024}MB` };
  }
  return { valid: true };
}

export function validateFileType(contentType: string): { valid: boolean; error?: string } {
  const allowedTypes = ['application/json', 'text/json'];
  if (!allowedTypes.includes(contentType)) {
    return { valid: false, error: "只支持 JSON 格式的模板文件" };
  }
  return { valid: true };
}

