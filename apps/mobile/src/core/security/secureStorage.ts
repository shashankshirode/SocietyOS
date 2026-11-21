import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { runtimePolicy } from '../config/runtimePolicy';

export interface SecureStorageResult<T> {
  success: boolean;
  value?: T;
  error?: string;
}

// In-memory fallback for web in development/demo mode ONLY
const webDemoStorage = new Map<string, string>();

export class SecureStorageService {
  public async setItem(key: string, value: string): Promise<SecureStorageResult<void>> {
    if (Platform.OS === 'web') {
      if (runtimePolicy.isProduction()) {
        // Never persist production refresh tokens in browser-readable storage
        return {
          success: false,
          error: 'PERSISTENCE_NOT_SUPPORTED_ON_WEB_PRODUCTION: Browser-readable storage is forbidden for production credentials.',
        };
      }
      webDemoStorage.set(key, value);
      return { success: true };
    }

    try {
      if (typeof SecureStore.setItemAsync === 'function') {
        await SecureStore.setItemAsync(key, value);
        return { success: true };
      }
      return { success: false, error: 'SECURE_STORE_UNAVAILABLE' };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return { success: false, error: errorMessage };
    }
  }

  public async getItem(key: string): Promise<SecureStorageResult<string | null>> {
    if (Platform.OS === 'web') {
      if (runtimePolicy.isProduction()) {
        return { success: true, value: null };
      }
      return { success: true, value: webDemoStorage.get(key) ?? null };
    }

    try {
      if (typeof SecureStore.getItemAsync === 'function') {
        const item = await SecureStore.getItemAsync(key);
        return { success: true, value: item };
      }
      return { success: false, error: 'SECURE_STORE_UNAVAILABLE' };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return { success: false, error: errorMessage };
    }
  }

  public async deleteItem(key: string): Promise<SecureStorageResult<void>> {
    if (Platform.OS === 'web') {
      webDemoStorage.delete(key);
      return { success: true };
    }

    try {
      if (typeof SecureStore.deleteItemAsync === 'function') {
        await SecureStore.deleteItemAsync(key);
        return { success: true };
      }
      return { success: false, error: 'SECURE_STORE_UNAVAILABLE' };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return { success: false, error: errorMessage };
    }
  }

  public clearWebDemoStorage(): void {
    webDemoStorage.clear();
  }
}

export const secureStorage = new SecureStorageService();
