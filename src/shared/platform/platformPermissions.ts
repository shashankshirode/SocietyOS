import type { PlatformPermissionFallback, PlatformPermissionKind } from './platform.types';

const permissionMessageKeys: Record<PlatformPermissionKind, string> = {
  camera: 'resident.platform.cameraPermissionUnavailable',
  mediaLibrary: 'resident.platform.filePermissionUnavailable',
  file: 'resident.platform.filePermissionUnavailable',
};

export function getPermissionFallback(kind: PlatformPermissionKind): PlatformPermissionFallback {
  return {
    kind,
    messageKey: permissionMessageKeys[kind],
  };
}
