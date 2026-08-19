import { useState } from "react";
import { Text, View, ScrollView, FlatList } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { Spacing } from "../../../shared/constants/spacing";
import { useLiftSafetyDashboard, useLiftRegister, useLiftDetail, useReportLiftBreakdown, useLiftMaintenanceVisitLog, useAddLiftMaintenanceVisit, useLiftCertificateTracker, useStartLiftCertificateRenewal, useLiftDowntimeReport, useLiftSafetyDocuments } from "../data/complianceHooks";
import { ComplianceMetricCard, LiftCard, LiftBreakdownCard, CertificateExpiryCard, ComplianceSafetyNotice } from "../components/ComplianceComponents";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppButton } from "../../../shared/components/AppButton";
import { FormField } from "../../../shared/forms/FormField";
import { InfoRow } from "../../../shared/components/InfoRow";
import { FilterChips } from "../../../shared/lists/FilterChips";
import { ResponsiveGrid } from "../../../shared/layouts/ResponsiveGrid";
import { QuickActionCard } from "../../../shared/cards/QuickActionCard";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ComplianceOpsStackParamList } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/LiftSafetyScreens.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import type { AppIconName } from "../../../shared/icons/icon.types";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type ComplianceScreenProps<TRoute extends keyof ComplianceOpsStackParamList> = NativeStackScreenProps<ComplianceOpsStackParamList, TRoute>;
export function LiftSafetyDashboardScreen({ navigation }: ComplianceScreenProps<'LiftSafetyDashboard'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useLiftSafetyDashboard();
    const info = data || {
        totalLifts: 8,
        activeBreakdowns: 1,
        expiringCertificates: 2,
    };
    const menuItems: { name: string; icon: AppIconName; onPress: () => void }[] = [
        { name: String(localizedUiText.m_cc57fae45024), icon: 'list-outline', onPress: () => navigation.navigate('LiftRegister') },
        { name: String(localizedUiText.m_f089ac8b5c48), icon: 'document-text-outline', onPress: () => navigation.navigate('LiftSafetyDocuments') },
        { name: String(localizedUiText.m_df6f0a8ece16), icon: 'trending-down-outline', onPress: () => navigation.navigate('LiftDowntimeReport') },
    ];
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_a03167849089} subtitle={localizedUiText.m_6d07a0a4931a} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_abceb9feb027}</Text>
        <ResponsiveGrid columnsPhone={3} columnsTablet={3} gap={Spacing.sm}>
          <ComplianceMetricCard label={localizedUiText.m_cea58576dc8f} value={info.totalLifts}/>
          <ComplianceMetricCard label={localizedUiText.m_2b1e9cdebe2f} value={info.activeBreakdowns}/>
          <ComplianceMetricCard label={localizedUiText.m_dd702e0ae62d} value={info.expiringCertificates}/>
        </ResponsiveGrid>

        <Text style={styles.sectionTitle}>{localizedUiText.m_280d77446d3f}</Text>
        <ResponsiveGrid columnsPhone={2} columnsTablet={3} gap={Spacing.md}>
          {menuItems.map((item, idx) => (<QuickActionCard key={idx} title={item.name} iconName={item.icon} onPress={item.onPress}/>))}
        </ResponsiveGrid>

        <ComplianceSafetyNotice />
      </ScrollView>
    </ScreenContainer>);
}
export function LiftRegisterScreen({ navigation }: ComplianceScreenProps<'LiftRegister'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useLiftRegister();
    const list = data || [];
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_cc57fae45024} subtitle={localizedUiText.m_bccbb0eb88ee} onBack={() => navigation.goBack()}/>
      <FlatList data={list} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => (<LiftCard lift={item} onPress={() => navigation.navigate('LiftDetail', { liftId: item.id })}/>)}/>
    </ScreenContainer>);
}
export function LiftDetailScreen({ route, navigation }: ComplianceScreenProps<'LiftDetail'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { liftId } = route.params;
    const { data } = useLiftDetail(liftId);
    if (!data) {
        return (<ScreenContainer edges={['top', 'bottom']}>
        <ResponsivePageHeader title={localizedUiText.m_59a432f8aef0} onBack={() => navigation.goBack()}/>
        <View style={styles.center}>
          <Text style={styles.errorText}>{localizedUiText.m_fa7c61c63f64}</Text>
        </View>
      </ScreenContainer>);
    }
    const lift = data;
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={lift.liftNumber} subtitle={formatUiLiteral(localizedUiText.m_afce4c61d4e4, [lift.tower])} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppCard padding="lg" style={styles.appCardMarginBottom}>
          <InfoRow label={localizedUiText.m_d655d9dd3612} value={lift.liftNumber}/>
          <InfoRow label={localizedUiText.m_ea0a79480481} value={lift.tower}/>
          <InfoRow label={localizedUiText.m_baaddf70fb5d} value={lift.type}/>
          <InfoRow label={localizedUiText.m_920e413c7d41} value={lift.status}/>
          <InfoRow label={localizedUiText.m_3cc680f693e8} value={lift.vendor}/>
          <InfoRow label={localizedUiText.m_fc6442635de1} value={lift.lastServiceDate}/>
          <InfoRow label={localizedUiText.m_e3d0e3ea4d35} value={lift.nextServiceDate} isLast/>
        </AppCard>

        <View style={styles.actionSection}>
          <AppButton title={localizedUiText.m_568044357ad1} onPress={() => navigation.navigate('LiftBreakdownReport', { liftId })} variant="danger" fullWidth style={styles.appButtonMarginBottom}/>
          <View style={styles.btnRow}>
            <AppButton title={localizedUiText.m_1da22833318b} onPress={() => navigation.navigate('LiftMaintenanceVisitLog', { liftId })} variant="outline" style={styles.appButtonFlexMarginRight}/>
            <AppButton title={localizedUiText.m_95849034de4c} onPress={() => navigation.navigate('LiftCertificateTracker', { liftId })} variant="outline" style={styles.appButtonFlex}/>
          </View>
        </View>

        <ComplianceSafetyNotice />
      </ScrollView>
    </ScreenContainer>);
}
export function LiftBreakdownReportScreen({ route, navigation }: ComplianceScreenProps<'LiftBreakdownReport'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const liftId = route.params?.liftId ?? 'lift-1';
    const [breakdownType, setBreakdownType] = useState('TECHNICAL_GLITCH');
    const [description, setDescription] = useState('');
    const reportMutation = useReportLiftBreakdown();
    const handleSubmit = async () => {
        if (!description) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_1af3697234b3));
            return;
        }
        await reportMutation.mutateAsync({
            liftId,
            input: { breakdownType, description },
        });
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_f161ebb7ae84));
        navigation.pop();
    };
    const typeOptions = [
        { label: String(localizedUiText.m_c65dc1e32462), value: 'TECHNICAL_GLITCH' },
        { label: String(localizedUiText.m_1933301ff455), value: 'POWER_FAILURE' },
        { label: String(localizedUiText.m_1a649b102f94), value: 'PHYSICAL_DAMAGE' },
        { label: String(localizedUiText.m_f97e9da0e3b8), value: 'OTHER' },
    ];
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_381374cf24f0} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppCard padding="lg" style={styles.appCardMarginBottom2}>
          <Text style={styles.formLabel}>{localizedUiText.m_05fd7efbcd35}</Text>
          <FilterChips options={typeOptions} selected={breakdownType} onChange={setBreakdownType} style={styles.filterChipsMarginBottom}/>

          <FormField label={localizedUiText.m_ebf2901a51e1} value={description} onChangeText={setDescription} placeholder={localizedUiText.m_257e6245454d} multiline numberOfLines={3} required/>

          <AppButton title={reportMutation.isPending ? localizedUiText.m_5229d83a9942 : localizedUiText.m_568044357ad1} onPress={handleSubmit} variant="danger" fullWidth disabled={reportMutation.isPending} style={styles.appButtonMarginTop}/>
        </AppCard>
      </ScrollView>
    </ScreenContainer>);
}
export function LiftMaintenanceVisitLogScreen({ route, navigation }: ComplianceScreenProps<'LiftMaintenanceVisitLog'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const liftId = route.params?.liftId ?? 'lift-1';
    const { data, refetch } = useLiftMaintenanceVisitLog(liftId);
    const addMutation = useAddLiftMaintenanceVisit();
    const list = data || [];
    const handleAddVisit = () => {
        AppAlert.alert(String(localizedUiText.m_affcc372c8cf), String(localizedUiText.m_3c775bca8acb), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_976654e1e605),
                onPress: async () => {
                    await addMutation.mutateAsync({
                        liftId,
                        input: { visitType: 'ROUTINE', technicianName: 'AMC Technician', findings: getActiveUiLiteral("m_4a9c0a1dfdf2") }
                    });
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_2e08cc53070a));
                    refetch();
                }
            }
        ]);
    };
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_1da22833318b} subtitle={localizedUiText.m_1e9bc4a84045} onBack={() => navigation.goBack()} rightActions={<AppButton variant="primary" size="sm" title={localizedUiText.m_976654e1e605} onPress={handleAddVisit}/>}/>
      <FlatList data={list} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => (<AppCard style={styles.hkCard} padding="md">
            <InfoRow label={localizedUiText.m_99c40ab40592} value={item.visitDate}/>
            <InfoRow label={localizedUiText.m_3134a531ffbd} value={item.visitType}/>
            <InfoRow label={localizedUiText.m_9041ccc41723} value={item.technicianName}/>
            <InfoRow label={localizedUiText.m_920e413c7d41} value={item.status}/>
            <InfoRow label={localizedUiText.m_8a7525b1492f} value={item.findings || getActiveUiLiteral("m_aceb7568a033")} isLast/>
          </AppCard>)}/>
    </ScreenContainer>);
}
export function LiftCertificateTrackerScreen({ route, navigation }: ComplianceScreenProps<'LiftCertificateTracker'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const liftId = route.params?.liftId ?? 'lift-1';
    const { data, refetch } = useLiftCertificateTracker(liftId);
    const renewalMutation = useStartLiftCertificateRenewal();
    const list = data || [];
    const handleRenew = () => {
        AppAlert.alert(String(localizedUiText.m_3bcbc096dc74), String(localizedUiText.m_d4bee6dc3936), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_e2c53b83454f),
                onPress: async () => {
                    await renewalMutation.mutateAsync({
                        liftId,
                        input: { agencyName: 'Govt Lift Inspectorate', notes: getActiveUiLiteral("m_41985d53d9fe") }
                    });
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_66937999d4af));
                    refetch();
                }
            }
        ]);
    };
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_95849034de4c} subtitle={localizedUiText.m_15f8612c5ddb} onBack={() => navigation.goBack()} rightActions={<AppButton variant="primary" size="sm" title={localizedUiText.m_bd58120758d7} onPress={handleRenew}/>}/>
      <FlatList data={list} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => (<CertificateExpiryCard cert={item} onPress={() => { }}/>)}/>
    </ScreenContainer>);
}
export function LiftDowntimeReportScreen({ navigation }: ComplianceScreenProps<'LiftDowntimeReport'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useLiftDowntimeReport();
    const list = data || [];
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_6285c7add4e2} subtitle={localizedUiText.m_96df3263d215} onBack={() => navigation.goBack()}/>
      <FlatList data={list} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => (<LiftBreakdownCard breakdown={item} onPress={() => { }}/>)}/>
    </ScreenContainer>);
}
export function LiftSafetyDocumentsScreen({ navigation }: ComplianceScreenProps<'LiftSafetyDocuments'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useLiftSafetyDocuments();
    const list = data || [];
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_f089ac8b5c48} subtitle={localizedUiText.m_c29e2e06f307} onBack={() => navigation.goBack()}/>
      <FlatList data={list} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => (<AppCard style={styles.hkCard} padding="md">
            <InfoRow label={localizedUiText.m_6940d1faf9e5} value={item.documentName}/>
            <InfoRow label={localizedUiText.m_292c06f0045a} value={item.documentType}/>
            <InfoRow label={localizedUiText.m_2a7a01c43243} value={item.uploadedAt}/>
            <InfoRow label={localizedUiText.m_920e413c7d41} value={item.status} isLast/>
          </AppCard>)}/>
    </ScreenContainer>);
}
