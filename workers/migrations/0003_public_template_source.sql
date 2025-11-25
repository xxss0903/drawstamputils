-- 为公共模板表添加源模板字段，阻止重复分享
ALTER TABLE public_templates
ADD COLUMN source_template_id TEXT REFERENCES templates(id) ON DELETE SET NULL;

-- 为源模板字段创建唯一索引（允许多个 NULL）
CREATE UNIQUE INDEX IF NOT EXISTS idx_public_templates_source_template_id
  ON public_templates(source_template_id);

