import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    topLeftGradient: {
        backgroundColor: 'rgba(9, 13, 26, 0.45)',
    },
    rightIndigoMesh: {
        backgroundColor: 'rgba(79, 70, 229, 0.12)',
    },
    bottomSoftFade: {
        backgroundColor: 'transparent',
        borderBottomWidth: 100,
        borderBottomColor: 'rgba(10, 14, 26, 0.35)',
        justifyContent: 'flex-end',
    },
    ambientGlow: {
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
    },
    brandOverlay: {
        position: 'absolute',
        top: '16%',
        left: 24,
        right: 24,
    },
    railOverlay: {
        position: 'absolute',
        bottom: 48,
        left: 24,
        right: 24,
    },
});
