import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { Colors } from "../../../../shared/constants/colors";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { StatusBadge, getOccupancyStatusBadgeType } from "../../../../shared/components/StatusBadge";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { useUnitOccupancyOverview } from "../hooks/useUnitOccupancyOverview";
import type { OwnerTenantOverviewScreenProps } from "../../../../app/navigation/navigation.types";
import { ResidentDisplayName } from "../../../../ui/typography/ResidentDisplayName";
import { styles } from "../styles/screens/OwnerTenantOverviewScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function OwnerTenantOverviewScreen({ navigation, route }: OwnerTenantOverviewScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { unitId } = route.params;
    const { data, isLoading, error, refetch } = useUnitOccupancyOverview(unitId);
    if (isLoading)
        return <LoadingState />;
    if (error || !data) {
        return (<ErrorState title={localizedUiText.m_4ca7301e0bbb} message={localizedUiText.m_d344284fe38c} onRetry={refetch}/>);
    }
    const { unitDetails } = data;
    return (<SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader title={`${unitDetails.tower} - ${unitDetails.flatNumber}`} showBack onBack={() => navigation.goBack()}/>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Animated.View entering={FadeInUp.duration(400)}>
          <AppCard style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View>
                <Text style={styles.societyName}>{data.societyName}</Text>
                <Text style={styles.unitTypeLabel}>{localizedUiText.m_55eb025b3d45 + " "}{unitDetails.floor})</Text>
              </View>
              <StatusBadge label={unitDetails.occupancyStatus.replace('_', ' ')} type={getOccupancyStatusBadgeType(unitDetails.occupancyStatus)}/>
            </View>

            <View style={styles.divider}/>

            <View style={styles.ownerSummaryRow}>
              <View style={styles.ownerSummaryCol}>
                <Text style={styles.ownerLabel}>{localizedUiText.m_081a3543e9a5}</Text>
                <ResidentDisplayName displayName={data.currentOwner?.name || '—'} style={styles.ownerName}/>
              </View>
              {data.currentTenant && (<View style={[styles.ownerSummaryCol, styles.tenantSummaryCol]}>
                  <Text style={styles.ownerLabel}>{localizedUiText.m_ca79fe9ac3ac}</Text>
                  <ResidentDisplayName displayName={data.currentTenant.name} style={styles.ownerName}/>
                </View>)}
            </View>
          </AppCard>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(450)}>
          <View style={styles.metricsGrid}>
            <Pressable style={styles.metricItem} onPress={() => navigation.navigate('FamilyMembers', { unitId })}>
              <Text style={styles.metricNum}>{data.familyMembersCount}</Text>
              <Text style={styles.metricLabel}>{localizedUiText.m_3d87c24d24b9}</Text>
            </Pressable>
            <Pressable style={styles.metricItem} onPress={() => navigation.navigate('UnitVehicles', { unitId })}>
              <Text style={styles.metricNum}>{data.vehiclesCount}</Text>
              <Text style={styles.metricLabel}>{localizedUiText.m_f31536020df3}</Text>
            </Pressable>
            <Pressable style={styles.metricItem} onPress={() => navigation.navigate('CurrentDocumentsSummary', { unitId })}>
              <Text style={styles.metricNum}>{data.documentsCompletionCount}</Text>
              <Text style={styles.metricLabel}>{localizedUiText.m_23358d4918c7}</Text>
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(450)}>
          <Text style={styles.sectionHeader}>{localizedUiText.m_a3690b654f87}</Text>
          
          <AppCard style={styles.actionsCard}>
            <ActionRow icon="person-outline" label={localizedUiText.m_d3754e63d5e0} sublabel="KYC status, registry deeds, parking spaces" onPress={() => navigation.navigate('CurrentOwnerProfile', { unitId })}/>
            <ActionRow icon="people-outline" label={localizedUiText.m_95be4ae75167} sublabel="Rental lease term, police verification status" onPress={() => navigation.navigate('CurrentTenantProfile', { unitId })}/>
            <ActionRow icon="shield-checkmark-outline" label={localizedUiText.m_744ef4242720} sublabel="Toggle login, visitor approvals, and RFID gates" onPress={() => navigation.navigate('UnitAccessStatus', { unitId })}/>
            <ActionRow icon="cloud-upload-outline" label={localizedUiText.m_3adcf4a5ea17} sublabel="Register a new owner or tenant move-in request" onPress={() => navigation.navigate('MoveInRequest', { unitId })}/>
            <ActionRow icon="document-text-outline" label={localizedUiText.m_f38b4003ae20} sublabel="Declare self use, tenancy, lease, vacancy, renovation, or short-term rental" onPress={() => navigation.navigate('RentalDeclaration')}/>
            <ActionRow icon="bed-outline" label={localizedUiText.m_66d37c902714} sublabel="Declare guests, KYC, access windows, extensions, and checkout" onPress={() => navigation.navigate('ShortStayManagement')} isLast/>
          </AppCard>

          <Text style={styles.sectionHeader}>{localizedUiText.m_66623d5ba594}</Text>
          <AppCard style={styles.actionsCard}>
            <ActionRow icon="time-outline" label={localizedUiText.m_e7d63e50d3ad} sublabel="Audit events registry of flat changes" onPress={() => navigation.navigate('OccupancyTimeline', { unitId })}/>
            <ActionRow icon="journal-outline" label={localizedUiText.m_c30ef54b244b} sublabel="View historical owners transfer references" onPress={() => navigation.navigate('OwnerHistory', { unitId })}/>
            <ActionRow icon="receipt-outline" label={localizedUiText.m_bc1509e99dd6} sublabel="Review past leases, exits, and clearance NOCs" onPress={() => navigation.navigate('TenantHistory', { unitId })}/>
            <ActionRow icon="bar-chart-outline" label={localizedUiText.m_7e05e125ad57} sublabel="Consolidated society dashboard view" onPress={() => navigation.navigate('OwnershipTenancySummary', { unitId })} isLast/>
          </AppCard>
        </Animated.View>

        <View style={styles.bottomSpacer}/>
      </ScrollView>
    </SafeAreaView>);
}
function ActionRow({ icon, label, sublabel, onPress, isLast = false, }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    sublabel: string;
    onPress: () => void;
    isLast?: boolean;
}) {
    return (<Pressable style={({ pressed }) => [styles.actionRow, !isLast && styles.rowBorder, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.actionLeft}>
        <View style={styles.actionIconOuter}>
          <Ionicons name={icon} size={20} color={Colors.primary}/>
        </View>
        <View style={styles.viewFlex}>
          <Text style={styles.actionLabel}>{label}</Text>
          <Text style={styles.actionSub}>{sublabel}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.textMuted}/>
    </Pressable>);
}

