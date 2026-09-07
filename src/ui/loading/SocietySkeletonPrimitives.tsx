import React from 'react';
import { View, ScrollView, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import { SocietySkeleton } from './SocietySkeleton';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { Spacing } from '../../shared/theme/spacing';
import { Radius } from '../../shared/theme/radius';

export interface SocietySkeletonTextProps {
  readonly lines?: number;
  readonly lineHeight?: number;
  readonly lastLineWidth?: DimensionValue;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

export function SocietySkeletonText({
  lines = 2,
  lineHeight = 14,
  lastLineWidth = '60%',
  style,
  testID,
}: SocietySkeletonTextProps) {
  const lineArray = Array.from({ length: Math.max(1, lines) }, (_, index) => index);

  return (
    <View testID={testID} style={[{ gap: Spacing.xs }, style]}>
      {lineArray.map((index) => {
        const isLast = index === lineArray.length - 1;
        const width: DimensionValue = isLast && lines > 1 ? lastLineWidth : '100%';
        return (
          <SocietySkeleton
            key={index}
            width={width}
            height={lineHeight}
            borderRadius={Radius.xs}
          />
        );
      })}
    </View>
  );
}

export interface SocietySkeletonAvatarProps {
  readonly size?: number;
  readonly rounded?: boolean;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

export function SocietySkeletonAvatar({
  size = 40,
  rounded = true,
  style,
  testID,
}: SocietySkeletonAvatarProps) {
  return (
    <SocietySkeleton
      {...(testID === undefined ? {} : { testID })}
      width={size}
      height={size}
      borderRadius={rounded ? size / 2 : Radius.md}
      style={style}
    />
  );
}

export interface SocietySkeletonSurfaceProps {
  readonly children?: React.ReactNode;
  readonly height?: DimensionValue;
  readonly borderRadius?: number;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

export function SocietySkeletonSurface({
  children,
  height,
  borderRadius = Radius.card,
  style,
  testID,
}: SocietySkeletonSurfaceProps) {
  const { semantic } = useAppTheme();

  return (
    <View
      testID={testID}
      style={[
        {
          backgroundColor: semantic.surface.raised,
          borderRadius,
          borderWidth: 1,
          borderColor: semantic.border.subtle,
          padding: Spacing.md,
          overflow: 'hidden',
          height,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export interface SocietySkeletonHeaderProps {
  readonly showBackButton?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

export function SocietySkeletonHeader({ showBackButton = true, style }: SocietySkeletonHeaderProps) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm }, style]}>
      {showBackButton ? <SocietySkeleton width={36} height={36} borderRadius={Radius.pill} /> : null}
      <View style={{ flex: 1, gap: 4 }}>
        <SocietySkeleton width="55%" height={22} borderRadius={Radius.xs} />
        <SocietySkeleton width="35%" height={12} borderRadius={Radius.xs} />
      </View>
      <SocietySkeleton width={36} height={36} borderRadius={Radius.pill} />
    </View>
  );
}

export interface SocietySkeletonSearchBarProps {
  readonly style?: StyleProp<ViewStyle>;
}

export function SocietySkeletonSearchBar({ style }: SocietySkeletonSearchBarProps) {
  const { semantic } = useAppTheme();
  return (
    <View
      style={[
        {
          height: 44,
          borderRadius: Radius.md,
          backgroundColor: semantic.surface.raised,
          borderWidth: 1,
          borderColor: semantic.border.subtle,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: Spacing.md,
          gap: Spacing.sm,
        },
        style,
      ]}
    >
      <SocietySkeleton width={18} height={18} borderRadius={Radius.pill} />
      <SocietySkeleton width="60%" height={14} borderRadius={Radius.xs} />
    </View>
  );
}

export interface SocietySkeletonFilterChipsProps {
  readonly count?: number;
  readonly style?: StyleProp<ViewStyle>;
}

export function SocietySkeletonFilterChips({ count = 4, style }: SocietySkeletonFilterChipsProps) {
  const chipWidths: number[] = [68, 92, 80, 104, 76];
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[{ flexDirection: 'row', gap: Spacing.xs, paddingHorizontal: Spacing.xs }, style]}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SocietySkeleton
          key={i}
          width={chipWidths[i % chipWidths.length] ?? 80}
          height={34}
          borderRadius={Radius.pill}
        />
      ))}
    </ScrollView>
  );
}

export interface SocietySkeletonStatCardsProps {
  readonly count?: number;
  readonly style?: StyleProp<ViewStyle>;
}

export function SocietySkeletonStatCards({ count = 4, style }: SocietySkeletonStatCardsProps) {
  const { semantic } = useAppTheme();
  return (
    <View style={[{ flexDirection: 'row', gap: Spacing.xs }, style]}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            backgroundColor: semantic.surface.raised,
            borderWidth: 1,
            borderColor: semantic.border.subtle,
            borderRadius: Radius.md,
            padding: Spacing.sm,
            gap: 6,
          }}
        >
          <SocietySkeleton width={24} height={24} borderRadius={Radius.xs} />
          <SocietySkeleton width="70%" height={18} borderRadius={Radius.xs} />
          <SocietySkeleton width="50%" height={10} borderRadius={Radius.xs} />
        </View>
      ))}
    </View>
  );
}

export interface SocietySkeletonListProps {
  readonly count?: number;
  readonly renderItem?: (index: number) => React.ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

export function SocietySkeletonList({
  count = 3,
  renderItem,
  style,
  testID,
}: SocietySkeletonListProps) {
  const items = Array.from({ length: Math.max(1, count) }, (_, index) => index);

  return (
    <View testID={testID} style={[{ gap: Spacing.md }, style]}>
      {items.map((index) => {
        if (renderItem) {
          return <React.Fragment key={index}>{renderItem(index)}</React.Fragment>;
        }
        return (
          <SocietySkeletonSurface key={index}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <SocietySkeletonAvatar size={40} />
              <View style={{ flex: 1, gap: Spacing.xs }}>
                <SocietySkeleton width="70%" height={16} />
                <SocietySkeleton width="45%" height={12} />
              </View>
              <SocietySkeleton width={60} height={24} borderRadius={Radius.pill} />
            </View>
          </SocietySkeletonSurface>
        );
      })}
    </View>
  );
}

export interface SocietySkeletonTimelineProps {
  readonly steps?: number;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

export function SocietySkeletonTimeline({
  steps = 3,
  style,
  testID,
}: SocietySkeletonTimelineProps) {
  const stepArray = Array.from({ length: Math.max(1, steps) }, (_, index) => index);

  return (
    <View testID={testID} style={[{ gap: Spacing.sm }, style]}>
      {stepArray.map((index) => {
        const isLast = index === stepArray.length - 1;
        return (
          <View key={index} style={{ flexDirection: 'row', gap: Spacing.md }}>
            <View style={{ alignItems: 'center', width: 20 }}>
              <SocietySkeleton width={12} height={12} borderRadius={6} />
              {!isLast ? (
                <SocietySkeleton width={2} height={44} style={{ marginVertical: 4 }} />
              ) : null}
            </View>
            <View style={{ flex: 1, gap: Spacing.xs, paddingBottom: isLast ? 0 : Spacing.md }}>
              <SocietySkeleton width="50%" height={14} />
              <SocietySkeleton width="85%" height={12} />
            </View>
          </View>
        );
      })}
    </View>
  );
}
