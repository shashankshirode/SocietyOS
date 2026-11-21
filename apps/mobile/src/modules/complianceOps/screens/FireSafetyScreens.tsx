import { useState } from "react";
import { Text, View, ScrollView, FlatList } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { Spacing } from "../../../shared/constants/spacing";
import { useFireSafetyDashboard, useFireEquipmentRegister, useFireEquipmentDetail, useSubmitFireEquipmentInspection, useMarkFireEquipmentFaulty, useMarkFireEquipmentReplaced, useFireExtinguisherExpiry, useFireNocTracker, useStartFireNocRenewal, useSubmitHydrantPumpChecklist, useFireDrillRecords, useFireDrillDetail, useCreateFireDrill, useCompleteFireDrill, useEvacuationPlan, useSafetyInspectionReport, useComplianceReports, useComplianceAuditLogs, useComplianceSettings } from "../data/complianceHooks";
import { ComplianceMetricCard, FireEquipmentCard, FireDrillCard, InspectionChecklistCard, ComplianceSafetyNotice } from "../components/ComplianceComponents";
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
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/FireSafetyScreens.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import type { AppIconName } from "../../../shared/icons/icon.types";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type ComplianceScreenProps<TRoute extends keyof ComplianceOpsStackParamList> = NativeStackScreenProps<ComplianceOpsStackParamList, TRoute>;
export function FireSafetyDashboardScreen({ navigation }: ComplianceScreenProps<'FireSafetyDashboard'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useFireSafetyDashboard();
    const info = data || {
        totalEquipmentCount: 35,
        faultyEquipmentCount: 2,
        nocExpiryDaysRemaining: 120
    };
    const menuItems: { name: string; icon: AppIconName; onPress: () => void }[] = [
        { name: String(localizedUiText.m_c34131ac2032), icon: 'list-outline', onPress: () => navigation.navigate('FireEquipmentRegister') },
        { name: String(localizedUiText.m_5b150a3f204a), icon: 'shield-checkmark-outline', onPress: () => navigation.navigate('FireNocTracker') },
        { name: String(localizedUiText.m_0fe6e9502444), icon: 'water-outline', onPress: () => navigation.navigate('HydrantPumpInspectionChecklist') },
        { name: String(localizedUiText.m_ccc0d23852be), icon: 'people-outline', onPress: () => navigation.navigate('FireDrillRecords') },
        { name: String(localizedUiText.m_5a0e5e004356), icon: 'exit-outline', onPress: () => navigation.navigate('EvacuationPlanPlaceholder') },
    ];
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_b27d277e243a} subtitle={localizedUiText.m_b87fa33cc0ac} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_abceb9feb027}</Text>
        <ResponsiveGrid columnsPhone={3} columnsTablet={3} gap={Spacing.sm}>
          <ComplianceMetricCard label={localizedUiText.m_7f2465ac7cef} value={info.totalEquipmentCount}/>
          <ComplianceMetricCard label={localizedUiText.m_59aed60b5a64} value={info.faultyEquipmentCount}/>
          <ComplianceMetricCard label={localizedUiText.m_16b7b864fda0} value={info.nocExpiryDaysRemaining}/>
        </ResponsiveGrid>

        <Text style={styles.sectionTitle}>{localizedUiText.m_f4231ec00a3f}</Text>
        <ResponsiveGrid columnsPhone={2} columnsTablet={3} gap={Spacing.md}>
          {menuItems.map((item, idx) => (<QuickActionCard key={idx} title={item.name} iconName={item.icon} onPress={item.onPress}/>))}
        </ResponsiveGrid>

        <ComplianceSafetyNotice />
      </ScrollView>
    </ScreenContainer>);
}
export function FireEquipmentRegisterScreen({ navigation }: ComplianceScreenProps<'FireEquipmentRegister'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useFireEquipmentRegister();
    const list = data || [];
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_c34131ac2032} subtitle={localizedUiText.m_11471896f5df} onBack={() => navigation.goBack()} rightActions={<AppButton variant="primary" size="sm" title={localizedUiText.m_bdfb0952b11e} onPress={() => navigation.navigate('FireExtinguisherExpiryTracker')}/>}/>
      <FlatList data={list} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => (<FireEquipmentCard equipment={item} onPress={() => navigation.navigate('FireEquipmentDetail', { equipmentId: item.id })}/>)}/>
    </ScreenContainer>);
}
export function FireEquipmentDetailScreen({ route, navigation }: ComplianceScreenProps<'FireEquipmentDetail'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { equipmentId } = route.params;
    const { data, refetch } = useFireEquipmentDetail(equipmentId);
    const inspectMutation = useSubmitFireEquipmentInspection();
    const faultyMutation = useMarkFireEquipmentFaulty();
    const replacedMutation = useMarkFireEquipmentReplaced();
    if (!data) {
        return (<ScreenContainer edges={['top', 'bottom']}>
        <ResponsivePageHeader title={localizedUiText.m_acf56603fab7} onBack={() => navigation.goBack()}/>
        <View style={styles.center}>
          <Text style={styles.errorText}>{localizedUiText.m_ea25e261844e}</Text>
        </View>
      </ScreenContainer>);
    }
    const eq = data;
    const handleInspect = () => {
        AppAlert.alert(String(localizedUiText.m_bb032b46bc6a), String(localizedUiText.m_6a7174a1e243), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_e0723a86a5b9),
                onPress: async () => {
                    await inspectMutation.mutateAsync({
                        equipmentId,
                        input: { pressureGaugeOk: true, nozzleOk: true, sealIntact: true, inspectedBy: 'Safety Officer', remarks: getActiveUiLiteral("m_7af5f07931c8") }
                    });
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_24b8c543cf70));
                    refetch();
                }
            }
        ]);
    };
    const handleMarkFaulty = () => {
        AppAlert.alert(String(localizedUiText.m_07989d32a9ed), String(localizedUiText.m_2da41ad34232), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_07989d32a9ed),
                onPress: async () => {
                    await faultyMutation.mutateAsync({
                        equipmentId,
                        input: { notes: getActiveUiLiteral("m_ada10976a50e") }
                    });
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_904fdc3f0be3));
                    refetch();
                }
            }
        ]);
    };
    const handleMarkReplaced = () => {
        AppAlert.alert(String(localizedUiText.m_baab2a532e70), String(localizedUiText.m_facead5c0a04), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_37aebcf0a993),
                onPress: async () => {
                    await replacedMutation.mutateAsync({
                        equipmentId,
                        input: { notes: getActiveUiLiteral("m_84fd169938d0") }
                    });
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_0982fab90009));
                    refetch();
                }
            }
        ]);
    };
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={eq.equipmentCode} subtitle={eq.name} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppCard padding="lg" style={styles.appCardMarginBottom}>
          <InfoRow label={localizedUiText.m_56764b64bc49} value={eq.equipmentCode}/>
          <InfoRow label={localizedUiText.m_dcd1d5223f73} value={eq.name}/>
          <InfoRow label={localizedUiText.m_15b61974b270} value={eq.location}/>
          <InfoRow label={localizedUiText.m_920e413c7d41} value={eq.status}/>
          <InfoRow label={localizedUiText.m_939b5f0e0a8a} value={eq.lastInspectionDate}/>
          <InfoRow label={localizedUiText.m_d600e62a6861} value={eq.expiryDate || 'N/A'} isLast/>
        </AppCard>

        <View style={styles.actionSection}>
          <AppButton title={localizedUiText.m_a2fb6741dc70} onPress={handleInspect} variant="primary" fullWidth style={styles.appButtonMarginBottom}/>
          <View style={styles.btnRow}>
            <AppButton title={localizedUiText.m_07989d32a9ed} onPress={handleMarkFaulty} variant="danger" style={styles.appButtonFlexMarginRight}/>
            <AppButton title={localizedUiText.m_baab2a532e70} onPress={handleMarkReplaced} variant="success" style={styles.appButtonFlex}/>
          </View>
        </View>

        <ComplianceSafetyNotice />
      </ScrollView>
    </ScreenContainer>);
}
export function FireExtinguisherExpiryTrackerScreen({ navigation }: ComplianceScreenProps<'FireExtinguisherExpiryTracker'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useFireExtinguisherExpiry();
    const list = data || [];
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_ea6ef8e81f2e} subtitle={localizedUiText.m_3797d0a929e5} onBack={() => navigation.goBack()}/>
      <FlatList data={list} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => (<AppCard style={styles.hkCard} padding="md">
            <InfoRow label={localizedUiText.m_340f463033e0} value={item.equipmentCode}/>
            <InfoRow label={localizedUiText.m_baaddf70fb5d} value={item.type}/>
            <InfoRow label={localizedUiText.m_15b61974b270} value={item.location}/>
            <InfoRow label={localizedUiText.m_d600e62a6861} {...includeWhenPresent("value", item.expiryDate)}/>
            <InfoRow label={localizedUiText.m_920e413c7d41} value={item.status} isLast/>
          </AppCard>)}/>
    </ScreenContainer>);
}
export function FireNocTrackerScreen({ navigation }: ComplianceScreenProps<'FireNocTracker'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, refetch } = useFireNocTracker();
    const renewalMutation = useStartFireNocRenewal();
    const noc = data;
    if (!noc) {
        return (<ScreenContainer edges={['top', 'bottom']}>
        <ResponsivePageHeader title={localizedUiText.m_acc6e2744f34} onBack={() => navigation.goBack()}/>
        <View style={styles.center}>
          <Text style={styles.errorText}>{localizedUiText.m_6f4ac938f7b7}</Text>
        </View>
      </ScreenContainer>);
    }
    const handleRenew = () => {
        AppAlert.alert(String(localizedUiText.m_16b3b41350bc), String(localizedUiText.m_d50c646f3c97), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_e2c53b83454f),
                onPress: async () => {
                    await renewalMutation.mutateAsync({
                        agencyName: 'Fire Safety Bureau',
                        notes: getActiveUiLiteral("m_a97a5a405f9d")
                    });
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_e80fd5a6a79b));
                    refetch();
                }
            }
        ]);
    };
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_acc6e2744f34} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppCard padding="lg" style={styles.appCardMarginBottom2}>
          <InfoRow label={localizedUiText.m_2a47beb8df40} value={noc.nocNumber}/>
          <InfoRow label={localizedUiText.m_496372bfbc72} value={noc.issueDate}/>
          <InfoRow label={localizedUiText.m_d600e62a6861} value={noc.expiryDate}/>
          <InfoRow label={localizedUiText.m_920e413c7d41} value={noc.status}/>
          <InfoRow label={localizedUiText.m_b80e403d2645} value={noc.issuingAuthority} isLast/>
        </AppCard>

        {noc.renewalTaskStatus === 'NOT_STARTED' && (<AppButton title={localizedUiText.m_16b3b41350bc} onPress={handleRenew} variant="primary" fullWidth/>)}

        <ComplianceSafetyNotice />
      </ScrollView>
    </ScreenContainer>);
}
export function HydrantPumpInspectionChecklistScreen({ navigation }: ComplianceScreenProps<'HydrantPumpInspectionChecklist'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [pumpPressureOk, setPumpPressureOk] = useState(false);
    const [autoStartWorking, setAutoStartWorking] = useState(false);
    const [dieselLevelOk, setDieselLevelOk] = useState(false);
    const [valvesFree, setValvesFree] = useState(false);
    const [remarks, setRemarks] = useState('');
    const pumpMutation = useSubmitHydrantPumpChecklist();
    const handleSubmit = async () => {
        await pumpMutation.mutateAsync({
            pumpPressureOk,
            autoStartWorking,
            dieselLevelOk,
            valvesFree,
            remarks
        });
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_a896528484b9));
        navigation.goBack();
    };
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_88a6427ab205} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppCard padding="lg" style={styles.appCardMarginBottom3}>
          <Text style={styles.checklistHeader}>{localizedUiText.m_7cbd45960b9e}</Text>
          
          <InspectionChecklistCard title={localizedUiText.m_d25bb0ea716b} checked={pumpPressureOk} onPress={() => setPumpPressureOk(!pumpPressureOk)}/>
          <InspectionChecklistCard title={localizedUiText.m_7e8101715ef0} checked={autoStartWorking} onPress={() => setAutoStartWorking(!autoStartWorking)}/>
          <InspectionChecklistCard title={localizedUiText.m_cfe9b4850098} checked={dieselLevelOk} onPress={() => setDieselLevelOk(!dieselLevelOk)}/>
          <InspectionChecklistCard title={localizedUiText.m_be2713de182b} checked={valvesFree} onPress={() => setValvesFree(!valvesFree)}/>

          <View style={styles.viewMarginTop}>
            <FormField label={localizedUiText.m_b5025c735015} value={remarks} onChangeText={setRemarks} placeholder={localizedUiText.m_ada3f3f1be91} multiline numberOfLines={3}/>
          </View>

          <AppButton title={pumpMutation.isPending ? localizedUiText.m_64115d5b9c79 : localizedUiText.m_21c45ca16052} onPress={handleSubmit} variant="primary" fullWidth disabled={pumpMutation.isPending} style={styles.appButtonMarginTop}/>
        </AppCard>
      </ScrollView>
    </ScreenContainer>);
}
export function FireDrillRecordsScreen({ navigation }: ComplianceScreenProps<'FireDrillRecords'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, refetch } = useFireDrillRecords();
    const createMutation = useCreateFireDrill();
    const list = data || [];
    const handleScheduleDrill = () => {
        AppAlert.alert(String(localizedUiText.m_6db5421e814a), String(localizedUiText.m_f1ab3af3d2d3), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_f4830a1dae29),
                onPress: async () => {
                    await createMutation.mutateAsync({
                        drillName: 'Q3 Evacuation Mock',
                        drillType: 'EVACUATION_MOCK',
                        date: '2026-09-24',
                        targetArea: 'Tower A & B'
                    });
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_b808b43b6700));
                    refetch();
                }
            }
        ]);
    };
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_ccc0d23852be} subtitle={localizedUiText.m_5ef025c8ec5c} onBack={() => navigation.goBack()} rightActions={<AppButton variant="primary" size="sm" title={localizedUiText.m_cbb5482084f9} onPress={handleScheduleDrill}/>}/>
      <FlatList data={list} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => (<FireDrillCard drill={item} onPress={() => navigation.navigate('FireDrillDetail', { drillId: item.id })}/>)}/>
    </ScreenContainer>);
}
export function FireDrillDetailScreen({ route, navigation }: ComplianceScreenProps<'FireDrillDetail'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { drillId } = route.params;
    const { data, refetch } = useFireDrillDetail(drillId);
    const completeMutation = useCompleteFireDrill();
    if (!data) {
        return (<ScreenContainer edges={['top', 'bottom']}>
        <ResponsivePageHeader title={localizedUiText.m_5083bc8f62d4} onBack={() => navigation.goBack()}/>
        <View style={styles.center}>
          <Text style={styles.errorText}>{localizedUiText.m_901a654ae2b3}</Text>
        </View>
      </ScreenContainer>);
    }
    const drill = data;
    const handleLogResults = () => {
        AppAlert.alert(String(localizedUiText.m_e8e668bcdab1), String(localizedUiText.m_699f8b508b0d), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_64285133c503),
                onPress: async () => {
                    await completeMutation.mutateAsync({
                        drillId,
                        input: { participantsCount: 150, observations: getActiveUiLiteral("m_0a950b46ed96") }
                    });
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_74881c0a47f9));
                    refetch();
                }
            }
        ]);
    };
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={drill.drillName} subtitle={drill.date} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppCard padding="lg" style={styles.appCardMarginBottom4}>
          <InfoRow label={localizedUiText.m_31e193682dbf} value={drill.drillName}/>
          <InfoRow label={localizedUiText.m_7b4fc01f52b0} value={drill.drillType.replace(/_/g, ' ')}/>
          <InfoRow label={localizedUiText.m_99c40ab40592} value={drill.date}/>
          <InfoRow label={localizedUiText.m_920e413c7d41} value={drill.status}/>
          <InfoRow label={localizedUiText.m_42ace8a1b5e1} value={drill.targetArea}/>
          <InfoRow label={localizedUiText.m_0e27279b3302} value={String(drill.participantsCount)}/>
          <InfoRow label={localizedUiText.m_f87558869bcf} value={drill.observations || getActiveUiLiteral("m_ef49549a5e75")} isLast/>
        </AppCard>

        {drill.status !== 'COMPLETED' && (<AppButton title={localizedUiText.m_e8e668bcdab1} onPress={handleLogResults} variant="primary" fullWidth/>)}

        <ComplianceSafetyNotice />
      </ScrollView>
    </ScreenContainer>);
}
export function EvacuationPlanPlaceholderScreen({ navigation }: ComplianceScreenProps<'EvacuationPlanPlaceholder'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useEvacuationPlan();
    const plan = data;
    if (!plan) {
        return (<ScreenContainer edges={['top', 'bottom']}>
        <ResponsivePageHeader title={localizedUiText.m_5a0e5e004356} onBack={() => navigation.goBack()}/>
        <View style={styles.center}>
          <Text style={styles.errorText}>{localizedUiText.m_35becc5581c2}</Text>
        </View>
      </ScreenContainer>);
    }
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_5a0e5e004356} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppCard padding="lg" style={styles.appCardMarginBottom5}>
          <InfoRow label={localizedUiText.m_7e8cd2056da7} value={plan.title}/>
          <InfoRow label={localizedUiText.m_3ac4ce0681c6} value={plan.assemblyPointLocation}/>
          <InfoRow label={localizedUiText.m_048c7f2ef9aa} value={plan.lastUpdated}/>
          <InfoRow label={localizedUiText.m_526e0087cc3f} value={plan.instructions || getActiveUiLiteral("m_8215fdaa9eeb")} isLast/>
        </AppCard>
        <ComplianceSafetyNotice />
      </ScrollView>
    </ScreenContainer>);
}
export function SafetyInspectionReportScreen({ navigation }: ComplianceScreenProps<'SafetyInspectionReport'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useSafetyInspectionReport();
    const list = data || [];
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_6e94d9797b27} subtitle={localizedUiText.m_e625a5a377e5} onBack={() => navigation.goBack()}/>
      <FlatList data={list} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => (<AppCard style={styles.hkCard} padding="md">
            <InfoRow label={localizedUiText.m_0283e2abb921} value={item.date}/>
            <InfoRow label={localizedUiText.m_da188e3b1cef} value={item.inspector}/>
            <InfoRow label={localizedUiText.m_2b62116dcbdd} value={item.category}/>
            <InfoRow label={localizedUiText.m_920e413c7d41} value={item.status}/>
            <InfoRow label={localizedUiText.m_38e5a46cbc5a} value={`${item.score}/100`}/>
            <InfoRow label={localizedUiText.m_71af5e5a8e5e} value={item.reportNumber} isLast/>
          </AppCard>)}/>
    </ScreenContainer>);
}
export function ComplianceReportsScreen({ navigation }: ComplianceScreenProps<'ComplianceReports'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useComplianceReports();
    const list = data || [];
    const handleExport = (reportType: string) => {
        AppAlert.alert(String(localizedUiText.m_5d55cdba1c77), formatUiLiteral(String(localizedUiText.m_d486d3c27e9c), [reportType.replace(/_/g, ' ')]), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_3664895579f0),
                onPress: () => {
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_ff8682eb5c4d));
                }
            }
        ]);
    };
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_02f61b55c9a4} subtitle={localizedUiText.m_e11993ad2a82} onBack={() => navigation.goBack()}/>
      <FlatList data={list} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => (<AppCard style={styles.hkCard} padding="md">
            <View style={styles.row}>
              <View style={styles.viewFlexMarginRight}>
                <Text style={styles.reportTitle}>{item.name}</Text>
                <Text style={styles.reportSub}>{item.description}</Text>
                <Text style={styles.reportSub}>{localizedUiText.m_4c0e9d699b7a + " "}{item.lastGenerated}</Text>
              </View>
              <AppButton title={localizedUiText.m_3664895579f0} onPress={() => handleExport(item.reportType)} variant="outline" size="sm"/>
            </View>
          </AppCard>)}/>
    </ScreenContainer>);
}
export function ComplianceAuditLogScreen({ navigation }: ComplianceScreenProps<'ComplianceAuditLog'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useComplianceAuditLogs();
    const list = data || [];
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_f69ac9b2a711} subtitle={localizedUiText.m_f45fd98844c9} onBack={() => navigation.goBack()}/>
      <FlatList data={list} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => (<AppCard style={styles.hkCard} padding="md">
            <View style={styles.row}>
              <Text style={styles.auditTime}>{item.timestamp}</Text>
              <Text style={styles.auditRole}>{item.actorRole}</Text>
            </View>
            <Text style={styles.auditAction}>{item.eventName}</Text>
            <Text style={styles.auditActor}>{localizedUiText.m_5704b7c3727f + " "}{item.actorName}</Text>
          </AppCard>)}/>
    </ScreenContainer>);
}
export function ComplianceSettingsScreen({ navigation }: ComplianceScreenProps<'ComplianceSettings'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useComplianceSettings();
    const settings = data;
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_43e9937eb231} subtitle={localizedUiText.m_ec3dafe5f3e8} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppCard padding="lg" style={styles.appCardMarginBottom6}>
          <Text style={styles.settingsGroupTitle}>{localizedUiText.m_56410103417f}</Text>
          <InfoRow label={localizedUiText.m_fd64ef5a7818} value={settings?.hydrantPumpCheckFrequency || 'DAILY'}/>
          <InfoRow label={localizedUiText.m_e4e43f01191c} value={settings?.fireExtinguisherCheckFrequency || 'MONTHLY'}/>
          <InfoRow label={localizedUiText.m_3704a74837f8} value={settings?.liftSafetyCheckFrequency || 'BI_ANNUALLY'}/>
          <InfoRow label={localizedUiText.m_39c1b6122aeb} value={settings?.housekeepingCheckFrequency || 'DAILY'} isLast/>
        </AppCard>

        <AppCard padding="lg" style={styles.appCardMarginBottom7}>
          <Text style={styles.settingsGroupTitle}>{localizedUiText.m_15ed3aac0634}</Text>
          <InfoRow label={localizedUiText.m_b16e41428f89} value={`${settings?.fireNocReminderDaysBefore || 30} Days Before`}/>
          <InfoRow label={localizedUiText.m_08d972f9787c} value={`${settings?.liftCertificateReminderDaysBefore || 15} Days Before`} isLast/>
        </AppCard>

        <AppButton title={localizedUiText.m_ec92e1dc9bb3} onPress={() => AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_65e876880114))} variant="primary" fullWidth/>
      </ScrollView>
    </ScreenContainer>);
}
