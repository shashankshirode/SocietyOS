import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { AppIconName, ContextualInsightPriority } from '../data/residentContextualInsights.types';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';

export interface ContextualInsightIconProps {
  name: AppIconName;
  priority: ContextualInsightPriority;
  size?: number;
}

export function ContextualInsightIcon({ name, priority, size = 20 }: ContextualInsightIconProps) {
  const { colors } = useAppTheme();
  let color = colors.textMuted;
  if (priority === 'low') color = colors.info;
  else if (priority === 'medium') color = colors.primary;
  else if (priority === 'high') color = colors.warning;
  else if (priority === 'critical') color = colors.danger;

  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
    />
  );
}
export default ContextualInsightIcon;
