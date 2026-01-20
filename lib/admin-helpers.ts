// Admin security helpers

/**
 * Check if a user email is an admin
 * Supports multiple admin emails via comma-separated env variable
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;

  const adminEmails = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
  const adminList = adminEmails.split(',').map((e) => e.trim().toLowerCase());

  return adminList.includes(email.toLowerCase());
}

/**
 * Get the admin dashboard slug from env
 * Default to 'admin' if not set (for local dev)
 */
export function getAdminSlug(): string {
  return process.env.ADMIN_SLUG || process.env.NEXT_PUBLIC_ADMIN_SLUG || 'admin';
}

/**
 * Get the full admin dashboard path
 */
export function getAdminPath(): string {
  return `/${getAdminSlug()}`;
}

// Rate limiting helper for admin API
const requestCounts = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple in-memory rate limiter for admin API
 * Limits to 10 requests per minute per IP
 */
export function checkRateLimit(identifier: string, maxRequests = 10): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute

  const record = requestCounts.get(identifier);

  if (!record || now > record.resetAt) {
    requestCounts.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}
