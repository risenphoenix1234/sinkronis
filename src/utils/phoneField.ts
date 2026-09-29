/**
 * Utility functions for validating and normalizing phone numbers
 * to international E.164 format (e.g., +2348012345678).
 */

export function normalizePhoneNumber(
  phone?: string | null,
): string | undefined {
  if (!phone) return undefined;
  const trimmed = phone.trim();
  if (!trimmed) return undefined;

  // Remove spaces, hyphens, dots, parentheses
  const cleaned = trimmed.replace(/[\s\-\(\)\.]/g, "");
  if (!cleaned) return undefined;

  // If already starts with '+'
  if (cleaned.startsWith("+")) {
    const digits = cleaned.slice(1).replace(/[^\d]/g, "");
    if (digits.length >= 7 && digits.length <= 15) {
      return `+${digits}`;
    }
    return undefined;
  }

  // Nigerian 11-digit local numbers starting with 0 (e.g. 080..., 070..., 090..., 081..., 091...)
  if (/^0\d{10}$/.test(cleaned)) {
    return `+234${cleaned.slice(1)}`;
  }

  // 10 digits without leading 0 (e.g. 8012345678)
  if (/^[789]\d{9}$/.test(cleaned)) {
    return `+234${cleaned}`;
  }

  // 13 digits starting with 234 (e.g. 2348012345678)
  if (/^234\d{10}$/.test(cleaned)) {
    return `+${cleaned}`;
  }

  // Other numbers with 7 to 15 digits
  const allDigits = cleaned.replace(/[^\d]/g, "");
  if (allDigits.length >= 7 && allDigits.length <= 15) {
    return `+${allDigits}`;
  }

  return undefined;
}

export function isValidPhoneNumber(phone?: string | null): boolean {
  if (!phone || !phone.trim()) return true; // empty is valid when optional
  return normalizePhoneNumber(phone) !== undefined;
}
