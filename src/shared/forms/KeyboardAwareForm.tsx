import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  View,
  type TextInput,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPlatformKeyboardConfig } from '../platform';
import { useKeyboardExperience } from '../../modules/resident/experience/KeyboardExperienceContext';
import { styles, createCommandStyle, createContentStyle } from './styles/KeyboardAwareForm.styles';

type FocusCoordinator = {
  ensureVisible: (input: TextInput | null) => void;
};

const FormFocusContext = createContext<FocusCoordinator>({ ensureVisible: () => undefined });

export type KeyboardAwareFormProps = {
  children: React.ReactNode;
  command?: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  testID?: string;
};

export function KeyboardAwareForm({ children, command, style, contentStyle, keyboardShouldPersistTaps = 'handled', testID }: KeyboardAwareFormProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [commandHeight, setCommandHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const keyboard = useKeyboardExperience();
  const keyboardConfig = getPlatformKeyboardConfig(insets.top);

  const ensureVisible = useCallback((input: TextInput | null) => {
    if (!input) return;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollResponderScrollNativeHandleToKeyboard(
        input,
        commandHeight + 24,
        true,
      );
    });
  }, [commandHeight]);

  const coordinator = useMemo(() => ({ ensureVisible }), [ensureVisible]);
  const effectiveCommandBottom = keyboard.isOpen ? 8 : Math.max(insets.bottom, 8);

  return (
    <KeyboardAvoidingView
      testID={testID}
      style={[styles.root, style]}
      behavior={keyboardConfig.behavior}
      keyboardVerticalOffset={keyboardConfig.keyboardVerticalOffset}
    >
      <FormFocusContext.Provider value={coordinator}>
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
          automaticallyAdjustKeyboardInsets={false}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={Keyboard.dismiss}
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
      </FormFocusContext.Provider>
    </KeyboardAvoidingView>
  );
}

export function useKeyboardAwareField<T extends TextInput>(ref: React.RefObject<T | null>) {
  const { ensureVisible } = useContext(FormFocusContext);
  return useCallback(() => {
    ensureVisible(ref.current);
  }, [ensureVisible, ref]);
}
