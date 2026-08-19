import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    scroll: {
        padding: Spacing.md,
        paddingBottom: Spacing.xxl,
    },
    list: {
        padding: Spacing.md,
    },
    sectionTitle: {
        ...Typography.sectionTitle,
        color: Colors.textPrimary,
        marginTop: Spacing.lg,
        marginBottom: Spacing.md,
        fontWeight: '700',
    },
    hkCard: {
        marginBottom: Spacing.md,
        backgroundColor: Colors.surface,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    appCardMarginBottom: { marginBottom: Spacing.xl },
    appButtonMarginTop: { marginTop: Spacing.md },
    appCardMarginBottom2: { marginBottom: Spacing.xl },
    appButtonMarginTop2: { marginTop: Spacing.md },
    appCardMarginBottom3: { marginBottom: Spacing.xl },
    appButtonMarginTop3: { marginTop: Spacing.md }
});

