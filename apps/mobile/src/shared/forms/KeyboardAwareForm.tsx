import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
  type TextInputInstance,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboardExperience } from '../../modules/resident/experience/KeyboardExperienceContext';
import { KeyboardFocusContext, type KeyboardFocusCoordinator } from '../keyboard/KeyboardFocusContext';
import { styles, createCommandStyle, createContentStyle } from './styles/KeyboardAwareForm.styles';

type FocusCoordinator = {
  ensureVisible: (input: TextInputInstance | null) => void;
};

export const FormFocusContext = createContext<FocusCoordinator>({ ensureVisible: () => undefined });

export type KeyboardAwareFormProps = {
  children: React.ReactNode;
  command?: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  testID?: string;
  extraScrollHeight?: number;
};

type ActiveTarget = {
  node: TextInputInstance;
  extraOffset: number;
};

export function KeyboardAwareForm({
  children,
  command,
  style,
  contentStyle,
  keyboardShouldPersistTaps = 'handled',
  testID,
  extraScrollHeight = 20,
}: KeyboardAwareFormProps) {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [commandHeight, setCommandHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const keyboard = useKeyboardExperience();
  const activeTargetRef = useRef<ActiveTarget | null>(null);
  const currentScrollYRef = useRef(0);

  const scrollToInput = useCallback(
    (input: TextInputInstance | null, extraOffset = 0) => {
      if (!input || !scrollRef.current) return;
      activeTargetRef.current = { node: input, extraOffset };

      const performCheckAndScroll = () => {
        if (!scrollRef.current || !activeTargetRef.current?.node) return;
        const targetNode = activeTargetRef.current.node;

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

              const clearance = Math.max(commandHeight + extraScrollHeight, extraScrollHeight) + extraOffset;
              const targetBoundary = effectiveViewportBottom - clearance;
              const inputBottom = y + height;

              if (inputBottom > targetBoundary) {
                const delta = inputBottom - targetBoundary;
                scrollRef.current.scrollTo({
                  y: Math.max(0, currentScrollYRef.current + delta),
                  animated: true,
                });
              } else if (y < insets.top + 16) {
                const delta = insets.top + 16 - y;
                scrollRef.current.scrollTo({
                  y: Math.max(0, currentScrollYRef.current - delta),
                  animated: true,
                });
              }
            }
          );
        } else if (typeof scrollRef.current.scrollResponderScrollNativeHandleToKeyboard === 'function') {
          scrollRef.current.scrollResponderScrollNativeHandleToKeyboard(
            targetNode,
            commandHeight + 24 + extraOffset,
            true
          );
        }
      };

      requestAnimationFrame(performCheckAndScroll);
      setTimeout(performCheckAndScroll, 75);
      setTimeout(performCheckAndScroll, 220);
    },
    [commandHeight, extraScrollHeight, insets.top, keyboard.keyboardHeight, keyboard.keyboardInset, keyboard.visibleViewportHeight]
  );

  useEffect(() => {
    if (keyboard.isOpen && activeTargetRef.current?.node) {
      scrollToInput(activeTargetRef.current.node, activeTargetRef.current.extraOffset);
    }
  }, [keyboard.isOpen, keyboard.keyboardHeight, scrollToInput]);

  const formCoordinator = useMemo(() => ({
    ensureVisible: (input: TextInputInstance | null) => {
      scrollToInput(input);
    },
  }), [scrollToInput]);

  const globalCoordinator: KeyboardFocusCoordinator = useMemo(
    () => ({
      registerFocusedInput: (node: TextInputInstance | null, extraSpacing?: number) => {
        scrollToInput(node, extraSpacing);
      },
      unregisterFocusedInput: (node: TextInputInstance | null) => {
        if (activeTargetRef.current?.node === node) {
          activeTargetRef.current = null;
        }
      },
      ensureVisible: (node: TextInputInstance | null, extraSpacing?: number) => {
        scrollToInput(node, extraSpacing);
      },
    }),
    [scrollToInput]
  );

  const effectiveCommandBottom = keyboard.isOpen ? 8 : Math.max(insets.bottom, 8);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    currentScrollYRef.current = event.nativeEvent.contentOffset.y;
  }, []);

  return (
    <KeyboardAvoidingView
      testID={testID}
      style={[styles.root, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
    >
      <FormFocusContext.Provider value={formCoordinator}>
        <KeyboardFocusContext.Provider value={globalCoordinator}>
          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={[
              styles.content,
              createContentStyle(command ? commandHeight + 24 : Math.max(insets.bottom, 20)),
              contentStyle,
            ]}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            keyboardDismissMode="interactive"
            automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
            showsVerticalScrollIndicator={false}
            onScrollBeginDrag={Keyboard.dismiss}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {children}
          </ScrollView>
          {command ? (
            <View
              onLayout={(event) => setCommandHeight(event.nativeEvent.layout.height)}
              style={[styles.command, createCommandStyle(effectiveCommandBottom)]}
            >
              {command}
            </View>
          ) : null}
        </KeyboardFocusContext.Provider>
      </FormFocusContext.Provider>
    </KeyboardAvoidingView>
  );
}

export function useKeyboardAwareField<T extends TextInputInstance>(ref: React.RefObject<T | null>) {
  const { ensureVisible } = useContext(FormFocusContext);
  return useCallback(() => {
    ensureVisible(ref.current);
  }, [ensureVisible, ref]);
}

export default KeyboardAwareForm;
