/*
  Multilingual Support Migration
  
  This migration adds multilingual support to the existing categories and products tables.
  It converts single-language fields to JSONB format supporting multiple languages.
  
  Supported Languages: en, es, fr, de, ja, ko, pt, it
  
  Changes:
  1. Add new JSONB columns for multilingual content
  2. Migrate existing data to multilingual format
  3. Update indexes for performance
  4. Provide rollback functionality
*/

-- ============================================================================
-- STEP 1: Add new multilingual columns
-- ============================================================================

-- Add multilingual columns to categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS name_i18n JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS description_i18n JSONB DEFAULT '{}';

-- Add multilingual columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS name_i18n JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS description_i18n JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS features_i18n JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tags_i18n JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS specifications_i18n JSONB DEFAULT '{}';

-- ============================================================================
-- STEP 2: Create helper functions for data migration
-- ============================================================================

-- Function to create multilingual object with English as base
CREATE OR REPLACE FUNCTION create_multilingual_text(base_text TEXT)
RETURNS JSONB AS $$
BEGIN
  RETURN jsonb_build_object(
    'en', base_text,
    'es', base_text,  -- Will be translated later
    'fr', base_text,  -- Will be translated later
    'de', base_text,  -- Will be translated later
    'ja', base_text,  -- Will be translated later
    'ko', base_text,  -- Will be translated later
    'pt', base_text,  -- Will be translated later
    'it', base_text   -- Will be translated later
  );
END;
$$ LANGUAGE plpgsql;

-- Function to create multilingual array
CREATE OR REPLACE FUNCTION create_multilingual_array(base_array TEXT[])
RETURNS JSONB AS $$
BEGIN
  RETURN jsonb_build_object(
    'en', to_jsonb(base_array),
    'es', to_jsonb(base_array),  -- Will be translated later
    'fr', to_jsonb(base_array),  -- Will be translated later
    'de', to_jsonb(base_array),  -- Will be translated later
    'ja', to_jsonb(base_array),  -- Will be translated later
    'ko', to_jsonb(base_array),  -- Will be translated later
    'pt', to_jsonb(base_array),  -- Will be translated later
    'it', to_jsonb(base_array)   -- Will be translated later
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 3: Migrate existing categories data
-- ============================================================================

-- Migrate categories data to multilingual format
UPDATE categories 
SET 
  name_i18n = create_multilingual_text(name),
  description_i18n = create_multilingual_text(description)
WHERE name_i18n = '{}'::jsonb OR description_i18n = '{}'::jsonb OR specifications_i18n = '{}'::jsonb;

-- ============================================================================
-- STEP 4: Migrate existing products data
-- ============================================================================

-- Migrate products data to multilingual format
UPDATE products 
SET 
  name_i18n = create_multilingual_text(name),
  description_i18n = create_multilingual_text(description),
  features_i18n = create_multilingual_array(features),
  tags_i18n = create_multilingual_array(tags),
  specifications_i18n = create_multilingual_text(specifications)
WHERE name_i18n = '{}'::jsonb OR description_i18n = '{}'::jsonb;

-- ============================================================================
-- STEP 5: Add translated content for categories
-- ============================================================================

-- Update categories with translated content
UPDATE categories 
SET name_i18n = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(name_i18n,
  '{es}', '"drones"'),
  '{fr}', '"drones"'),
  '{de}', '"Drohnen"'),
  '{ja}', '"ドローン"'),
  '{ko}', '"드론"'),
  '{pt}', '"drones"'),
  '{it}', '"droni"')
WHERE name = 'drones';

UPDATE categories 
SET name_i18n = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(name_i18n,
  '{es}', '"robots"'),
  '{fr}', '"robots"'),
  '{de}', '"Roboter"'),
  '{ja}', '"ロボット"'),
  '{ko}', '"로봇"'),
  '{pt}', '"robôs"'),
  '{it}', '"robot"')
WHERE name = 'robots';

UPDATE categories 
SET name_i18n = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(name_i18n,
  '{es}', '"agrícola"'),
  '{fr}', '"agricole"'),
  '{de}', '"landwirtschaftlich"'),
  '{ja}', '"農業"'),
  '{ko}', '"농업"'),
  '{pt}', '"agrícola"'),
  '{it}', '"agricolo"')
WHERE name = 'agricultural';

UPDATE categories 
SET name_i18n = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(name_i18n,
  '{es}', '"industrial"'),
  '{fr}', '"industriel"'),
  '{de}', '"industriell"'),
  '{ja}', '"産業"'),
  '{ko}', '"산업"'),
  '{pt}', '"industrial"'),
  '{it}', '"industriale"')
