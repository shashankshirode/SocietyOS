import React from 'react';
import { View, type StyleProp, type ViewStyle, type DimensionValue } from 'react-native';
import { Skeleton } from './Skeleton';
import { skeletonSizes, getSkeletonTheme, createSkeletonStyle } from '../tokens/premium-skeleton';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import type { Absent } from "../../shared/types/absence.types";
export interface BaseSkeletonProps {
    style?: StyleProp<ViewStyle> | Absent;
    testID?: string | Absent;
    animate?: boolean | Absent;
}
export function AvatarSkeleton({ size = 'md', style, testID, animate }: BaseSkeletonProps & {
    size?: keyof typeof skeletonSizes.avatar | Absent;
}) {
    const config = skeletonSizes.avatar[size];
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function ButtonSkeleton({ size = 'md', width = '100%', style, testID, animate }: BaseSkeletonProps & {
    size?: keyof typeof skeletonSizes.button | Absent;
    width?: DimensionValue | Absent;
}) {
    const config = skeletonSizes.button[size];
    return <Skeleton width={width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function InputSkeleton({ size = 'md', width = '100%', style, testID, animate }: BaseSkeletonProps & {
    size?: keyof typeof skeletonSizes.input | Absent;
    width?: DimensionValue | Absent;
}) {
    const config = skeletonSizes.input[size];
    return <Skeleton width={width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function CardSkeleton({ variant = 'md', style, testID, animate }: BaseSkeletonProps & {
    variant?: keyof typeof skeletonSizes.card | Absent;
}) {
    const config = skeletonSizes.card[variant];
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function BadgeSkeleton({ variant = 'md', style, testID, animate }: BaseSkeletonProps & {
    variant?: keyof typeof skeletonSizes.badge | Absent;
}) {
    const config = skeletonSizes.badge[variant];
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function ChipSkeleton({ variant = 'md', style, testID, animate }: BaseSkeletonProps & {
    variant?: keyof typeof skeletonSizes.chip | Absent;
}) {
    const config = skeletonSizes.chip[variant];
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function ListItemSkeleton({ variant = 'md', style, testID, animate }: BaseSkeletonProps & {
    variant?: keyof typeof skeletonSizes.listItem | Absent;
}) {
    const config = skeletonSizes.listItem[variant];
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function ImageSkeleton({ variant = 'medium', style, testID, animate }: BaseSkeletonProps & {
    variant?: keyof typeof skeletonSizes.image | Absent;
}) {
    const config = skeletonSizes.image[variant];
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function IconSkeleton({ size = 'md', style, testID, animate }: BaseSkeletonProps & {
    size?: keyof typeof skeletonSizes.icon | Absent;
}) {
    const config = skeletonSizes.icon[size];
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function TextSkeleton({ variant = 'md', width = '100%', style, testID, animate }: BaseSkeletonProps & {
    variant?: keyof typeof skeletonSizes.text | Absent;
    width?: DimensionValue | Absent;
}) {
    const config = skeletonSizes.text[variant];
    return <Skeleton width={width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function DividerSkeleton({ variant = 'thin', style, testID, animate }: BaseSkeletonProps & {
    variant?: keyof typeof skeletonSizes.divider | Absent;
}) {
    const config = skeletonSizes.divider[variant];
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function SpacerSkeleton({ variant = 'md', style, testID, animate }: BaseSkeletonProps & {
    variant?: keyof typeof skeletonSizes.spacer | Absent;
}) {
    const config = skeletonSizes.spacer[variant];
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function ProgressSkeleton({ variant = 'md', width = '100%', style, testID, animate }: BaseSkeletonProps & {
    variant?: keyof typeof skeletonSizes.progress | Absent;
    width?: DimensionValue | Absent;
}) {
    const config = skeletonSizes.progress[variant];
    return <Skeleton width={width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function TimelineDotSkeleton({ style, testID, animate }: BaseSkeletonProps) {
    const config = skeletonSizes.timeline.dot;
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function TimelineLineSkeleton({ height = 20, style, testID, animate }: BaseSkeletonProps & {
    height?: number;
}) {
    const config = skeletonSizes.timeline.line;
    return <Skeleton width={config.width} height={height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function TimelineConnectorSkeleton({ style, testID, animate }: BaseSkeletonProps) {
    const config = skeletonSizes.timeline.connector;
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function ModalSkeleton({ variant = 'md', style, testID, animate }: BaseSkeletonProps & {
    variant?: keyof typeof skeletonSizes.modal;
}) {
    const config = skeletonSizes.modal[variant];
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function ToastSkeleton({ variant = 'md', style, testID, animate }: BaseSkeletonProps & {
    variant?: keyof typeof skeletonSizes.toast;
}) {
    const config = skeletonSizes.toast[variant];
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function SheetSkeleton({ variant = 'md', style, testID, animate }: BaseSkeletonProps & {
    variant?: keyof typeof skeletonSizes.sheet;
}) {
    const config = skeletonSizes.sheet[variant];
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function NavigationBarSkeleton({ variant = 'tabBar', style, testID, animate }: BaseSkeletonProps & {
    variant?: keyof typeof skeletonSizes.navigation;
}) {
    const config = skeletonSizes.navigation[variant];
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function SearchBarSkeleton({ variant = 'bar', style, testID, animate }: BaseSkeletonProps & {
    variant?: keyof typeof skeletonSizes.search;
}) {
    const config = skeletonSizes.search[variant];
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function FilterChipSkeleton({ variant = 'chip', style, testID, animate }: BaseSkeletonProps & {
    variant?: keyof typeof skeletonSizes.filter;
}) {
    const config = skeletonSizes.filter[variant];
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function StatCardSkeleton({ variant = 'card', style, testID, animate }: BaseSkeletonProps & {
    variant?: keyof typeof skeletonSizes.stat;
}) {
    const config = skeletonSizes.stat[variant];
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function StatIconSkeleton({ variant = 'icon', style, testID, animate }: BaseSkeletonProps & {
    variant?: keyof typeof skeletonSizes.stat;
}) {
    const config = skeletonSizes.stat[variant];
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function StatValueSkeleton({ variant = 'value', style, testID, animate }: BaseSkeletonProps & {
    variant?: keyof typeof skeletonSizes.stat;
}) {
    const config = skeletonSizes.stat[variant];
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export function StatLabelSkeleton({ variant = 'label', style, testID, animate }: BaseSkeletonProps & {
    variant?: keyof typeof skeletonSizes.stat;
}) {
    const config = skeletonSizes.stat[variant];
    return <Skeleton width={config.width} height={config.height} borderRadius={config.borderRadius} style={style} testID={testID} animate={animate}/>;
}
export const SkeletonPresets = {
    avatar: { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl', xxl: 'xxl' } as const,
    button: { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' } as const,
    input: { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg' } as const,
    card: { sm: 'sm', md: 'md', lg: 'lg', xl: 'xl', featured: 'featured' } as const,
    badge: { sm: 'sm', md: 'md', lg: 'lg' } as const,
    chip: { sm: 'sm', md: 'md', lg: 'lg' } as const,
    listItem: { sm: 'sm', md: 'md', lg: 'lg' } as const,
    image: { thumbnail: 'thumbnail', small: 'small', medium: 'medium', large: 'large', featured: 'featured', hero: 'hero' } as const,
    icon: { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl', xxl: 'xxl' } as const,
    text: { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl', display: 'display', label: 'label', caption: 'caption', line: 'line' } as const,
    divider: { thin: 'thin', thick: 'thick' } as const,
    spacer: { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' } as const,
    progress: { sm: 'sm', md: 'md', lg: 'lg' } as const,
    timeline: { dot: 'dot', line: 'line', connector: 'connector' } as const,
    modal: { sm: 'sm', md: 'md', lg: 'lg', full: 'full' } as const,
    toast: { sm: 'sm', md: 'md', lg: 'lg' } as const,
    sheet: { sm: 'sm', md: 'md', lg: 'lg', xl: 'xl', full: 'full' } as const,
    navigation: { tabBar: 'tabBar', header: 'header', backButton: 'backButton' } as const,
    search: { bar: 'bar', input: 'input' } as const,
    filter: { chip: 'chip', bar: 'bar' } as const,
    stat: { card: 'card', icon: 'icon', value: 'value', label: 'label' } as const,
} as const;
export type SkeletonVariantMap = typeof SkeletonPresets;

