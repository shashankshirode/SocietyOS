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

import type { ReturnSemantic } from '../experience/EdgeReturn';

export type ResidentAppHeaderProps = {
  variant?: ResidentHeaderVariant;
  titleKey?: MessageKey;
  subtitleKey?: MessageKey;
  roleLabelKey?: MessageKey;
  showBackButton?: boolean;
  actions?: ResidentHeaderAction[];
  contextLabelKey?: MessageKey;
  onBackPress?: () => void;
  semantic?: ReturnSemantic;
  fallbackRoute?: string;
  fallbackTab?: string;
  includeSafeAreaTop?: boolean;
  showNarrative?: boolean;
  testID?: string;
  contextualAction?: React.ReactNode;
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
