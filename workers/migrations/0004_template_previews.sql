-- 为模板和公共模板添加预览图字段
ALTER TABLE templates ADD COLUMN preview_r2_key TEXT;
ALTER TABLE public_templates ADD COLUMN preview_r2_key TEXT;

-- 针对已存在的数据，默认值为空即可

