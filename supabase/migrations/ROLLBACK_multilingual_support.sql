/*
  ROLLBACK SCRIPT - Multilingual Support
  
  This script will completely remove all multilingual changes and restore
  the database to its previous state.
  
  ⚠️  WARNING: This will permanently delete all translation data!
  
  Execute this script ONLY if you need to rollback the multilingual migration.
  Make sure to backup your database before running this script.
*/

-- ============================================================================
-- STEP 1: DROP VIEWS
-- ============================================================================

DROP VIEW IF EXISTS products_localized;
DROP VIEW IF EXISTS categories_localized;

-- ============================================================================
-- STEP 2: DROP INDEXES
-- ============================================================================

DROP INDEX IF EXISTS idx_products_name_i18n_gin;
DROP INDEX IF EXISTS idx_products_description_i18n_gin;
DROP INDEX IF EXISTS idx_products_features_i18n_gin;
DROP INDEX IF EXISTS idx_products_tags_i18n_gin;
DROP INDEX IF EXISTS idx_categories_name_i18n_gin;
DROP INDEX IF EXISTS idx_categories_description_i18n_gin;

-- ============================================================================
-- STEP 3: DROP FUNCTIONS
-- ============================================================================

DROP FUNCTION IF EXISTS get_localized_text(jsonb, text, text);
DROP FUNCTION IF EXISTS get_localized_array(jsonb, text, text[]);

-- ============================================================================
-- STEP 4: REMOVE MULTILINGUAL COLUMNS FROM PRODUCTS TABLE
-- ============================================================================

ALTER TABLE products 
DROP COLUMN IF EXISTS name_i18n,
DROP COLUMN IF EXISTS description_i18n,
DROP COLUMN IF EXISTS features_i18n,
DROP COLUMN IF EXISTS tags_i18n;

-- ============================================================================
-- STEP 5: REMOVE MULTILINGUAL COLUMNS FROM CATEGORIES TABLE
-- ============================================================================

ALTER TABLE categories 
DROP COLUMN IF EXISTS name_i18n,
DROP COLUMN IF EXISTS description_i18n;

-- ============================================================================
-- STEP 6: RESTORE ORIGINAL DATA (if needed)
-- ============================================================================

-- Note: The original data in 'name', 'description', 'features', and 'tags' 
-- columns should still be intact. If for some reason they were modified,
-- you would need to restore from backup.

-- Verify original data is still present
-- SELECT name, description FROM products LIMIT 5;
-- SELECT name, description FROM categories LIMIT 5;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check that multilingual columns are removed
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND table_schema = 'public'
  AND column_name LIKE '%_i18n';

SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'categories' 
  AND table_schema = 'public'
  AND column_name LIKE '%_i18n';

-- Check that views are removed
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public' 
  AND table_name IN ('products_localized', 'categories_localized');

-- Check that functions are removed
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('get_localized_text', 'get_localized_array');

-- ============================================================================
-- CLEANUP COMPLETE
-- ============================================================================

/*
  Rollback completed successfully!
  
  What was removed:
  ✓ All multilingual columns (name_i18n, description_i18n, features_i18n, tags_i18n)
  ✓ All multilingual indexes
  ✓ All multilingual views (products_localized, categories_localized)
  ✓ All helper functions (get_localized_text, get_localized_array)
  
  What was preserved:
  ✓ Original data in name, description, features, tags columns
  ✓ All other table structure and data
  ✓ All existing indexes and constraints
  ✓ All RLS policies
  
  Next steps after rollback:
  1. Update your frontend code to remove multilingual support
  2. Remove language switching functionality
  3. Revert to using original fields (name, description, features, tags)
  
  If you want to re-implement multilingual support later:
  1. Re-run the migration: 20250612120000_multilingual_support.sql
  2. Re-run the translation scripts: 20250612120001_product_translations.sql and 20250612120002_product_translations_part2.sql
  3. Update frontend code according to FRONTEND_INTEGRATION_GUIDE.md
*/