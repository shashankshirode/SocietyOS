import { clearTokens } from './tokenStore';
import { clearCurrentSession, clearSensitiveCachedDataPlaceholder } from './sessionStore';

export async function logoutCurrentSession(): Promise<void> {
  await clearCurrentSession();
  await clearTokens();
  await clearSensitiveCachedDataPlaceholder();
}
