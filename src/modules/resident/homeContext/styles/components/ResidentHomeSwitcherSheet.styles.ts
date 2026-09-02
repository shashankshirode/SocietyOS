import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 34,
        borderTopRightRadius: 34,
        paddingTop: Spacing.xs,
        paddingBottom: 40,
        maxHeight: '90%',
    },
    dragHandle: {
        width: 40,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: 'rgba(0,0,0,0.1)',
        alignSelf: 'center',
        marginBottom: Spacing.sm,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.lg,
    },
    headerCopy: { flex: 1, gap: 4 },
    eyebrow: { letterSpacing: 0.7 },
    closeButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    closeIcon: {
        padding: 4,
    },
    scroll: {
        maxHeight: 560,
    },
    scrollContent: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.sm,
    },
    search: {
        minHeight: 48,
        borderWidth: 1,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.md,
    },
    searchInput: { flex: 1, minWidth: 0, minHeight: 44 },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.xl,
        gap: Spacing.md,
    },
});

export function createTextColorStyle(color: string) {
    return { color } as const;
}

export function createBackgroundStyle(backgroundColor: string) {
    return { backgroundColor } as const;
}

export function createSearchStyle(borderColor: string, backgroundColor: string) {
    return { borderColor, backgroundColor } as const;
}
