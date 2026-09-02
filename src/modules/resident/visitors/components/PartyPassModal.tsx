import React, { useState } from 'react';
import { StyleSheet, View, Pressable, TextInput, Share } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { AppModal } from '../../../../ui/modal/AppModal';
import { HapticFeedback } from '../../../../shared/utils/haptics';

export interface PartyPassModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PartyPassModal({ visible, onClose }: PartyPassModalProps) {
  const { colors } = useAppTheme();
  const [eventName, setEventName] = useState('Birthday Celebration & Dinner');
  const [guestCount, setGuestCount] = useState('15');
  const [partyPassCreated, setPartyPassCreated] = useState(false);
  const [partyCode] = useState(() => `PARTY-${Math.floor(1000 + Math.random() * 9000)}`);

  const handleShare = async () => {
    HapticFeedback.success();
    try {
      await Share.share({
        message: `🎉 You are invited to ${eventName} at Flat 402, Tower B! Use digital pass code: ${partyCode} for quick entry at Security Gate. Link: https://societyos.app/pass/${partyCode}`,
      });
    } catch {
      // safe fallback
    }
  };

  const handleCreate = () => {
    HapticFeedback.medium();
    setPartyPassCreated(true);
  };

  return (
    <AppModal visible={visible} onClose={onClose} testID="party-pass-modal">
      <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
        <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="sparkles" size={22} color="#F59E0B" />
              <SafeText variant="h3" color="primary">Multi-Guest Party Pass</SafeText>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          {!partyPassCreated ? (
            <View style={styles.form}>
              <SafeText variant="caption" color="muted">
                Create a single pass for all your guests. Share the link or code via WhatsApp/SMS for 1-tap entry.
              </SafeText>

              <View style={styles.inputGroup}>
                <SafeText variant="caption" color="primary" style={{ fontWeight: '700' }}>Occasion / Event Title</SafeText>
                <TextInput
                  value={eventName}
                  onChangeText={setEventName}
                  style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.background }]}
                  placeholder="e.g. Housewarming / Birthday Party"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <SafeText variant="caption" color="primary" style={{ fontWeight: '700' }}>Expected Guest Count</SafeText>
                <TextInput
                  value={guestCount}
                  onChangeText={setGuestCount}
                  keyboardType="numeric"
                  style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.background }]}
                  placeholder="e.g. 20"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={[styles.badgeInfo, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                <Ionicons name="information-circle-outline" size={18} color="#D97706" />
                <SafeText variant="tiny" style={{ color: '#B45309', flex: 1 }}>
                  Security guard will validate each guest against this pass count until {guestCount} guests enter.
                </SafeText>
              </View>

              <Pressable
                onPress={handleCreate}
                style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
              >
                <Ionicons name="qr-code-outline" size={18} color="#FFF" />
                <SafeText variant="bodyStrong" style={styles.primaryBtnText}>Generate Bulk Party Pass</SafeText>
              </Pressable>
            </View>
          ) : (
            <View style={styles.successState}>
              <View style={[styles.qrPlaceholder, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Ionicons name="qr-code" size={100} color={colors.primary} />
                <SafeText variant="h2" color="primary" style={styles.codeText}>{partyCode}</SafeText>
                <SafeText variant="caption" color="muted">Valid for {guestCount} guests today</SafeText>
              </View>

              <Pressable
                onPress={handleShare}
                style={[styles.shareBtn, { backgroundColor: '#25D366' }]}
              >
                <Ionicons name="logo-whatsapp" size={20} color="#FFF" />
                <SafeText variant="bodyStrong" style={styles.primaryBtnText}>Share Invite Link on WhatsApp</SafeText>
              </Pressable>

              <Pressable onPress={onClose} style={styles.doneBtn}>
                <SafeText variant="bodyStrong" color="primary">Done</SafeText>
              </Pressable>
            </View>
          )}
        </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  closeBtn: {
    padding: 4,
  },
  form: {
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  badgeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 12,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 6,
  },
  primaryBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
  successState: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 10,
  },
  qrPlaceholder: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    width: '100%',
  },
  codeText: {
    letterSpacing: 2,
    marginVertical: 6,
    fontWeight: '800',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
  },
  doneBtn: {
    paddingVertical: 8,
  },
});
