import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        backgroundColor: Colors.white,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconBg: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.neutralLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.sm,
    },
    inBg: {
        backgroundColor: Colors.successLight,
    },
    outBg: {
        backgroundColor: Colors.neutralLight,
    },
    info: {
        flex: 1,
    },
    name: {
        ...Typography.body,
        fontWeight: '500',
        color: Colors.textPrimary,
    },
    meta: {
        ...Typography.caption,
        color: Colors.neutral,
        marginTop: 1,
    },
    right: {
        alignItems: 'flex-end',
    },
    time: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    date: {
        ...Typography.caption,
        color: Colors.neutral,
        marginTop: 1,
    },
    dupBadge: {
        marginTop: 2,
        paddingHorizontal: 4,
        paddingVertical: 1,
    },
});
