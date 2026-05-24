-- =============================================
-- 005_multi_sector.sql
-- دعم القطاعات المتعددة (هندسة، مقاولات، عقار، تصميم...)
-- =============================================

-- 1. عمود القطاع في جدول المستأجرين
alter table tenants
  add column if not exists sector text not null default 'engineering'
    check (sector in (
      'engineering',
      'contractor',
      'real_estate',
      'interior_design',
      'photography',
      'legal',
      'medical',
      'general'
    ));

-- 2. واتساب مستقل (مفيد للعقاري والتجاري)
alter table tenants
  add column if not exists whatsapp text;

-- 3. حقول إضافية للمشاريع/الأعمال
alter table projects
  add column if not exists price text;        -- السعر (للعقاري: "750,000 ريال")

alter table projects
  add column if not exists area text;         -- المساحة (للهندسي والعقاري والتصميم)

alter table projects
  add column if not exists status text;       -- الحالة (للعقاري: متاح/مباع/مؤجر)

alter table projects
  add column if not exists bedrooms integer;  -- غرف النوم (للعقاري)

alter table projects
  add column if not exists bathrooms integer; -- دورات المياه (للعقاري)

alter table projects
  add column if not exists tags text[];       -- وسوم حرة لكل القطاعات

-- 4. دعم القطاعات في القوالب المخصصة
alter table custom_themes
  add column if not exists supported_sectors text[]
    default array['engineering','contractor','real_estate','interior_design','photography','legal','medical','general'];

-- 5. المكاتب الموجودة → قطاع هندسي افتراضي (مضمون بالـ default لكن للتأكيد)
update tenants set sector = 'engineering' where sector is null;
