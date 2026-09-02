import { Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../shared/components/SafeText';
import { useMessages } from '../../../shared/constants/useMessages';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useActiveResidentHome } from '../homeContext/hooks/useActiveResidentHome';
import { useSocietyExperience } from './SocietyExperienceContext';
import { createBackgroundStyle, createColorStyle, styles } from './styles/SocietyAmbientChrome.styles';

const roleLabels = {
  owner: 'owner',
  coOwner: 'coOwner',
  tenant: 'tenant',
  familyMember: 'familyMember',
  authorizedOccupant: 'authorizedOccupant',
} as const;

export function ResidenceBeacon() {
  const theme = useAppTheme();
  const messages = useMessages();
  const { activeContext } = useActiveResidentHome();
  const { openResidenceSwitcher } = useSocietyExperience();
  const copy = messages.resident.experience;
  const relationship = copy.identityCenter[roleLabels[activeContext.residentRole]];

  return (
    <Pressable
      testID="resident-residence-beacon"
      onPress={openResidenceSwitcher}
      accessibilityRole="button"
      accessibilityLabel={`${copy.ambient.switchResidence}. ${activeContext.societyName}, ${activeContext.displayUnitName}`}
      style={[styles.beacon, createBackgroundStyle(theme.semantic.surface.soft)]}
    >
      <SafeText variant="tiny" style={[styles.beaconEyebrow, createColorStyle(theme.semantic.accent.moss)]} numberOfLines={1}>
        {activeContext.societyName}
      </SafeText>
      <View style={styles.beaconMeta}>
        <SafeText variant="caption" color="secondary" style={styles.beaconContext} numberOfLines={1}>
          {activeContext.displayUnitName} · {relationship}
        </SafeText>
        <Ionicons name="chevron-down" size={14} color={theme.semantic.text.tertiary} />
      </View>
    </Pressable>
  );
}
