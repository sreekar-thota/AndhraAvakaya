import crypto from 'node:crypto';

/**
 * Hash a password using scrypt with a random or provided salt
 */
export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a plaintext password against a stored salt:hash string
 */
export function verifyPasswordHash(password, storedHash) {
  if (!password || !storedHash || !storedHash.includes(':')) return false;
  const [salt, expectedHash] = storedHash.split(':');
  try {
    const computedHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return safeEqual(computedHash, expectedHash);
  } catch (err) {
    return false;
  }
}

/**
 * Default fallback salted scrypt hash of 'uday0309'
 */
const DEFAULT_UDAY_HASH = '64596425ea607dd0d22a30dbdf6478de:3c94ea66868b95cba487c2648b095f9635baaeb3ad09da76e7852370bf814772c6ba123526a668f7a64ff8c7a1a7c889a21ff77367155f83543113129f02336a';

/**
 * Get configuration from environment with secure defaults
 */
function getConfig() {
  const adminUsername = process.env.ADMIN_USERNAME || 'uday';
  let adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminPasswordHash) {
    if (process.env.ADMIN_PASSWORD) {
      adminPasswordHash = hashPassword(process.env.ADMIN_PASSWORD);
    } else {
      adminPasswordHash = DEFAULT_UDAY_HASH;
    }
  }
  const sessionSecret = process.env.SESSION_SECRET || 'c8f3e2b9a7104f6e85293d14ab529e847c130d7b29a174c82b95107e324efb18';
  return { adminUsername, adminPasswordHash, sessionSecret };
}

/**
 * Timing-safe string comparison
 */
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Perform dummy timing safe compare to prevent timing leaks
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verify admin credentials
 */
export function verifyCredentials(username, password) {
  const { adminUsername, adminPasswordHash } = getConfig();
  if (!username || !password) return false;
  const userValid = safeEqual(username.trim(), adminUsername.trim());
  const passValid = verifyPasswordHash(password, adminPasswordHash);
  return userValid && passValid;
}

/**
 * Create a signed, tamper-proof session token
 * Format: base64(username):expiresAt:hmacSignature
 */
export function createSessionToken(username, durationMs = 7 * 24 * 60 * 60 * 1000) {
  const { sessionSecret } = getConfig();
  const expiresAt = Date.now() + durationMs;
  const userPayload = Buffer.from(username).toString('base64url');
  const dataToSign = `${userPayload}.${expiresAt}`;
  const signature = crypto
    .createHmac('sha256', sessionSecret)
    .update(dataToSign)
    .digest('base64url');
  return `${userPayload}.${expiresAt}.${signature}`;
}

/**
 * Verify session token and return user if valid
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return { valid: false };
  const parts = token.split('.');
  if (parts.length !== 3) return { valid: false };

  const [userPayload, expiresAtStr, signature] = parts;
  const expiresAt = parseInt(expiresAtStr, 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return { valid: false, error: 'Session expired' };
  }

  const { sessionSecret } = getConfig();
  const dataToSign = `${userPayload}.${expiresAtStr}`;
  const expectedSignature = crypto
    .createHmac('sha256', sessionSecret)
    .update(dataToSign)
    .digest('base64url');

  if (!safeEqual(signature, expectedSignature)) {
    return { valid: false, error: 'Invalid signature' };
  }

  const username = Buffer.from(userPayload, 'base64url').toString('utf-8');
  return { valid: true, username, expiresAt };
}

/**
 * Parse incoming Cookie header into key-value pairs
 */
export function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  const items = cookieHeader.split(';');
  for (const item of items) {
    const parts = item.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      cookies[key] = decodeURIComponent(val);
    }
  }
  return cookies;
}

/**
 * Build Set-Cookie header for session
 */
export function getSessionCookieHeader(token, isSecure = false) {
  const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
  const secureFlag = isSecure ? '; Secure' : '';
  return `admin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secureFlag}`;
}

/**
 * Build Set-Cookie header for clearing session on logout
 */
export function getClearSessionCookieHeader() {
  return `admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
