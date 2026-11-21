import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
  type TextInputInstance,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme/useAppTheme';
import { useKeyboardExperience } from '../../modules/resident/experience/KeyboardExperienceContext';
import { KeyboardFocusContext, type KeyboardFocusCoordinator } from '../keyboard/KeyboardFocusContext';

interface SocietyScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
  stickyFooter?: React.ReactNode;
  testID?: string;
}

export function SocietyScreen({
  children,
  scrollable = true,
  contentContainerStyle,
  style,
  stickyFooter,
  testID,
}: SocietyScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors, dark } = useAppTheme();
  const keyboard = useKeyboardExperience();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const activeInputRef = useRef<{ node: TextInputInstance; extraSpacing: number } | null>(null);
  const scrollOffsetYRef = useRef(0);

  const scrollToInput = useCallback(
    (node: TextInputInstance | null, customExtraSpacing = 20) => {
      if (!node || !scrollRef.current) return;
      activeInputRef.current = { node, extraSpacing: customExtraSpacing };

      const performScroll = () => {
        if (!scrollRef.current || !activeInputRef.current?.node) return;
        const targetNode = activeInputRef.current.node;

        if (typeof (targetNode as unknown as { measureInWindow?: (callback: (x: number, y: number, width: number, height: number) => void) => void }).measureInWindow === 'function') {
          (targetNode as unknown as { measureInWindow: (callback: (x: number, y: number, width: number, height: number) => void) => void }).measureInWindow(
            (_x: number, y: number, _width: number, height: number) => {
              if (!scrollRef.current) return;
              const screenHeight = Dimensions.get('window').height;
              const currentKbHeight = keyboard.keyboardHeight || keyboard.keyboardInset || 0;
              const effectiveViewportBottom =
                keyboard.visibleViewportHeight && keyboard.visibleViewportHeight > 0
                  ? keyboard.visibleViewportHeight
                  : screenHeight - currentKbHeight;

              const footerClearance = stickyFooter ? 80 : 0;
              const targetBoundary = effectiveViewportBottom - (footerClearance + customExtraSpacing);
              const inputBottom = y + height;

              if (inputBottom > targetBoundary) {
                const delta = inputBottom - targetBoundary;
                scrollRef.current.scrollTo({
                  y: Math.max(0, scrollOffsetYRef.current + delta),
                  animated: true,
                });
              } else if (y < insets.top + 16) {
                const delta = insets.top + 16 - y;
                scrollRef.current.scrollTo({
                  y: Math.max(0, scrollOffsetYRef.current - delta),
                  animated: true,
                });
              }
            }
          );
        } else if (typeof scrollRef.current.scrollResponderScrollNativeHandleToKeyboard === 'function') {
          scrollRef.current.scrollResponderScrollNativeHandleToKeyboard(
            targetNode,
            (stickyFooter ? 80 : 24) + customExtraSpacing,
            true
          );
        }
      };

      requestAnimationFrame(performScroll);
      setTimeout(performScroll, 75);
      setTimeout(performScroll, 220);
    },
    [insets.top, keyboard.keyboardHeight, keyboard.keyboardInset, keyboard.visibleViewportHeight, stickyFooter]
  );

  useEffect(() => {
    if (keyboard.isOpen && activeInputRef.current?.node) {
      scrollToInput(activeInputRef.current.node, activeInputRef.current.extraSpacing);
    }
  }, [keyboard.isOpen, keyboard.keyboardHeight, scrollToInput]);

  const coordinator: KeyboardFocusCoordinator = useMemo(
    () => ({
      registerFocusedInput: (node: TextInputInstance | null, extraSpacing?: number) => {
        scrollToInput(node, extraSpacing);
      },
      unregisterFocusedInput: (node: TextInputInstance | null) => {
        if (activeInputRef.current?.node === node) {
          activeInputRef.current = null;
        }
      },
      ensureVisible: (node: TextInputInstance | null, extraSpacing?: number) => {
        scrollToInput(node, extraSpacing);
      },
    }),
    [scrollToInput]
  );

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffsetYRef.current = event.nativeEvent.contentOffset.y;
  }, []);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }, style]} testID={testID}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <KeyboardFocusContext.Provider value={coordinator}>
          {scrollable ? (
            <ScrollView
              ref={scrollRef}
              style={styles.scroll}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: insets.bottom + (stickyFooter ? 80 : 32) },
                contentContainerStyle,
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
              onScrollBeginDrag={Keyboard.dismiss}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {children}
            </ScrollView>
          ) : (
            <View
              style={[
                styles.fixedContent,
                { paddingBottom: insets.bottom + (stickyFooter ? 80 : 16) },
                contentContainerStyle,
              ]}
            >
              {children}
            </View>
          )}

          {stickyFooter ? (
            <View
              style={[
                styles.stickyFooter,
                {
                  paddingBottom: Math.max(insets.bottom, 16),
                  backgroundColor: colors.surface,
                  borderTopColor: colors.border,
                },
              ]}
            >
              {stickyFooter}
            </View>
          ) : null}
        </KeyboardFocusContext.Provider>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  fixedContent: {
    flex: 1,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
