// Module name must not be empty
export const isValidModuleName = name => name?.trim().length > 0;

// Basic URL validation
export const isValidUrl = url => /^https?:\/\/.+\..+/.test(String(url || ''));

// File size <= 5MB
export const isValidFileSize = file => file && file.size <= 5 * 1024 * 1024;

// Normalize text for search
export const norm = s =>
  String(s || '')
    .toLowerCase()
    .trim();
