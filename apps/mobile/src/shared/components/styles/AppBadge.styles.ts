import { StyleSheet } from "react-native";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
export const styles = StyleSheet.create({
    badge: {
        borderRadius: Radius.pill,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        alignSelf: 'flex-start',
    },
    label: {
        ...Typography.caption,
        fontWeight: '700',
    },
});
