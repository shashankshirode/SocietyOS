import type { AppIconName } from '../../../shared/icons/icon.types';

export type MessageKey = string;

export type ResidentHeaderVariant =
  | 'dashboard'
  | 'detail'
  | 'form'
  | 'list'
  | 'workflow'
  | 'emergency'
  | 'secure'
  | 'chat'
  | 'marketplace'
  | 'community';

export type ResidentHeaderAction = {
  id: string;
  iconName: AppIconName;
  accessibilityLabelKey: MessageKey;
  onPress: () => void;
  badgeCount?: number;
};

export type ResidentAppHeaderProps = {
  variant: ResidentHeaderVariant;
  titleKey: MessageKey;
  subtitleKey?: MessageKey;
  roleLabelKey?: MessageKey;
  showBackButton: boolean;
  actions?: ResidentHeaderAction[];
  contextLabelKey?: MessageKey;
  onBackPress?: () => void;
  includeSafeAreaTop?: boolean;
  testID?: string;
};

export type ResidentHeaderRoleTokenKey =
  | 'RESIDENT_OWNER'
  | 'RESIDENT_TENANT'
  | 'RESIDENT_FAMILY';

export type ResidentHeaderResolvedTheme = {
  variant: ResidentHeaderVariant;
  roleTokenKey: ResidentHeaderRoleTokenKey;
  backgroundColors: readonly string[];
  accentColor: string;
  textColor: string;
  surfaceColor: string;
  borderColor: string;
  isDark: boolean;
};
