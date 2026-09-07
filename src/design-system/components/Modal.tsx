import React, { forwardRef, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Modal as RNModal,
  Pressable,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { glassStyles, colors, getColors } from '../tokens/premium-colors';
import { radius } from '../tokens/premium-radius';
import { shadows } from '../tokens/premium-shadows';
import { motion } from '../tokens/premium-motion';
import { spacing } from '../tokens/premium-spacing';
import { typography } from '../tokens/premium-typography';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalPosition = 'center' | 'bottom';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: ModalSize;
  position?: ModalPosition;
  closeOnOverlayPress?: boolean;
  closeOnBackPress?: boolean;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

const sizeWidth = (size: ModalSize) => {
  switch (size) {
    case 'sm': return 320;
    case 'md': return 400;
    case 'lg': return 520;
    case 'xl': return 600;
    case 'full': return '100%';
    default: return 400;
  }
};

export const Modal = forwardRef<View, ModalProps>(
  (
    {
      visible,
      onClose,
      title,
      subtitle,
      children,
      size = 'md',
      position = 'center',
      closeOnOverlayPress = true,
      closeOnBackPress = true,
      showCloseButton = true,
      footer,
      style,
      testID,
    },
    ref
  ) => {
    const { colors, dark } = useAppTheme();
    const themeColors = getColors(dark ? 'dark' : 'light');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(position === 'bottom' ? 1 : 0.5)).current;

    useEffect(() => {
      if (visible) {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: motion.duration.modal,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: motion.duration.modal,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: motion.duration.fast,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: position === 'bottom' ? 1 : 0.5,
            duration: motion.duration.fast,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start(() => onClose());
      }
    }, [visible]);

    if (!visible) {
      return null;
    }

    const modalWidth = sizeWidth(size);
    const isFullWidth = size === 'full';

    const overlayStyle = {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: position === 'bottom' ? ('flex-end' as const) : ('center' as const),
      alignItems: 'center' as const,
      padding: spacing[4],
    };

    const containerStyle = [
      styles.containerBase,
      {
        width: isFullWidth ? ('100%' as const) : modalWidth,
        maxHeight: position === 'bottom' ? ('85%' as const) : ('90%' as const),
        backgroundColor: themeColors.surface.primary,
        borderRadius: radius.xl,
        transform: [
          {
            translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 300],
            }),
          },
          {
            scale: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.95],
            }),
          },
        ],
      },
      style,
    ];

    return (
      <RNModal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={onClose}
        supportedOrientations={['portrait', 'landscape']}
        testID={testID}
      >
        <Pressable
          onPress={closeOnOverlayPress ? onClose : undefined}
          style={overlayStyle}
          accessibilityLiveRegion="polite"
        >
          <Animated.View ref={ref} style={containerStyle}>
            {(title || showCloseButton) && (
              <View style={styles.header}>
                {title && (
                  <View style={styles.headerContent}>
                    <Text style={[styles.title, { color: themeColors.text.primary }]}>{title}</Text>
                    {subtitle && <Text style={[styles.subtitle, { color: themeColors.text.secondary }]}>{subtitle}</Text>}
                  </View>
                )}
                {showCloseButton && (
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                    accessibilityLabel="Close modal"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={[styles.closeButtonText, { color: themeColors.text.secondary }]}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            <View style={styles.content}>
              {children}
            </View>
            {footer && <View style={styles.footer}>{footer}</View>}
          </Animated.View>
        </Pressable>
      </RNModal>
    );
  }
);

Modal.displayName = 'Modal';

const styles = StyleSheet.create({
  containerBase: {
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  footer: {
    padding: 20,
    paddingTop: 12,
  },
});

export default Modal;