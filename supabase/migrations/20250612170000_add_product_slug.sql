-- Migration: Add Product Slug Support
-- Description: Add slug field to products table for SEO-friendly URLs
-- ============================================================================

-- Add slug column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS slug text;

-- Create unique index on slug for fast lookups and ensure uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Add constraint to ensure slug is not empty when provided
ALTER TABLE products 
ADD CONSTRAINT check_slug_not_empty 
CHECK (slug IS NULL OR length(trim(slug)) > 0);

-- Function to generate slug from product name
CREATE OR REPLACE FUNCTION generate_product_slug(product_name text)
RETURNS text AS $$
BEGIN
  -- Convert to lowercase, replace spaces and special chars with hyphens
  -- Remove multiple consecutive hyphens and trim
  RETURN trim(both '-' from 
    regexp_replace(
      regexp_replace(
        lower(unaccent(product_name)), 
        '[^a-z0-9\s-]', '', 'g'
      ), 
      '[\s-]+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Function to ensure unique slug
CREATE OR REPLACE FUNCTION ensure_unique_slug(base_slug text, product_id uuid DEFAULT NULL)
RETURNS text AS $$
DECLARE
  final_slug text;
  counter integer := 1;
  temp_slug text;
BEGIN
  final_slug := base_slug;
  
  -- Check if slug already exists (excluding current product if updating)
  WHILE EXISTS (
    SELECT 1 FROM products 
    WHERE slug = final_slug 
    AND (product_id IS NULL OR id != product_id)
  ) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to auto-generate slug on insert/update
CREATE OR REPLACE FUNCTION auto_generate_product_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate slug if it's not provided or if name changed
  IF NEW.slug IS NULL OR (TG_OP = 'UPDATE' AND OLD.name != NEW.name AND NEW.slug = OLD.slug) THEN
    NEW.slug := ensure_unique_slug(generate_product_slug(NEW.name), NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_auto_generate_product_slug ON products;
CREATE TRIGGER trigger_auto_generate_product_slug
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_product_slug();

-- Update existing products to generate slugs
UPDATE products 
SET slug = ensure_unique_slug(generate_product_slug(name), id)
WHERE slug IS NULL;

-- Verify the changes
SELECT 
  id, 
  name, 
  slug,
  created_at
FROM products 
ORDER BY created_at DESC
LIMIT 5;

-- Success message
SELECT 'Product slug support added successfully!' as status;