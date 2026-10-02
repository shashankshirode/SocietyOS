import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingHeader } from './OnboardingHeader';
import { ProgressIndicator } from './ProgressIndicator';
import { OnboardingMilestone } from '../data/residentOnboarding.types';
import { FONT_FAMILY_INTER_MEDIUM } from '../../../../shared/theme/typography';
import Svg, { Path } from 'react-native-svg';

interface OnboardingShellProps {
  children: React.ReactNode;
  currentMilestone?: OnboardingMilestone;
  currentStepIndex?: number;
  onBack?: () => void;
  onHelp?: () => void;
  showBack?: boolean;
  showProgress?: boolean;
  footerCta?: React.ReactNode;
  isOffline?: boolean;
}

export function OnboardingShell({
  children,
  currentMilestone = 'Verify',
  currentStepIndex = 1,
  onBack,
  onHelp,
  showBack = true,
  showProgress = true,
  footerCta,
  isOffline = false,
}: OnboardingShellProps) {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'ios' ? 44 : 20);
  const bottomPadding = Math.max(insets.bottom, 16);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Top Safe Area Container */}
      <View style={{ paddingTop: topPadding }}>
        {isOffline && (
          <View style={styles.offlineBanner}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
              <Path
                d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"
                stroke="#B45309"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.offlineText}>
              You're offline. Changes are saved locally.
            </Text>
          </View>
        )}

        <OnboardingHeader
          {...(onBack ? { onBack } : {})}
          {...(onHelp ? { onHelp } : {})}
          showBack={showBack}
        />

        {showProgress && (
          <ProgressIndicator
            currentMilestone={currentMilestone}
            currentStepIndex={currentStepIndex}
          />
        )}
      </View>

      {/* Scrollable Content with padding for footer CTA */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: footerCta ? 120 + bottomPadding : 40 + bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>

      {/* Sticky Bottom CTA with safe area */}
      {footerCta && (
        <View style={[styles.footerContainer, { paddingBottom: bottomPadding }]}>
          <View style={styles.footerInner}>
            {footerCta}
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F1',
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  offlineText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#92400E',
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 10,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(250, 248, 241, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(235, 232, 222, 0.7)',
    paddingTop: 12,
    paddingHorizontal: 22,
  },
  footerInner: {
    gap: 10,
  },
});
