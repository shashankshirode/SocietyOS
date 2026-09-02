import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { HapticFeedback } from '../../../../shared/utils/haptics';

export interface ConnectHomeViewProps {
  status?: 'INVITED' | 'PENDING_APPROVAL' | 'ENDED' | 'NONE';
  societyName?: string;
  unitName?: string;
  onLinkResidence?: () => void;
  onViewInvitations?: () => void;
  onWithdrawRequest?: () => void;
}

export function ConnectHomeView({
  status = 'NONE',
  societyName = 'Green Valley Heights',
  unitName = 'Flat A-1204',
  onLinkResidence,
  onViewInvitations,
  onWithdrawRequest,
}: ConnectHomeViewProps) {
  const { colors } = useAppTheme();
  const isPending = status === 'PENDING_APPROVAL';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} testID="connect-home-view">
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.iconWrap, { backgroundColor: isPending ? 'rgba(245, 158, 11, 0.12)' : 'rgba(59, 130, 246, 0.12)' }]}>
          <Ionicons
            name={isPending ? 'hourglass-outline' : 'home-outline'}
            size={36}
            color={isPending ? '#D97706' : colors.primary}
          />
        </View>

        <SafeText variant="h2" color="primary" align="center" style={styles.title}>
          {isPending ? 'Link Request Under Review' : 'Connect Your Home'}
        </SafeText>

        <SafeText variant="body" color="muted" align="center" style={styles.description}>
          {isPending
            ? `Your request to join ${societyName} (${unitName}) was submitted. When the committee approves it, this home will automatically activate in SocietyOS.`
            : 'Link your apartment or accept a society invitation to start experiencing continuous smart residential living.'}
        </SafeText>

        {isPending ? (
          <View style={styles.pendingBadge}>
            <Ionicons name="time" size={14} color="#B45309" />
            <SafeText variant="tiny" style={{ color: '#B45309', fontWeight: '700' }}>
              SUBMISSION STATUS: PENDING COMMITTEE VERIFICATION
            </SafeText>
          </View>
        ) : null}

        <View style={styles.actionsCol}>
          {!isPending ? (
            <>
              <Pressable
                onPress={() => {
                  HapticFeedback.medium();
                  onLinkResidence?.();
                }}
                style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
              >
                <Ionicons name="add-circle-outline" size={18} color="#FFF" />
                <SafeText variant="bodyStrong" style={styles.primaryBtnText}>Link a Residence</SafeText>
              </Pressable>

              <Pressable
                onPress={() => {
                  HapticFeedback.light();
                  onViewInvitations?.();
                }}
                style={[styles.outlineBtn, { borderColor: colors.border }]}
              >
                <Ionicons name="mail-unread-outline" size={18} color={colors.textPrimary} />
                <SafeText variant="bodyStrong" color="primary">View Invitations</SafeText>
              </Pressable>
            </>
          ) : (
            <Pressable
              onPress={() => {
                HapticFeedback.medium();
                onWithdrawRequest?.();
              }}
              style={[styles.outlineBtn, { borderColor: colors.danger }]}
            >
              <Ionicons name="close-circle-outline" size={18} color={colors.danger} />
              <SafeText variant="bodyStrong" style={{ color: colors.danger }}>Withdraw Request</SafeText>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    lineHeight: 20,
    marginBottom: 16,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 20,
  },
  actionsCol: {
    width: '100%',
    gap: 10,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  primaryBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
  },
});
