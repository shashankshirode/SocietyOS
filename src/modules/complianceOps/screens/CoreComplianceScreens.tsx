import { useState } from "react";
import { Text, View, ScrollView, FlatList } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { Spacing } from "../../../shared/constants/spacing";
import { useComplianceHome, useComplianceCalendar, useComplianceTasks, useComplianceTaskDetail, useCreateComplianceTask, useStartComplianceTask, useCompleteComplianceTask, useVerifyComplianceTask, useReopenComplianceTask } from "../data/complianceHooks";
import { ComplianceMetricCard, ComplianceTaskCard, ComplianceCalendarItem, ComplianceSafetyNotice } from "../components/ComplianceComponents";
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
import { styles } from "../styles/screens/CoreComplianceScreens.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
import type { AppIconName } from "../../../shared/icons/icon.types";
type ComplianceScreenProps<TRoute extends keyof ComplianceOpsStackParamList> = NativeStackScreenProps<ComplianceOpsStackParamList, TRoute>;
export function ComplianceHomeScreen({ navigation }: ComplianceScreenProps<'ComplianceHome'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useComplianceHome();
    const info = data || {
        societyName: 'Green Valley Heights',
        currentRole: 'FACILITY_MANAGER',
        complianceHealthScore: 94,
        openTasksCount: 12,
        overdueTasksCount: 2,
        wasteComplianceStatus: 'COMPLIANT',
        housekeepingCompletionRate: 88,
        liftSafetyStatus: 'OPERATIONAL',
        fireSafetyStatus: 'NEEDS_ATTENTION',
    };
    const menuItems: {
        name: string;
        icon: AppIconName;
        onPress: () => void;
    }[] = [
        { name: String(localizedUiText.m_2829c8aa7bc5), icon: 'calendar-outline', onPress: () => navigation.navigate('ComplianceCalendar') },
        { name: String(localizedUiText.m_424136850ebc), icon: 'list-outline', onPress: () => navigation.navigate('ComplianceTaskList') },
        { name: String(localizedUiText.m_af1a7ad6f2e4), icon: 'trash-outline', onPress: () => navigation.navigate('WasteComplianceDashboard') },
        { name: String(localizedUiText.m_6f352b468971), icon: 'brush-outline', onPress: () => navigation.navigate('HousekeepingDashboard') },
        { name: String(localizedUiText.m_a03167849089), icon: 'swap-vertical-outline', onPress: () => navigation.navigate('LiftSafetyDashboard') },
        { name: String(localizedUiText.m_b27d277e243a), icon: 'flame-outline', onPress: () => navigation.navigate('FireSafetyDashboard') },
        { name: String(localizedUiText.m_02f61b55c9a4), icon: 'document-text-outline', onPress: () => navigation.navigate('ComplianceReports') },
        { name: String(localizedUiText.m_5428d7fe5929), icon: 'receipt-outline', onPress: () => navigation.navigate('ComplianceAuditLog') },
        { name: String(localizedUiText.m_74a883a037bc), icon: 'settings-outline', onPress: () => navigation.navigate('ComplianceSettings') },
    ];
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_7cdc9709db8f} subtitle={info.societyName} roleContext={info.currentRole}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppCard style={styles.scoreCard} padding="lg">
          <Text style={styles.scoreNum}>{info.complianceHealthScore}%</Text>
          <Text style={styles.scoreLabel}>{localizedUiText.m_fcf668fcd4ec}</Text>
        </AppCard>

        <Text style={styles.sectionTitle}>{localizedUiText.m_abceb9feb027}</Text>
        <ResponsiveGrid columnsPhone={2} columnsTablet={4} gap={Spacing.md}>
          <ComplianceMetricCard label={localizedUiText.m_96d741b61505} value={info.openTasksCount}/>
          <ComplianceMetricCard label={localizedUiText.m_d67cde969db0} value={info.overdueTasksCount}/>
          <ComplianceMetricCard label={localizedUiText.m_3cf10273b6c7} value={info.wasteComplianceStatus}/>
          <ComplianceMetricCard label={localizedUiText.m_6f352b468971} value={`${info.housekeepingCompletionRate}%`}/>
        </ResponsiveGrid>

        <Text style={styles.sectionTitle}>{localizedUiText.m_802b61afd1ef}</Text>
        <ResponsiveGrid columnsPhone={2} columnsTablet={3} gap={Spacing.md}>
          {menuItems.map((item, idx) => (<QuickActionCard key={idx} title={item.name} iconName={item.icon} onPress={item.onPress}/>))}
        </ResponsiveGrid>

        <ComplianceSafetyNotice />
      </ScrollView>
    </ScreenContainer>);
}
export function ComplianceCalendarScreen({ navigation }: ComplianceScreenProps<'ComplianceCalendar'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useComplianceCalendar();
    const list = data || [];
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_2829c8aa7bc5} subtitle={localizedUiText.m_569c40f604fe} onBack={() => navigation.goBack()} rightActions={<AppButton variant="primary" size="sm" title={localizedUiText.m_718e58cc20d6} onPress={() => navigation.navigate('CreateComplianceTask')}/>}/>
      <FlatList data={list} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => (<ComplianceCalendarItem item={item} onPress={() => navigation.navigate('ComplianceTaskDetail', { taskId: item.id })}/>)}/>
    </ScreenContainer>);
}
export function ComplianceTaskListScreen({ navigation }: ComplianceScreenProps<'ComplianceTaskList'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [category, setCategory] = useState<string>('ALL');
    const [status, setStatus] = useState<string>('ALL');
    const { data } = useComplianceTasks({
        category: category === 'ALL' ? undefined : category,
        status: status === 'ALL' ? undefined : status,
    });
    const list = data || [];
    const categoryOptions = [
        { label: String(localizedUiText.m_fe3b58f14752), value: 'ALL' },
        { label: String(localizedUiText.m_f734f9b7f370), value: 'WASTE' },
        { label: String(localizedUiText.m_6f352b468971), value: 'HOUSEKEEPING' },
        { label: String(localizedUiText.m_a03167849089), value: 'LIFT_SAFETY' },
        { label: String(localizedUiText.m_b27d277e243a), value: 'FIRE_SAFETY' },
    ];
    const statusOptions = [
        { label: String(localizedUiText.m_05f567125eb0), value: 'ALL' },
        { label: String(localizedUiText.m_331551b0de41), value: 'PENDING' },
        { label: String(localizedUiText.m_b4cc4b07c300), value: 'IN_PROGRESS' },
        { label: String(localizedUiText.m_22a970d2e5b1), value: 'COMPLETED' },
        { label: String(localizedUiText.m_4f7838402f37), value: 'VERIFIED' },
    ];
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_424136850ebc} subtitle={localizedUiText.m_0cbbacc9210c} onBack={() => navigation.goBack()} rightActions={<AppButton variant="primary" size="sm" title={localizedUiText.m_718e58cc20d6} onPress={() => navigation.navigate('CreateComplianceTask')}/>}/>
      <View style={styles.filterContainer}>
        <FilterChips options={categoryOptions} selected={category} onChange={setCategory}/>
        <FilterChips options={statusOptions} selected={status} onChange={setStatus}/>
      </View>

      <FlatList data={list} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => (<ComplianceTaskCard task={item} onPress={() => navigation.navigate('ComplianceTaskDetail', { taskId: item.id })}/>)}/>
    </ScreenContainer>);
}
export function ComplianceTaskDetailScreen({ route, navigation }: ComplianceScreenProps<'ComplianceTaskDetail'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { taskId } = route.params;
    const { data, refetch } = useComplianceTaskDetail(taskId);
    const startMutation = useStartComplianceTask();
    const completeMutation = useCompleteComplianceTask();
    const verifyMutation = useVerifyComplianceTask();
    const reopenMutation = useReopenComplianceTask();
    if (!data) {
        return (<ScreenContainer edges={['top', 'bottom']}>
        <ResponsivePageHeader title={localizedUiText.m_2096f34e7649} onBack={() => navigation.goBack()}/>
        <View style={styles.center}>
          <Text style={styles.errorText}>{localizedUiText.m_2b3b5d627ca0}</Text>
        </View>
      </ScreenContainer>);
    }
    const task = data;
    const handleStart = async () => {
        await startMutation.mutateAsync(taskId);
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_d495276d6e3f));
        refetch();
    };
    const handleComplete = async () => {
        await completeMutation.mutateAsync({ taskId, input: { notes: getActiveUiLiteral("m_b6a08b6eda00") } });
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_5739ac109078));
        refetch();
    };
    const handleVerify = async () => {
        await verifyMutation.mutateAsync({ taskId, input: { notes: getActiveUiLiteral("m_15a9b466ae61") } });
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_04a408903c52));
        refetch();
    };
    const handleReopen = async () => {
        await reopenMutation.mutateAsync({ taskId, input: { notes: getActiveUiLiteral("m_acf668b18e37") } });
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_3406ef4ea4ae));
        refetch();
    };
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={task.taskNumber} subtitle={task.title} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppCard style={styles.detailCard} padding="lg">
          <InfoRow label={localizedUiText.m_7e8cd2056da7} value={task.title}/>
          <InfoRow label={localizedUiText.m_292c06f0045a} value={task.category.replace(/_/g, ' ')}/>
          <InfoRow label={localizedUiText.m_d60dbba07922} value={task.priority}/>
          <InfoRow label={localizedUiText.m_920e413c7d41} value={task.status}/>
          <InfoRow label={localizedUiText.m_838f74e6c714} value={task.assignedTo}/>
          <InfoRow label={localizedUiText.m_57870fd03032} value={task.dueDate}/>
          <InfoRow label={localizedUiText.m_526e0087cc3f} value={task.notes || getActiveUiLiteral("m_2527a18acbad")} isLast/>
        </AppCard>

        <View style={styles.actionSection}>
          {(task.status === 'OPEN' || task.status === 'ASSIGNED') && (<AppButton title={localizedUiText.m_3410d9f73ad8} onPress={handleStart} variant="primary" fullWidth/>)}
          {task.status === 'IN_PROGRESS' && (<AppButton title={localizedUiText.m_7d6cea75de7a} onPress={handleComplete} variant="success" fullWidth/>)}
          {task.status === 'COMPLETED' && (<View style={styles.btnRow}>
              <AppButton title={localizedUiText.m_a886d1dc4f12} onPress={handleReopen} variant="danger" style={styles.appButtonFlexMarginRight}/>
              <AppButton title={localizedUiText.m_eea2745e2867} onPress={handleVerify} variant="success" style={styles.appButtonFlex}/>
            </View>)}
        </View>

        <ComplianceSafetyNotice />
      </ScrollView>
    </ScreenContainer>);
}
export function CreateComplianceTaskScreen({ navigation }: ComplianceScreenProps<'CreateComplianceTask'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('WASTE');
    const [priority, setPriority] = useState('MEDIUM');
    const [assignedTo, setAssignedTo] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');
    const createMutation = useCreateComplianceTask();
    const categoryOptions = [
        { label: String(localizedUiText.m_f734f9b7f370), value: 'WASTE' },
        { label: String(localizedUiText.m_6f352b468971), value: 'HOUSEKEEPING' },
        { label: String(localizedUiText.m_a03167849089), value: 'LIFT_SAFETY' },
        { label: String(localizedUiText.m_b27d277e243a), value: 'FIRE_SAFETY' },
    ];
    const priorityOptions = [
        { label: String(localizedUiText.m_f793de205ead), value: 'LOW' },
        { label: String(localizedUiText.m_8e588cd18774), value: 'MEDIUM' },
        { label: String(localizedUiText.m_c4ebc6d4a583), value: 'HIGH' },
        { label: String(localizedUiText.m_427dd2969bd1), value: 'CRITICAL' },
    ];
    const handleSubmit = async () => {
        if (!title || !assignedTo || !dueDate) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_d1641a4df419));
            return;
        }
        await createMutation.mutateAsync({
            title,
            category,
            priority,
            assignedTo,
            dueDate,
            description,
        });
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_ec389ba9f311));
        navigation.goBack();
    };
    return (<ScreenContainer edges={['top', 'bottom']}>
      <ResponsivePageHeader title={localizedUiText.m_232d0e562f4d} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppCard padding="lg" style={styles.appCardMarginBottom}>
          <FormField label={localizedUiText.m_2d9ac27ba380} value={title} onChangeText={setTitle} placeholder={localizedUiText.m_975362957e00} required/>

          <Text style={styles.formLabel}>{localizedUiText.m_1539ace74940}</Text>
          <FilterChips options={categoryOptions} selected={category} onChange={setCategory} style={styles.filterChipsMarginBottom}/>

          <Text style={styles.formLabel}>{localizedUiText.m_863375f72568}</Text>
          <FilterChips options={priorityOptions} selected={priority} onChange={setPriority} style={styles.filterChipsMarginBottom2}/>

          <FormField label={localizedUiText.m_838f74e6c714} value={assignedTo} onChangeText={setAssignedTo} placeholder={localizedUiText.m_6ff0225cfe24} required/>

          <FormField label={localizedUiText.m_57870fd03032} value={dueDate} onChangeText={setDueDate} placeholder={localizedUiText.m_c646c2c1438a} required/>

          <FormField label={localizedUiText.m_526e0087cc3f} value={description} onChangeText={setDescription} placeholder={localizedUiText.m_5de73726c7a0} multiline numberOfLines={3}/>

          <AppButton title={createMutation.isPending ? localizedUiText.m_def70944c9bb : localizedUiText.m_5a9133cebfab} onPress={handleSubmit} variant="primary" fullWidth disabled={createMutation.isPending} style={styles.appButtonMarginTop}/>
        </AppCard>
      </ScrollView>
    </ScreenContainer>);
}

