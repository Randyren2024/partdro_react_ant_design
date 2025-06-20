-- Migration: Remove Price and Currency Fields
-- Description: This migration removes price and currency columns from products table
-- and drops related indexes since the application no longer displays pricing information.
-- ============================================================================

-- Drop price index first
DROP INDEX IF EXISTS idx_products_price;

-- Remove price and currency columns from products table
ALTER TABLE products 
DROP COLUMN IF EXISTS price,
DROP COLUMN IF EXISTS currency;

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Success message
SELECT 'Price and currency fields removed successfully!' as status;