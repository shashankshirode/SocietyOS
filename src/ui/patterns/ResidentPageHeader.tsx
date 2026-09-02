import React from 'react';
import { ResidentAppHeader } from '../../modules/resident/navigation/ResidentAppHeader';
import type { MessageKey, ResidentHeaderAction, ResidentHeaderVariant } from '../../modules/resident/navigation/residentHeader.types';
import type { ReturnSemantic } from '../../modules/resident/experience/EdgeReturn';
import { includeWhenPresent } from "../../shared/utils/presentProperty";

export interface ResidentPageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  semantic?: ReturnSemantic;
  fallbackRoute?: string;
  fallbackTab?: string;
  rightAction?: React.ReactNode;
  titleKey?: MessageKey;
  subtitleKey?: MessageKey;
  actions?: ResidentHeaderAction[];
  variant?: ResidentHeaderVariant;
  roleLabelKey?: MessageKey;
  testID?: string;
  contextLabel?: string;
  contextLabelKey?: MessageKey;
}

export function ResidentPageHeader({
  title,
  subtitle,
  showBackButton = true,
  onBackPress,
  semantic = 'back',
  fallbackRoute,
  fallbackTab,
  actions,
  titleKey,
  subtitleKey,
  contextLabel,
  contextLabelKey,
  variant = 'detail',
  roleLabelKey = 'resident.header.roles.owner',
  testID,
}: ResidentPageHeaderProps) {
  return (
    <ResidentAppHeader
      variant={variant}
      titleKey={titleKey ?? title}
      {...includeWhenPresent("subtitleKey", subtitleKey ?? subtitle)}
      {...includeWhenPresent("contextLabelKey", contextLabelKey ?? contextLabel)}
      roleLabelKey={roleLabelKey}
      showBackButton={showBackButton}
      semantic={semantic}
      {...includeWhenPresent("fallbackRoute", fallbackRoute)}
      {...includeWhenPresent("fallbackTab", fallbackTab)}
      {...includeWhenPresent("actions", actions)}
      {...includeWhenPresent("onBackPress", onBackPress)}
      includeSafeAreaTop
      {...includeWhenPresent("testID", testID)}
    />
  );
}

export default ResidentPageHeader;
