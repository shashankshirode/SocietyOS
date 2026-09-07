import React, { forwardRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { HapticFeedback } from '../../shared/utils/haptics';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { colors, getColors } from '../tokens/premium-colors';
import { typography } from '../tokens/premium-typography';
import { spacing } from '../tokens/premium-spacing';
import { radius } from '../tokens/premium-radius';
import { shadows } from '../tokens/premium-shadows';
import { motion } from '../tokens/premium-motion';
import { performBackNavigation } from '../../shared/navigation/performBackNavigation';
import type { Absent } from "../../shared/types/absence.types";

export interface AppBarProps {
    title: string;
    subtitle?: string | Absent;
    showBackButton?: boolean | Absent;
    onBackPress?: (() => void) | Absent;
    rightActions?: React.ReactNode | Absent;
    style?: ViewStyle | Absent;
    testID?: string | Absent;
}

export const AppBar = forwardRef<View, AppBarProps>(function AppBar({ title, subtitle, showBackButton = true, onBackPress, rightActions, style, testID }, ref) {
    const insets = useSafeAreaInsets();
    const { dark } = useAppTheme();
    const tc = getColors(dark ? 'dark' : 'light');
    const nav = useNavigation<{ canGoBack?: () => boolean; goBack?: () => void; navigate?: (name: string, params?: object) => void }>();
    const handleBack = useCallback(() => {
        HapticFeedback.light();
        performBackNavigation(nav, onBackPress);
    }, [nav, onBackPress]);

    return (
        <View
            ref={ref}
            style={[
                styles.container,
                {
                    backgroundColor: tc.surface.primary,
                    paddingTop: insets.top,
                    minHeight: 56 + insets.top,
                },
                style
            ]}
            testID={testID}
        >
            <View style={styles.content}>
                {showBackButton && (
                    <TouchableOpacity
                        onPress={handleBack}
                        style={styles.backButton}
                        accessibilityLabel="Go back"
                        accessibilityRole="button"
                        testID="appbar-back"
                    >
                        <Ionicons name="chevron-back" size={24} color={tc.text.primary} />
                    </TouchableOpacity>
                )}
                <View style={styles.titleContainer} testID="appbar-title-container">
                    <Text style={[styles.title, { color: tc.text.primary }]}>{title}</Text>
                    {subtitle && <Text style={[styles.subtitle, { color: tc.text.secondary }]}>{subtitle}</Text>}
                </View>
                {rightActions && <View style={styles.rightActions}>{rightActions}</View>}
            </View>
        </View>
    );
});
AppBar.displayName = 'AppBar';
const styles = StyleSheet.create({
    container: {
        height: 56,
        paddingHorizontal: spacing[4],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E2E8F0',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        fontSize: 24,
        fontWeight: '300',
        lineHeight: 28,
    },
    titleContainer: {
        flex: 1,
        paddingHorizontal: spacing[3],
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.lineHeight.tight,
    },
    subtitle: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.regular,
        marginTop: 2,
    },
    rightActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
    },
});
export default AppBar;

