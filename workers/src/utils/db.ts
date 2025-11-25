// 数据库操作工具函数

import type { User, Template } from '../types';

/**
 * 创建用户
 */
export async function createUser(db: D1Database, email: string, passwordHash: string): Promise<User> {
  const id = crypto.randomUUID();
  const now = Date.now();

  await db.prepare(
    `INSERT INTO users (id, email, password_hash, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(id, email, passwordHash, now, now).run();

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
  fileSize: number
): Promise<Template> {
  const id = crypto.randomUUID();
  const now = Date.now();

  await db.prepare(
    `INSERT INTO templates (id, user_id, name, description, r2_key, file_size, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, userId, name, description || null, r2Key, fileSize, now, now).run();

  return {
    id,
    user_id: userId,
    name,
    description,
    r2_key: r2Key,
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

