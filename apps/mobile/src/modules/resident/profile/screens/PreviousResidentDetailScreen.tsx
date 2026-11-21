import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { Colors } from "../../../../shared/constants/colors";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppButton } from "../../../../shared/components/AppButton";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { InfoRow } from "../../../../shared/components/InfoRow";
import { WarningBanner } from "../../../../shared/feedback/WarningBanner";
import { StatusBadge, getDuesClearanceStatusBadgeType, getPoliceVerificationBadgeType, getMoveOutNocStatusBadgeType } from "../../../../shared/components/StatusBadge";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { usePreviousResidentDetail } from "../hooks/usePreviousResidentDetail";
import type { PreviousResidentDetailScreenProps } from "../../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/PreviousResidentDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function PreviousResidentDetailScreen({ navigation, route }: PreviousResidentDetailScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { unitId, residentHistoryId, residentHistoryType } = route.params;
    const { data: record, isLoading, error, refetch } = usePreviousResidentDetail(unitId, residentHistoryId);
    if (isLoading)
        return <LoadingState />;
    if (error || !record) {
        return (<ErrorState title={localizedUiText.m_c8c60b5063b2} message={localizedUiText.m_7f78ccf74f13} onRetry={refetch}/>);
    }
    return (<SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader title={localizedUiText.m_a36e968a5564} showBack onBack={() => navigation.goBack()}/>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        
        <Animated.View entering={FadeInUp.duration(400)}>
          <WarningBanner message={localizedUiText.m_30a347336b83} type="danger" style={styles.bannerMargin}/>
        </Animated.View>

        
        <Animated.View entering={FadeInUp.delay(100).duration(450)}>
          <AppCard style={styles.profileCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>{localizedUiText.m_24e132330784 + " "}{residentHistoryType}{" " + localizedUiText.m_1092e2e43a48}</Text>
              <StatusBadge label={record.accessStatus} type="danger"/>
            </View>

            <View style={styles.avatarRow}>
              <View style={styles.avatarCircle}>
                <Ionicons name="archive-outline" size={24} color={Colors.textMuted}/>
              </View>
              <View>
                <Text style={styles.ownerName}>{record.name}</Text>
                <Text style={styles.ownerSub}>{localizedUiText.m_4ee267ef20b9}</Text>
              </View>
            </View>

            <View style={styles.divider}/>

            <InfoRow label={localizedUiText.m_b0de8d554161} value={record.occupancyStartDate}/>
            <InfoRow label={localizedUiText.m_7acc0d3514bc} value={record.occupancyEndDate} valueColor={Colors.danger}/>
            
            {residentHistoryType === 'OWNER' ? (<>
                <InfoRow label={localizedUiText.m_92a95262f9fd} value={record.transferReason || 'SALE'}/>
                <InfoRow label={localizedUiText.m_686655f3512b} value={record.transferReferenceMasked || '—'}/>
              </>) : (<>
                <InfoRow label={localizedUiText.m_29e790552a11} value={record.agreementPeriod || '—'}/>
                <InfoRow label={localizedUiText.m_af1e88eceeef} customValue={<StatusBadge label={record.policeVerificationStatus} type={getPoliceVerificationBadgeType(record.policeVerificationStatus)} style={styles.badgeInline}/>}/>
              </>)}

            <InfoRow label={localizedUiText.m_770afb1ff435} customValue={<StatusBadge label={record.duesClearanceStatus} type={getDuesClearanceStatusBadgeType(record.duesClearanceStatus)} style={styles.badgeInline}/>}/>

            <InfoRow label={localizedUiText.m_8a1bc3858ae5} customValue={<StatusBadge label={record.moveOutNocStatus} type={getMoveOutNocStatusBadgeType(record.moveOutNocStatus)} style={styles.badgeInline}/>}/>

            {record.notes ? (<View style={styles.notesBox}>
                <Text style={styles.notesLabel}>{localizedUiText.m_e86c8709f987}</Text>
                <Text style={styles.notesText}>{record.notes}</Text>
              </View>) : null}
          </AppCard>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(150).duration(450)}>
          <AppCard style={styles.documentsCard}>
            <View style={styles.docHeader}>
              <Ionicons name="folder-outline" size={24} color={Colors.textSecondary}/>
              <View style={styles.viewFlexMarginLeft}>
                <Text style={styles.docTitle}>{localizedUiText.m_08d9dbc63f7a}</Text>
                <Text style={styles.docSub}>{record.documentsCount}{" " + localizedUiText.m_ee5bd8582b30}</Text>
              </View>
            </View>

            <Text style={styles.lockWarning}>{localizedUiText.m_57ae7a4aa3f1}</Text>

            <AppButton title={localizedUiText.m_e6b6c3758d0f} onPress={() => navigation.navigate('PreviousResidentDocuments', {
            unitId,
            residentHistoryId,
        })} variant="secondary" fullWidth style={styles.btnCta}/>
          </AppCard>
        </Animated.View>

        <View style={styles.bottomSpacer}/>
      </ScrollView>
    </SafeAreaView>);
}

