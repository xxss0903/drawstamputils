// 数据库操作工具函数

import type { User, Template, PublicTemplate } from '../types';

/**
 * 创建用户
 */
export async function createUser(db: D1Database, email: string, passwordHash: string): Promise<User> {
  const id = crypto.randomUUID();
  const now = Date.now();

  try {
    const result = await db.prepare(
      `INSERT INTO users (id, email, password_hash, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`
    ).bind(id, email, passwordHash, now, now).run();

    if (!result.success) {
      const error = (result as any).error ? String((result as any).error) : 'D1 insert failed';
      throw new Error(error);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (/UNIQUE constraint failed:\s*users\.email/i.test(message)) {
      throw new Error('USER_EMAIL_EXISTS');
    }

    if (
      /no column named\s+(created_at|updated_at)/i.test(message) ||
      /has no column named\s+(created_at|updated_at)/i.test(message) ||
      /no such column:\s*(created_at|updated_at)/i.test(message)
    ) {
      const fallback = await db.prepare(
        `INSERT INTO users (id, email, password_hash)
         VALUES (?, ?, ?)`
      ).bind(id, email, passwordHash).run();

      if (!fallback.success) {
        const fallbackError = (fallback as any).error ? String((fallback as any).error) : 'D1 insert failed';
        throw new Error(fallbackError);
      }
    } else {
      throw error;
    }
  }

  return {
    id,
    email,
    password_hash: passwordHash,
    created_at: now,
    updated_at: now,
  };
}

/**
 * 根据邮箱查找用户
 */
export async function findUserByEmail(db: D1Database, email: string): Promise<User | null> {
  const result = await db.prepare(
    `SELECT * FROM users WHERE email = ?`
  ).bind(email).first<User>();

  return result || null;
}

/**
 * 根据 ID 查找用户
 */
export async function findUserById(db: D1Database, id: string): Promise<User | null> {
  const result = await db.prepare(
    `SELECT * FROM users WHERE id = ?`
  ).bind(id).first<User>();

  return result || null;
}

/**
 * 创建模板
 */
export async function createTemplate(
  db: D1Database,
  userId: string,
  name: string,
  description: string | undefined,
  r2Key: string,
  previewR2Key: string | null,
  fileSize: number
): Promise<Template> {
  const id = crypto.randomUUID();
  const now = Date.now();

  await db.prepare(
    `INSERT INTO templates (id, user_id, name, description, r2_key, preview_r2_key, file_size, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, userId, name, description || null, r2Key, previewR2Key, fileSize, now, now).run();

  return {
    id,
    user_id: userId,
    name,
    description,
    r2_key: r2Key,
    preview_r2_key: previewR2Key,
    file_size: fileSize,
    created_at: now,
    updated_at: now,
  };
}

/**
 * 获取用户的所有模板
 */
export async function getUserTemplates(db: D1Database, userId: string): Promise<Template[]> {
  const result = await db.prepare(
    `SELECT * FROM templates WHERE user_id = ? ORDER BY created_at DESC`
  ).bind(userId).all<Template>();

  return result.results || [];
}

export async function getUserTemplateCount(db: D1Database, userId: string): Promise<number> {
  const result = await db.prepare(
    `SELECT COUNT(*) as count FROM templates WHERE user_id = ?`
  ).bind(userId).first<{ count: number }>();

  return result?.count || 0;
}

/**
 * 根据 ID 获取模板
 */
export async function getTemplateById(db: D1Database, id: string): Promise<Template | null> {
  const result = await db.prepare(
    `SELECT * FROM templates WHERE id = ?`
  ).bind(id).first<Template>();

  return result || null;
}

/**
 * 更新模板
 */
export async function updateTemplate(
  db: D1Database,
  id: string,
  name: string | undefined,
  description: string | undefined
): Promise<boolean> {
  const updates: string[] = [];
  const values: any[] = [];

  if (name !== undefined) {
    updates.push('name = ?');
    values.push(name);
  }
  if (description !== undefined) {
    updates.push('description = ?');
    values.push(description);
  }

  if (updates.length === 0) {
    return false;
  }

  updates.push('updated_at = ?');
  values.push(Date.now());
  values.push(id);

  const sql = `UPDATE templates SET ${updates.join(', ')} WHERE id = ?`;
  const result = await db.prepare(sql).bind(...values).run();

  return result.success;
}

/**
 * 删除模板
 */
export async function deleteTemplate(db: D1Database, id: string): Promise<boolean> {
  const result = await db.prepare(
    `DELETE FROM templates WHERE id = ?`
  ).bind(id).run();

  return result.success;
}

/**
 * 创建公共模板
 */
export async function createPublicTemplate(
  db: D1Database,
  userId: string | null,
  name: string,
  description: string | undefined,
  r2Key: string,
  previewR2Key: string | null,
  fileSize: number,
  isSystem: boolean = false,
  sourceTemplateId: string | null = null
): Promise<PublicTemplate> {
  const id = crypto.randomUUID();
  const now = Date.now();

  await db.prepare(
    `INSERT INTO public_templates (id, user_id, name, description, r2_key, preview_r2_key, file_size, is_system, view_count, collect_count, source_template_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?, ?)`
  ).bind(id, userId, name, description || null, r2Key, previewR2Key, fileSize, isSystem ? 1 : 0, sourceTemplateId, now, now).run();

  return {
    id,
    user_id: userId,
    source_template_id: sourceTemplateId,
    name,
    description,
    r2_key: r2Key,
    preview_r2_key: previewR2Key,
    file_size: fileSize,
    is_system: isSystem,
    view_count: 0,
    collect_count: 0,
    created_at: now,
    updated_at: now,
  };
}

/**
 * 获取公共模板列表
 */
export async function getPublicTemplates(
  db: D1Database,
  limit: number = 50,
  offset: number = 0,
  orderBy: 'created_at' | 'collect_count' | 'view_count' = 'created_at'
): Promise<PublicTemplate[]> {
  const orderByMap: Record<string, string> = {
    'created_at': 'created_at DESC',
    'collect_count': 'collect_count DESC',
    'view_count': 'view_count DESC',
  };

  const result = await db.prepare(
    `SELECT * FROM public_templates ORDER BY ${orderByMap[orderBy]} LIMIT ? OFFSET ?`
  ).bind(limit, offset).all<PublicTemplate>();

  return result.results || [];
}

/**
 * 根据 ID 获取公共模板
 */
export async function getPublicTemplateById(db: D1Database, id: string): Promise<PublicTemplate | null> {
  const result = await db.prepare(
    `SELECT * FROM public_templates WHERE id = ?`
  ).bind(id).first<PublicTemplate>();

  return result || null;
}

export async function getPublicTemplateBySourceTemplateId(db: D1Database, templateId: string): Promise<PublicTemplate | null> {
  const result = await db.prepare(
    `SELECT * FROM public_templates WHERE source_template_id = ?`
  ).bind(templateId).first<PublicTemplate>();

  return result || null;
}

export async function getUserSharedPublicTemplateCount(db: D1Database, userId: string): Promise<number> {
  const result = await db.prepare(
    `SELECT COUNT(*) as count FROM public_templates WHERE user_id = ?`
  ).bind(userId).first<{ count: number }>();

  return result?.count || 0;
}

/**
 * 删除公共模板
 */
export async function deletePublicTemplate(db: D1Database, id: string): Promise<boolean> {
  const result = await db.prepare(
    `DELETE FROM public_templates WHERE id = ?`
  ).bind(id).run();

  return result.success;
}

/**
 * 增加公共模板查看次数
 */
export async function incrementPublicTemplateViewCount(db: D1Database, id: string): Promise<boolean> {
  const result = await db.prepare(
    `UPDATE public_templates SET view_count = view_count + 1 WHERE id = ?`
  ).bind(id).run();

  return result.success;
}

/**
 * 收藏模板
 */
export async function collectTemplate(db: D1Database, userId: string, templateId: string): Promise<boolean> {
  const id = crypto.randomUUID();
  const now = Date.now();

  try {
    // 插入收藏记录
    await db.prepare(
      `INSERT INTO template_collections (id, user_id, template_id, created_at)
       VALUES (?, ?, ?, ?)`
    ).bind(id, userId, templateId, now).run();

    // 增加模板收藏数
    await db.prepare(
      `UPDATE public_templates SET collect_count = collect_count + 1 WHERE id = ?`
    ).bind(templateId).run();

    return true;
  } catch (error) {
    // 如果已收藏，返回 false
    return false;
  }
}

/**
 * 取消收藏模板
 */
export async function uncollectTemplate(db: D1Database, userId: string, templateId: string): Promise<boolean> {
  try {
    // 删除收藏记录
    const deleteResult = await db.prepare(
      `DELETE FROM template_collections WHERE user_id = ? AND template_id = ?`
    ).bind(userId, templateId).run();

    if (deleteResult.success) {
      // 减少模板收藏数
      await db.prepare(
        `UPDATE public_templates SET collect_count = collect_count - 1 WHERE id = ? AND collect_count > 0`
      ).bind(templateId).run();
    }

    return deleteResult.success;
  } catch (error) {
    return false;
  }
}

/**
 * 检查用户是否已收藏模板
 */
export async function isTemplateCollected(db: D1Database, userId: string, templateId: string): Promise<boolean> {
  const result = await db.prepare(
    `SELECT id FROM template_collections WHERE user_id = ? AND template_id = ?`
  ).bind(userId, templateId).first();

  return result !== null;
}

/**
 * 获取用户收藏的模板列表
 */
export async function getUserCollections(db: D1Database, userId: string): Promise<PublicTemplate[]> {
  const result = await db.prepare(
    `SELECT pt.* FROM public_templates pt
     INNER JOIN template_collections tc ON pt.id = tc.template_id
     WHERE tc.user_id = ?
     ORDER BY tc.created_at DESC`
  ).bind(userId).all<PublicTemplate>();

  return result.results || [];
}

/**
 * 创建印章保存记录
 */
export async function createStampSave(
  db: D1Database,
  userId: string | null,
  ipAddress: string,
  imageBase64: string
): Promise<{ id: string; user_id: string | null; ip_address: string; created_at: number }> {
  const id = crypto.randomUUID();
  const now = Date.now();

  await db.prepare(
    `INSERT INTO stamp_saves (id, user_id, ip_address, image_base64, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(id, userId, ipAddress, imageBase64, now).run();

  return {
    id,
    user_id: userId,
    ip_address: ipAddress,
    created_at: now,
  };
}

/**
 * 获取用户今日保存次数（基于 IP 或用户 ID）
 */
export async function getTodaySaveCount(
  db: D1Database,
  userId: string | null,
  ipAddress: string
): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.getTime();

  let result;
  if (userId) {
    // 已登录用户：按用户 ID 统计
    result = await db.prepare(
      `SELECT COUNT(*) as count FROM stamp_saves 
       WHERE user_id = ? AND created_at >= ?`
    ).bind(userId, todayStart).first<{ count: number }>();
  } else {
    // 未登录用户：按 IP 统计
    result = await db.prepare(
      `SELECT COUNT(*) as count FROM stamp_saves 
       WHERE ip_address = ? AND created_at >= ? AND user_id IS NULL`
    ).bind(ipAddress, todayStart).first<{ count: number }>();
  }

  return result?.count || 0;
}
