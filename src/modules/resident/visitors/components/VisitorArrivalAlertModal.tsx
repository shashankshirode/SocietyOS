import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
  FONT_FAMILY_SERIF,
} from '../../../../shared/theme/typography';

interface VisitorArrivalAlertModalProps {
  visible: boolean;
  visitorName: string;
  gateName: string;
  scanTime: string;
  vehicleNumber?: string;
  onAllow: () => void;
  onWait: () => void;
  onDeny: () => void;
}

export function VisitorArrivalAlertModal({
  visible,
  visitorName,
  gateName,
  scanTime,
  vehicleNumber,
  onAllow,
  onWait,
  onDeny,
}: VisitorArrivalAlertModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Accent Header Bar */}
          <View style={styles.topPill} />

          <View style={styles.headerRow}>
            <View style={styles.gateBadge}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  stroke="#064F45"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.gateBadgeText}>{gateName}</Text>
            </View>
            <Text style={styles.timeText}>Scanned at {scanTime}</Text>
          </View>

          <Text style={styles.titleText}>{visitorName} is at {gateName}</Text>
          <Text style={styles.subtitleText}>
            Your visitor pass was scanned by security. Please confirm if they may be admitted to your home.
          </Text>

          {vehicleNumber ? (
            <View style={styles.vehicleRow}>
              <Text style={styles.vehicleLabel}>Vehicle:</Text>
              <Text style={styles.vehicleValue}>{vehicleNumber}</Text>
            </View>
          ) : null}

          {/* Security Action CTAs */}
          <View style={styles.actionsContainer}>
            <Pressable
              style={styles.allowButton}
              onPress={onAllow}
              accessibilityRole="button"
              accessibilityLabel="Allow entry"
              testID="allow-arrival-btn"
            >
              <Text style={styles.allowButtonText}>Allow entry</Text>
            </Pressable>

            <View style={styles.secondaryRow}>
              <Pressable
                style={styles.waitButton}
                onPress={onWait}
                accessibilityRole="button"
                accessibilityLabel="Keep waiting"
              >
                <Text style={styles.waitButtonText}>Keep waiting</Text>
              </Pressable>

              <Pressable
                style={styles.denyButton}
                onPress={onDeny}
                accessibilityRole="button"
                accessibilityLabel="Deny entry"
                testID="deny-arrival-btn"
              >
                <Text style={styles.denyButtonText}>Deny entry</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(16, 32, 29, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FAF8F1',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 36,
    shadowColor: '#10201D',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  topPill: {
    width: 44,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F3EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gateBadgeText: {
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontSize: 12,
    color: '#064F45',
  },
  timeText: {
    fontFamily: FONT_FAMILY_INTER,
    fontSize: 12,
    color: '#69716D',
  },
  titleText: {
    fontFamily: FONT_FAMILY_SERIF,
    fontSize: 24,
    fontWeight: '700',
    color: '#10201D',
    marginBottom: 6,
  },
  subtitleText: {
    fontFamily: FONT_FAMILY_INTER,
    fontSize: 14,
    color: '#69716D',
    lineHeight: 20,
    marginBottom: 16,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E9E8',
    marginBottom: 20,
  },
  vehicleLabel: {
    fontFamily: FONT_FAMILY_INTER,
    fontSize: 13,
    color: '#69716D',
  },
  vehicleValue: {
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontSize: 13,
    color: '#10201D',
  },
  actionsContainer: {
    gap: 12,
  },
  allowButton: {
    backgroundColor: '#064F45',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#064F45',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  allowButtonText: {
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontSize: 16,
    color: '#FAF8F1',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  waitButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitButtonText: {
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontSize: 14,
    color: '#4B5563',
  },
  denyButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  denyButtonText: {
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontSize: 14,
    color: '#DC2626',
  },
});
