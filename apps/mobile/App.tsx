import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/app/navigation/RootNavigator';
import { ThemeProvider } from './src/shared/theme';
import { KeyboardExperienceProvider } from './src/modules/resident/experience/KeyboardExperienceContext';
import { MockStoreProvider } from './src/core/mockStore/mockStoreProvider';
import { ResidentHomeContextProvider } from './src/modules/resident/homeContext';
import { ModalProvider } from './src/ui/modal';
import { LanguageProvider } from './src/shared/localization';
import { ExperienceRuntimeProvider } from './src/core/experience';
import { SocietyShimmerProvider } from './src/ui/loading';
import { AuthProvider } from './src/core/auth/AuthProvider';
import { AppErrorBoundary } from './src/shared/components/ErrorBoundary';

export default function App() {
  return (
    <AppErrorBoundary>
      <SafeAreaProvider>
        <LanguageProvider>
          <ExperienceRuntimeProvider>
            <MockStoreProvider>
              <ResidentHomeContextProvider>
                <AuthProvider>
                  <ThemeProvider>
                    <KeyboardExperienceProvider>
                      <ModalProvider>
                        <SocietyShimmerProvider>
                          <RootNavigator />
                        </SocietyShimmerProvider>
                      </ModalProvider>
                    </KeyboardExperienceProvider>
                  </ThemeProvider>
                </AuthProvider>
              </ResidentHomeContextProvider>
            </MockStoreProvider>
          </ExperienceRuntimeProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </AppErrorBoundary>
  );
}
