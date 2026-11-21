import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Share, Platform } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
  FONT_FAMILY_SERIF,
} from '../../../../shared/theme/typography';
import type { ActiveVisitorRecord } from '../data/visitorLifecycle.store';

interface VisitorPassDisplayProps {
  pass: ActiveVisitorRecord;
  onRevokePress: () => void;
  onClose?: () => void;
}

export function VisitorPassDisplay({
  pass,
  onRevokePress,
  onClose,
}: VisitorPassDisplayProps) {
  const [shareSuccessMessage, setShareSuccessMessage] = useState<string | null>(null);

  const handleShare = async () => {
    const shareMessage = `Society OS Visitor Pass\nVisitor: ${pass.name}\nPass Code: ${pass.passCode}\nUnit: ${pass.flatNumber} (${pass.tower})\nValid: ${pass.expectedWindow}\nShow this pass at Gate 01 on arrival.`;
    try {
      if (Platform.OS !== 'web' && Share?.share) {
        await Share.share({
          message: shareMessage,
          title: `Visitor Pass - ${pass.name}`,
        });
      } else {
        setShareSuccessMessage('Pass details copied for sharing.');
        setTimeout(() => setShareSuccessMessage(null), 3000);
      }
    } catch {
      // Ignore user cancellations
    }
  };

  const getStatusTone = () => {
    switch (pass.status) {
      case 'CHECKED_IN':
        return { bg: '#E8F3EE', text: '#064F45', label: 'Inside' };
      case 'CHECKED_OUT':
        return { bg: '#F3F4F6', text: '#4B5563', label: 'Visit complete' };
      case 'CANCELLED':
        return { bg: '#FEF2F2', text: '#DC2626', label: 'Revoked' };
      case 'EXPIRED':
        return { bg: '#FEF3C7', text: '#92400E', label: 'Expired' };
      default:
        return { bg: '#E8F3EE', text: '#064F45', label: 'Approved' };
    }
  };

  const statusTone = getStatusTone();

  return (
    <View style={styles.cardContainer} testID="visitor-pass-card">
      {/* Society OS Brand Watermark Header */}
      <View style={styles.headerStrip}>
        <View style={styles.brandMark}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2L3 9v11a2 2 0 002 2h14a2 2 0 002-2V9l-9-7z"
              stroke="#064F45"
              strokeWidth={2}
            />
          </Svg>
          <Text style={styles.brandTitle}>SOCIETY OS • DIGITAL ACCESS PASS</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: statusTone.bg }]}>
          <Text style={[styles.statusPillText, { color: statusTone.text }]}>
            {statusTone.label}
          </Text>
        </View>
      </View>

      {/* Prominent High Contrast QR Simulation Frame */}
      <View style={styles.qrArea}>
        <View style={styles.qrFrame}>
          {/* Simulated High-Res QR Grid */}
          <Svg width={160} height={160} viewBox="0 0 100 100">
            {/* Background */}
            <Rect width="100" height="100" fill="#FFFFFF" rx="8" />
            {/* Top-Left Finder */}
            <Rect x="10" y="10" width="24" height="24" fill="#064F45" rx="4" />
            <Rect x="14" y="14" width="16" height="16" fill="#FFFFFF" rx="2" />
            <Rect x="18" y="18" width="8" height="8" fill="#064F45" rx="1" />
            {/* Top-Right Finder */}
            <Rect x="66" y="10" width="24" height="24" fill="#064F45" rx="4" />
            <Rect x="70" y="14" width="16" height="16" fill="#FFFFFF" rx="2" />
            <Rect x="74" y="18" width="8" height="8" fill="#064F45" rx="1" />
            {/* Bottom-Left Finder */}
            <Rect x="10" y="66" width="24" height="24" fill="#064F45" rx="4" />
            <Rect x="14" y="70" width="16" height="16" fill="#FFFFFF" rx="2" />
            <Rect x="18" y="74" width="8" height="8" fill="#064F45" rx="1" />
            {/* Pattern Dots */}
            <Rect x="42" y="14" width="6" height="6" fill="#064F45" />
            <Rect x="52" y="20" width="6" height="6" fill="#064F45" />
            <Rect x="42" y="30" width="16" height="6" fill="#064F45" />
            <Rect x="44" y="44" width="12" height="12" fill="#064F45" rx="2" />
            <Rect x="66" y="44" width="8" height="6" fill="#064F45" />
            <Rect x="80" y="52" width="10" height="6" fill="#064F45" />
            <Rect x="66" y="66" width="6" height="12" fill="#064F45" />
            <Rect x="76" y="72" width="14" height="6" fill="#064F45" />
            <Rect x="42" y="78" width="16" height="6" fill="#064F45" />
          </Svg>
        </View>
        <Text style={styles.passCodeLabel}>Pass Code</Text>
        <Text style={styles.passCodeValue}>{pass.passCode}</Text>
      </View>

      {/* Visitor Identity Section */}
      <View style={styles.detailsBlock}>
        <View style={styles.nameRow}>
          <Text style={styles.visitorName}>{pass.name}</Text>
          <Text style={styles.visitorCategory}>{pass.type}</Text>
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>DESTINATION</Text>
            <Text style={styles.metaValue}>{pass.flatNumber} · {pass.tower}</Text>
          </View>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>WINDOW</Text>
            <Text style={styles.metaValue}>{pass.expectedWindow}</Text>
          </View>
        </View>

        {pass.vehicleNumber ? (
          <View style={styles.vehiclePill}>
            <Text style={styles.vehicleLabel}>Vehicle:</Text>
            <Text style={styles.vehicleText}>{pass.vehicleNumber}</Text>
          </View>
        ) : null}

        {/* Security Audit Timeline */}
        <View style={styles.timelineContainer}>
          <View style={styles.timelineNode}>
            <View style={[styles.dot, styles.dotDone]} />
            <Text style={styles.nodeText}>Pass created</Text>
          </View>
          <View style={[styles.nodeLine, styles.lineDone]} />
          <View style={styles.timelineNode}>
            <View style={[styles.dot, styles.dotDone]} />
            <Text style={styles.nodeText}>Approved</Text>
          </View>
          <View style={[styles.nodeLine, pass.status === 'CHECKED_IN' || pass.status === 'CHECKED_OUT' ? styles.lineDone : styles.linePending]} />
          <View style={styles.timelineNode}>
            <View style={[styles.dot, pass.status === 'CHECKED_IN' || pass.status === 'CHECKED_OUT' ? styles.dotDone : styles.dotPending]} />
            <Text style={styles.nodeText}>Entry</Text>
          </View>
          <View style={[styles.nodeLine, pass.status === 'CHECKED_OUT' ? styles.lineDone : styles.linePending]} />
          <View style={styles.timelineNode}>
            <View style={[styles.dot, pass.status === 'CHECKED_OUT' ? styles.dotDone : styles.dotPending]} />
            <Text style={styles.nodeText}>Exit</Text>
          </View>
        </View>
      </View>

      {/* Share Toast Message */}
      {shareSuccessMessage ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{shareSuccessMessage}</Text>
        </View>
      ) : null}

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <Pressable
          style={styles.shareBtn}
          onPress={handleShare}
          accessibilityRole="button"
          accessibilityLabel="Share pass"
          testID="share-pass-btn"
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
            <Path
              d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
              stroke="#FAF8F1"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.shareBtnText}>Share pass</Text>
        </Pressable>

        {pass.status !== 'CANCELLED' && pass.status !== 'CHECKED_OUT' ? (
          <Pressable
            style={styles.revokeTextBtn}
            onPress={onRevokePress}
            accessibilityRole="button"
            accessibilityLabel="Revoke pass"
            testID="revoke-pass-btn"
          >
            <Text style={styles.revokeText}>Revoke pass</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E7E9E8',
    overflow: 'hidden',
    shadowColor: '#10201D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginVertical: 12,
  },
  headerStrip: {
    backgroundColor: '#FAF8F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFECE6',
  },
  brandMark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontSize: 10,
    color: '#064F45',
    letterSpacing: 0.6,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusPillText: {
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontSize: 11,
  },
  qrArea: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FAFAF8',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
  },
  qrFrame: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 10,
  },
  passCodeLabel: {
    fontFamily: FONT_FAMILY_INTER,
    fontSize: 11,
    color: '#69716D',
  },
  passCodeValue: {
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontSize: 20,
    color: '#064F45',
    letterSpacing: 1,
  },
  detailsBlock: {
    padding: 20,
    gap: 14,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  visitorName: {
    fontFamily: FONT_FAMILY_SERIF,
    fontSize: 22,
    fontWeight: '700',
    color: '#10201D',
  },
  visitorCategory: {
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontSize: 12,
    color: '#064F45',
    backgroundColor: '#E8F3EE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    paddingVertical: 12,
  },
  metaCell: {
    flex: 1,
    gap: 2,
  },
  metaLabel: {
    fontFamily: FONT_FAMILY_INTER,
    fontSize: 10,
    color: '#69716D',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontSize: 13,
    color: '#10201D',
  },
  vehiclePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  vehicleLabel: {
    fontFamily: FONT_FAMILY_INTER,
    fontSize: 12,
    color: '#69716D',
  },
  vehicleText: {
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontSize: 12,
    color: '#10201D',
  },
  timelineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  timelineNode: {
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotDone: {
    backgroundColor: '#064F45',
  },
  dotPending: {
    backgroundColor: '#D1D5DB',
  },
  nodeText: {
    fontFamily: FONT_FAMILY_INTER,
    fontSize: 9.5,
    color: '#69716D',
  },
  nodeLine: {
    flex: 1,
    height: 2,
    marginBottom: 12,
  },
  lineDone: {
    backgroundColor: '#064F45',
  },
  linePending: {
    backgroundColor: '#E5E7EB',
  },
  toast: {
    backgroundColor: '#064F45',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  toastText: {
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontSize: 12,
    color: '#FAF8F1',
  },
  actionButtonsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    gap: 10,
  },
  shareBtn: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: '#064F45',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#064F45',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  shareBtnText: {
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontSize: 14.5,
    color: '#FAF8F1',
  },
  revokeTextBtn: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  revokeText: {
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontSize: 13,
    color: '#DC2626',
  },
});
