import * as React from 'react';
import { View, StyleSheet, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import { SocietySkeleton, SocietyShimmerProvider } from '../../ui/loading/SocietySkeleton';
import { Radius } from '../theme/radius';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'card' | 'list-item';

export interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  animation?: 'pulse' | 'wave' | 'none';
  count?: number;
  spacing?: number;
  showAnimation?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function SkeletonLoader({
  variant = 'text',
  width = '100%',
  height,
  borderRadius,
  count = 1,
  spacing = 12,
  showAnimation = true,
  style,
  testID,
}: SkeletonLoaderProps) {
  const resolvedHeight = height ?? (variant === 'circular' ? 44 : variant === 'card' ? 120 : 16);
  const resolvedWidth = variant === 'circular' ? resolvedHeight : width;
  const resolvedRadius =
    borderRadius !== undefined
      ? borderRadius
      : variant === 'circular'
      ? typeof resolvedHeight === 'number'
        ? resolvedHeight / 2
        : Radius.pill
      : variant === 'card'
      ? Radius.card
      : Radius.xs;

  const items = Array.from({ length: count }, (_, i) => (
    <View key={i} style={[i > 0 && { marginTop: spacing }]}>
      <SocietySkeleton
        testID={testID}
        width={resolvedWidth}
        height={resolvedHeight}
        borderRadius={resolvedRadius}
        animate={showAnimation}
        style={style}
      />
    </View>
  ));

  return <SocietyShimmerProvider>{items.length === 1 ? items[0] : <View>{items}</View>}</SocietyShimmerProvider>;
}

export function TextSkeleton({
  lines = 3,
  width = '100%',
  lineHeight = 16,
  spacing = 8,
  ...props
}: {
  lines?: number;
  width?: DimensionValue;
  lineHeight?: number;
  spacing?: number;
} & Omit<SkeletonLoaderProps, 'variant' | 'height'>) {
  const items = Array.from({ length: lines }, (_, i) => {
    const isLast = i === lines - 1 && lines > 1;
    const lineWidth: DimensionValue = isLast ? '65%' : width;
    return (
      <View key={i} style={[i > 0 && { marginTop: spacing }]}>
        <SocietySkeleton
          width={lineWidth}
          height={lineHeight}
          borderRadius={Radius.xs}
          animate={props.showAnimation ?? true}
          style={props.style}
        />
      </View>
    );
  });

  return <SocietyShimmerProvider><View>{items}</View></SocietyShimmerProvider>;
}

export function CardSkeleton({
  lines = 3,
  spacing = 16,
  count = 1,
  ...props
}: { lines?: number; count?: number; spacing?: number } & Omit<SkeletonLoaderProps, 'variant' | 'height'>) {
  return (
    <SocietyShimmerProvider>
      <View style={{ gap: spacing }}>
        {Array.from({ length: count }).map((_, idx) => (
          <View key={idx} style={styles.cardContainer}>
            <SocietySkeleton width="100%" height={100} borderRadius={Radius.md} />
            <View style={{ marginTop: 12 }}>
              <TextSkeleton lines={lines} spacing={8} {...props} />
            </View>
          </View>
        ))}
      </View>
    </SocietyShimmerProvider>
  );
}

export function ListItemSkeleton({
  lines = 2,
  avatar = true,
  ...props
}: { lines?: number; avatar?: boolean } & Omit<SkeletonLoaderProps, 'variant' | 'height'>) {
  return (
    <SocietyShimmerProvider>
      <View style={styles.listItemContainer}>
        {avatar && <SocietySkeleton width={44} height={44} borderRadius={22} />}
        <View style={styles.listItemContent}>
          <SocietySkeleton width="60%" height={16} borderRadius={Radius.xs} />
          <View style={{ marginTop: 6 }}>
            <TextSkeleton lines={lines} spacing={6} {...props} />
          </View>
        </View>
      </View>
    </SocietyShimmerProvider>
  );
}

export function AvatarSkeleton({
  size = 44,
  ...props
}: { size?: number } & Omit<SkeletonLoaderProps, 'variant' | 'width' | 'height'>) {
  return (
    <SocietyShimmerProvider>
      <SocietySkeleton width={size} height={size} borderRadius={size / 2} {...props} />
    </SocietyShimmerProvider>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  listItemContent: {
    flex: 1,
  },
});