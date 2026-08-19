import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, KeyboardAvoidingView, Modal, Pressable, StyleSheet, View, useWindowDimensions, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { modalTokens } from "./modalTokens";
import { Messages } from "../../shared/constants/messages";
import { getPlatformKeyboardConfig } from "../../shared/platform/platformKeyboard";
import { useReducedMotion } from "../motion/useReducedMotion";
import type { ModalVisibilityState } from "./modal.types";
import { styles, createViewBackgroundColorStyle, createAnimatedViewBackgroundColorOpacityStyle, createAnimatedViewBackgroundColorBorderRadiusBorderTopLeftRadiusBorderStyle, createAnimatedViewTranslateYStyle, createAnimatedViewScaleStyle } from "./styles/AppModal.styles";
export interface AppModalProps {
    visible: boolean;
    onClose: () => void;
    onDismiss?: () => void;
    children: React.ReactNode;
    centered?: boolean;
    showDragHandle?: boolean;
    preventDismiss?: boolean;
    testID?: string;
    fullScreen?: boolean;
    contentStyle?: StyleProp<ViewStyle>;
}
export function AppModal({ visible, onClose, onDismiss, children, centered = false, showDragHandle = true, preventDismiss = false, testID, fullScreen = false, contentStyle, }: AppModalProps) {
    const { colors } = useAppTheme();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isTablet = width > 600;
    const useCenter = !fullScreen && (isTablet || centered);
    const keyboardConfig = getPlatformKeyboardConfig(insets.top);
    const reducedMotion = useReducedMotion();
    const [visibilityState, setVisibilityState] = useState<ModalVisibilityState>('closed');
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const contentProgress = useRef(new Animated.Value(0)).current;
    const closeRequestedRef = useRef(false);
    const onDismissRef = useRef(onDismiss);
    useEffect(() => {
        onDismissRef.current = onDismiss;
    }, [onDismiss]);
    useEffect(() => {
        const shouldOpen = visible && (visibilityState === 'closed' || visibilityState === 'closing');
        const shouldClose = !visible && (visibilityState === 'open' || visibilityState === 'opening');
        if (shouldOpen) {
            closeRequestedRef.current = false;
            setVisibilityState('opening');
            backdropOpacity.stopAnimation();
            contentProgress.stopAnimation();
            Animated.parallel([
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: reducedMotion ? 1 : modalTokens.animationDuration,
                    useNativeDriver: true,
                }),
                Animated.timing(contentProgress, {
                    toValue: 1,
                    duration: reducedMotion ? 1 : modalTokens.animationDuration,
                    useNativeDriver: true,
                }),
            ]).start(({ finished }) => {
                if (finished)
                    setVisibilityState('open');
            });
            return;
        }
        if (shouldClose) {
            setVisibilityState('closing');
            backdropOpacity.stopAnimation();
            contentProgress.stopAnimation();
            Animated.parallel([
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: reducedMotion ? 1 : modalTokens.closeAnimationDuration,
                    useNativeDriver: true,
                }),
                Animated.timing(contentProgress, {
                    toValue: 0,
                    duration: reducedMotion ? 1 : modalTokens.closeAnimationDuration,
                    useNativeDriver: true,
                }),
            ]).start(({ finished }) => {
                if (!finished)
                    return;
                setVisibilityState('closed');
                closeRequestedRef.current = false;
                onDismissRef.current?.();
            });
        }
    }, [backdropOpacity, contentProgress, reducedMotion, visibilityState, visible]);
    const requestClose = useCallback(() => {
        if (preventDismiss || closeRequestedRef.current || visibilityState === 'closing')
            return;
        closeRequestedRef.current = true;
        onClose();
    }, [onClose, preventDismiss, visibilityState]);
    const shouldRender = visibilityState !== 'closed';
    if (!shouldRender)
        return null;
    const translateY = contentProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [useCenter ? 12 : 36, 0],
    });
    const scale = contentProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0.98, 1],
    });
    return (<Modal visible transparent animationType="none" onRequestClose={requestClose} statusBarTranslucent testID={testID}>
      <KeyboardAvoidingView behavior={keyboardConfig.behavior} keyboardVerticalOffset={keyboardConfig.keyboardVerticalOffset} style={styles.flex}>
        <Animated.View style={[
            styles.overlay,
            createAnimatedViewBackgroundColorOpacityStyle(colors.overlay, backdropOpacity),
            useCenter ? styles.centered : styles.bottomSheet,
        ]} accessibilityViewIsModal>
          
          {!preventDismiss && (<Pressable style={StyleSheet.absoluteFill} onPress={requestClose} accessibilityLabel={Messages.accessibility.modal.dismiss} accessibilityRole="button"/>)}

          
          <Animated.View style={[
            styles.content,
            createAnimatedViewBackgroundColorBorderRadiusBorderTopLeftRadiusBorderStyle(colors.surface, useCenter
                ? modalTokens.borderRadius
                : undefined, useCenter
                ? modalTokens.borderRadius
                : modalTokens.borderRadius, useCenter
                ? modalTokens.borderRadius
                : modalTokens.borderRadius, useCenter
                ? modalTokens.borderRadius
                : 0, useCenter
                ? modalTokens.borderRadius
                : 0, useCenter
                ? 0
                : Math.max(insets.bottom, 16), useCenter ? modalTokens.maxWidthTablet : undefined, useCenter ? '90%' : '100%', contentProgress, [createAnimatedViewTranslateYStyle(translateY), createAnimatedViewScaleStyle(scale)]),
            fullScreen && styles.fullScreenContent,
            contentStyle,
        ]} accessibilityRole="alert">
            
            {!useCenter && !fullScreen && showDragHandle && (<View style={styles.dragHandleRow}>
                <View style={[
                styles.dragHandle,
                createViewBackgroundColorStyle(colors.border),
            ]}/>
              </View>)}
            {children}
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>);
}
export default AppModal;

