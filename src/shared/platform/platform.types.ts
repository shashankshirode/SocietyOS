import type { KeyboardAvoidingViewProps, ViewStyle } from 'react-native';

export type AppPlatform = 'ios' | 'android' | 'web' | 'native';

export type PlatformSelectValue<T> = {
  ios?: T;
  android?: T;
  web?: T;
  native?: T;
  default: T;
};

export type PlatformShadowLevel = 'none' | 'soft' | 'medium' | 'strong' | 'floating';

export type PlatformShadowStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

export type PlatformKeyboardConfig = {
  behavior: KeyboardAvoidingViewProps['behavior'];
  keyboardVerticalOffset: number;
};

export type PlatformPermissionKind = 'camera' | 'mediaLibrary' | 'file';

export type PlatformPermissionFallback = {
  kind: PlatformPermissionKind;
  messageKey: string;
};

export type PlatformImageResizeMode = 'cover' | 'contain' | 'stretch' | 'center';
