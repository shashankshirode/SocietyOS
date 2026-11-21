import React, { useCallback, useMemo } from 'react';
import { View, ScrollView, StyleSheet, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge as ScreenEdge } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { spacing } from '../tokens/premium-spacing';
import { colors, getColors } from '../tokens/premium-colors';
import type { Absent } from "../../shared/types/absence.types";
export type { ScreenEdge };
export type LayoutVariant = 'default' | 'scroll' | 'modal' | 'fullscreen';
export interface LayoutProps {
    children: React.ReactNode;
    variant?: LayoutVariant | Absent;
    edges?: ScreenEdge[] | Absent;
    style?: ViewStyle | Absent;
    contentStyle?: ViewStyle | Absent;
    edgesInset?: {
        top?: number | Absent;
        bottom?: number | Absent;
        left?: number | Absent;
        right?: number | Absent;
    } | Absent;
}
export function Layout({ children, variant = 'scroll', edges = ['bottom'], style, contentStyle, edgesInset, }: LayoutProps) {
    const { dark } = useAppTheme();
    const colors = getColors(dark ? 'dark' : 'light');
    const safeEdges = useMemo(() => edges, [edges]);
    if (variant === 'scroll') {
        return (<SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface.primary }, style]} edges={edges}>
        <ScrollView contentContainerStyle={[styles.scrollContent, contentStyle]} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </SafeAreaView>);
    }
    if (variant === 'modal') {
        return (<SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface.primary }, style]} edges={edges}>
        {children}
      </SafeAreaView>);
    }
    if (variant === 'fullscreen') {
        return (<SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface.primary, flex: 1 }, style]} edges={edges}>
        {children}
      </SafeAreaView>);
    }
    return (<SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface.primary, flex: 1 }, style]} edges={edges}>
      {children}
    </SafeAreaView>);
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 100,
    },
});

