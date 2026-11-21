import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ComplianceOpsStackParamList } from './navigation.types';
import { ComplianceHomeScreen, ComplianceCalendarScreen, ComplianceTaskListScreen, ComplianceTaskDetailScreen, CreateComplianceTaskScreen } from '../../modules/complianceOps/screens/CoreComplianceScreens';
import { WasteComplianceDashboardScreen, WastePickupScheduleScreen, WasteSegregationChecklistScreen, MissedGarbagePickupScreen, WasteViolationNoticePlaceholderScreen, WasteSegregationReportScreen } from '../../modules/complianceOps/screens/WasteComplianceScreens';
import { HousekeepingDashboardScreen, HousekeepingScheduleScreen, HousekeepingRoundDetailScreen, FloorCleaningChecklistScreen, CommonAreaInspectionScreen, HousekeepingSupervisorVerificationScreen, HousekeepingIssueReportScreen } from '../../modules/complianceOps/screens/HousekeepingScreens';
import { LiftSafetyDashboardScreen, LiftRegisterScreen, LiftDetailScreen, LiftBreakdownReportScreen, LiftMaintenanceVisitLogScreen, LiftCertificateTrackerScreen, LiftDowntimeReportScreen, LiftSafetyDocumentsScreen } from '../../modules/complianceOps/screens/LiftSafetyScreens';
import { FireSafetyDashboardScreen, FireEquipmentRegisterScreen, FireEquipmentDetailScreen, FireExtinguisherExpiryTrackerScreen, FireNocTrackerScreen, HydrantPumpInspectionChecklistScreen, FireDrillRecordsScreen, FireDrillDetailScreen, EvacuationPlanPlaceholderScreen, SafetyInspectionReportScreen, ComplianceReportsScreen, ComplianceAuditLogScreen, ComplianceSettingsScreen } from '../../modules/complianceOps/screens/FireSafetyScreens';
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
const Stack = createNativeStackNavigator<ComplianceOpsStackParamList>();
export function ComplianceOpsStack() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<Stack.Navigator screenOptions={{ headerShown: true, title: String(localizedUiText.m_7cdc9709db8f) }}>
      <Stack.Screen name="ComplianceHome" component={ComplianceHomeScreen} options={{ title: String(localizedUiText.m_05711df86199) }}/>
      <Stack.Screen name="ComplianceCalendar" component={ComplianceCalendarScreen} options={{ title: String(localizedUiText.m_2829c8aa7bc5) }}/>
      <Stack.Screen name="ComplianceTaskList" component={ComplianceTaskListScreen} options={{ title: String(localizedUiText.m_424136850ebc) }}/>
      <Stack.Screen name="ComplianceTaskDetail" component={ComplianceTaskDetailScreen} options={{ title: String(localizedUiText.m_2096f34e7649) }}/>
      <Stack.Screen name="CreateComplianceTask" component={CreateComplianceTaskScreen} options={{ title: String(localizedUiText.m_5a9133cebfab) }}/>
      
      
      <Stack.Screen name="WasteComplianceDashboard" component={WasteComplianceDashboardScreen} options={{ title: String(localizedUiText.m_b83cfa0b5aea) }}/>
      <Stack.Screen name="WastePickupSchedule" component={WastePickupScheduleScreen} options={{ title: String(localizedUiText.m_b685a65dc9fc) }}/>
      <Stack.Screen name="WasteSegregationChecklist" component={WasteSegregationChecklistScreen} options={{ title: String(localizedUiText.m_468f4f6c6a1b) }}/>
      <Stack.Screen name="MissedGarbagePickup" component={MissedGarbagePickupScreen} options={{ title: String(localizedUiText.m_1990c1e707fd) }}/>
      <Stack.Screen name="WasteViolationNoticePlaceholder" component={WasteViolationNoticePlaceholderScreen} options={{ title: String(localizedUiText.m_48098dd9b77e) }}/>
      <Stack.Screen name="WasteSegregationReport" component={WasteSegregationReportScreen} options={{ title: String(localizedUiText.m_cee1c5e924b3) }}/>

      
      <Stack.Screen name="HousekeepingDashboard" component={HousekeepingDashboardScreen} options={{ title: String(localizedUiText.m_6f352b468971) }}/>
      <Stack.Screen name="HousekeepingSchedule" component={HousekeepingScheduleScreen} options={{ title: String(localizedUiText.m_edd41b1f3518) }}/>
      <Stack.Screen name="HousekeepingRoundDetail" component={HousekeepingRoundDetailScreen} options={{ title: String(localizedUiText.m_851039b7ef36) }}/>
      <Stack.Screen name="FloorCleaningChecklist" component={FloorCleaningChecklistScreen} options={{ title: String(localizedUiText.m_fc6c798416ff) }}/>
      <Stack.Screen name="CommonAreaInspection" component={CommonAreaInspectionScreen} options={{ title: String(localizedUiText.m_828269613a92) }}/>
      <Stack.Screen name="HousekeepingSupervisorVerification" component={HousekeepingSupervisorVerificationScreen} options={{ title: String(localizedUiText.m_97f69777506f) }}/>
      <Stack.Screen name="HousekeepingIssueReport" component={HousekeepingIssueReportScreen} options={{ title: String(localizedUiText.m_653f005a6072) }}/>

      
      <Stack.Screen name="LiftSafetyDashboard" component={LiftSafetyDashboardScreen} options={{ title: String(localizedUiText.m_a03167849089) }}/>
      <Stack.Screen name="LiftRegister" component={LiftRegisterScreen} options={{ title: String(localizedUiText.m_cc57fae45024) }}/>
      <Stack.Screen name="LiftDetail" component={LiftDetailScreen} options={{ title: String(localizedUiText.m_59a432f8aef0) }}/>
      <Stack.Screen name="LiftBreakdownReport" component={LiftBreakdownReportScreen} options={{ title: String(localizedUiText.m_568044357ad1) }}/>
      <Stack.Screen name="LiftMaintenanceVisitLog" component={LiftMaintenanceVisitLogScreen} options={{ title: String(localizedUiText.m_1da22833318b) }}/>
      <Stack.Screen name="LiftCertificateTracker" component={LiftCertificateTrackerScreen} options={{ title: String(localizedUiText.m_683c27582e9a) }}/>
      <Stack.Screen name="LiftDowntimeReport" component={LiftDowntimeReportScreen} options={{ title: String(localizedUiText.m_df6f0a8ece16) }}/>
      <Stack.Screen name="LiftSafetyDocuments" component={LiftSafetyDocumentsScreen} options={{ title: String(localizedUiText.m_f089ac8b5c48) }}/>

      
      <Stack.Screen name="FireSafetyDashboard" component={FireSafetyDashboardScreen} options={{ title: String(localizedUiText.m_b27d277e243a) }}/>
      <Stack.Screen name="FireEquipmentRegister" component={FireEquipmentRegisterScreen} options={{ title: String(localizedUiText.m_c34131ac2032) }}/>
      <Stack.Screen name="FireEquipmentDetail" component={FireEquipmentDetailScreen} options={{ title: String(localizedUiText.m_acf56603fab7) }}/>
      <Stack.Screen name="FireExtinguisherExpiryTracker" component={FireExtinguisherExpiryTrackerScreen} options={{ title: String(localizedUiText.m_bdfb0952b11e) }}/>
      <Stack.Screen name="FireNocTracker" component={FireNocTrackerScreen} options={{ title: String(localizedUiText.m_949c7ca155b8) }}/>
      <Stack.Screen name="HydrantPumpInspectionChecklist" component={HydrantPumpInspectionChecklistScreen} options={{ title: String(localizedUiText.m_2947c1b854d4) }}/>
      <Stack.Screen name="FireDrillRecords" component={FireDrillRecordsScreen} options={{ title: String(localizedUiText.m_ccc0d23852be) }}/>
      <Stack.Screen name="FireDrillDetail" component={FireDrillDetailScreen} options={{ title: String(localizedUiText.m_5083bc8f62d4) }}/>
      <Stack.Screen name="EvacuationPlanPlaceholder" component={EvacuationPlanPlaceholderScreen} options={{ title: String(localizedUiText.m_5a0e5e004356) }}/>
      
      
      <Stack.Screen name="SafetyInspectionReport" component={SafetyInspectionReportScreen} options={{ title: String(localizedUiText.m_71c2930e7e39) }}/>
      <Stack.Screen name="ComplianceReports" component={ComplianceReportsScreen} options={{ title: String(localizedUiText.m_02f61b55c9a4) }}/>
      <Stack.Screen name="ComplianceAuditLog" component={ComplianceAuditLogScreen} options={{ title: String(localizedUiText.m_47751f88edff) }}/>
      <Stack.Screen name="ComplianceSettings" component={ComplianceSettingsScreen} options={{ title: String(localizedUiText.m_74a883a037bc) }}/>
    </Stack.Navigator>);
}
export type { ComplianceOpsStackParamList };

