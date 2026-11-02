import React from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from './SafeText';
import { useAppTheme } from '../theme/useAppTheme';

export interface ActionHubItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  onPress: () => void;
}

interface SocietyActionHubProps {
  visible: boolean;
  onClose: () => void;
  onActionSelect: (actionId: string) => void;
}

export function SocietyActionHub({
  visible,
  onClose,
  onActionSelect,
}: SocietyActionHubProps) {
  const { colors } = useAppTheme();

  const primaryActions: ActionHubItem[] = [
    {
      id: 'add-visitor',
      title: 'Add Visitor',
      subtitle: 'Create guest pass with QR',
      iconName: 'person-add',
      iconColor: '#16A34A',
      iconBg: '#DCFCE7',
      onPress: () => onActionSelect('add-visitor'),
    },
    {
      id: 'raise-complaint',
      title: 'Raise Complaint',
      subtitle: 'Report maintenance issue',
      iconName: 'construct',
      iconColor: '#D97706',
      iconBg: '#FEF3C7',
      onPress: () => onActionSelect('raise-complaint'),
    },
    {
      id: 'book-facility',
      title: 'Book Facility',
      subtitle: 'Clubhouse, sports & halls',
      iconName: 'calendar',
      iconColor: '#064F43',
      iconBg: '#EEF5F0',
      onPress: () => onActionSelect('book-facility'),
    },
    {
      id: 'pay-maintenance',
      title: 'Make Payment',
      subtitle: 'Pay society maintenance bills',
      iconName: 'wallet',
      iconColor: '#2563EB',
      iconBg: '#DBEAFE',
      onPress: () => onActionSelect('pay-maintenance'),
    },
    {
      id: 'emergency-sos',
      title: 'Emergency / SOS',
      subtitle: 'Alert security & society staff',
      iconName: 'alert-circle',
      iconColor: '#DC2626',
      iconBg: '#FEE2E2',
      onPress: () => onActionSelect('emergency-sos'),
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.surface }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.sheetHandle} />

          <View style={styles.headerRow}>
            <View>
              <SafeText style={[styles.sheetTitle, { color: colors.textPrimary }]}>
                Quick Actions
              </SafeText>
              <SafeText style={[styles.sheetSubtitle, { color: colors.textSecondary }]}>
                Select an action for your home
              </SafeText>
            </View>
            <Pressable
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close actions"
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.actionsList}>
            {primaryActions.map((action) => (
              <Pressable
                key={action.id}
                onPress={() => {
                  onClose();
                  action.onPress();
                }}
                style={({ pressed }) => [
                  styles.actionRow,
                  {
                    backgroundColor: pressed ? colors.backgroundSoft : 'transparent',
                    borderColor: colors.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={action.title}
              >
                <View style={[styles.iconBox, { backgroundColor: action.iconBg }]}>
                  <Ionicons name={action.iconName} size={20} color={action.iconColor} />
                </View>
                <View style={styles.actionTextCol}>
                  <SafeText style={[styles.actionTitle, { color: colors.textPrimary }]}>
                    {action.title}
                  </SafeText>
                  <SafeText style={[styles.actionSubtitle, { color: colors.textMuted }]}>
                    {action.subtitle}
                  </SafeText>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.border} />
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D4D0C5',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sheetSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F1EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsList: {
    gap: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionTextCol: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
