import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/app/navigation/RootNavigator';
import { ThemeProvider } from './src/shared/theme';
import { MockStoreProvider } from './src/core/mockStore/mockStoreProvider';
import { ResidentHomeContextProvider } from './src/modules/resident/homeContext';
import { ModalProvider } from './src/ui/modal';
import { LanguageProvider } from './src/shared/localization';

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FC',
  },
});

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter': require('./assets/fonts/Inter-Regular.otf'),
    'Inter-Medium': require('./assets/fonts/Inter-Medium.otf'),
    'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.otf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.otf'),
    'Inter-ExtraBold': require('./assets/fonts/Inter-ExtraBold.otf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={loadingStyles.container}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <MockStoreProvider>
          <ResidentHomeContextProvider>
            <ThemeProvider>
              <ModalProvider>
                <RootNavigator />
              </ModalProvider>
            </ThemeProvider>
          </ResidentHomeContextProvider>
        </MockStoreProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
