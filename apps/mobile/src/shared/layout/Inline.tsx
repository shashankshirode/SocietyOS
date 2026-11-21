import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { Spacing, SpacingToken } from '../theme/spacing';

export interface InlineProps {
  children: React.ReactNode;
  gap?: SpacingToken | number;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  wrap?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Inline({
  children,
  gap = 'sm',
  align = 'center',
  justify,
  wrap = true,
  style,
  testID,
}: InlineProps) {
  const resolvedGap = typeof gap === 'number' ? gap : Spacing[gap] ?? 0;

  const inlineStyle: ViewStyle = {
    flexDirection: 'row',
    gap: resolvedGap,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap ? 'wrap' : 'nowrap',
  };

  return (
    <View testID={testID} style={[inlineStyle, style]}>
      {children}
    </View>
  );
}

export default Inline;
