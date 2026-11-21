import { StyleSheet } from "react-native";
import { residentColors } from "../../../../../shared/theme/residentColors";
import { darkPalette } from "../../../../../shared/theme/colors";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: residentColors.darkCanvas,
    },
    brandOverlay: {
        position: 'absolute',
        top: 54,
        left: 24,
        right: 24,
        zIndex: 2,
    },
    orbitField: {
        position: 'absolute',
        width: 196,
        height: 196,
        right: -30,
        top: 104,
        alignItems: 'center',
        justifyContent: 'center',
    },
    orbit: {
        position: 'absolute',
        borderWidth: 1,
        borderColor: residentColors.onBrandSoft,
    },
    orbitOuter: {
        width: 190,
        height: 190,
        borderRadius: 95,
    },
    orbitMiddle: {
        width: 142,
        height: 142,
        borderRadius: 71,
    },
    orbitInner: {
        width: 94,
        height: 94,
        borderRadius: 47,
    },
    homeNode: {
        width: 58,
        height: 58,
        borderRadius: 29,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: darkPalette.primary,
    },
    signalNode: {
        position: 'absolute',
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: residentColors.attentionOnBrand,
        borderWidth: 2,
        borderColor: residentColors.darkCanvas,
    },
    signalNodeTop: {
        top: 26,
        right: 46,
    },
    signalNodeRight: {
        right: 13,
        top: 104,
        backgroundColor: darkPalette.accentTeal,
    },
    signalNodeBottom: {
        bottom: 18,
        left: 62,
        backgroundColor: darkPalette.accentSky,
    },
    contextLine: {
        position: 'absolute',
        left: 24,
        bottom: 42,
        width: '58%',
        gap: 4,
    },
    contextEyebrow: {
        color: darkPalette.primary,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.7,
    },
    contextCopy: {
        color: residentColors.onBrandMedium,
        fontSize: 12,
        lineHeight: 17,
    },
});
