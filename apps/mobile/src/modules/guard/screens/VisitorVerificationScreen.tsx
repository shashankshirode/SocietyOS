import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Colors } from "../../../shared/constants/colors";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppButton } from "../../../shared/components/AppButton";
import { AppHeader } from "../../../shared/components/AppHeader";
import { InfoRow } from "../../../shared/components/InfoRow";
import { WarningBanner } from "../../../shared/feedback/WarningBanner";
import { StatusBadge, getGatePassBadgeType } from "../../../shared/components/StatusBadge";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { useGuardPassDetail } from "../data/useGuardPassDetail";
import type { VisitorVerificationScreenProps } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/VisitorVerificationScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
export function VisitorVerificationScreen({ navigation, route }: VisitorVerificationScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { passCode } = route.params;
    const { data: pass, isLoading, error, refetch } = useGuardPassDetail(passCode);
    const [localStatus, setLocalStatus] = useState(pass?.approvalStatus ?? 'EXPECTED');
    React.useEffect(() => {
        if (pass) {
            setLocalStatus(pass.approvalStatus);
        }
    }, [pass]);
    if (isLoading) {
        return (<SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader title={localizedUiText.m_2ed10b71f28b} showBack onBack={() => navigation.goBack()}/>
        <LoadingState message={localizedUiText.m_8d345678fc99} showCardPlaceholder/>
      </SafeAreaView>);
    }
    if (error) {
        return (<SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader title={localizedUiText.m_2ed10b71f28b} showBack onBack={() => navigation.goBack()}/>
        <ErrorState message={error.message} onRetry={refetch}/>
      </SafeAreaView>);
    }
    if (!pass) {
        return (<SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader title={localizedUiText.m_2ed10b71f28b} showBack onBack={() => navigation.goBack()}/>
        <ErrorState message={localizedUiText.m_e5101b1a8251} onRetry={refetch}/>
      </SafeAreaView>);
    }
    const isExpired = localStatus === 'EXPIRED';
    const isRejected = localStatus === 'REJECTED';
    const isBlacklisted = pass.watchlistWarning;
    const isAllowEnabled = !isExpired && !isRejected && !isBlacklisted && (localStatus === 'APPROVED' || localStatus === 'EXPECTED');
    const handleAllowEntry = () => {
        navigation.navigate('RecordEntry', { pass: { ...pass, approvalStatus: localStatus } });
    };
    const handleRejectEntry = () => {
        AppAlert.alert(String(localizedUiText.m_dce40d73516a), String(localizedUiText.m_eaa062fb45eb), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_03ccd1fde805),
                style: 'destructive',
                onPress: () => {
                    setLocalStatus('REJECTED');
                    AppAlert.alert(String(localizedUiText.m_66b459751b8f), String(localizedUiText.m_fc12813c1700));
                },
            },
        ]);
    };
    const handleCallResident = () => {
        AppAlert.alert(String(localizedUiText.m_76b3249c762e), formatUiLiteral(String(localizedUiText.m_87b0d287a55c), [pass.visitingFlat, pass.residentName]), [{ text: String(localizedUiText.m_565339bc4d33) }]);
    };
    const handleMarkWaiting = () => {
        setLocalStatus('WAITING_APPROVAL');
        AppAlert.alert(String(localizedUiText.m_8b2d0675b4b0), String(localizedUiText.m_eaf35fa939a6));
    };
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_2ed10b71f28b} showBack onBack={() => navigation.goBack()}/>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        
        <Animated.View entering={FadeInUp.duration(400)}>
          {isBlacklisted ? (<WarningBanner message={localizedUiText.m_f5676c50053b} type="danger" style={styles.bannerMargin}/>) : isExpired ? (<WarningBanner message={localizedUiText.m_61ab8a0c041c} type="danger" style={styles.bannerMargin}/>) : isRejected ? (<WarningBanner message={localizedUiText.m_c71d090f9942} type="danger" style={styles.bannerMargin}/>) : localStatus === 'WAITING_APPROVAL' ? (<WarningBanner message={localizedUiText.m_ebf90bbe3939} type="warning" style={styles.bannerMargin}/>) : (<WarningBanner message={localizedUiText.m_ac918b12e58e} type="info" style={styles.bannerMargin}/>)}
        </Animated.View>

        
        <Animated.View entering={FadeInUp.delay(100).duration(450)}>
          <AppCard style={styles.profileCard}>
            <View style={styles.avatarRow}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color={Colors.primary}/>
              </View>
              <View style={styles.profileText}>
                <Text style={styles.visitorName}>{pass.visitorName}</Text>
                <Text style={styles.visitorType}>{pass.visitorType}{" " + localizedUiText.m_ebdf8cc00bc4}</Text>
              </View>
              <StatusBadge label={localStatus} type={getGatePassBadgeType(localStatus)}/>
            </View>
          </AppCard>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(150).duration(450)}>
          <AppCard style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>{localizedUiText.m_506b60f0898b}</Text>
            
            <InfoRow label={localizedUiText.m_7ebc765e1de9} value={pass.visitingFlat}/>
            <InfoRow label={localizedUiText.m_987aead6d4fd} value={pass.residentName}/>
            <InfoRow label={localizedUiText.m_e42eb92ed430} value={pass.purpose || getActiveUiLiteral("m_dc12bec5d71f")}/>
            <InfoRow label={localizedUiText.m_be911b667eab} value={pass.expectedDate}/>
            <InfoRow label={localizedUiText.m_181a22167b25} value={pass.validityWindow}/>
            {pass.vehicleNumber ? (<InfoRow label={localizedUiText.m_57c8177ac1f3} value={pass.vehicleNumber}/>) : null}
            <InfoRow label={localizedUiText.m_a48c81dea2d9} value={pass.approvalSource}/>
            <InfoRow label={localizedUiText.m_35f2ded4b059} value={pass.otp} valueBold isLast/>
          </AppCard>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(200).duration(450)}>
          <AppCard style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>{localizedUiText.m_467129b5f45c}</Text>
            <InfoRow label={localizedUiText.m_174522bca1b9} value={String(pass.previousVisitCount || 0)}/>
            {pass.specialInstructions ? (<View style={styles.instructionBox}>
                <Text style={styles.instructionLabel}>{localizedUiText.m_b920b8d3e618}</Text>
                <Text style={styles.instructionText}>{pass.specialInstructions}</Text>
              </View>) : (<InfoRow label={localizedUiText.m_26c3805380fe} value="None" isLast/>)}
          </AppCard>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(250).duration(450)} style={styles.actionsContainer}>
          <AppButton title={localizedUiText.m_7c3a4b88cbe8} onPress={handleAllowEntry} variant="primary" fullWidth disabled={!isAllowEnabled} style={styles.actionBtn}/>

          <View style={styles.buttonRow}>
            <View style={styles.viewFlex}>
              <AppButton title={localizedUiText.m_03cff7ceafb9} onPress={handleRejectEntry} variant="secondary" disabled={localStatus === 'REJECTED'}/>
            </View>
            <View style={styles.viewFlex2}>
              <AppButton title={localizedUiText.m_23b9dae01910} onPress={handleCallResident} variant="secondary"/>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <View style={styles.viewFlex3}>
              <AppButton title={localizedUiText.m_0178cc03c50a} onPress={handleMarkWaiting} variant="secondary" disabled={localStatus === 'WAITING_APPROVAL'}/>
            </View>
            <View style={styles.viewFlex4}>
              <AppButton title={localizedUiText.m_653f005a6072} onPress={() => AppAlert.alert(String(localizedUiText.m_c75dfd6d4a5e), String(localizedUiText.m_dd3dc08102ce))} variant="secondary"/>
            </View>
          </View>
        </Animated.View>

        <View style={styles.bottomSpacer}/>
      </ScrollView>
    </SafeAreaView>);
}

