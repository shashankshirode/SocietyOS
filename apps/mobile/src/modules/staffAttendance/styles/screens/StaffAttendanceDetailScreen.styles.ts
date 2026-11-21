import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        padding: Spacing.md,
    },
    header: {
        marginBottom: Spacing.md,
    },
    title: {
        ...Typography.h2,
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.neutral,
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        justifyContent: 'space-around',
        marginBottom: Spacing.lg,
    },
    statBox: {
        alignItems: 'center',
    },
    statLabel: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    statVal: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginTop: 2,
    },
    successText: { color: Colors.success },
    warningText: { color: Colors.warning },
    dangerText: { color: Colors.danger },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    sectionTitle: {
        ...Typography.h3,
        color: Colors.textPrimary,
    },
    correctBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    correctBtnText: {
        ...Typography.caption,
        color: Colors.primary,
        fontWeight: '600',
    },
    logsCard: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    logRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    dateText: {
        ...Typography.body,
        fontWeight: '500',
        color: Colors.textPrimary,
    },
    timeText: {
        ...Typography.caption,
        color: Colors.neutral,
        marginTop: 2,
    },
});
