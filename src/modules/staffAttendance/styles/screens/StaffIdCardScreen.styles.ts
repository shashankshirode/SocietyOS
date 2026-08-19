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
        marginBottom: Spacing.lg,
    },
    title: {
        ...Typography.h2,
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.neutral,
    },
    cardWrapper: {
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    idCard: {
        width: 320,
        height: 200,
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.sm,
        gap: Spacing.sm,
    },
    societyName: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    cardTitle: {
        color: Colors.white,
        fontSize: 9,
        fontWeight: '600',
        opacity: 0.8,
    },
    cardBody: {
        flexDirection: 'row',
        padding: Spacing.md,
        flex: 1,
        gap: Spacing.md,
    },
    photoBox: {
        width: 70,
        height: 70,
        borderRadius: Layout.borderRadius.sm,
        backgroundColor: Colors.neutralLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    info: {
        flex: 1,
        justifyContent: 'center',
    },
    nameText: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    categoryText: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.primary,
        marginTop: 2,
    },
    codeText: {
        ...Typography.caption,
        color: Colors.neutral,
        marginTop: 2,
    },
    validText: {
        ...Typography.caption,
        color: Colors.success,
        fontWeight: '600',
        marginTop: 2,
    },
    cardFooter: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingHorizontal: Spacing.md,
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.neutralLight,
    },
    qrCodePlaceholder: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerInfo: {
        alignItems: 'flex-end',
    },
    footerLabel: {
        fontSize: 8,
        color: Colors.neutral,
        fontWeight: '600',
    },
    footerVal: {
        fontSize: 10,
        color: Colors.textPrimary,
        fontWeight: '600',
    },
    actions: {
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        borderRadius: Layout.borderRadius.md,
        paddingVertical: Spacing.md,
        gap: Spacing.sm,
    },
    btnSec: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    btnText: {
        ...Typography.body,
        color: Colors.white,
        fontWeight: '600',
    },
    btnTextSec: {
        ...Typography.body,
        color: Colors.primary,
        fontWeight: '600',
    },
});
