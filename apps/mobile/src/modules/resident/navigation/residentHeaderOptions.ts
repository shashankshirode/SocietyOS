import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export const residentHeaderHiddenOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

export function getResidentHeaderOptions(): NativeStackNavigationOptions {
  return residentHeaderHiddenOptions;
}

