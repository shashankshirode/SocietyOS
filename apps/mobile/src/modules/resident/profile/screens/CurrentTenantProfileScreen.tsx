import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { Colors } from "../../../../shared/constants/colors";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { InfoRow } from "../../../../shared/components/InfoRow";
import { EmptyState } from "../../../../shared/feedback/EmptyState";
import { WarningBanner } from "../../../../shared/feedback/WarningBanner";
import { StatusBadge, getKycStatusBadgeType, getPoliceVerificationBadgeType, getResidentAccessBadgeType, getMoveOutNocStatusBadgeType } from "../../../../shared/components/StatusBadge";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { useCurrentTenant } from "../hooks/useCurrentTenant";
import type { CurrentTenantProfileScreenProps } from "../../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/CurrentTenantProfileScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function CurrentTenantProfileScreen({ navigation, route }: CurrentTenantProfileScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { unitId } = route.params;
    const { data: tenant, isLoading, error, refetch } = useCurrentTenant(unitId);
    if (isLoading)
        return <LoadingState />;
    if (error) {
        return (<ErrorState title={localizedUiText.m_618749e88978} message={localizedUiText.m_938c7c7a7bca} onRetry={refetch}/>);
    }
    const handleCta = (actionType: string) => {
        switch (actionType) {
            case 'DOCUMENTS':
                navigation.navigate('CurrentDocumentsSummary', { unitId });
                break;
            case 'ACCESS':
                navigation.navigate('UnitAccessStatus', { unitId });
                break;
            case 'MOVEOUT':
                navigation.navigate('NocRequestList');
                break;
            default:
                break;
        }
    };
    return (<SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader title={localizedUiText.m_1f5c0fe9e3c1} showBack onBack={() => navigation.goBack()}/>
      
      {!tenant ? (<View style={styles.emptyContainer}>
          <EmptyState title={localizedUiText.m_98f6afed6036} description={localizedUiText.m_17fc6adea2e0} iconName="home-outline"/>
        </View>) : (<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          
          <Animated.View entering={FadeInUp.duration(400)}>
            {tenant.accessStatus === 'REVOKED' ? (<WarningBanner message={localizedUiText.m_90155a00b3db} type="danger" style={styles.bannerMargin}/>) : tenant.nocStatus === 'GENERATED' || tenant.nocStatus === 'APPROVED' ? (<WarningBanner message={localizedUiText.m_e94c3f12e553} type="warning" style={styles.bannerMargin}/>) : (<WarningBanner message={localizedUiText.m_c5197611acd4} type="info" style={styles.bannerMargin}/>)}
          </Animated.View>

          
          <Animated.View entering={FadeInUp.delay(100).duration(450)}>
            <AppCard style={styles.profileCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardHeaderTitle}>{localizedUiText.m_43b4547ebd51}</Text>
                <StatusBadge label={tenant.accessStatus} type={getResidentAccessBadgeType(tenant.accessStatus)}/>
              </View>

              <View style={styles.avatarRow}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{tenant.name.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.tenantName}>{tenant.name}</Text>
                  <Text style={styles.tenantSub}>{localizedUiText.m_6df6994f90ed}</Text>
                </View>
              </View>

              <View style={styles.divider}/>

              <InfoRow label={localizedUiText.m_b286c7f6e0ef} value={tenant.mobile}/>
              <InfoRow label={localizedUiText.m_09bf25ef3083} value={tenant.email}/>
              <InfoRow label={localizedUiText.m_4d0cb1ef08cf} value={tenant.agreementStartDate}/>
              <InfoRow label={localizedUiText.m_5e3919882ede} value={tenant.agreementEndDate} valueColor={Colors.danger}/>
              <InfoRow label={localizedUiText.m_14f63f390f4e} value={tenant.moveInDate}/>
              
              <View style={styles.divider}/>

              <Text style={styles.sectionSubHeader}>{localizedUiText.m_a4f67293f44a}</Text>
              <InfoRow label={localizedUiText.m_62bb9f2476a2} customValue={<StatusBadge label={tenant.policeVerificationStatus} type={getPoliceVerificationBadgeType(tenant.policeVerificationStatus)} style={styles.badgeInline}/>}/>
              <InfoRow label={localizedUiText.m_76a9c53ded6e} customValue={<StatusBadge label={tenant.kycStatus} type={getKycStatusBadgeType(tenant.kycStatus)} style={styles.badgeInline}/>}/>
              <InfoRow label={localizedUiText.m_b6e6c393f3f1} customValue={<StatusBadge label={tenant.rentAgreementStatus} type={getKycStatusBadgeType(tenant.rentAgreementStatus)} style={styles.badgeInline}/>}/>
              <InfoRow label={localizedUiText.m_18abd6f4a1e5} value={tenant.ownerApprovalStatus} valueBold/>
              {tenant.nocStatus && (<InfoRow label={localizedUiText.m_8a1bc3858ae5} customValue={<StatusBadge label={tenant.nocStatus} type={getMoveOutNocStatusBadgeType(tenant.nocStatus)} style={styles.badgeInline}/>} isLast/>)}
            </AppCard>
          </Animated.View>

          
          <Animated.View entering={FadeInDown.delay(150).duration(450)} style={styles.actions}>
            <Pressable style={styles.ctaBtn} onPress={() => handleCta('DOCUMENTS')}>
              <Ionicons name="document-text-outline" size={20} color={Colors.primary}/>
              <View style={styles.ctaDetails}>
                <Text style={styles.ctaTitle}>{localizedUiText.m_36182dbe5d7b}</Text>
                <Text style={styles.ctaDesc}>{localizedUiText.m_3aa7667cd268}{tenant.documentsCount}{" " + localizedUiText.m_e47b2bf8f4e8}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted}/>
            </Pressable>

            <Pressable style={[styles.ctaBtn, styles.pressableMarginTop]} onPress={() => handleCta('ACCESS')}>
              <Ionicons name="key-outline" size={20} color={Colors.primary}/>
              <View style={styles.ctaDetails}>
                <Text style={styles.ctaTitle}>{localizedUiText.m_440f0ef3644b}</Text>
                <Text style={styles.ctaDesc}>{localizedUiText.m_71b77b9d1e49}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted}/>
            </Pressable>

            {tenant.nocStatus && tenant.nocStatus !== 'NOT_REQUIRED' && (<Pressable style={[styles.ctaBtn, styles.pressableMarginTop2]} onPress={() => handleCta('MOVEOUT')}>
                <Ionicons name="exit-outline" size={20} color={Colors.danger}/>
                <View style={styles.ctaDetails}>
                  <Text style={[styles.ctaTitle, styles.textColor]}>{localizedUiText.m_d78311fbb32b}</Text>
                  <Text style={styles.ctaDesc}>{localizedUiText.m_b4fee10d615e}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted}/>
              </Pressable>)}
          </Animated.View>

          <View style={styles.bottomSpacer}/>
        </ScrollView>)}
    </SafeAreaView>);
}

