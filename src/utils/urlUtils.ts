import { Product } from '../types/product';

/**
 * Generate SEO-friendly product URL
 * @param product Product object
 * @returns Product URL path
 */
export const getProductUrl = (product: Product): string => {
  // Use slug if available, otherwise fall back to ID
  const identifier = product.slug || product.id;
  return `/product/${identifier}`;
};

/**
 * Generate product URL by identifier
 * @param identifier Product slug or ID
 * @returns Product URL path
 */
export const getProductUrlByIdentifier = (identifier: string): string => {
  return `/product/${identifier}`;
};

/**
 * Extract product identifier from URL
 * @param url Product URL or path
 * @returns Product identifier (slug or ID)
 */
export const extractProductIdentifier = (url: string): string | null => {
  const match = url.match(/\/product\/([^/?#]+)/);
  return match ? match[1] : null;
};

/**
 * Check if identifier is a UUID
 * @param identifier String to check
 * @returns True if identifier is UUID format
 */
export const isUUID = (identifier: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(identifier);
};

/**
 * Generate slug from text
 * @param text Text to convert to slug
 * @returns URL-friendly slug
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/[\s-]+/g, '-') // Replace spaces and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};