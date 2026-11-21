import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({});
export function createSafeTextMaxWidthStyle(maxWidthValue: number) {
    return {
        maxWidth: maxWidthValue
    } as const;
}

