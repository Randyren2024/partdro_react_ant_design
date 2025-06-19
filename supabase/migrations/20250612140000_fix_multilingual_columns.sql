-- ============================================================================
-- Migration: Fix Multilingual Columns
-- Description: This migration ensures all required multilingual columns exist
-- before running data migrations. Run this FIRST if you encounter column errors.
-- ============================================================================

-- Ensure all multilingual columns exist in categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS name_i18n JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS description_i18n JSONB DEFAULT '{}';

-- Ensure all multilingual columns exist in products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS name_i18n JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS description_i18n JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS features_i18n JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tags_i18n JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS specifications_i18n JSONB DEFAULT '{}';

-- Verify columns were created successfully
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
    AND column_name LIKE '%_i18n'
ORDER BY column_name;

-- Also check categories table
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'categories' 
    AND column_name LIKE '%_i18n'
ORDER BY column_name;

-- Add comments to document the columns
COMMENT ON COLUMN products.name_i18n IS 'Internationalized product names in JSONB format with language codes as keys';
COMMENT ON COLUMN products.description_i18n IS 'Internationalized product descriptions in JSONB format with language codes as keys';
COMMENT ON COLUMN products.features_i18n IS 'Internationalized product features in JSONB format with language codes as keys';
COMMENT ON COLUMN products.tags_i18n IS 'Internationalized product tags in JSONB format with language codes as keys';
COMMENT ON COLUMN products.specifications_i18n IS 'Internationalized product specifications in JSONB format with language codes as keys';

COMMENT ON COLUMN categories.name_i18n IS 'Internationalized category names in JSONB format with language codes as keys';
COMMENT ON COLUMN categories.description_i18n IS 'Internationalized category descriptions in JSONB format with language codes as keys';

-- Success message
SELECT 'Multilingual columns have been successfully created or verified!' as status;