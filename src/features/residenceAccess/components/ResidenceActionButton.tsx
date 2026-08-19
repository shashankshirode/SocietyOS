import React from 'react';
import { AppButton } from '../../../shared/components/AppButton';
import type { ResidenceAccessAction } from '../models/residenceAccess.types';

interface ResidenceActionButtonProps {
  readonly action: ResidenceAccessAction;
  readonly onPress: (action: ResidenceAccessAction) => void;
  readonly primary?: boolean;
  readonly loading?: boolean;
}

export function ResidenceActionButton({
  action,
  onPress,
  primary = false,
  loading = false,
}: ResidenceActionButtonProps) {
  return (
    <AppButton
      title={action.label}
      accessibilityLabel={action.accessibilityLabel}
      onPress={() => onPress(action)}
      variant={action.destructive ? 'danger' : primary ? 'primary' : 'outline'}
      disabled={!action.enabled}
      loading={loading}
      fullWidth
    />
  );
}
