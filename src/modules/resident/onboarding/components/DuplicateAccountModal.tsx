import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PrimaryCTA } from './PrimaryCTA';
import { SecondaryCTA } from './SecondaryCTA';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
  FONT_FAMILY_SERIF,
} from '../../../../shared/theme/typography';

interface DuplicateAccountModalProps {
  visible: boolean;
  maskedMobile: string;
  onContinueExisting: () => void;
  onContactSociety: () => void;
  onUseAnotherNumber: () => void;
}

export function DuplicateAccountModal({
  visible,
  maskedMobile,
  onContinueExisting,
  onContactSociety,
  onUseAnotherNumber,
}: DuplicateAccountModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onUseAnotherNumber}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Warning Icon Badge */}
          <View style={styles.iconCircle}>
            <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                stroke="#D97706"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          {/* Heading and Supporting Copy */}
          <Text style={styles.titleText}>
            We found an existing Society OS account
          </Text>
          <Text style={styles.supportingText}>
            The mobile number <Text style={styles.highlightText}>{maskedMobile}</Text> is
            already registered with a resident profile. We keep your accounts distinct to protect your privacy.
          </Text>

          {/* Action CTAs */}
          <View style={styles.actionsContainer}>
            <PrimaryCTA
              label="Continue with existing account"
              onPress={onContinueExisting}
              showArrow={false}
            />
            <SecondaryCTA
              label="Contact society office"
              onPress={onContactSociety}
            />
            <Pressable
              onPress={onUseAnotherNumber}
              hitSlop={8}
              style={styles.anotherNumberBtn}
            >
              <Text style={styles.anotherNumberText}>Use another mobile number</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 25, 21, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FAF8F1',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#EBE8DE',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  titleText: {
    fontSize: 20,
    fontFamily: FONT_FAMILY_SERIF,
    fontWeight: '600',
    color: '#10201D',
    textAlign: 'center',
  },
  supportingText: {
    fontSize: 13.5,
    fontFamily: FONT_FAMILY_INTER,
    color: '#69716D',
    textAlign: 'center',
    lineHeight: 20,
  },
  highlightText: {
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#10201D',
  },
  actionsContainer: {
    width: '100%',
    gap: 10,
    marginTop: 8,
  },
  anotherNumberBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  anotherNumberText: {
    fontSize: 13.5,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#69716D',
  },
});
