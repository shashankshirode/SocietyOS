import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Keyboard, type KeyboardEvent } from 'react-native';

export type KeyboardExperienceState = {
  isOpen: boolean;
  isEditing: boolean;
  keyboardInset: number;
  keyboardHeight: number;
  visibleViewportHeight: number | null;
  duration: number;
};

const closedState: KeyboardExperienceState = {
  isOpen: false,
  isEditing: false,
  keyboardInset: 0,
  keyboardHeight: 0,
  visibleViewportHeight: null,
  duration: 250,
};

const KeyboardExperienceContext = createContext<KeyboardExperienceState>(closedState);

export function KeyboardExperienceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<KeyboardExperienceState>(closedState);

  useEffect(() => {
    const handleKeyboardShow = (event: KeyboardEvent) => {
      const height = Math.max(0, event?.endCoordinates?.height ?? 0);
      setState({
        isOpen: height > 0,
        isEditing: height > 0,
        keyboardInset: height,
        keyboardHeight: height,
        visibleViewportHeight: Math.max(0, event?.endCoordinates?.screenY ?? 0),
        duration: event?.duration ?? 250,
      });
    };

    const handleKeyboardHide = () => {
      setState(closedState);
    };

    const subscriptions = [
      Keyboard.addListener('keyboardWillShow', handleKeyboardShow),
      Keyboard.addListener('keyboardDidShow', handleKeyboardShow),
      Keyboard.addListener('keyboardWillHide', handleKeyboardHide),
      Keyboard.addListener('keyboardDidHide', handleKeyboardHide),
      Keyboard.addListener('keyboardWillChangeFrame', handleKeyboardShow),
      Keyboard.addListener('keyboardDidChangeFrame', handleKeyboardShow),
    ];

    return () => {
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, []);

  const value = useMemo(() => state, [state]);

  return <KeyboardExperienceContext.Provider value={value}>{children}</KeyboardExperienceContext.Provider>;
}

export function useKeyboardExperience(): KeyboardExperienceState {
  return useContext(KeyboardExperienceContext);
}
