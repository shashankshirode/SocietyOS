export function createIdempotencyKey(prefix: string): string {
  const safePrefix = prefix.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
  return `${safePrefix || 'request'}_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

