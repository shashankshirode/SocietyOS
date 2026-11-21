import { useState } from "react";
import { Text, ScrollView, FlatList } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { Spacing } from "../../../shared/constants/spacing";
import { useWasteDashboard, useWastePickupSchedule, useMarkWastePickupCompleted, useSubmitWasteSegregationChecklist, useReportMissedGarbagePickup, useCreateWasteViolation, useWasteSegregationReport } from "../data/complianceHooks";
import { ComplianceMetricCard, WastePickupRow, ComplianceSafetyNotice } from "../components/ComplianceComponents";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppButton } from "../../../shared/components/AppButton";
import { FormField } from "../../../shared/forms/FormField";
import { InfoRow } from "../../../shared/components/InfoRow";
import { ResponsiveGrid } from "../../../shared/layouts/ResponsiveGrid";
import { QuickActionCard } from "../../../shared/cards/QuickActionCard";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ComplianceOpsStackParamList } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/WasteComplianceScreens.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
import type { AppIconName } from "../../../shared/icons/icon.types";
type ComplianceScreenProps<TRoute extends keyof ComplianceOpsStackParamList> = NativeStackScreenProps<ComplianceOpsStackParamList, TRoute>;
export function WasteComplianceDashboardScreen({ navigation }: ComplianceScreenProps<'WasteComplianceDashboard'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useWasteDashboard();
    const info = data || {
        todayCleanups: 45,
        missedPickups: 1,
        segregationComplianceRate: 92,
    };
    const menuItems: { name: string; icon: AppIconName; onPress: () => void }[] = [
        { name: String(localizedUiText.m_b685a65dc9fc), icon: 'calendar-outline', onPress: () => navigation.navigate('WastePickupSchedule') },
        { name: String(localizedUiText.m_468f4f6c6a1b), icon: 'checkbox-outline', onPress: () => navigation.navigate('WasteSegregationChecklist') },
        { name: String(localizedUiText.m_823c1d6049c9), icon: 'alert-circle-outline', onPress: () => navigation.navigate('MissedGarbagePickup') },
        { name: String(localizedUiText.m_9ac7fcc3a557), icon: 'warning-outline', onPress: () => navigation.navigate('WasteViolationNoticePlaceholder') },
        { name: String(localizedUiText.m_9eb4bfc1bc8b), icon: 'document-text-outline', onPress: () => navigation.navigate('WasteSegregationReport') },
    ];
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_af1a7ad6f2e4} subtitle={localizedUiText.m_0f80b81f5193} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_abceb9feb027}</Text>
        <ResponsiveGrid columnsPhone={3} columnsTablet={3} gap={Spacing.sm}>
          <ComplianceMetricCard label={localizedUiText.m_bc5e462f767e} value={info.todayCleanups}/>
          <ComplianceMetricCard label={localizedUiText.m_7df8c5d0c3ee} value={info.missedPickups}/>
          <ComplianceMetricCard label={localizedUiText.m_3f585730c57d} value={`${info.segregationComplianceRate}%`}/>
        </ResponsiveGrid>

        <Text style={styles.sectionTitle}>{localizedUiText.m_29c1d54316be}</Text>
        <ResponsiveGrid columnsPhone={2} columnsTablet={3} gap={Spacing.md}>
          {menuItems.map((item, idx) => (<QuickActionCard key={idx} title={item.name} iconName={item.icon} onPress={item.onPress}/>))}
        </ResponsiveGrid>

        <ComplianceSafetyNotice />
      </ScrollView>
    </ScreenContainer>);
}
export function WastePickupScheduleScreen({ navigation }: ComplianceScreenProps<'WastePickupSchedule'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, refetch } = useWastePickupSchedule();
    const completeMutation = useMarkWastePickupCompleted();
    const list = data || [];
    const handleMarkComplete = (scheduleId: string) => {
        AppAlert.alert(String(localizedUiText.m_fb3be2b63b34), String(localizedUiText.m_7223a9bdacb5), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_143b270a3260),
                onPress: async () => {
                    await completeMutation.mutateAsync({
                        scheduleId,
                        input: { completedBy: 'Housekeeping Staff', notes: getActiveUiLiteral("m_23acc88801c9") }
                    });
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_d759a6509cf4));
                    refetch();
                }
            }
        ]);
    };
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_b685a65dc9fc} subtitle={localizedUiText.m_5276e7348b0d} onBack={() => navigation.goBack()}/>
      <FlatList data={list} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => (<WastePickupRow row={item} showAction={true} onMarkComplete={() => handleMarkComplete(item.id)}/>)}/>
    </ScreenContainer>);
}
export function WasteSegregationChecklistScreen({ navigation }: ComplianceScreenProps<'WasteSegregationChecklist'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [tower, setTower] = useState('');
    const [checkedUnitsCount, setCheckedUnitsCount] = useState('');
    const [compliantUnitsCount, setCompliantUnitsCount] = useState('');
    const [notes, setNotes] = useState('');
    const checklistMutation = useSubmitWasteSegregationChecklist();
    const handleSubmit = async () => {
        if (!tower || !checkedUnitsCount || !compliantUnitsCount) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_d1641a4df419));
            return;
        }
        await checklistMutation.mutateAsync({
            tower,
            checkedUnitsCount: parseInt(checkedUnitsCount),
            compliantUnitsCount: parseInt(compliantUnitsCount),
            notes,
        });
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_e6da75e200a7));
        navigation.goBack();
    };
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_822c93b25ded} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppCard padding="lg" style={styles.appCardMarginBottom}>
          <FormField label={localizedUiText.m_aeb11001d776} value={tower} onChangeText={setTower} placeholder={localizedUiText.m_3e36208fe44f} required/>

          <FormField label={localizedUiText.m_f4a44fa05d1d} value={checkedUnitsCount} onChangeText={setCheckedUnitsCount} placeholder={localizedUiText.m_52494c5307f9} keyboardType="numeric" required/>

          <FormField label={localizedUiText.m_b81ebd3301de} value={compliantUnitsCount} onChangeText={setCompliantUnitsCount} placeholder={localizedUiText.m_cc9a6f5ca2eb} keyboardType="numeric" required/>

          <FormField label={localizedUiText.m_8a7525b1492f} value={notes} onChangeText={setNotes} placeholder={localizedUiText.m_87383b5a8054} multiline numberOfLines={3}/>

          <AppButton title={checklistMutation.isPending ? localizedUiText.m_64115d5b9c79 : localizedUiText.m_21c45ca16052} onPress={handleSubmit} variant="primary" fullWidth disabled={checklistMutation.isPending} style={styles.appButtonMarginTop}/>
        </AppCard>
      </ScrollView>
    </ScreenContainer>);
}
export function MissedGarbagePickupScreen({ navigation }: ComplianceScreenProps<'MissedGarbagePickup'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [unitNumber, setUnitNumber] = useState('');
    const [notes, setNotes] = useState('');
    const missedMutation = useReportMissedGarbagePickup();
    const handleSubmit = async () => {
        if (!unitNumber) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_dafe6558cfa4));
            return;
        }
        await missedMutation.mutateAsync({
            unitNumber,
            notes,
        });
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_a7a27c64a790));
        navigation.goBack();
    };
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_823c1d6049c9} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppCard padding="lg" style={styles.appCardMarginBottom2}>
          <FormField label={localizedUiText.m_06aa50156468} value={unitNumber} onChangeText={setUnitNumber} placeholder={localizedUiText.m_32c2c119cb99} required/>

          <FormField label={localizedUiText.m_88dd4af6122f} value={notes} onChangeText={setNotes} placeholder={localizedUiText.m_1e4d14b1ee50} multiline numberOfLines={3}/>

          <AppButton title={missedMutation.isPending ? localizedUiText.m_5229d83a9942 : localizedUiText.m_823c1d6049c9} onPress={handleSubmit} variant="danger" fullWidth disabled={missedMutation.isPending} style={styles.appButtonMarginTop2}/>
        </AppCard>
      </ScrollView>
    </ScreenContainer>);
}
export function WasteViolationNoticePlaceholderScreen({ navigation }: ComplianceScreenProps<'WasteViolationNoticePlaceholder'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [unitNumber, setUnitNumber] = useState('');
    const [violationType, setViolationType] = useState('');
    const [fineAmount, setFineAmount] = useState('');
    const [notes, setNotes] = useState('');
    const violationMutation = useCreateWasteViolation();
    const handleSubmit = async () => {
        if (!unitNumber || !violationType) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_1ea09f810141));
            return;
        }
        await violationMutation.mutateAsync({
            unitNumber,
            violationType,
            fineAmount: fineAmount ? parseFloat(fineAmount) : undefined,
            notes,
        });
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_9b12f980ef41));
        navigation.goBack();
    };
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_aa197170d14b} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppCard padding="lg" style={styles.appCardMarginBottom3}>
          <FormField label={localizedUiText.m_e2433b4da1f2} value={unitNumber} onChangeText={setUnitNumber} placeholder={localizedUiText.m_b6f4f4ff3fcf} required/>

          <FormField label={localizedUiText.m_dcd5112647cf} value={violationType} onChangeText={setViolationType} placeholder={localizedUiText.m_6f22b03ddbb9} required/>

          <FormField label={localizedUiText.m_837fe316ebc0} value={fineAmount} onChangeText={setFineAmount} placeholder={localizedUiText.m_a7c6c31a964a} keyboardType="numeric"/>

          <FormField label={localizedUiText.m_5dabe2ef5358} value={notes} onChangeText={setNotes} placeholder={localizedUiText.m_fd08adb03206} multiline numberOfLines={3}/>

          <AppButton title={violationMutation.isPending ? localizedUiText.m_6e714c7e1d22 : localizedUiText.m_9ac7fcc3a557} onPress={handleSubmit} variant="primary" fullWidth disabled={violationMutation.isPending} style={styles.appButtonMarginTop3}/>
        </AppCard>
      </ScrollView>
    </ScreenContainer>);
}
export function WasteSegregationReportScreen({ navigation }: ComplianceScreenProps<'WasteSegregationReport'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useWasteSegregationReport();
    const list = data || [];
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_9eb4bfc1bc8b} subtitle={localizedUiText.m_a9a8570d935a} onBack={() => navigation.goBack()}/>
      <FlatList data={list} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => (<AppCard style={styles.hkCard} padding="md">
            <InfoRow label={localizedUiText.m_99c40ab40592} value={item.recordedAt}/>
            <InfoRow label={localizedUiText.m_aeb11001d776} value={item.tower}/>
            <InfoRow label={localizedUiText.m_23a4aaefb3af} value={String(item.checkedUnitsCount)}/>
            <InfoRow label={localizedUiText.m_852fceee95c2} value={String(item.compliantUnitsCount)}/>
            <InfoRow label={localizedUiText.m_8d8acd994002} value={`${item.complianceRate}%`}/>
            <InfoRow label={localizedUiText.m_6ec09b6d5e30} value={item.recordedBy} isLast/>
          </AppCard>)}/>
    </ScreenContainer>);
}
