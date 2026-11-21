import { createContext, useContext } from 'react';
import type { TextInputInstance } from 'react-native';

export type KeyboardFocusCoordinator = {
  registerFocusedInput: (node: TextInputInstance | null, extraSpacing?: number) => void;
  unregisterFocusedInput: (node: TextInputInstance | null) => void;
  ensureVisible: (node: TextInputInstance | null, extraSpacing?: number) => void;
};

const defaultFocusCoordinator: KeyboardFocusCoordinator = {
  registerFocusedInput: () => undefined,
  unregisterFocusedInput: () => undefined,
  ensureVisible: () => undefined,
};

export const KeyboardFocusContext = createContext<KeyboardFocusCoordinator>(defaultFocusCoordinator);

export function useKeyboardFocus(): KeyboardFocusCoordinator {
  return useContext(KeyboardFocusContext);
}
