import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/app/navigation/RootNavigator';
import { ThemeProvider } from './src/shared/theme';
import { MockStoreProvider } from './src/core/mockStore/mockStoreProvider';
import { ResidentHomeContextProvider } from './src/modules/resident/homeContext';
import { ModalProvider } from './src/ui/modal';
import { LanguageProvider } from './src/shared/localization';
import { ExperienceRuntimeProvider } from './src/core/experience';
import { SocietyShimmerProvider } from './src/ui/loading';

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ExperienceRuntimeProvider>
          <MockStoreProvider>
            <ResidentHomeContextProvider>
              <ThemeProvider>
                <ModalProvider>
                  <SocietyShimmerProvider>
                    <RootNavigator />
                  </SocietyShimmerProvider>
                </ModalProvider>
              </ThemeProvider>
            </ResidentHomeContextProvider>
          </MockStoreProvider>
        </ExperienceRuntimeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
