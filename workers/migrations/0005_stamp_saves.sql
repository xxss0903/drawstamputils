-- 创建印章保存记录表
CREATE TABLE IF NOT EXISTS stamp_saves (
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

