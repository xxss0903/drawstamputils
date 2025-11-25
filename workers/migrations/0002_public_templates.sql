-- 创建公共模板表
CREATE TABLE IF NOT EXISTS public_templates (
  id TEXT PRIMARY KEY,
  user_id TEXT, -- 分享者用户ID，NULL表示系统默认模板
  name TEXT NOT NULL,
  description TEXT,
  r2_key TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  is_system BOOLEAN DEFAULT 0, -- 是否为系统默认模板
  view_count INTEGER DEFAULT 0, -- 查看次数
  collect_count INTEGER DEFAULT 0, -- 收藏次数
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 创建收藏表
CREATE TABLE IF NOT EXISTS template_collections (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  template_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES public_templates(id) ON DELETE CASCADE,
  UNIQUE(user_id, template_id) -- 确保用户不能重复收藏同一个模板
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_public_templates_created_at ON public_templates(created_at);
CREATE INDEX IF NOT EXISTS idx_public_templates_collect_count ON public_templates(collect_count);
CREATE INDEX IF NOT EXISTS idx_public_templates_user_id ON public_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON template_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_template_id ON template_collections(template_id);

