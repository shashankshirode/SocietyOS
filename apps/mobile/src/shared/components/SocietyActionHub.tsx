import React from 'react';
import {
  Pressable,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from './SafeText';
import { useAppTheme } from '../theme/useAppTheme';
import { AppModal } from '../../ui/modal/AppModal';
import {
  styles,
  createTextColorStyle,
  createActionRowDynamicStyle,
  createIconBoxBgStyle,
} from './styles/SocietyActionHub.styles';

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
    <AppModal
      visible={visible}
      onClose={onClose}
      showDragHandle={true}
    >
      <View style={styles.contentWrapper}>
        <View style={styles.headerRow}>
          <View>
            <SafeText style={[styles.sheetTitle, createTextColorStyle(colors.textPrimary)]}>
              Quick Actions
            </SafeText>
            <SafeText style={[styles.sheetSubtitle, createTextColorStyle(colors.textSecondary)]}>
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
                createActionRowDynamicStyle(
                  pressed ? colors.backgroundSoft : 'transparent',
                  colors.border
                ),
              ]}
              accessibilityRole="button"
              accessibilityLabel={action.title}
            >
              <View style={[styles.iconBox, createIconBoxBgStyle(action.iconBg)]}>
                <Ionicons name={action.iconName} size={20} color={action.iconColor} />
              </View>
              <View style={styles.actionTextCol}>
                <SafeText style={[styles.actionTitle, createTextColorStyle(colors.textPrimary)]}>
                  {action.title}
                </SafeText>
                <SafeText style={[styles.actionSubtitle, createTextColorStyle(colors.textMuted)]}>
                  {action.subtitle}
                </SafeText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.border} />
            </Pressable>
          ))}
        </View>
      </View>
    </AppModal>
  );
}
