import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    scrollContent: { paddingTop: 16 },
    contentStack: { gap: 24 },
    header: { alignItems: 'center', gap: 16, paddingVertical: 12 },
    circle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
    headerText: { alignItems: 'center', gap: 6 },
    title: { fontWeight: '800' },
    heroContainer: {
        alignItems: 'center',
        gap: 16,
    },
    particleContainer: {
        position: 'absolute',
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    particle: {
        position: 'absolute',
        width: 2,
        height: 60,
        alignItems: 'center',
    },
    particleDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
    },
    successCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    checkmarkWrapper: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    amountLabel: {
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    amountValue: {
        fontSize: 42,
        fontWeight: '800',
    },
    methodBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#E0F2FE',
    },
    successTitle: {
        fontWeight: '800',
        fontSize: 24,
    },
    successSubtitle: {
        fontWeight: '500',
        marginTop: 4,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    primaryAction: {
        flex: 1,
    },
    secondaryAction: {
        flex: 1,
    },
    secondaryActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    shareButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#3B82F6',
        backgroundColor: '#EFF6FF',
    },
    downloadButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#F8FAFC',
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createScrollViewPaddingBottomStyle(paddingBottomValue: number) {
    return {
        paddingBottom: paddingBottomValue
    } as const;
}
export function createAnimatedViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

