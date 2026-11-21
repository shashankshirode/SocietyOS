function getCryptoUUID(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function createIdempotencyKey(prefix: string): string {
  const safePrefix = prefix.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
  return `${safePrefix || 'request'}_${getCryptoUUID()}`;
}

export function generateOperationId(prefix: string): string {
  return createIdempotencyKey(prefix);
}


