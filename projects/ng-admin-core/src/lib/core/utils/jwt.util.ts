/**
 * JWT utility functions for token handling
 */

/**
 * Decode a JWT token without verification
 * @param token - The JWT token to decode
 * @returns The decoded token payload
 */
export function decodeJwt<T = Record<string, any>>(token: string): T | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as T;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Check if a JWT token is expired
 * @param token - The JWT token to check
 * @returns true if the token is expired, false otherwise
 */
export function isJwtExpired(token: string): boolean {
  const decoded = decodeJwt<{ exp?: number }>(token);
  if (!decoded || !decoded.exp) return true;

  const expirationDate = new Date(decoded.exp * 1000);
  return expirationDate < new Date();
}

/**
 * Get the expiration date of a JWT token
 * @param token - The JWT token
 * @returns The expiration date or null if not available
 */
export function getJwtExpiration(token: string): Date | null {
  const decoded = decodeJwt<{ exp?: number }>(token);
  if (!decoded || !decoded.exp) return null;

  return new Date(decoded.exp * 1000);
}

/**
 * Get the time remaining until token expiration in milliseconds
 * @param token - The JWT token
 * @returns Time remaining in milliseconds, or null if no expiration found
 */
export function getJwtTimeRemaining(token: string): number | null {
  const expiration = getJwtExpiration(token);
  if (!expiration) return null;

  const remaining = expiration.getTime() - Date.now();
  return Math.max(0, remaining);
}

/**
 * Extract a specific claim from a JWT token
 * @param token - The JWT token
 * @param claim - The claim key to extract
 * @returns The claim value or null if not found
 */
export function getJwtClaim<T = any>(token: string, claim: string): T | null {
  const decoded = decodeJwt<Record<string, any>>(token);
  if (!decoded) return null;

  return (decoded[claim] as T) ?? null;
}

/**
 * Validate JWT token format (basic check)
 * @param token - The token to validate
 * @returns true if the token has valid JWT format
 */
export function isValidJwtFormat(token: string): boolean {
  if (!token) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  try {
    parts.forEach(part => atob(part.replace(/-/g, '+').replace(/_/g, '/')));
    return true;
  } catch {
    return false;
  }
}
