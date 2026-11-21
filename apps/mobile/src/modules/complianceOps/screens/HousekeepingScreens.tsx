import { useState } from "react";
import { Text, View, ScrollView, FlatList } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { Spacing } from "../../../shared/constants/spacing";
import { useHousekeepingDashboard, useHousekeepingSchedule, useHousekeepingRoundDetail, useStartHousekeepingRound, useCompleteHousekeepingRound, useSubmitFloorCleaningChecklist, useSubmitCommonAreaInspection, useSubmitSupervisorVerification, useReportHousekeepingIssue } from "../data/complianceHooks";
import { ComplianceMetricCard, HousekeepingRoundCard, InspectionChecklistCard, ComplianceSafetyNotice } from "../components/ComplianceComponents";
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
import { styles } from "../styles/screens/HousekeepingScreens.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import type { AppIconName } from "../../../shared/icons/icon.types";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type ComplianceScreenProps<TRoute extends keyof ComplianceOpsStackParamList> = NativeStackScreenProps<ComplianceOpsStackParamList, TRoute>;
export function HousekeepingDashboardScreen({ navigation }: ComplianceScreenProps<'HousekeepingDashboard'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useHousekeepingDashboard();
    const info = data || {
        completionRate: 88,
        pendingRoundsCount: 3,
        activeStaffCount: 8,
    };
    const menuItems: { name: string; icon: AppIconName; onPress: () => void }[] = [
        { name: String(localizedUiText.m_d6727b6d7a17), icon: 'calendar-outline', onPress: () => navigation.navigate('HousekeepingSchedule') },
        { name: String(localizedUiText.m_828269613a92), icon: 'eye-outline', onPress: () => navigation.navigate('CommonAreaInspection') },
        { name: String(localizedUiText.m_b699cf5a36a5), icon: 'alert-circle-outline', onPress: () => navigation.navigate('HousekeepingIssueReport') },
    ];
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_e90ba65ee1e8} subtitle={localizedUiText.m_a4767ec51b4d} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_abceb9feb027}</Text>
        <ResponsiveGrid columnsPhone={3} columnsTablet={3} gap={Spacing.sm}>
          <ComplianceMetricCard label={localizedUiText.m_1063f9223419} value={`${info.completionRate}%`}/>
          <ComplianceMetricCard label={localizedUiText.m_779dd1993ab4} value={info.pendingRoundsCount}/>
          <ComplianceMetricCard label={localizedUiText.m_7c55c31e71f0} value={info.activeStaffCount}/>
        </ResponsiveGrid>

        <Text style={styles.sectionTitle}>{localizedUiText.m_8176f945a42d}</Text>
        <ResponsiveGrid columnsPhone={2} columnsTablet={3} gap={Spacing.md}>
          {menuItems.map((item, idx) => (<QuickActionCard key={idx} title={item.name} iconName={item.icon} onPress={item.onPress}/>))}
        </ResponsiveGrid>

        <ComplianceSafetyNotice />
      </ScrollView>
    </ScreenContainer>);
}
export function HousekeepingScheduleScreen({ navigation }: ComplianceScreenProps<'HousekeepingSchedule'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useHousekeepingSchedule();
    const list = data || [];
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_d6727b6d7a17} subtitle={localizedUiText.m_388984453f13} onBack={() => navigation.goBack()}/>
      <FlatList data={list} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => (<HousekeepingRoundCard round={item} onPress={() => navigation.navigate('HousekeepingRoundDetail', { roundId: item.id })}/>)}/>
    </ScreenContainer>);
}
export function HousekeepingRoundDetailScreen({ route, navigation }: ComplianceScreenProps<'HousekeepingRoundDetail'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { roundId } = route.params;
    const { data, refetch } = useHousekeepingRoundDetail(roundId);
    const startMutation = useStartHousekeepingRound();
    const completeMutation = useCompleteHousekeepingRound();
    if (!data) {
        return (<ScreenContainer edges={['top', 'bottom']}>
        <ResponsivePageHeader title={localizedUiText.m_851039b7ef36} onBack={() => navigation.goBack()}/>
        <View style={styles.center}>
          <Text style={styles.errorText}>{localizedUiText.m_4e4d9dece675}</Text>
        </View>
      </ScreenContainer>);
    }
    const round = data;
    const handleStart = async () => {
        await startMutation.mutateAsync(roundId);
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_ccb535b0ff7c));
        refetch();
    };
    const handleComplete = () => {
        AppAlert.alert(String(localizedUiText.m_67aa047e0137), String(localizedUiText.m_6819dc5381ff), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_143b270a3260),
                onPress: async () => {
                    await completeMutation.mutateAsync({
                        roundId,
                        input: { completedBy: 'Housekeeping Staff', remarks: getActiveUiLiteral("m_97c9344c7c37") }
                    });
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_d402c54c5499));
                    refetch();
                }
            }
        ]);
    };
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={round.roundNumber} subtitle={round.area} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppCard padding="lg" style={styles.appCardMarginBottom}>
          <InfoRow label={localizedUiText.m_024dc204d7ba} value={round.area}/>
          <InfoRow label={localizedUiText.m_1693501b97cd} value={round.cleaningType.replace(/_/g, ' ')}/>
          <InfoRow label={localizedUiText.m_271189ae389a} value={round.startTime}/>
          <InfoRow label={localizedUiText.m_920e413c7d41} value={round.status}/>
          <InfoRow label={localizedUiText.m_bc9b7b8a8d0a} value={round.assignedStaff}/>
          <InfoRow label={localizedUiText.m_f999521ccfa8} value={String(round.checklist.length)} isLast/>
        </AppCard>

        <View style={styles.actionSection}>
          {round.status === 'SCHEDULED' && (<AppButton title={localizedUiText.m_130ddb033094} onPress={handleStart} variant="primary" fullWidth/>)}
          {round.status === 'IN_PROGRESS' && (<View style={styles.btnRow}>
              <AppButton title={localizedUiText.m_f5d2ef77b9b6} onPress={() => navigation.navigate('FloorCleaningChecklist', { roundId })} variant="outline" style={styles.appButtonFlexMarginRight}/>
              <AppButton title={localizedUiText.m_67aa047e0137} onPress={handleComplete} variant="success" style={styles.appButtonFlex}/>
            </View>)}
          {round.status === 'COMPLETED' && (<AppButton title={localizedUiText.m_9230e2ddccf7} onPress={() => navigation.navigate('HousekeepingSupervisorVerification', { roundId })} variant="primary" fullWidth/>)}
        </View>

        <ComplianceSafetyNotice />
      </ScrollView>
    </ScreenContainer>);
}
export function FloorCleaningChecklistScreen({ route, navigation }: ComplianceScreenProps<'FloorCleaningChecklist'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { roundId } = route.params;
    const [swept, setSwept] = useState(false);
    const [mopped, setMopped] = useState(false);
    const [disinfected, setDisinfected] = useState(false);
    const [trashEmptied, setTrashEmptied] = useState(false);
    const checklistMutation = useSubmitFloorCleaningChecklist();
    const handleSubmit = async () => {
        await checklistMutation.mutateAsync({
            roundId,
            swept,
            mopped,
            disinfected,
            trashEmptied,
        });
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_8ba1fe4d1bc6));
        navigation.goBack();
    };
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_067c776b9158} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppCard padding="lg" style={styles.appCardMarginBottom2}>
          <Text style={styles.checklistHeader}>{localizedUiText.m_53df4c7b983a}</Text>
          
          <InspectionChecklistCard title={localizedUiText.m_cf3347f0bfec} checked={swept} onPress={() => setSwept(!swept)}/>
          <InspectionChecklistCard title={localizedUiText.m_f77652a4b46f} checked={mopped} onPress={() => setMopped(!mopped)}/>
          <InspectionChecklistCard title={localizedUiText.m_e3331b2ff73c} checked={disinfected} onPress={() => setDisinfected(!disinfected)}/>
          <InspectionChecklistCard title={localizedUiText.m_f0aab0634373} checked={trashEmptied} onPress={() => setTrashEmptied(!trashEmptied)}/>

          <AppButton title={checklistMutation.isPending ? localizedUiText.m_dc85af8f2b1d : localizedUiText.m_5f25bf1aed9f} onPress={handleSubmit} variant="primary" fullWidth disabled={checklistMutation.isPending} style={styles.appButtonMarginTop}/>
        </AppCard>
      </ScrollView>
    </ScreenContainer>);
}
export function CommonAreaInspectionScreen({ navigation }: ComplianceScreenProps<'CommonAreaInspection'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [area, setArea] = useState('');
    const [cleanlinessRating, setCleanlinessRating] = useState('4');
    const [odorRating, setOdorRating] = useState('4');
    const [issuesObserved, setIssuesObserved] = useState('');
    const inspectionMutation = useSubmitCommonAreaInspection();
    const handleSubmit = async () => {
        if (!area) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_aecdc942654d));
            return;
        }
        await inspectionMutation.mutateAsync({
            area,
            cleanlinessRating: parseInt(cleanlinessRating),
            odorRating: parseInt(odorRating),
            issuesObserved,
        });
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_14284753578a));
        navigation.goBack();
    };
    const ratingOptions = [
        { label: String(localizedUiText.m_6c6932227b09), value: '1' },
        { label: '2', value: '2' },
        { label: String(localizedUiText.m_bee161449c17), value: '3' },
        { label: '4', value: '4' },
        { label: String(localizedUiText.m_9f6872ee1363), value: '5' },
    ];
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_828269613a92} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppCard padding="lg" style={styles.appCardMarginBottom3}>
          <FormField label={localizedUiText.m_9b8c7b3ba546} value={area} onChangeText={setArea} placeholder={localizedUiText.m_91f1cf041376} required/>

          <Text style={styles.formLabel}>{localizedUiText.m_016cb36cc513}</Text>
          <FilterChips options={ratingOptions} selected={cleanlinessRating} onChange={setCleanlinessRating} style={styles.filterChipsMarginBottom}/>

          <Text style={styles.formLabel}>{localizedUiText.m_3f47d6c34f98}</Text>
          <FilterChips options={ratingOptions} selected={odorRating} onChange={setOdorRating} style={styles.filterChipsMarginBottom2}/>

          <FormField label={localizedUiText.m_b95fd26a4793} value={issuesObserved} onChangeText={setIssuesObserved} placeholder={localizedUiText.m_5a406478d590} multiline numberOfLines={3}/>

          <AppButton title={inspectionMutation.isPending ? localizedUiText.m_64115d5b9c79 : localizedUiText.m_a2fb6741dc70} onPress={handleSubmit} variant="primary" fullWidth disabled={inspectionMutation.isPending} style={styles.appButtonMarginTop2}/>
        </AppCard>
      </ScrollView>
    </ScreenContainer>);
}
export function HousekeepingSupervisorVerificationScreen({ route, navigation }: ComplianceScreenProps<'HousekeepingSupervisorVerification'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { roundId } = route.params;
    const [result, setResult] = useState<'PASSED' | 'FAILED'>('PASSED');
    const [remarks, setRemarks] = useState('');
    const verifyMutation = useSubmitSupervisorVerification();
    const handleSubmit = async () => {
        await verifyMutation.mutateAsync({
            roundId,
            input: { result, remarks },
        });
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), formatUiLiteral(String(localizedUiText.m_c33da9b292e9), [result]));
        navigation.pop(2);
    };
    const resultOptions = [
        { label: String(localizedUiText.m_10a1726d279a), value: 'PASSED' },
        { label: String(localizedUiText.m_5cecf2d07f19), value: 'FAILED' },
    ];
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_97f69777506f} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppCard padding="lg" style={styles.appCardMarginBottom4}>
          <Text style={styles.formLabel}>{localizedUiText.m_1f41045117ca}</Text>
          <FilterChips options={resultOptions} selected={result} onChange={(value) => {
            if (value === 'PASSED' || value === 'FAILED') {
                setResult(value);
            }
        }} style={styles.filterChipsMarginBottom3}/>

          <FormField label={localizedUiText.m_ce8d1c2e3414} value={remarks} onChangeText={setRemarks} placeholder={localizedUiText.m_ae37710461a8} multiline numberOfLines={3}/>

          <AppButton title={verifyMutation.isPending ? localizedUiText.m_dc85af8f2b1d : localizedUiText.m_932157b69a31} onPress={handleSubmit} variant="primary" fullWidth disabled={verifyMutation.isPending} style={styles.appButtonMarginTop3}/>
        </AppCard>
      </ScrollView>
    </ScreenContainer>);
}
export function HousekeepingIssueReportScreen({ navigation }: ComplianceScreenProps<'HousekeepingIssueReport'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [area, setArea] = useState('');
    const [issueType, setIssueType] = useState('SPILLAGE');
    const [description, setDescription] = useState('');
    const issueMutation = useReportHousekeepingIssue();
    const handleSubmit = async () => {
        if (!area || !description) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_d1641a4df419));
            return;
        }
        await issueMutation.mutateAsync({
            area,
            issueType,
            description,
        });
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_2d0ad52b4915));
        navigation.goBack();
    };
    const issueOptions = [
        { label: String(localizedUiText.m_ed2a12fe8204), value: 'SPILLAGE' },
        { label: String(localizedUiText.m_737f997fb8b8), value: 'OVERFLOWING_BIN' },
        { label: String(localizedUiText.m_80f924a411a0), value: 'FOUL_ODOR' },
        { label: String(localizedUiText.m_d800f0aec8e7), value: 'PEST_ISSUE' },
        { label: String(localizedUiText.m_f97e9da0e3b8), value: 'OTHER' },
    ];
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_b699cf5a36a5} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppCard padding="lg" style={styles.appCardMarginBottom5}>
          <FormField label={localizedUiText.m_6b6845ebb26c} value={area} onChangeText={setArea} placeholder={localizedUiText.m_36608e0edd1c} required/>

          <Text style={styles.formLabel}>{localizedUiText.m_b880408f3dda}</Text>
          <FilterChips options={issueOptions} selected={issueType} onChange={setIssueType} style={styles.filterChipsMarginBottom4}/>

          <FormField label={localizedUiText.m_aac5f3fbf2b3} value={description} onChangeText={setDescription} placeholder={localizedUiText.m_e486ab6ac876} multiline numberOfLines={3} required/>

          <AppButton title={issueMutation.isPending ? localizedUiText.m_64115d5b9c79 : localizedUiText.m_653f005a6072} onPress={handleSubmit} variant="danger" fullWidth disabled={issueMutation.isPending} style={styles.appButtonMarginTop4}/>
        </AppCard>
      </ScrollView>
    </ScreenContainer>);
}
