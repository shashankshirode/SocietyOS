import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Keyboard, type KeyboardEvent } from 'react-native';

export type KeyboardExperienceState = {
  isOpen: boolean;
  isEditing: boolean;
  keyboardInset: number;
  visibleViewportHeight: number | null;
};

const closedState: KeyboardExperienceState = {
  isOpen: false,
  isEditing: false,
  keyboardInset: 0,
  visibleViewportHeight: null,
};

const KeyboardExperienceContext = createContext<KeyboardExperienceState>(closedState);

export function KeyboardExperienceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<KeyboardExperienceState>(closedState);

  useEffect(() => {
    const show = (event: KeyboardEvent) => {
      const keyboardInset = Math.max(0, event.endCoordinates.height);
      setState({
        isOpen: true,
        isEditing: true,
        keyboardInset,
        visibleViewportHeight: Math.max(0, event.endCoordinates.screenY),
      });
    };
    const hide = () => setState(closedState);
    const subscriptions = [
      Keyboard.addListener('keyboardWillShow', show),
      Keyboard.addListener('keyboardDidShow', show),
      Keyboard.addListener('keyboardWillHide', hide),
      Keyboard.addListener('keyboardDidHide', hide),
    ];
    return () => subscriptions.forEach((subscription) => subscription.remove());
  }, []);

  const value = useMemo(() => state, [state]);
  return <KeyboardExperienceContext.Provider value={value}>{children}</KeyboardExperienceContext.Provider>;
}

export function useKeyboardExperience(): KeyboardExperienceState {
  return useContext(KeyboardExperienceContext);
}

