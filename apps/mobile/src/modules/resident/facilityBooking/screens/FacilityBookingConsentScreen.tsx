import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FacilityStackParamList } from '../../../../app/navigation/navigation.types';
import { AppCard } from '../../../../shared/cards/AppCard';
import { AppButton } from '../../../../shared/components/AppButton';
import { SafeText } from '../../../../shared/components/SafeText';
import { ErrorState } from '../../../../shared/feedback/ErrorState';
import { StickyFooter } from '../../../../shared/layout/StickyFooter';
import { useMessages } from '../../../../messages/useMessages';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useFacilityDetails } from '../hooks/useFacilityDetails';
import {
  facilityBookingDraftStore,
  useFacilityBookingDraft,
} from '../state/facilityBookingDraftStore';
import {
  backgroundBorderStyle,
  backgroundColorStyle,
  facilityBookingStyles as styles,
} from '../styles/facilityBooking.styles';
import { FacilityScreenLayout } from '../components/FacilityScreenLayout';
import { performBackNavigation } from '../../../../shared/navigation/performBackNavigation';

type Props = NativeStackScreenProps<FacilityStackParamList, 'FacilityBookingConsent'>;

export function FacilityBookingConsentScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const labels = useMessages().resident.facilityBooking;
  const { activeContext } = useActiveResidentHome();
  const draft = useFacilityBookingDraft();
  const resource = useFacilityDetails(draft?.facilityId ?? '');
  const [accepted, setAccepted] = useState(draft?.consentAccepted ?? false);
  const validDraft = draft && draft.residenceId === activeContext.homeContextId && Date.parse(draft.holdExpiresAt ?? '') > Date.now();
  if (!validDraft || !draft || resource.error) {
    return (
      <FacilityScreenLayout title={labels.consent.title} onBack={() => performBackNavigation(navigation, { fallbackRoute: 'CreateFacilityBooking', currentRouteName: 'FacilityBookingConsent' })}>
        <ErrorState
          title={labels.review.residenceChangedTitle}
          message={labels.review.residenceChangedDescription}
          onRetry={() => navigation.navigate('FacilityHome', { unitId: activeContext.unitId })}
          retryLabel={labels.success.backToFacilities}
        />
      </FacilityScreenLayout>
    );
  }
  if (resource.isLoading || !resource.data) {
    return <FacilityScreenLayout title={labels.consent.title} onBack={() => performBackNavigation(navigation, { fallbackRoute: 'CreateFacilityBooking', currentRouteName: 'FacilityBookingConsent' })}><AppCard><SafeText>{labels.states.loadingDetails}</SafeText></AppCard></FacilityScreenLayout>;
  }
  const facility = resource.data;
  const footer = (
    <StickyFooter>
      <AppButton
        title={labels.consent.continueAction}
        onPress={() => {
          facilityBookingDraftStore.update({
            consentAccepted: true,
            acceptedRuleIds: facility.rules.filter((rule) => rule.required).map((rule) => rule.id),
          });
          navigation.navigate('FacilityBookingReview', {});
        }}
        disabled={!accepted}
        fullWidth
      />
    </StickyFooter>
  );
  const policies = [
    { id: 'damage', title: labels.consent.damageResponsibility, description: labels.damageResponsibilityDescription, icon: 'construct-outline' },
    { id: 'guests', title: labels.consent.guestResponsibility, description: labels.agreeRulesDescription, icon: 'people-outline' },
    { id: 'noise', title: labels.consent.noiseRestrictions, description: labels.inspectionNote, icon: 'volume-low-outline' },
    { id: 'hours', title: labels.consent.operatingRestrictions, description: labels.details.hoursBefore(facility.cancellationCutoffMinutes / 60), icon: 'time-outline' },
    { id: 'conduct', title: labels.consent.conductRequirements, description: labels.agreeRulesDescription, icon: 'shield-checkmark-outline' },
  ];
  return (
    <FacilityScreenLayout
      title={labels.consent.title}
      subtitle={labels.consent.subtitle}
      onBack={() => performBackNavigation(navigation, { fallbackRoute: 'CreateFacilityBooking', currentRouteName: 'FacilityBookingConsent' })}
      footer={footer}
      testID="facility-booking-consent-screen"
    >
      <AppCard variant="outlined" style={styles.policyCard}>
        <SafeText variant="title">{labels.consent.facilityRules}</SafeText>
        {facility.rules.map((rule) => (
          <View key={rule.id} style={styles.policyRow}>
            <View style={[styles.policyIcon, backgroundColorStyle(colors.primarySoft)]}>
              <Ionicons name="document-text-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.grow}>
              <SafeText variant="caption">{rule.title}</SafeText>
              <SafeText variant="tiny" color="secondary">{rule.description}</SafeText>
            </View>
          </View>
        ))}
      </AppCard>
      <AppCard variant="outlined" style={styles.policyCard}>
        <SafeText variant="title">{labels.consent.cancellationPolicy}</SafeText>
        <SafeText variant="caption" color="secondary">{labels.depositNote}</SafeText>
        {policies.map((policy) => (
          <View key={policy.id} style={styles.policyRow}>
            <View style={[styles.policyIcon, backgroundColorStyle(colors.infoSoft)]}>
              <Ionicons name="information-circle-outline" size={18} color={colors.info} />
            </View>
            <View style={styles.grow}>
              <SafeText variant="caption">{policy.title}</SafeText>
              <SafeText variant="tiny" color="secondary">{policy.description}</SafeText>
            </View>
          </View>
        ))}
      </AppCard>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: accepted }}
        accessibilityLabel={labels.consent.agreementAccessibility}
        onPress={() => setAccepted((current) => !current)}
        style={styles.consentRow}
      >
        <View style={[
          styles.checkbox,
          backgroundBorderStyle(accepted ? colors.primary : colors.surface, accepted ? colors.primary : colors.border),
        ]}>
          {accepted ? <Ionicons name="checkmark" size={18} color={colors.textOnPrimary} /> : null}
        </View>
        <SafeText variant="caption" style={styles.grow}>{labels.consent.agreement}</SafeText>
      </Pressable>
      {!accepted ? <SafeText variant="tiny" color="danger">{labels.consent.required}</SafeText> : null}
    </FacilityScreenLayout>
  );
}
