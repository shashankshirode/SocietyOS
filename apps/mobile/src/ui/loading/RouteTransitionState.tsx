import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { SocietyLoadingIndicator } from './SocietyLoadingIndicators';
import { LoadingIntent } from '../../core/async/AsyncState';
import { Spacing } from '../../shared/theme/spacing';

export interface RouteTransitionStateProps {
  readonly message?: string;
  readonly children?: React.ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

export function RouteTransitionState({
  message = 'Loading view...',
  children,
  style,
  testID,
}: RouteTransitionStateProps) {
  const { semantic } = useAppTheme();

  return (
    <View
      testID={testID}
      style={[
        {
          flex: 1,
          backgroundColor: semantic.surface.canvas,
          alignItems: 'center',
          justifyContent: 'center',
          padding: Spacing.lg,
        },
        style,
      ]}
    >
      {children ?? (
        <SocietyLoadingIndicator
          intent={LoadingIntent.ROUTE}
          size="lg"
          message={message}
        />
      )}
    </View>
  );
}

export default RouteTransitionState;
