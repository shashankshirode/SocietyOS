import React, { useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, View, Animated, useWindowDimensions, BackHandler, Pressable, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { useReducedMotion } from "../motion/useReducedMotion";
import { useBottomSheetGesture } from "./useBottomSheetGesture";
import { BottomSheetHandle } from "./BottomSheetHandle";
import type { BottomSheetVisibilityState } from "./bottomSheet.types";
import { Messages } from "../../shared/constants/messages";
import { styles, createAnimatedViewBackgroundColorOpacityStyle, createAnimatedViewBackgroundColorTransformPaddingBottomStyle, createAnimatedViewTranslateYStyle } from "./styles/AppBottomSheet.styles";
export interface AppBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    header?: React.ReactNode;
    testID?: string;
    sheetStyle?: ViewStyle;
    preventDismiss?: boolean;
    onDismiss?: () => void;
}
export function AppBottomSheet({ visible, onClose, children, header, testID, sheetStyle, preventDismiss = false, onDismiss, }: AppBottomSheetProps) {
    const { colors } = useAppTheme();
    const insets = useSafeAreaInsets();
    const { height: screenHeight, width: screenWidth } = useWindowDimensions();
    const reducedMotion = useReducedMotion();
    const [innerState, setInnerState] = useState<BottomSheetVisibilityState>('closed');
    const translateY = useRef(new Animated.Value(screenHeight)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const isTablet = screenWidth >= 768;
    useEffect(() => {
        if (visible && innerState === 'closed') {
            setInnerState('opening');
            translateY.setValue(screenHeight);
            backdropOpacity.setValue(0);
            Animated.parallel([
                reducedMotion
                    ? Animated.timing(translateY, {
                        toValue: 0,
                        duration: 180,
                        useNativeDriver: true,
                    })
                    : Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                        damping: 18,
                        stiffness: 120,
                    }),
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: reducedMotion ? 120 : 250,
                    useNativeDriver: true,
                }),
            ]).start((result) => {
                if (result.finished) {
                    setInnerState('open');
                }
            });
        }
        else if (!visible && (innerState === 'open' || innerState === 'opening')) {
            setInnerState('closing');
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: screenHeight,
                    duration: reducedMotion ? 150 : 280,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: reducedMotion ? 120 : 220,
                    useNativeDriver: true,
                }),
            ]).start((result) => {
                if (result.finished) {
                    setInnerState('closed');
                    onDismiss?.();
                }
            });
        }
    }, [
        backdropOpacity,
        innerState,
        onDismiss,
        reducedMotion,
        screenHeight,
        translateY,
        visible,
    ]);
    useEffect(() => {
        if (innerState === 'open' || innerState === 'opening') {
            const backAction = () => {
                if (!preventDismiss)
                    onClose();
                return true;
            };
            const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
            return () => backHandler.remove();
        }
        return undefined;
    }, [innerState, onClose, preventDismiss]);
    const handleSnapBack = () => {
        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 15,
            stiffness: 150,
        }).start();
    };
    const gestureHandler = useBottomSheetGesture({
        translateY,
        onDismiss: () => {
            if (!preventDismiss)
                onClose();
        },
        onSnapBack: handleSnapBack,
        enabled: innerState === 'open' && !preventDismiss,
    });
    const shouldRender = innerState !== 'closed';
    if (!shouldRender)
        return null;
    return (<Modal transparent visible={true} animationType="none" onRequestClose={preventDismiss ? undefined : onClose} statusBarTranslucent>
      <View style={styles.container} accessibilityViewIsModal>
        
        <Animated.View style={[
            styles.backdrop,
            createAnimatedViewBackgroundColorOpacityStyle(colors.backdrop, backdropOpacity),
        ]}>
          {!preventDismiss ? (<Pressable style={StyleSheet.absoluteFill} onPress={onClose} testID="bottom-sheet-backdrop" accessibilityRole="button" accessibilityLabel={Messages.accessibility.modal.dismiss}/>) : null}
        </Animated.View>

        
        <Animated.View style={[
            styles.sheet,
            createAnimatedViewBackgroundColorTransformPaddingBottomStyle(colors.surface, [createAnimatedViewTranslateYStyle(translateY)], Math.max(insets.bottom, 16)),
            isTablet && styles.tabletSheet,
            sheetStyle,
        ]} testID={testID}>
          
          <View {...gestureHandler.panHandlers} style={styles.gestureZone}>
            <BottomSheetHandle />
            {header}
          </View>

          {children}
        </Animated.View>
      </View>
    </Modal>);
}
export default AppBottomSheet;

