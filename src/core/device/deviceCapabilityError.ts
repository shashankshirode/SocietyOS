export function resolveDeviceCapabilityError(type: 'camera' | 'notifications' | 'picker'): string {
  if (type === 'camera') {
    return 'Camera is not available on this device.\nYou can attach a document or continue without photo if this field is optional.';
  }
  if (type === 'notifications') {
    return 'Push notifications are not supported on this device capability.';
  }
  return 'File manager picker is not supported on this device.';
}

export function resolvePermissionDeniedError(type: 'camera' | 'notifications' | 'picker'): string {
  if (type === 'camera') {
    return 'Camera permission is required to take a photo.\nPlease enable camera access from device settings.';
  }
  if (type === 'notifications') {
    return 'Notification permissions are currently denied.\nPlease enable notifications from device settings to receive real-time updates.';
  }
  return 'Storage permission is required to access your files.\nPlease enable file access in device settings.';
}
