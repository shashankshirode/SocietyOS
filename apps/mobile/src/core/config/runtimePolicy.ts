export type RuntimeEnvironment = 'development' | 'demo' | 'production' | 'test';

export interface RuntimePolicy {
  getEnvironment(): RuntimeEnvironment;
  isProduction(): boolean;
  isDemoAllowed(): boolean;
  isApiMode(): boolean;
  assertDemoAllowed(action: string): void;
  assertProductionSafe(): void;
}

function resolveEnvironment(): RuntimeEnvironment {
  if (process.env.NODE_ENV === 'test') {
    return 'test';
  }
  if (process.env.NODE_ENV === 'production' || process.env.EXPO_PUBLIC_APP_ENV === 'production') {
    return 'production';
  }
  if (process.env.EXPO_PUBLIC_APP_ENV === 'demo') {
    return 'demo';
  }
  return 'development';
}

class DefaultRuntimePolicy implements RuntimePolicy {
  private envOverride: RuntimeEnvironment | null = null;

  public setEnvironmentOverride(env: RuntimeEnvironment | null): void {
    this.envOverride = env;
  }

  public getEnvironment(): RuntimeEnvironment {
    return this.envOverride ?? resolveEnvironment();
  }

  public isProduction(): boolean {
    return this.getEnvironment() === 'production';
  }

  public isDemoAllowed(): boolean {
    // In production, demo features are strictly prohibited.
    return !this.isProduction();
  }

  public isApiMode(): boolean {
    const envMode = process.env.EXPO_PUBLIC_DATA_SOURCE_MODE;
    return this.isProduction() || envMode === 'api';
  }

  public assertDemoAllowed(action: string): void {
    if (!this.isDemoAllowed()) {
      throw new Error(`[SecurityPolicy] ${action} is strictly prohibited in production builds.`);
    }
  }

  public assertProductionSafe(): void {
    if (this.isProduction()) {
      const envMode = process.env.EXPO_PUBLIC_DATA_SOURCE_MODE;
      if (envMode && envMode !== 'api') {
        throw new Error(
          `[SecurityPolicy] Production release builds cannot run with non-API data source mode '${envMode}'. Only 'api' mode is allowed.`
        );
      }
      const rawApiOrigin = process.env.EXPO_PUBLIC_API_BASE_URL;
      if (!rawApiOrigin || !rawApiOrigin.startsWith('https://')) {
        throw new Error(
          '[SecurityPolicy] Production release builds require an HTTPS EXPO_PUBLIC_API_BASE_URL.'
        );
      }
    }
  }
}

export const runtimePolicy = new DefaultRuntimePolicy();
