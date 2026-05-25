-- إضافة حقل رابط الفيديو لجدول المستأجرين
-- يدعم YouTube وVimeo وروابط MP4 المباشرة

ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS video_url text;

COMMENT ON COLUMN tenants.video_url IS 'رابط فيديو الخلفية للـ Hero (YouTube / Vimeo / MP4)';