WHERE name = 'industrial';

UPDATE categories 
SET name_i18n = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(name_i18n,
  '{es}', '"otros"'),
  '{fr}', '"autres"'),
  '{de}', '"andere"'),
  '{ja}', '"その他"'),
  '{ko}', '"기타"'),
  '{pt}', '"outros"'),
  '{it}', '"altri"')
WHERE name = 'other';

-- Update category descriptions
UPDATE categories 
SET description_i18n = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(description_i18n,
  '{es}', '"Drones profesionales para diversas aplicaciones"'),
  '{fr}', '"Drones professionnels pour diverses applications"'),
  '{de}', '"Professionelle Drohnen für verschiedene Anwendungen"'),
  '{ja}', '"様々な用途のプロフェッショナルドローン"'),
  '{ko}', '"다양한 용도의 전문 드론"'),
  '{pt}', '"Drones profissionais para várias aplicações"'),
  '{it}', '"Droni professionali per varie applicazioni"')
WHERE name = 'drones';

UPDATE categories 
SET description_i18n = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(description_i18n,
  '{es}', '"Soluciones robóticas avanzadas para automatización"'),
  '{fr}', '"Solutions robotiques avancées pour l''''automatisation"'),
  '{de}', '"Fortschrittliche Robotiklösungen für die Automatisierung"'),
  '{ja}', '"自動化のための高度なロボティクスソリューション"'),
  '{ko}', '"자동화를 위한 고급 로봇 솔루션"'),
  '{pt}', '"Soluções robóticas avançadas para automação"'),
  '{it}', '"Soluzioni robotiche avanzate per l''''automazione"')
WHERE name = 'robots';

-- ============================================================================
-- STEP 6: Create indexes for multilingual columns
-- ============================================================================

-- Create GIN indexes for JSONB columns for better performance
CREATE INDEX IF NOT EXISTS idx_categories_name_i18n ON categories USING GIN(name_i18n);
CREATE INDEX IF NOT EXISTS idx_categories_description_i18n ON categories USING GIN(description_i18n);
CREATE INDEX IF NOT EXISTS idx_products_name_i18n ON products USING GIN(name_i18n);
CREATE INDEX IF NOT EXISTS idx_products_description_i18n ON products USING GIN(description_i18n);
CREATE INDEX IF NOT EXISTS idx_products_features_i18n ON products USING GIN(features_i18n);
CREATE INDEX IF NOT EXISTS idx_products_tags_i18n ON products USING GIN(tags_i18n);

-- ============================================================================
-- STEP 7: Create helper functions for frontend
-- ============================================================================

