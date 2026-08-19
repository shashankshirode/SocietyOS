import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    searchBar: {
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.sm,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    infoCol: {
        flex: 1,
        marginRight: Spacing.md,
    },
    name: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    society: {
        ...Typography.bodySmall,
        color: Colors.primary,
        fontWeight: '600',
        marginTop: 2,
        marginBottom: 4,
    },
    contact: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    status: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.success,
    },
});
