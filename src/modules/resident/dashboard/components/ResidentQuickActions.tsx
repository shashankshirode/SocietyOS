import { memo } from 'react';
import { Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import {
  createIconBoxStyle,
  createActionLabelStyle,
  createBadgeDotStyle,
  createRailStyle,
  createActionItemStyle,
  styles,
} from '../styles/components/ResidentQuickActions.styles';

export interface ResidentQuickActionsProps {
  canManageBills: boolean;
  hasUnpaidBill: boolean;
  onInviteGuest: () => void;
  onPayOrBilling: () => void;
  onRaiseRequest: () => void;
  onBookFacility: () => void;
}

interface ActionItem {
  id: string;
  label: string;
  accessibilityLabel: string;
  unpaidLabel?: string;
  unpaidAccessibilityLabel?: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
  unpaidIconBg?: string;
  unpaidIconColor?: string;
  onPress: (props: ResidentQuickActionsProps) => void;
}

const actionItems = {
  inviteGuest: {
    id: 'invite-guest',
    label: 'Invite Guest',
    accessibilityLabel: 'Invite Guest: Create a visitor pass',
    iconName: 'person-add-outline',
    iconBg: 'successSurface',
    iconColor: 'success',
    onPress: (props: ResidentQuickActionsProps) => props.onInviteGuest(),
  },
  billing: {
    id: 'billing',
    label: 'Billing',
    accessibilityLabel: 'Billing: View maintenance history and ledger',
    unpaidLabel: 'Pay Bill',
    unpaidAccessibilityLabel: 'Pay Maintenance: Unpaid bill pending',
    iconName: 'card-outline',
    iconBg: 'dangerSurface',
    iconColor: 'coral',
    unpaidIconBg: 'dangerSurface',
    unpaidIconColor: 'danger',
    onPress: (props: ResidentQuickActionsProps) => props.onPayOrBilling(),
  },
  raiseIssue: {
    id: 'raise-issue',
    label: 'Raise Issue',
    accessibilityLabel: 'Raise Request: Report a maintenance issue or complaint',
    iconName: 'construct-outline',
    iconBg: 'warningSurface',
    iconColor: 'amber',
    onPress: (props: ResidentQuickActionsProps) => props.onRaiseRequest(),
  },
  bookFacility: {
    id: 'book-facility',
    label: 'Book Facility',
    accessibilityLabel: 'Book Facility: Reserve clubhouse or sports amenities',
    iconName: 'calendar-outline',
    iconBg: 'infoSurface',
    iconColor: 'lavender',
    onPress: (props: ResidentQuickActionsProps) => props.onBookFacility(),
  },
} as const;

export const ResidentQuickActions = memo(function ResidentQuickActions({
  canManageBills,
  hasUnpaidBill,
  onInviteGuest,
  onPayOrBilling,
  onRaiseRequest,
  onBookFacility,
}: ResidentQuickActionsProps) {
  const { semantic } = useAppTheme();

  const actions: ActionItem[] = [actionItems.inviteGuest];
  if (canManageBills) {
    actions.push(actionItems.billing);
  }
  actions.push(actionItems.raiseIssue, actionItems.bookFacility);

  return (
    <View style={styles.root}>
      <View style={createRailStyle(semantic.surface.raised, semantic.border.default)}>
        {actions.map((action) => {
          const isBilling = action.id === 'billing';
          const isUnpaid = isBilling && hasUnpaidBill;

          return (
            <Pressable
              key={action.id}
              style={createActionItemStyle()}
              accessibilityRole="button"
              accessibilityLabel={isBilling && isUnpaid ? action.unpaidAccessibilityLabel! : action.accessibilityLabel}
              onPress={() => action.onPress({ canManageBills, hasUnpaidBill, onInviteGuest, onPayOrBilling, onRaiseRequest, onBookFacility })}
            >
              <View style={[
                styles.iconBox,
                createIconBoxStyle(
                  isBilling && isUnpaid
                    ? semantic.status[action.unpaidIconBg! as keyof typeof semantic.status]
                    : semantic.status[action.iconBg as keyof typeof semantic.status]
                ),
              ]}>
                <Ionicons
                  name={action.iconName as keyof typeof Ionicons.glyphMap}
                  size={22}
                  color={
                    isBilling && isUnpaid
                      ? semantic.status[action.unpaidIconColor! as keyof typeof semantic.status]
                      : semantic.status[action.iconColor as keyof typeof semantic.status] ||
                        semantic.accent[action.iconColor as keyof typeof semantic.accent]
                  }
                />
                {isBilling && isUnpaid ? <View style={createBadgeDotStyle(semantic.status.danger)} /> : null}
              </View>
              <SafeText style={[styles.actionLabel, createActionLabelStyle(semantic.text.primary)]} numberOfLines={2}>
                {isBilling && isUnpaid ? action.unpaidLabel! : action.label}
              </SafeText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});

export default ResidentQuickActions;

