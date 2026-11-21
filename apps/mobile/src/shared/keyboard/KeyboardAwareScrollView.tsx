import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
  type ScrollViewProps,
  type StyleProp,
  type TextInputInstance,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboardExperience } from '../../modules/resident/experience/KeyboardExperienceContext';
import { KeyboardFocusContext, type KeyboardFocusCoordinator } from './KeyboardFocusContext';
import { styles, createContentPaddingBottomStyle } from './styles/KeyboardAwareScrollView.styles';

export type KeyboardAwareScrollViewProps = Omit<ScrollViewProps, 'style'> & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  extraScrollHeight?: number;
  keyboardVerticalOffset?: number;
  testID?: string;
};

type ActiveFieldTarget = {
  node: TextInputInstance;
  extraSpacing: number;
};

export function KeyboardAwareScrollView({
  children,
  style,
  contentContainerStyle,
  extraScrollHeight = 20,
  keyboardVerticalOffset,
  keyboardShouldPersistTaps = 'handled',
  keyboardDismissMode = 'interactive',
  showsVerticalScrollIndicator = false,
  onScroll,
  testID,
  ...restProps
}: KeyboardAwareScrollViewProps) {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const insets = useSafeAreaInsets();
  const keyboard = useKeyboardExperience();
  const activeFieldRef = useRef<ActiveFieldTarget | null>(null);
  const scrollOffsetRef = useRef(0);

  const resolvedVerticalOffset = keyboardVerticalOffset ?? (Platform.OS === 'ios' ? insets.top : 0);

  const scrollToActiveNode = useCallback(
    (node: TextInputInstance | null, customExtraSpacing?: number) => {
      if (!node || !scrollRef.current) return;
      const spacingToApply = customExtraSpacing ?? extraScrollHeight;
      activeFieldRef.current = { node, extraSpacing: spacingToApply };

      const checkAndScroll = () => {
        if (!scrollRef.current || !activeFieldRef.current?.node) return;
        const currentTarget = activeFieldRef.current.node;

        if (typeof (currentTarget as unknown as { measureInWindow?: (callback: (x: number, y: number, width: number, height: number) => void) => void }).measureInWindow === 'function') {
          (currentTarget as unknown as { measureInWindow: (callback: (x: number, y: number, width: number, height: number) => void) => void }).measureInWindow(
            (_x: number, y: number, _width: number, height: number) => {
              if (!scrollRef.current) return;
              const screenHeight = Dimensions.get('window').height;
              const currentKeyboardHeight = keyboard.keyboardHeight || keyboard.keyboardInset || 0;
              const effectiveViewportBottom =
                keyboard.visibleViewportHeight && keyboard.visibleViewportHeight > 0
                  ? keyboard.visibleViewportHeight
                  : screenHeight - currentKeyboardHeight;

              const targetBoundary = effectiveViewportBottom - spacingToApply;
              const nodeBottom = y + height;

              if (nodeBottom > targetBoundary) {
                const delta = nodeBottom - targetBoundary;
                scrollRef.current.scrollTo({
                  y: Math.max(0, scrollOffsetRef.current + delta),
                  animated: true,
                });
              } else if (y < insets.top + 16) {
                const delta = insets.top + 16 - y;
                scrollRef.current.scrollTo({
                  y: Math.max(0, scrollOffsetRef.current - delta),
                  animated: true,
                });
              }
            }
          );
        } else if (typeof scrollRef.current.scrollResponderScrollNativeHandleToKeyboard === 'function') {
          scrollRef.current.scrollResponderScrollNativeHandleToKeyboard(
            currentTarget,
            spacingToApply,
            true
          );
        }
      };

      requestAnimationFrame(checkAndScroll);
      setTimeout(checkAndScroll, 70);
      setTimeout(checkAndScroll, 200);
    },
    [extraScrollHeight, insets.top, keyboard.keyboardHeight, keyboard.keyboardInset, keyboard.visibleViewportHeight]
  );

  useEffect(() => {
    if (keyboard.isOpen && activeFieldRef.current?.node) {
      scrollToActiveNode(activeFieldRef.current.node, activeFieldRef.current.extraSpacing);
    }
  }, [keyboard.isOpen, keyboard.keyboardHeight, scrollToActiveNode]);

  const coordinator: KeyboardFocusCoordinator = useMemo(
    () => ({
      registerFocusedInput: (node: TextInputInstance | null, extraSpacing?: number) => {
        scrollToActiveNode(node, extraSpacing);
      },
      unregisterFocusedInput: (node: TextInputInstance | null) => {
        if (activeFieldRef.current?.node === node) {
          activeFieldRef.current = null;
        }
      },
      ensureVisible: (node: TextInputInstance | null, extraSpacing?: number) => {
        scrollToActiveNode(node, extraSpacing);
      },
    }),
    [scrollToActiveNode]
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
      onScroll?.(event);
    },
    [onScroll]
  );

  return (
    <KeyboardAvoidingView
      style={[styles.root, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={resolvedVerticalOffset}
      testID={testID}
    >
      <KeyboardFocusContext.Provider value={coordinator}>
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            createContentPaddingBottomStyle(Math.max(insets.bottom, 24)),
            contentContainerStyle,
          ]}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          keyboardDismissMode={keyboardDismissMode}
          automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          onScrollBeginDrag={Keyboard.dismiss}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          {...restProps}
        >
          {children}
        </ScrollView>
      </KeyboardFocusContext.Provider>
    </KeyboardAvoidingView>
  );
}

export default KeyboardAwareScrollView;