-- Function to get localized text
CREATE OR REPLACE FUNCTION get_localized_text(i18n_data JSONB, lang TEXT DEFAULT 'en')
RETURNS TEXT AS $$
BEGIN
  -- Return the requested language, fallback to English, then to any available language
  RETURN COALESCE(
    i18n_data ->> lang,
    i18n_data ->> 'en',
    (SELECT value FROM jsonb_each_text(i18n_data) LIMIT 1)
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get localized array
CREATE OR REPLACE FUNCTION get_localized_array(i18n_data JSONB, lang TEXT DEFAULT 'en')
RETURNS TEXT[] AS $$
DECLARE
  result JSONB;
BEGIN
  -- Return the requested language array, fallback to English, then to any available language
  result := COALESCE(
    i18n_data -> lang,
    i18n_data -> 'en',
    (SELECT value FROM jsonb_each(i18n_data) LIMIT 1)
  );
  
  -- Convert JSONB array to TEXT array
  RETURN ARRAY(SELECT jsonb_array_elements_text(result));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- STEP 8: Create views for easy multilingual access
-- ============================================================================

-- Create view for localized categories
CREATE OR REPLACE VIEW categories_localized AS
SELECT 
  id,
  name,
  parent_id,
  description,
  image_url,
  created_at,
  name_i18n,
  description_i18n,
  get_localized_text(name_i18n, 'en') as name_en,
  get_localized_text(name_i18n, 'es') as name_es,
  get_localized_text(name_i18n, 'fr') as name_fr,
  get_localized_text(name_i18n, 'de') as name_de,
  get_localized_text(name_i18n, 'ja') as name_ja,
  get_localized_text(name_i18n, 'ko') as name_ko,
  get_localized_text(name_i18n, 'pt') as name_pt,
  get_localized_text(name_i18n, 'it') as name_it,
  get_localized_text(description_i18n, 'en') as description_en,
  get_localized_text(description_i18n, 'es') as description_es,
  get_localized_text(description_i18n, 'fr') as description_fr,
  get_localized_text(description_i18n, 'de') as description_de,
  get_localized_text(description_i18n, 'ja') as description_ja,
  get_localized_text(description_i18n, 'ko') as description_ko,
  get_localized_text(description_i18n, 'pt') as description_pt,
  get_localized_text(description_i18n, 'it') as description_it
FROM categories;

-- Create view for localized products
CREATE OR REPLACE VIEW products_localized AS
SELECT 
  id,
  name,
  description,
  specifications,
  price,
  images,
  video_url,
  category,
  subcategory,
  tags,
  features,
  created_at,
  updated_at,
  name_i18n,
  description_i18n,
  features_i18n,
  tags_i18n,
  specifications_i18n,
  get_localized_text(name_i18n, 'en') as name_en,
  get_localized_text(name_i18n, 'es') as name_es,
  get_localized_text(name_i18n, 'fr') as name_fr,
  get_localized_text(name_i18n, 'de') as name_de,
  get_localized_text(name_i18n, 'ja') as name_ja,
  get_localized_text(name_i18n, 'ko') as name_ko,
  get_localized_text(name_i18n, 'pt') as name_pt,
  get_localized_text(name_i18n, 'it') as name_it,
  get_localized_text(description_i18n, 'en') as description_en,
  get_localized_text(description_i18n, 'es') as description_es,
  get_localized_text(description_i18n, 'fr') as description_fr,
  get_localized_text(description_i18n, 'de') as description_de,
  get_localized_text(description_i18n, 'ja') as description_ja,
  get_localized_text(description_i18n, 'ko') as description_ko,
  get_localized_text(description_i18n, 'pt') as description_pt,
  get_localized_text(description_i18n, 'it') as description_it,
  get_localized_text(specifications_i18n, 'en') as specifications_en,
  get_localized_text(specifications_i18n, 'es') as specifications_es,
  get_localized_text(specifications_i18n, 'fr') as specifications_fr,
  get_localized_text(specifications_i18n, 'de') as specifications_de,
  get_localized_text(specifications_i18n, 'ja') as specifications_ja,
  get_localized_text(specifications_i18n, 'ko') as specifications_ko,
  get_localized_text(specifications_i18n, 'pt') as specifications_pt,
  get_localized_text(specifications_i18n, 'it') as specifications_it
FROM products;

-- ============================================================================
-- STEP 9: Update RLS policies for new columns
-- ============================================================================

-- Policies for the new columns are automatically covered by existing table policies
-- No additional RLS policies needed

-- ============================================================================
-- STEP 10: Clean up helper functions (optional)
-- ============================================================================

-- Drop temporary helper functions
DROP FUNCTION IF EXISTS create_multilingual_text(TEXT);
DROP FUNCTION IF EXISTS create_multilingual_array(TEXT[]);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify categories migration
-- SELECT name, name_i18n, description_i18n FROM categories LIMIT 5;

-- Verify products migration  
-- SELECT name, name_i18n, description_i18n FROM products LIMIT 3;

-- Test localized views
-- SELECT name_en, name_es FROM categories_localized;
-- SELECT name_en, description_en FROM products_localized LIMIT 3;

/*
  ROLLBACK INSTRUCTIONS:
  
  To rollback this migration, run the following commands:
  
  -- Drop views
  DROP VIEW IF EXISTS categories_localized;
  DROP VIEW IF EXISTS products_localized;
  
  -- Drop helper functions
  DROP FUNCTION IF EXISTS get_localized_text(JSONB, TEXT);
  DROP FUNCTION IF EXISTS get_localized_array(JSONB, TEXT);
  
  -- Drop indexes
  DROP INDEX IF EXISTS idx_categories_name_i18n;
  DROP INDEX IF EXISTS idx_categories_description_i18n;
  DROP INDEX IF EXISTS idx_products_name_i18n;
  DROP INDEX IF EXISTS idx_products_description_i18n;
  DROP INDEX IF EXISTS idx_products_features_i18n;
  DROP INDEX IF EXISTS idx_products_tags_i18n;
  
  -- Remove multilingual columns
  ALTER TABLE categories DROP COLUMN IF EXISTS name_i18n;
  ALTER TABLE categories DROP COLUMN IF EXISTS description_i18n;
  ALTER TABLE products DROP COLUMN IF EXISTS name_i18n;
  ALTER TABLE products DROP COLUMN IF EXISTS description_i18n;
  ALTER TABLE products DROP COLUMN IF EXISTS features_i18n;
  ALTER TABLE products DROP COLUMN IF EXISTS tags_i18n;
*/