-- ============================================================================
-- Migration: Migrate Existing Data to Multilingual Format
-- Description: This migration converts existing single-language data to 
-- multilingual JSONB format. Run AFTER the column creation migration.
-- ============================================================================

-- Migrate categories data to multilingual format
UPDATE categories 
SET 
  name_i18n = jsonb_build_object('en', name),
  description_i18n = jsonb_build_object('en', description)
WHERE name_i18n = '{}'::jsonb OR description_i18n = '{}'::jsonb;

-- Migrate products data to multilingual format
UPDATE products 
SET 
  name_i18n = jsonb_build_object('en', name),
  description_i18n = jsonb_build_object('en', description),
  features_i18n = jsonb_build_object('en', features),
  tags_i18n = jsonb_build_object('en', tags),
  specifications_i18n = jsonb_build_object('en', specifications)
WHERE name_i18n = '{}'::jsonb 
   OR description_i18n = '{}'::jsonb 
   OR features_i18n = '{}'::jsonb 
   OR tags_i18n = '{}'::jsonb 
   OR specifications_i18n = '{}'::jsonb;

-- Verify the migration
SELECT 
    name,
    name_i18n,
    specifications_i18n
FROM products 
LIMIT 3;

-- Success message
SELECT 'Data migration completed successfully!' as status;