import { View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../../../app/navigation/navigation.types";
import { AppButton } from "../../../../shared/components/AppButton";
import { SafeText } from "../../../../shared/components/SafeText";
import { TenantVerificationChecklist } from "../components/TenantVerificationChecklist";
import { useTenantManagement } from "../hooks/useTenantManagement";
import { HouseholdErrorScreen, HouseholdLoadingScreen, HouseholdScreenLayout, SectionCard, useHouseholdMessages } from "./HouseholdScreenLayout";
import { styles } from "../styles/screens/TenantManagementScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
type Props = NativeStackScreenProps<HomeStackParamList, 'TenantManagement'>;
export function TenantManagementScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { summary, eligibility, isLoading, error, refetch, initiateTenantExit, completeTenantExit } = useTenantManagement();
    const { text } = useHouseholdMessages();
    if (isLoading || !summary || !eligibility) {
        return <HouseholdLoadingScreen titleKey="resident.navigation.tenantManagement.title" subtitleKey="resident.navigation.tenantManagement.subtitle"/>;
    }
    if (error) {
        return <HouseholdErrorScreen titleKey="resident.navigation.tenantManagement.title" subtitleKey="resident.navigation.tenantManagement.subtitle" onRetry={refetch}/>;
    }
    const currentTenant = summary.currentTenant;
    const activeRequest = summary.activeRequest;
    return (<HouseholdScreenLayout titleKey="resident.navigation.tenantManagement.title" subtitleKey="resident.navigation.tenantManagement.subtitle">
      <SectionCard>
        <SafeText variant="bodyStrong" color="primary">{text('resident.tenant.management.currentTenant')}</SafeText>
        <SafeText variant="caption" color="secondary">
          {currentTenant ? currentTenant.fullName : text('resident.tenant.management.noCurrentTenant')}
        </SafeText>
        {currentTenant ? (<View style={styles.viewGapMarginTop}>
            <AppButton title={text('resident.tenant.viewCurrentTenant') || localizedUiText.m_ec996b054642} variant="secondary" onPress={() => navigation.navigate('TenantDetail', { tenantId: currentTenant.id })}/>
            {!summary.isExitInitiated ? (<AppButton title={text('resident.tenant.initiateTenantExit') || localizedUiText.m_3e91371f7455} variant="danger" onPress={initiateTenantExit}/>) : (<AppButton title={localizedUiText.m_46756e8b22f0} variant="primary" onPress={completeTenantExit}/>)}
          </View>) : null}
      </SectionCard>

      {summary.isExitInitiated && (<SectionCard>
          <SafeText variant="bodyStrong" color="warning">{localizedUiText.m_d2457b98db6b}</SafeText>
          <View style={styles.viewGapPaddingVertical}>
            <SafeText variant="caption" style={styles.safeTextColor}>{localizedUiText.m_1ab706e067b7}</SafeText>
            <SafeText variant="caption" color="secondary">{localizedUiText.m_d7be833e8ed2}</SafeText>
            <SafeText variant="caption" color="secondary">{localizedUiText.m_604aa55420a3}</SafeText>
            <SafeText variant="caption" color="secondary">{localizedUiText.m_c4b6ca2a0adb}</SafeText>
          </View>
        </SectionCard>)}

      {currentTenant && (<View style={styles.viewBackgroundColorBorderColorBorderWidthBorderRadius}>
          <SafeText variant="caption" style={styles.safeTextColorFontWeight}>
            {summary.isExitInitiated ? localizedUiText.m_28dd3243147c : text('resident.tenant.management.activeTenantBlocker')}
          </SafeText>
          <SafeText variant="tiny" style={styles.safeTextColorMarginTop}>
            {summary.isExitInitiated
                ? localizedUiText.m_fa5f56c6eab9 : text('resident.tenant.blocked.activeTenant')}
          </SafeText>
        </View>)}

      <TenantVerificationChecklist eligibility={eligibility}/>
      
      <AppButton title={text('resident.household.profile.actions.addTenant')} onPress={() => navigation.navigate('AddTenantStart')} disabled={!!currentTenant}/>
      {activeRequest ? (<AppButton title={text('resident.household.profile.actions.viewTenantRequestStatus')} variant="secondary" onPress={() => navigation.navigate('TenantOnboardingStatus', { requestId: activeRequest.id })}/>) : null}
    </HouseholdScreenLayout>);
}
export default TenantManagementScreen;

