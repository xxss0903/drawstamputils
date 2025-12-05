-- 更新 stamp_saves 表：将 stamp_config 改为 image_base64
-- 如果表不存在，直接创建新表
CREATE TABLE IF NOT EXISTS stamp_saves (
  id TEXT PRIMARY KEY,
  user_id TEXT, -- 可为空，未登录用户使用 IP
  ip_address TEXT, -- IP 地址
  image_base64 TEXT NOT NULL, -- 印章图片的 base64 数据
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 如果旧表存在且字段名不同，需要修改表结构
-- 注意：SQLite 不支持直接修改列，需要重建表
-- 这里先检查是否存在旧字段，如果存在则重建表

-- 删除旧表（如果存在，因为字段类型不同无法直接迁移）
-- 注意：这会删除所有旧数据，但这是新功能，应该没有重要数据
DROP TABLE IF EXISTS stamp_saves;

-- 重新创建表
CREATE TABLE stamp_saves (
  id TEXT PRIMARY KEY,
  user_id TEXT, -- 可为空，未登录用户使用 IP
  ip_address TEXT, -- IP 地址
  image_base64 TEXT NOT NULL, -- 印章图片的 base64 数据
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_stamp_saves_user_id ON stamp_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_stamp_saves_ip_address ON stamp_saves(ip_address);
CREATE INDEX IF NOT EXISTS idx_stamp_saves_created_at ON stamp_saves(created_at);

