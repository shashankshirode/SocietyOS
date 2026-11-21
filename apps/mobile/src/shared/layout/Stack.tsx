import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { Spacing, SpacingToken } from '../theme/spacing';

export interface StackProps {
  children: React.ReactNode;
  gap?: SpacingToken | number;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Stack({
  children,
  gap = 'md',
  align,
  justify,
  style,
  testID,
}: StackProps) {
  const resolvedGap = typeof gap === 'number' ? gap : Spacing[gap] ?? 0;
  
  const stackStyle: ViewStyle = {
    flexDirection: 'column',
    gap: resolvedGap,
    alignItems: align,
    justifyContent: justify,
  };

  return (
    <View testID={testID} style={[stackStyle, style]}>
      {children}
    </View>
  );
}

export default Stack;
