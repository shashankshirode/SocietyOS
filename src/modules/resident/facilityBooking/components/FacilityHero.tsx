import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppButton } from '../../../../shared/components/AppButton';
import { SafeText } from '../../../../shared/components/SafeText';
import { ResponsiveImage } from '../../../../ui/components/ResponsiveImage';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import type { CatalogImage } from '../../../../configuration/residentImageCatalog';
import {
  facilityBookingStyles as styles,
  heroOverlayStyle,
} from '../styles/facilityBooking.styles';

interface FacilityHeroProps {
  readonly image: CatalogImage;
  readonly title: string;
  readonly subtitle: string;
  readonly actionLabel: string;
  readonly badgeLabel: string;
  readonly onAction: () => void;
}

export function FacilityHero({
  image,
  title,
  subtitle,
  actionLabel,
  badgeLabel,
  onAction,
}: FacilityHeroProps) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.hero}>
      <ResponsiveImage image={image} aspectRatio={16 / 7} style={styles.heroImage} />
      <View style={[styles.heroContent, heroOverlayStyle(colors.overlay)]}>
        <SafeText variant="tiny" color="inverse" style={styles.heroBadge}>{badgeLabel}</SafeText>
        <SafeText variant="h2" color="inverse">{title}</SafeText>
        <SafeText variant="caption" color="inverse">{subtitle}</SafeText>
        <AppButton
          title={actionLabel}
          onPress={onAction}
          size="sm"
          variant="secondary"
          style={styles.heroAction}
          iconLeft={<Ionicons name="calendar-outline" size={17} color={colors.primary} />}
        />
      </View>
    </View>
  );
}
