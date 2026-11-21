export function isCacheValid(validUntilIso: string): boolean {
  try {
    const validUntil = new Date(validUntilIso).getTime();
    return Date.now() < validUntil;
  } catch {
    return false;
  }
}
