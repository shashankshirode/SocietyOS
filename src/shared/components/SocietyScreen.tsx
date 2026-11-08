import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme/useAppTheme';

interface SocietyScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
  stickyFooter?: React.ReactNode;
  testID?: string;
}

export function SocietyScreen({
  children,
  scrollable = true,
  contentContainerStyle,
  style,
  stickyFooter,
  testID,
}: SocietyScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors, dark } = useAppTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }, style]} testID={testID}>
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
      />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scrollable ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + (stickyFooter ? 80 : 32) },
              contentContainerStyle,
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View
            style={[
              styles.fixedContent,
              { paddingBottom: insets.bottom + (stickyFooter ? 80 : 16) },
              contentContainerStyle,
            ]}
          >
            {children}
          </View>
        )}

        {stickyFooter ? (
          <View
            style={[
              styles.stickyFooter,
              {
                paddingBottom: Math.max(insets.bottom, 16),
                backgroundColor: colors.surface,
                borderTopColor: colors.border,
              },
            ]}
          >
            {stickyFooter}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  fixedContent: {
    flex: 1,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
