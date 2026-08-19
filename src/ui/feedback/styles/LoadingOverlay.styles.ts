import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    absolute: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,
        alignItems: 'center',
        justifyContent: 'center'
    },
    relative: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewBackgroundColor: { backgroundColor: 'rgba(255, 255, 255, 0.7)' }
});

