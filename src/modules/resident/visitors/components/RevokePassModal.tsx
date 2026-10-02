import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
  FONT_FAMILY_SERIF,
} from '../../../../shared/theme/typography';

interface RevokePassModalProps {
  visible: boolean;
  visitorName: string;
  onConfirmRevoke: () => void;
  onCancel: () => void;
}

export function RevokePassModal({
  visible,
  visitorName,
  onConfirmRevoke,
  onCancel,
}: RevokePassModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                stroke="#DC2626"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          <Text style={styles.titleText}>Revoke this visitor pass?</Text>
          <Text style={styles.supportingText}>
            {visitorName} will no longer be allowed to enter using this pass. This action will immediately notify the security gate desk and be permanently logged in the access audit.
          </Text>

          <View style={styles.actionsRow}>
            <Pressable
              style={styles.cancelBtn}
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel="Keep pass"
            >
              <Text style={styles.cancelBtnText}>Keep pass</Text>
            </Pressable>

            <Pressable
              style={styles.revokeBtn}
              onPress={onConfirmRevoke}
              accessibilityRole="button"
              accessibilityLabel="Revoke pass"
              testID="confirm-revoke-btn"
            >
              <Text style={styles.revokeBtnText}>Revoke pass</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(16, 32, 29, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FAF8F1',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#10201D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  titleText: {
    fontFamily: FONT_FAMILY_SERIF,
    fontSize: 22,
    fontWeight: '700',
    color: '#10201D',
    textAlign: 'center',
    marginBottom: 10,
  },
  supportingText: {
    fontFamily: FONT_FAMILY_INTER,
    fontSize: 14,
    color: '#69716D',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontSize: 14,
    color: '#4B5563',
  },
  revokeBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  revokeBtnText: {
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontSize: 14,
    color: '#FFFFFF',
  },
});
