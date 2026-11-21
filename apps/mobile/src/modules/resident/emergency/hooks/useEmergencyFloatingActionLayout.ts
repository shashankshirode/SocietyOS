import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useEmergencyFloatingActionLayout() {
  const insets = useSafeAreaInsets();
  const bottomOffset = insets.bottom + 16;
  const rightOffset = 16;

  return {
    bottomOffset,
    rightOffset,
  };
}
export default useEmergencyFloatingActionLayout;
