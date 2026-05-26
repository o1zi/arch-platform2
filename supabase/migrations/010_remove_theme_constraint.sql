-- إزالة قيد القوالب المدمجة — المنصة تعمل الآن بقوالب ZIP فقط
-- theme يُحفظ كنص حر (اسم القالب أو 'custom')
ALTER TABLE tenants
  DROP CONSTRAINT IF EXISTS tenants_theme_check;

-- نضع قيماً افتراضية مناسبة
ALTER TABLE tenants
  ALTER COLUMN theme SET DEFAULT 'default';

-- تحديث القيم القديمة
UPDATE tenants SET theme = 'default'
  WHERE theme IN ('modern','classic','bold','minimal','luxury','nebula');

COMMENT ON COLUMN tenants.theme IS 'اسم القالب — يُخزن فقط للإشارة، المنصة تستخدم custom_theme_id الآن';
