import React, { useRef } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useActiveResidentHome } from '../homeContext/hooks/useActiveResidentHome';
import { useMessages } from '../../../shared/constants/useMessages';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { Spacing } from '../../../shared/theme/spacing';
import { SafeText } from '../../../shared/components/SafeText';
import { SocietyButton } from '../../../shared/components/SocietyButton';

export interface ResidenceContextGuardState {
  boundScope: string;
  currentScope: string;
  isStale: boolean;
  activeContext: ReturnType<typeof useActiveResidentHome>['activeContext'];
}

export function useResidenceContextGuard(): ResidenceContextGuardState {
  const { activeContext } = useActiveResidentHome();
  const initialScopeRef = useRef(activeContext.dataScopeKey);

  return {
    boundScope: initialScopeRef.current,
    currentScope: activeContext.dataScopeKey,
    isStale: initialScopeRef.current !== activeContext.dataScopeKey,
    activeContext,
  };
}

export interface ResidenceContextGuardProps {
  isStale: boolean;
  onRestart?: () => void;
  restartLabel?: string;
  message?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ResidenceContextGuard({
  isStale,
  onRestart,
  restartLabel,
  message,
  children,
  style,
}: ResidenceContextGuardProps) {
  const theme = useAppTheme();
  const messages = useMessages();

  if (!isStale) {
    return <>{children}</>;
  }

  const defaultMessage =
    messages.visitors?.residenceChanged ??
    'Your active residence changed. Return and start this draft again.';

  return (
    <View style={[{ gap: Spacing.md }, style]}>
      <View
        style={{
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          borderColor: theme.semantic.status.danger,
          borderWidth: 1,
          borderRadius: 12,
          padding: Spacing.md,
          gap: Spacing.sm,
        }}
      >
        <SafeText variant="bodyStrong" style={{ color: theme.semantic.status.danger }}>
          {message ?? defaultMessage}
        </SafeText>
        {onRestart ? (
          <SocietyButton
            title={restartLabel ?? 'Restart Flow'}
            onPress={onRestart}
            variant="secondary"
            size="sm"
            style={{ alignSelf: 'flex-start' }}
          />
        ) : null}
      </View>
      <View style={{ opacity: 0.35, pointerEvents: 'none' }}>
        {children}
      </View>
    </View>
  );
}
