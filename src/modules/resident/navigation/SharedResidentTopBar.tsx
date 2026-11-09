/**
 * Shared Resident Top Navigation Bar
 * Persistent, configurable top navigation bar for resident screens
 */

import { memo } from 'react';
import { View, Pressable, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../shared/components/SafeText';
import { SocietyOSLogoMark } from '../../../shared/components/SocietyOSLogo';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useActiveResidentHome } from '../homeContext/hooks/useActiveResidentHome';
import { useSocietyExperience } from '../experience/SocietyExperienceContext';
import { useResidentNotifications } from '../notifications/data/useResidentNotifications';
import {
  createHeaderContainerStyle,
  createLogoBoxStyle,
  createSocietyNameStyle,
  createChevronIconStyle,
  createUnitTextStyle,
  createIconButtonStyle,
  createBadgeStyle,
  createBadgeTextStyle,
  createAvatarButtonStyle,
  styles as headerStyles,
} from '../dashboard/styles/components/ResidentHomeHeader.styles';

const AVATAR_IMAGE = require('../../../../assets/images/shashank-avatar.png');

export interface SharedResidentTopBarProps {
  societyName?: string;
  unitName?: string;
  topInset?: number;
  unreadCount?: number;
  visible?: boolean;
  onSwitchResidence?: () => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
}

export const SharedResidentTopBar = memo(function SharedResidentTopBar({
  societyName: propSocietyName,
  unitName: propUnitName,
  topInset: propTopInset,
  unreadCount: propUnreadCount,
  visible = true,
  onSwitchResidence: propOnSwitchResidence,
  onOpenNotifications: propOnOpenNotifications,
  onOpenProfile: propOnOpenProfile,
}: SharedResidentTopBarProps) {
  const insets = useSafeAreaInsets();
  const { colors, semantic } = useAppTheme();
  const { activeContext } = useActiveResidentHome();
  const { openResidenceSwitcher, openIdentityCenter } = useSocietyExperience();
  const { data: notifications = [] } = useResidentNotifications();

  if (!visible) {
    return null;
  }

  const effectiveTopInset = propTopInset ?? insets.top;
  const societyName = propSocietyName || activeContext.societyName || 'Greenwood Heights';
  const unitName = propUnitName || activeContext.displayUnitName || 'A-1204 • Pune';
  const unreadCount =
    propUnreadCount ?? notifications.filter((item) => item.status === 'unread').length;

  const handleSwitchResidence = propOnSwitchResidence || openResidenceSwitcher;
  const handleOpenProfile = propOnOpenProfile || openIdentityCenter;
  const handleOpenNotifications = propOnOpenNotifications;

  return (
    <View
      style={[
        localStyles.topBarContainer,
        { backgroundColor: colors.background },
        createHeaderContainerStyle(effectiveTopInset),
      ]}
      testID="shared-resident-top-bar"
    >
      <View style={headerStyles.topBar}>
        <Pressable
          style={headerStyles.residenceSelector}
          accessibilityRole="button"
          accessibilityLabel={`Current residence: ${societyName}, Unit ${unitName}. Tap to switch residence.`}
          onPress={handleSwitchResidence}
        >
          <View style={[createLogoBoxStyle(colors.surface, colors.border), headerStyles.logoBoxShadow]}>
            <SocietyOSLogoMark size={22} color={semantic.text.primary} />
          </View>
          <View style={headerStyles.residenceInfo}>
            <View style={headerStyles.societyRow}>
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

        <View style={headerStyles.actionsGroup}>
          <Pressable
            style={[createIconButtonStyle(colors.surface, colors.border), headerStyles.iconButtonShadow]}
            accessibilityRole="button"
            accessibilityLabel={`Notifications, ${unreadCount} unread`}
            onPress={handleOpenNotifications}
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
            onPress={handleOpenProfile}
          >
            <Image source={AVATAR_IMAGE} style={headerStyles.avatarImage} resizeMode="cover" />
          </Pressable>
        </View>
      </View>
    </View>
  );
});

const localStyles = StyleSheet.create({
  topBarContainer: {
    paddingHorizontal: 20,
    zIndex: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'transparent',
  },
});

export default SharedResidentTopBar;

