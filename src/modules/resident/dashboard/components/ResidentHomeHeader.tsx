import { memo } from 'react';
import { Image, Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { SocietyOSLogoMark } from '../../../../shared/components/SocietyOSLogo';
import { useResidentNotifications } from '../../notifications/data/useResidentNotifications';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import {
  createAuraDotStyle,
  createHeaderContainerStyle,
  createLogoBoxStyle,
  createSocietyNameStyle,
  createChevronIconStyle,
  createUnitTextStyle,
  createIconButtonStyle,
  createBadgeStyle,
  createBadgeTextStyle,
  createAvatarButtonStyle,
  createGreetingTextStyle,
  createResidentNameTextStyle,
  createStatusAuraTextStyle,
  styles,
} from '../styles/components/ResidentHomeHeader.styles';

const AVATAR_IMAGE = require('../../../../../assets/images/shashank-avatar.png');

export interface ResidentHomeGreetingProps {
  greeting: string;
  residentName: string;
  statusText: string;
  statusTone?: 'active' | 'attention' | 'calm';
}

export const ResidentHomeGreeting = memo(function ResidentHomeGreeting({
  greeting,
  residentName,
  statusText,
  statusTone = 'calm',
}: ResidentHomeGreetingProps) {
  const { semantic } = useAppTheme();

  const auraColor =
    statusTone === 'attention'
      ? semantic.status.danger
      : statusTone === 'active'
      ? semantic.status.warning
      : semantic.status.success;

  const residentFirstName = residentName.trim().split(' ')[0] || 'Resident';

  return (
    <View style={styles.greetingBlock}>
      <View style={styles.greetingTitleRow}>
        <SafeText style={createGreetingTextStyle(semantic.text.secondary)}>
          {greeting ? `${greeting},` : 'Hello,'}
        </SafeText>
        <SafeText
          testID="resident-dashboard-name"
          style={createResidentNameTextStyle(semantic.text.primary)}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {residentFirstName}
        </SafeText>
      </View>

      <View style={styles.statusAuraRow}>
        <View style={[styles.auraDot, createAuraDotStyle(auraColor)]} />
        <SafeText style={createStatusAuraTextStyle(semantic.text.secondary)} numberOfLines={1}>
          {statusText}
        </SafeText>
      </View>
    </View>
  );
});

export interface ResidentHomeHeaderProps {
  societyName: string;
  unitName: string;
  greeting: string;
  residentName: string;
  topInset: number;
  statusText: string;
  statusTone?: 'active' | 'attention' | 'calm';
  onSwitchResidence: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenScenarioLab?: () => void;
}

export const ResidentHomeHeader = memo(function ResidentHomeHeader({
  societyName,
  unitName,
  greeting,
  residentName,
  topInset,
  statusText,
  statusTone = 'calm',
  onSwitchResidence,
  onOpenNotifications,
  onOpenProfile,
}: ResidentHomeHeaderProps) {
  const { colors, semantic } = useAppTheme();
  const { data: notifications = [] } = useResidentNotifications();
  const unreadCount = notifications.filter((item) => item.status === 'unread').length;

  return (
    <View style={[styles.root, createHeaderContainerStyle(topInset)]}>
      <View style={styles.topBar}>
        <Pressable
          style={styles.residenceSelector}
          accessibilityRole="button"
          accessibilityLabel={`Current residence: ${societyName}, Unit ${unitName}. Tap to switch residence.`}
          onPress={onSwitchResidence}
        >
          <View style={[createLogoBoxStyle(colors.surface, colors.border), styles.logoBoxShadow]}>
            <SocietyOSLogoMark size={22} color={semantic.text.primary} />
          </View>
          <View style={styles.residenceInfo}>
            <View style={styles.societyRow}>
              <SafeText style={createSocietyNameStyle(semantic.text.primary)} numberOfLines={1}>
                {societyName}
              </SafeText>
              <Ionicons
                name="chevron-down"
                size={14}
                color={semantic.text.primary}
                style={createChevronIconStyle(semantic.text.primary)}
              />
            </View>
            <SafeText style={createUnitTextStyle(semantic.text.secondary)} numberOfLines={1}>
              {unitName}
            </SafeText>
          </View>
        </Pressable>

        <View style={styles.actionsGroup}>
          <Pressable
            style={[createIconButtonStyle(colors.surface, colors.border), styles.iconButtonShadow]}
            accessibilityRole="button"
            accessibilityLabel={`Notifications, ${unreadCount} unread`}
            onPress={onOpenNotifications}
          >
            <Ionicons name="notifications-outline" size={19} color={semantic.text.primary} />
            {unreadCount > 0 ? (
              <View style={createBadgeStyle(semantic.status.danger)}>
                <SafeText style={createBadgeTextStyle(semantic.text.inverse)}>
                  {unreadCount > 9 ? '9+' : String(unreadCount)}
                </SafeText>
              </View>
            ) : null}
          </Pressable>

          <Pressable
            style={createAvatarButtonStyle(colors.surface, colors.border)}
            accessibilityRole="button"
            accessibilityLabel="Resident Profile"
            onPress={onOpenProfile}
          >
            <Image
              source={AVATAR_IMAGE}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </Pressable>
        </View>
      </View>

      <ResidentHomeGreeting
        greeting={greeting}
        residentName={residentName}
        statusText={statusText}
        statusTone={statusTone}
      />
    </View>
  );
});

export default ResidentHomeHeader;
