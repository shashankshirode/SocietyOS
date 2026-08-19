import { StyleSheet } from "react-native";
import { residentColors } from "../../../../../shared/theme/residentColors";
export const styles = StyleSheet.create({
    outerContainer: {
        width: '100%',
    },
    container: {
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 8,
    },
    suggestionText: {
        flex: 1,
        fontWeight: '600',
    },
    pressableBackgroundColorBorderColor: {
        backgroundColor: residentColors.onBrandSubtle,
        borderColor: residentColors.onBrandSoft,
    },
    safeTextColor: { color: residentColors.onBrand }
});

