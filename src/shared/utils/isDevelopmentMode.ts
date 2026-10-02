export function isDevelopmentMode(): boolean {
  if (typeof __DEV__ !== 'undefined') {
    return __DEV__;
  }
  return process.env.NODE_ENV === 'development' || process.env.EXPO_PUBLIC_ENV === 'development';
}