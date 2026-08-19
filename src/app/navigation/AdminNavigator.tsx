import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SocietyAdminStackParamList } from './navigation.types';

import { SocietyAdminDashboardScreen } from '../../modules/societyAdmin/screens/SocietyAdminDashboardScreen';
import { UnitMasterScreen } from '../../modules/societyAdmin/screens/UnitMasterScreen';
import { ResidentDirectoryScreen } from '../../modules/societyAdmin/screens/ResidentDirectoryScreen';
import { PendingApprovalsScreen } from '../../modules/societyAdmin/screens/PendingApprovalsScreen';
import { NoticeControlScreen } from '../../modules/societyAdmin/screens/NoticeControlScreen';
import { ComplaintControlScreen } from '../../modules/societyAdmin/screens/ComplaintControlScreen';
import { AdminAuditLogScreen } from '../../modules/societyAdmin/screens/AdminAuditLogScreen';
import { FeatureConfigurationScreen } from '../../modules/societyAdmin/screens/FeatureConfigurationScreen';
import { AdminAccountScreen } from '../../modules/profile/screens/RoleAccountScreen';


import { SocietySetupSummaryScreen } from '../../modules/societySetup/screens/SocietySetupSummaryScreen';
import { SocietyHierarchyScreen } from '../../modules/societySetup/screens/SocietyHierarchyScreen';
import { TowerWingFloorSetupScreen } from '../../modules/societySetup/screens/TowerWingFloorSetupScreen';
import { UnitDetailScreen } from '../../modules/societySetup/screens/UnitDetailScreen';
import { UnitImportPlaceholderScreen } from '../../modules/societySetup/screens/UnitImportPlaceholderScreen';
import { UnitImportPreviewScreen } from '../../modules/societySetup/screens/UnitImportPreviewScreen';
import { UnitOccupancyStatusScreen } from '../../modules/societySetup/screens/UnitOccupancyStatusScreen';
import { SocietyConfigurationScreen } from '../../modules/societySetup/screens/SocietyConfigurationScreen';


import { ResidentDirectoryScreen as ResidentDirectoryNewScreen } from '../../modules/resident/profile/screens/ResidentDirectoryScreen';
import { ResidentDetailScreen } from '../../modules/resident/profile/screens/ResidentDetailScreen';
import { OwnerProfileScreen } from '../../modules/resident/profile/screens/OwnerProfileScreen';
import { TenantProfileScreen } from '../../modules/resident/profile/screens/TenantProfileScreen';
import { FamilyMembersScreen as FamilyMembersNewScreen } from '../../modules/resident/family/screens/FamilyMembersScreen';
import { ResidentKycScreen } from '../../modules/resident/profile/screens/ResidentKycScreen';
import { ResidentVehicleSummaryScreen } from '../../modules/resident/profile/screens/ResidentVehicleSummaryScreen';
import { ResidentApprovalQueueScreen } from '../../modules/resident/profile/screens/ResidentApprovalQueueScreen';
import { ResidentAccessStatusScreen } from '../../modules/resident/profile/screens/ResidentAccessStatusScreen';

import { RouteGuard } from '../../core/permissions/RouteGuard';
import { DepartmentChatStack } from './DepartmentChatStack';
import { StaffAttendanceStack } from './StaffAttendanceStack';

const Stack = createNativeStackNavigator<SocietyAdminStackParamList>();
const options = { headerShown: false, animation: 'slide_from_right' as const, animationDuration: 220 };

export function AdminNavigator() {
  return (
    <RouteGuard permission="ADMIN_DASHBOARD_VIEW">
      <Stack.Navigator screenOptions={options}>
        <Stack.Screen name="SocietyAdminHome" component={SocietyAdminDashboardScreen} />
        <Stack.Screen name="AdminProfile" component={AdminAccountScreen} />
        <Stack.Screen name="UnitMaster" component={UnitMasterScreen} />
        <Stack.Screen name="ResidentDirectory" component={ResidentDirectoryScreen} />
        <Stack.Screen name="PendingApprovals" component={PendingApprovalsScreen} />
        <Stack.Screen name="NoticeControl" component={NoticeControlScreen} />
        <Stack.Screen name="ComplaintControl" component={ComplaintControlScreen} />
        <Stack.Screen name="AdminAuditLog" component={AdminAuditLogScreen} />
        <Stack.Screen name="FeatureConfiguration" component={FeatureConfigurationScreen} />
        <Stack.Screen name="DepartmentChat" component={DepartmentChatStack} />
        <Stack.Screen name="StaffAttendanceStack" component={StaffAttendanceStack} />

        
        <Stack.Screen name="SocietySetupSummary" component={SocietySetupSummaryScreen} />
        <Stack.Screen name="SocietyHierarchy" component={SocietyHierarchyScreen} />
        <Stack.Screen name="TowerWingFloorSetup" component={TowerWingFloorSetupScreen} />
        <Stack.Screen name="UnitDetail" component={UnitDetailScreen} />
        <Stack.Screen name="UnitImportPlaceholder" component={UnitImportPlaceholderScreen} />
        <Stack.Screen name="UnitImportPreview" component={UnitImportPreviewScreen} />
        <Stack.Screen name="UnitOccupancyStatus" component={UnitOccupancyStatusScreen} />
        <Stack.Screen name="SocietyConfiguration" component={SocietyConfigurationScreen} />

        
        <Stack.Screen name="ResidentDirectoryNew" component={ResidentDirectoryNewScreen} />
        <Stack.Screen name="ResidentDetail" component={ResidentDetailScreen} />
        <Stack.Screen name="OwnerProfile" component={OwnerProfileScreen} />
        <Stack.Screen name="TenantProfile" component={TenantProfileScreen} />
        <Stack.Screen name="FamilyMembers" component={FamilyMembersNewScreen} />
        <Stack.Screen name="ResidentKyc" component={ResidentKycScreen} />
        <Stack.Screen name="ResidentVehicleSummary" component={ResidentVehicleSummaryScreen} />
        <Stack.Screen name="ResidentApprovalQueue" component={ResidentApprovalQueueScreen} />
        <Stack.Screen name="ResidentAccessStatus" component={ResidentAccessStatusScreen} />
      </Stack.Navigator>
    </RouteGuard>
  );
}

export default AdminNavigator;
