import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Skeleton } from './Skeleton';
import { skeletonSizes } from '../tokens/premium-skeleton';
import { Spacing } from '../../shared/theme/spacing';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { SpacerSkeleton, ImageSkeleton, SearchBarSkeleton } from './SkeletonComponents';
import type { Absent } from "../../shared/types/absence.types";
export interface BaseCompositionProps {
    style?: StyleProp<ViewStyle> | Absent;
    testID?: string | Absent;
    animate?: boolean | Absent;
    count?: number | Absent;
}
export function ListSkeleton({ count = 5, variant = 'md', showIcon = true, showBadge = true, style, testID, animate }: BaseCompositionProps & {
    variant?: keyof typeof skeletonSizes.listItem | Absent;
    showIcon?: boolean | Absent;
    showBadge?: boolean | Absent;
}) {
    const iconConfig = skeletonSizes.icon.lg;
    const iconSize = iconConfig.width;
    return (<View style={[{ gap: Spacing.md }, style]} testID={testID} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {Array.from({ length: count }).map((_, i) => (<View key={i} style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.md,
                paddingVertical: Spacing.sm,
                paddingHorizontal: Spacing.md,
                backgroundColor: 'transparent',
            }}>
          {showIcon && (<View style={{ width: iconSize, height: iconSize, borderRadius: iconSize / 2, backgroundColor: 'transparent' }}>
              <Skeleton width={iconSize} height={iconSize} borderRadius={iconSize / 2} animate={animate}/>
            </View>)}
          <View style={{ flex: 1, gap: Spacing.xs }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <Skeleton width="60%" height={14} borderRadius={3} animate={animate}/>
              {showBadge && <Skeleton width={64} height={24} borderRadius={12} animate={animate}/>}
            </View>
            <Skeleton width="80%" height={12} borderRadius={3} animate={animate}/>
          </View>
        </View>))}
    </View>);
}
export function CardContentSkeleton({ variant = 'md', showIcon = true, showBadge = true, lines = 2, style, testID, animate }: BaseCompositionProps & {
    variant?: keyof typeof skeletonSizes.card | Absent;
    showIcon?: boolean | Absent;
    showBadge?: boolean | Absent;
    lines?: number | Absent;
}) {
    const cardConfig = skeletonSizes.card[variant];
    const iconConfig = skeletonSizes.icon.xl;
    return (<View style={[{
                width: cardConfig.width,
                height: cardConfig.height,
                borderRadius: cardConfig.borderRadius,
                padding: Spacing.md,
                gap: Spacing.md,
            }, style]} testID={testID} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md }}>
        {showIcon && (<Skeleton width={iconConfig.width} height={iconConfig.height} borderRadius={iconConfig.borderRadius} animate={animate}/>)}
        <View style={{ flex: 1, gap: Spacing.xs }}>
          <Skeleton width="70%" height={14} borderRadius={3} animate={animate}/>
          {lines >= 2 && <Skeleton width="50%" height={12} borderRadius={3} animate={animate}/>}
          {lines >= 3 && <Skeleton width="40%" height={12} borderRadius={3} animate={animate}/>}
        </View>
        {showBadge && <Skeleton width={64} height={24} borderRadius={12} animate={animate}/>}
      </View>
    </View>);
}
export function StatCardRowSkeleton({ count = 4, style, testID, animate }: BaseCompositionProps) {
    const cardConfig = skeletonSizes.stat.card;
    const iconConfig = skeletonSizes.stat.icon;
    const valueConfig = skeletonSizes.stat.value;
    const labelConfig = skeletonSizes.stat.label;
    return (<View style={[{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: Spacing.md,
            }, style]} testID={testID} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {Array.from({ length: count }).map((_, i) => (<View key={i} style={{
                width: cardConfig.width,
                height: cardConfig.height,
                borderRadius: cardConfig.borderRadius,
                padding: Spacing.md,
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.md,
            }}>
          <Skeleton width={iconConfig.width} height={iconConfig.height} borderRadius={iconConfig.borderRadius} animate={animate}/>
          <View style={{ flex: 1, gap: Spacing.xs }}>
            <Skeleton width={valueConfig.width} height={valueConfig.height} borderRadius={valueConfig.borderRadius} animate={animate}/>
            <Skeleton width={labelConfig.width} height={labelConfig.height} borderRadius={labelConfig.borderRadius} animate={animate}/>
          </View>
        </View>))}
    </View>);
}
export function AvatarWithTextSkeleton({ avatarSize = 'md', textVariant = 'md', showCaption = true, style, testID, animate }: BaseCompositionProps & {
    avatarSize?: keyof typeof skeletonSizes.avatar | Absent;
    textVariant?: keyof typeof skeletonSizes.text | Absent;
    showCaption?: boolean | Absent;
}) {
    const avatarConfig = skeletonSizes.avatar[avatarSize];
    return (<View style={[{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }, style]} testID={testID} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Skeleton width={avatarConfig.width} height={avatarConfig.height} borderRadius={avatarConfig.borderRadius} animate={animate}/>
      <View style={{ flex: 1, gap: 2 }}>
        <Skeleton width="60%" height={14} borderRadius={3} animate={animate}/>
        {showCaption && <Skeleton width="40%" height={10} borderRadius={3} animate={animate}/>}
      </View>
    </View>);
}
export function TimelineItemSkeleton({ style, testID, animate }: BaseCompositionProps) {
    const dotConfig = { width: 12, height: 12, borderRadius: 6 };
    const lineConfig = { width: 2, height: 60, borderRadius: 1 };
    return (<View style={[{ flexDirection: 'row', gap: Spacing.md }, style]} testID={testID} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={{ width: dotConfig.width, height: '100%', alignItems: 'center', justifyContent: 'flex-start' }}>
        <Skeleton width={dotConfig.width} height={dotConfig.height} borderRadius={dotConfig.borderRadius} animate={animate}/>
        <Skeleton width={lineConfig.width} height={lineConfig.height} borderRadius={lineConfig.borderRadius} animate={animate}/>
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Skeleton width="40%" height={10} borderRadius={3} animate={animate}/>
        <Skeleton width="80%" height={14} borderRadius={3} animate={animate}/>
        <Skeleton width="55%" height={12} borderRadius={3} animate={animate}/>
      </View>
    </View>);
}
export function TimelineSkeleton({ count = 4, items, style, testID, animate }: BaseCompositionProps & {
    items?: number | Absent;
}) {
    const effectiveCount = items ?? count;
    return (<View style={[{ gap: Spacing.md }, style]} testID={testID} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {Array.from({ length: effectiveCount }).map((_, i) => (<TimelineItemSkeleton key={i} animate={animate}/>))}
    </View>);
}
export function FormFieldSkeleton({ style, testID, animate }: BaseCompositionProps) {
    const labelConfig = skeletonSizes.text.sm;
    const inputConfig = skeletonSizes.input.md;
    return (<View style={[{ gap: Spacing.sm }, style]} testID={testID} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Skeleton width={labelConfig.width} height={labelConfig.height} borderRadius={labelConfig.borderRadius} animate={animate}/>
      <Skeleton width="100%" height={inputConfig.height} borderRadius={inputConfig.borderRadius} animate={animate}/>
    </View>);
}
export function FormSkeleton({ fields = 4, showButton = true, style, testID, animate }: BaseCompositionProps & {
    fields?: number | Absent;
    showButton?: boolean | Absent;
}) {
    return (<View style={[{ gap: Spacing.lg }, style]} testID={testID} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {Array.from({ length: fields }).map((_, i) => (<FormFieldSkeleton key={i} animate={animate}/>))}
      {showButton && <Skeleton width="100%" height={48} borderRadius={12} animate={animate}/>}
    </View>);
}
export function FilterChipsSkeleton({ count = 4, style, testID, animate }: BaseCompositionProps & {
    count?: number | Absent;
}) {
    const chipConfig = { width: 72, height: 32, borderRadius: 16 };
    return (<View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }, style]} testID={testID} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {Array.from({ length: count }).map((_, i) => (<Skeleton key={i} width={chipConfig.width} height={chipConfig.height} borderRadius={chipConfig.borderRadius} animate={animate}/>))}
    </View>);
}
export function FilterBarSkeleton({ style, testID, animate }: BaseCompositionProps) {
    return (<View style={[{ flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.md }, style]} testID={testID} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <SearchBarSkeleton animate={animate}/>
      <FilterChipsSkeleton count={3} animate={animate}/>
    </View>);
}
export function HeaderSkeleton({ style, testID, animate }: BaseCompositionProps) {
    return (<View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm }, style]} testID={testID} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Skeleton width="60%" height={20} borderRadius={3} animate={animate}/>
      <Skeleton width={40} height={40} borderRadius={20} animate={animate}/>
    </View>);
}
export function ScreenSkeleton({ variant = 'list', style, testID, animate }: BaseCompositionProps & {
    variant?: 'dashboard' | 'list' | 'detail' | 'form' | 'timeline' | Absent;
}) {
    if (variant === 'dashboard') {
        return (<View style={[{ paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, gap: Spacing.xl }, style]} testID={testID} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <StatCardRowSkeleton count={4} animate={animate}/>
        <SpacerSkeleton variant="lg" animate={animate}/>
        <CardContentSkeleton variant="lg" animate={animate}/>
        <SpacerSkeleton variant="md" animate={animate}/>
        <ListSkeleton count={3} animate={animate}/>
      </View>);
    }
    if (variant === 'detail') {
        return (<View style={[{ paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, gap: Spacing.xl }, style]} testID={testID} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={{ gap: Spacing.sm }}>
          <Skeleton width="60%" height={20} borderRadius={3} animate={animate}/>
          <Skeleton width="40%" height={14} borderRadius={3} animate={animate}/>
        </View>
        <SpacerSkeleton variant="md" animate={animate}/>
        <ImageSkeleton variant="featured" animate={animate}/>
        <SpacerSkeleton variant="md" animate={animate}/>
        <CardContentSkeleton variant="md" lines={3} animate={animate}/>
        <SpacerSkeleton variant="md" animate={animate}/>
        <FormSkeleton fields={3} animate={animate}/>
      </View>);
    }
    if (variant === 'form') {
        return (<View style={[{ paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, gap: Spacing.xl }, style]} testID={testID} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={{ gap: Spacing.sm }}>
          <Skeleton width="50%" height={20} borderRadius={3} animate={animate}/>
          <Skeleton width="80%" height={12} borderRadius={3} animate={animate}/>
        </View>
        <SpacerSkeleton variant="md" animate={animate}/>
        <FormSkeleton fields={5} animate={animate}/>
      </View>);
    }
    if (variant === 'timeline') {
        return (<View style={[{ paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, gap: Spacing.xl }, style]} testID={testID} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={{ gap: Spacing.sm }}>
          <Skeleton width="50%" height={20} borderRadius={3} animate={animate}/>
        </View>
        <SpacerSkeleton variant="md" animate={animate}/>
        <TimelineSkeleton items={6} animate={animate}/>
      </View>);
    }
    return (<View style={[{ paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, gap: Spacing.xl }, style]} testID={testID} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Skeleton width="100%" height={44} borderRadius={12} animate={animate}/>
      <SpacerSkeleton variant="md" animate={animate}/>
      <FilterBarSkeleton animate={animate}/>
      <SpacerSkeleton variant="md" animate={animate}/>
      <ListSkeleton count={6} animate={animate}/>
    </View>);
}

