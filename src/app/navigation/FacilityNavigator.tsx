import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { FacilityOpsStackParamList } from './navigation.types';
import { FacilityOpsHomeScreen } from '../../modules/facilityOps/screens/FacilityOpsHomeScreen';
import { VendorDirectoryScreen } from '../../modules/facilityOps/screens/VendorDirectoryScreen';
import { VendorDetailScreen } from '../../modules/facilityOps/screens/VendorDetailScreen';
import { RegisterVendorScreen } from '../../modules/facilityOps/screens/RegisterVendorScreen';
import { VendorDocumentsScreen } from '../../modules/facilityOps/screens/VendorDocumentsScreen';
import { AmcContractListScreen } from '../../modules/facilityOps/screens/AmcContractListScreen';
import { AmcContractDetailScreen } from '../../modules/facilityOps/screens/AmcContractDetailScreen';
import { AmcRenewalRemindersScreen } from '../../modules/facilityOps/screens/AmcRenewalRemindersScreen';
import { AssetRegisterScreen } from '../../modules/facilityOps/screens/AssetRegisterScreen';
import { AssetDetailScreen } from '../../modules/facilityOps/screens/AssetDetailScreen';
import { AssetDocumentsScreen } from '../../modules/facilityOps/screens/AssetDocumentsScreen';
import { PreventiveMaintenanceScheduleScreen } from '../../modules/facilityOps/screens/PreventiveMaintenanceScheduleScreen';
import { WorkOrderListScreen } from '../../modules/facilityOps/screens/WorkOrderListScreen';
import { CreateWorkOrderScreen } from '../../modules/facilityOps/screens/CreateWorkOrderScreen';
import { WorkOrderDetailScreen } from '../../modules/facilityOps/screens/WorkOrderDetailScreen';
import { ServiceHistoryScreen } from '../../modules/facilityOps/screens/ServiceHistoryScreen';
import { InventoryListScreen } from '../../modules/facilityOps/screens/InventoryListScreen';
import { InventoryTransactionScreen } from '../../modules/facilityOps/screens/InventoryTransactionScreen';
import { PurchaseRequestScreen } from '../../modules/facilityOps/screens/PurchaseRequestScreen';
import { VendorScorecardScreen } from '../../modules/facilityOps/screens/VendorScorecardScreen';
import { ComplianceExpiryDashboardScreen } from '../../modules/facilityOps/screens/ComplianceExpiryDashboardScreen';
import { AssetBreakdownReportScreen } from '../../modules/facilityOps/screens/AssetBreakdownReportScreen';
import { StaffAttendanceStack } from './StaffAttendanceStack';
import { FacilityAccountScreen } from '../../modules/profile/screens/RoleAccountScreen';

import { RouteGuard } from '../../core/permissions/RouteGuard';
import { DepartmentChatStack } from './DepartmentChatStack';

const Stack = createNativeStackNavigator<FacilityOpsStackParamList>();
const options = { headerShown: false, animation: 'slide_from_right' as const, animationDuration: 220 };

export function FacilityNavigator() {
  return (
    <RouteGuard permission="FACILITY_OPS_VIEW">
      <Stack.Navigator screenOptions={options}>
        <Stack.Screen name="FacilityOpsHome" component={FacilityOpsHomeScreen} />
        <Stack.Screen name="FacilityProfile" component={FacilityAccountScreen} />
        <Stack.Screen name="VendorDirectory" component={VendorDirectoryScreen} />
        <Stack.Screen name="VendorDetail" component={VendorDetailScreen} />
        <Stack.Screen name="RegisterVendor" component={RegisterVendorScreen} />
        <Stack.Screen name="VendorDocuments" component={VendorDocumentsScreen} />
        <Stack.Screen name="AmcContractList" component={AmcContractListScreen} />
        <Stack.Screen name="AmcContractDetail" component={AmcContractDetailScreen} />
        <Stack.Screen name="AmcRenewalReminders" component={AmcRenewalRemindersScreen} />
        <Stack.Screen name="AssetRegister" component={AssetRegisterScreen} />
        <Stack.Screen name="AssetDetail" component={AssetDetailScreen} />
        <Stack.Screen name="AssetDocuments" component={AssetDocumentsScreen} />
        <Stack.Screen name="PreventiveMaintenanceSchedule" component={PreventiveMaintenanceScheduleScreen} />
        <Stack.Screen name="WorkOrderList" component={WorkOrderListScreen} />
        <Stack.Screen name="CreateWorkOrder" component={CreateWorkOrderScreen} />
        <Stack.Screen name="WorkOrderDetail" component={WorkOrderDetailScreen} />
        <Stack.Screen name="ServiceHistory" component={ServiceHistoryScreen} />
        <Stack.Screen name="InventoryList" component={InventoryListScreen} />
        <Stack.Screen name="InventoryTransaction" component={InventoryTransactionScreen} />
        <Stack.Screen name="PurchaseRequest" component={PurchaseRequestScreen} />
        <Stack.Screen name="VendorScorecard" component={VendorScorecardScreen} />
        <Stack.Screen name="ComplianceExpiryDashboard" component={ComplianceExpiryDashboardScreen} />
        <Stack.Screen name="AssetBreakdownReport" component={AssetBreakdownReportScreen} />
        <Stack.Screen name="StaffAttendanceStack" component={StaffAttendanceStack} />
        <Stack.Screen name="DepartmentChat" component={DepartmentChatStack} />
      </Stack.Navigator>
    </RouteGuard>
  );
}

export default FacilityNavigator;
