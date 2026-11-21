import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { Colors } from "../../../../shared/constants/colors";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { InfoRow } from "../../../../shared/components/InfoRow";
import { WarningBanner } from "../../../../shared/feedback/WarningBanner";
import { StatusBadge, getKycStatusBadgeType } from "../../../../shared/components/StatusBadge";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { useCurrentOwner } from "../hooks/useCurrentOwner";
import type { CurrentOwnerProfileScreenProps } from "../../../../app/navigation/navigation.types";
import type { OwnerInfo } from "../../../../shared/types/ownerTenant.types";
import { styles } from "../styles/screens/CurrentOwnerProfileScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function CurrentOwnerProfileScreen({ navigation, route }: CurrentOwnerProfileScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { unitId } = route.params;
    const { data, isLoading, error, refetch } = useCurrentOwner(unitId);
    if (isLoading)
        return <LoadingState />;
    if (error || !data) {
        return (<ErrorState title={localizedUiText.m_45250fccffba} message={localizedUiText.m_629a1aa781fc} onRetry={refetch}/>);
    }
    const { primary, coOwner } = data;
    const renderOwnerCard = (owner: OwnerInfo, title: string) => {
        return (<AppCard style={styles.profileCard}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardHeaderTitle}>{title}</Text>
          <StatusBadge label={owner.kycStatus} type={getKycStatusBadgeType(owner.kycStatus)}/>
        </View>

        <View style={styles.avatarRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{owner.name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.ownerName}>{owner.name}</Text>
            <Text style={styles.ownerSub}>{owner.ownerType.replace('_', ' ')}</Text>
          </View>
        </View>

        <View style={styles.divider}/>

        <InfoRow label={localizedUiText.m_b286c7f6e0ef} value={owner.mobile}/>
        <InfoRow label={localizedUiText.m_09bf25ef3083} value={owner.email}/>
        <InfoRow label={localizedUiText.m_b89ef791d861} value={owner.ownershipStartDate}/>
        <InfoRow label={localizedUiText.m_bf0118cad6a8} value={owner.ownershipType.replace('_', ' ')}/>
        {owner.shareCertificateNumber && (<InfoRow label={localizedUiText.m_86191ab2e3fd} value={owner.shareCertificateNumber}/>)}
        {owner.saleDeedRegistrationNumber && (<InfoRow label={localizedUiText.m_15d6acabff6f} value={owner.saleDeedRegistrationNumber}/>)}
        <InfoRow label={localizedUiText.m_2d0064ce3b90} value={owner.parkingSlots.join(', ') || 'None Allocated'}/>
        <InfoRow label={localizedUiText.m_e6d3c0aa2771} value={owner.emergencyContact}/>
        <InfoRow label={localizedUiText.m_43c68284ac5a} value={owner.communicationPreference} isLast/>
      </AppCard>);
    };
    return (<SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader title={localizedUiText.m_6bf872e4f41d} showBack onBack={() => navigation.goBack()}/>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        
        <Animated.View entering={FadeInUp.duration(400)}>
          <WarningBanner message={localizedUiText.m_03a2c046b13a} type="info" style={styles.bannerMargin}/>
        </Animated.View>

        
        <Animated.View entering={FadeInUp.delay(100).duration(450)}>
          {renderOwnerCard(primary, String(localizedUiText.m_f6e6d2d99d06))}
        </Animated.View>

        
        {coOwner && (<Animated.View entering={FadeInUp.delay(150).duration(450)} style={styles.animatedViewMarginTop}>
            {renderOwnerCard(coOwner, String(localizedUiText.m_e009d507adbf))}
          </Animated.View>)}

        
        <Animated.View entering={FadeInDown.delay(200).duration(450)} style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>{localizedUiText.m_90ceb46217f9}</Text>
          <View style={styles.shortcutsRow}>
            <Pressable style={styles.shortcutBtn} onPress={() => navigation.navigate('FamilyMembers', { unitId })}>
              <Ionicons name="people-outline" size={20} color={Colors.primary}/>
              <Text style={styles.shortcutText}>{localizedUiText.m_ae59bb70f396}</Text>
            </Pressable>

            <Pressable style={styles.shortcutBtn} onPress={() => navigation.navigate('UnitVehicles', { unitId })}>
              <Ionicons name="car-outline" size={20} color={Colors.primary}/>
              <Text style={styles.shortcutText}>{localizedUiText.m_9113796a52c0}</Text>
            </Pressable>

            <Pressable style={styles.shortcutBtn} onPress={() => navigation.navigate('OccupancyTimeline', { unitId })}>
              <Ionicons name="time-outline" size={20} color={Colors.primary}/>
              <Text style={styles.shortcutText}>{localizedUiText.m_9dcff98e275f}</Text>
            </Pressable>
          </View>
        </Animated.View>

        <View style={styles.bottomSpacer}/>
      </ScrollView>
    </SafeAreaView>);
}

