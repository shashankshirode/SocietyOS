import { StyleSheet } from "react-native";
import { Colors } from "../../../shared/constants/colors";
import { Typography } from "../../../shared/constants/typography";
export const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: Colors.tabBarBackground,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        paddingTop: 6,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
    },
    tabLabel: {
        ...Typography.caption,
        fontSize: 11,
        fontWeight: '500',
    },
});
