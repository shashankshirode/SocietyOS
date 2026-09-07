import React, { forwardRef } from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, TextStyle, ImageStyle, type ImageSourcePropType } from 'react-native';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { spacing } from '../tokens/premium-spacing';
import { radius } from '../tokens/premium-radius';
import { typography } from '../tokens/premium-typography';
import { colors, getColors } from '../tokens/premium-colors';
import type { Absent } from "../../shared/types/absence.types";
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export interface AvatarProps {
    source?: ImageSourcePropType | Absent;
    name?: string | Absent;
    size?: AvatarSize | Absent;
    variant?: 'circle' | 'rounded' | 'square' | Absent;
    status?: 'online' | 'offline' | 'busy' | 'away' | Absent;
    style?: ViewStyle | Absent;
    testID?: string | Absent;
}
export interface AvatarGroupProps {
    children?: React.ReactNode;
    max?: number;
    spacing?: number;
    style?: ViewStyle;
}
const sizeMap = {
    xs: { width: 24, height: 24, fontSize: 10, borderRadius: 12, statusSize: 8 },
    sm: { width: 32, height: 32, fontSize: 12, borderRadius: 16, statusSize: 10 },
    md: { width: 40, height: 40, fontSize: 14, borderRadius: 20, statusSize: 12 },
    lg: { width: 48, height: 48, fontSize: 16, borderRadius: 24, statusSize: 14 },
    xl: { width: 64, height: 64, fontSize: 20, borderRadius: 32, statusSize: 16 },
    xxl: { width: 96, height: 96, fontSize: 32, borderRadius: 48, statusSize: 20 },
};
const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};
const colorPalette = [
    '#3B82F6', '#8B5CF6', '#EC4899', '#F43F5E', '#EF4444',
    '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
    '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#6366F1',
];
const getColorFromName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colorPalette[Math.abs(hash) % colorPalette.length];
};
const statusColors = {
    online: '#10B981',
    offline: '#64748B',
    busy: '#EF4444',
    away: '#F59E0B',
};
export const Avatar = forwardRef<View, AvatarProps>(({ source, name, size = 'md', variant = 'circle', status, style, testID }, ref) => {
    const { dark } = useAppTheme();
    const themeColors = getColors(dark ? 'dark' : 'light');
    const { width, height, fontSize, statusSize } = sizeMap[size];
    const borderRadius = variant === 'circle' ? 9999 : variant === 'rounded' ? 16 : 8;
    const avatarStyle: ViewStyle = {
        width,
        height,
        borderRadius,
        backgroundColor: themeColors.surface.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    };
    if (style) {
        Object.assign(avatarStyle, style);
    }
    const imageStyle: ImageStyle = {
        width,
        height,
        borderRadius,
    };
    const textStyle: TextStyle = {
        fontSize,
        fontWeight: typography.fontWeight.bold,
        color: themeColors.text.inverse,
    };
    const statusStyle: ViewStyle = {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: statusSize,
        height: statusSize,
        borderRadius: statusSize / 2,
        backgroundColor: statusColors[status || 'offline'],
        borderWidth: 2,
        borderColor: themeColors.surface.primary,
    };
    return (<View ref={ref} style={avatarStyle} testID={testID}>
        {source ? (<Image source={source} style={imageStyle} resizeMode="cover"/>) : name ? (<Text style={textStyle}>{getInitials(name)}</Text>) : (<View style={{ width: '100%', height: '100%', borderRadius, backgroundColor: getColorFromName(name || 'unknown') }}/>)}
        {status && <View style={statusStyle}/>}
      </View>);
});
Avatar.displayName = 'Avatar';
export function AvatarGroup({ children, max = 4, spacing = -8, style }: AvatarGroupProps) {
    const childArray = React.Children.toArray(children);
    const visibleChildren = childArray.slice(0, max);
    const extra = childArray.length - max;
    return (<View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
      {visibleChildren.map((child, index) => (<View key={index} style={{ marginLeft: index === 0 ? 0 : spacing, zIndex: visibleChildren.length - index }}>
          {child}
        </View>))}
      {extra > 0 && (<View style={{
                marginLeft: spacing,
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#64748B',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
          <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>+{extra}</Text>
        </View>)}
    </View>);
}
export default Avatar;

