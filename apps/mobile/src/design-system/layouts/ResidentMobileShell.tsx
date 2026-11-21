import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  Platform,
  RefreshControl,
  KeyboardAvoidingView,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ResidentMobileShellProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
  refreshing?: boolean;
  onRefresh?: () => void;
  floatingAction?: React.ReactNode;
  bottomClearance?: number;
  testID?: string;
}

export function ResidentMobileShell({
  children,
  header,
  scrollable = true,
  contentContainerStyle,
  style,
  refreshing = false,
  onRefresh,
  floatingAction,
  bottomClearance,
  testID = 'resident-mobile-shell',
}: ResidentMobileShellProps) {
  const insets = useSafeAreaInsets();
  const effectiveClearance = bottomClearance ?? (104 + Math.max(insets.bottom, 24));

  const refreshControl = onRefresh ? (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor="#064F45"
      colors={['#064F45']}
    />
  ) : undefined;

  return (
    <View style={styles.outerContainer} testID={testID}>
      <View style={[styles.innerFrame, style]}>
        {header}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
        >
          {scrollable ? (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: effectiveClearance },
                contentContainerStyle,
              ]}
              showsVerticalScrollIndicator={false}
              refreshControl={refreshControl}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>
          ) : (
            <View
              style={[
                styles.staticContent,
                { paddingBottom: effectiveClearance },
                contentContainerStyle,
              ]}
            >
              {children}
            </View>
          )}
        </KeyboardAvoidingView>
        {floatingAction ? (
          <View style={styles.floatingContainer}>{floatingAction}</View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FAF8F1',
    alignItems: 'center',
    width: '100%',
  },
  innerFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FAF8F1',
    position: 'relative',
    overflow: 'hidden',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  staticContent: {
    flex: 1,
  },
  floatingContainer: {
    position: 'absolute',
    right: 20,
    bottom: 96,
    zIndex: 100,
  },
});
