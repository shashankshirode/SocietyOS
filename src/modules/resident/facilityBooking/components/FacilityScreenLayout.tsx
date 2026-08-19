import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { ContentFrame } from '../../../../ui/layout/ContentFrame';
import { ResidentPageHeader } from '../../../../ui/patterns/ResidentPageHeader';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useFacilityNetworkStatus } from '../hooks/useFacilityNetworkStatus';
import { useMessages } from '../../../../messages/useMessages';
import {
  backgroundBorderStyle,
  backgroundColorStyle,
  facilityBookingStyles as styles,
} from '../styles/facilityBooking.styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { includeWhenPresent } from '../../../../shared/utils/presentProperty';

interface FacilityScreenLayoutProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly onBack: () => void;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
  readonly testID?: string;
  readonly showBackButton?: boolean;
}

export function FacilityScreenLayout({
  title,
  subtitle,
  onBack,
  children,
  footer,
  testID,
  showBackButton = true,
}: FacilityScreenLayoutProps) {
  const { colors } = useAppTheme();
  const { isOffline } = useFacilityNetworkStatus();
  const labels = useMessages().resident.facilityBooking.states;
  return (
    <View style={[styles.root, backgroundColorStyle(colors.background)]} testID={testID}>
      <ResidentPageHeader
        title={title}
        showBackButton={showBackButton}
        onBackPress={onBack}
        {...includeWhenPresent('subtitle', subtitle)}
      />
      {isOffline ? (
        <View style={[
          styles.offlineBanner,
          backgroundBorderStyle(colors.warningSoft, colors.warning),
        ]}>
          <Ionicons name="cloud-offline-outline" size={18} color={colors.warning} />
          <SafeText variant="tiny" color="secondary" style={styles.grow}>{labels.offlineDescription}</SafeText>
        </View>
      ) : null}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <ContentFrame style={styles.contentStack}>{children}</ContentFrame>
      </ScrollView>
      {footer}
    </View>
  );
}
