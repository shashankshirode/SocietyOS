import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { StaffAttendanceStackParamList } from './navigation.types';

import { StaffAttendanceHomeScreen } from '../../modules/staffAttendance/screens/StaffAttendanceHomeScreen';
import { StaffDirectoryScreen } from '../../modules/staffAttendance/screens/StaffDirectoryScreen';
import { StaffDetailScreen } from '../../modules/staffAttendance/screens/StaffDetailScreen';
import { RegisterStaffScreen } from '../../modules/staffAttendance/screens/RegisterStaffScreen';
import { DomesticHelpDirectoryScreen } from '../../modules/staffAttendance/screens/DomesticHelpDirectoryScreen';
import { DomesticHelpDetailScreen } from '../../modules/staffAttendance/screens/DomesticHelpDetailScreen';
import { DomesticHelpVerificationScreen } from '../../modules/staffAttendance/screens/DomesticHelpVerificationScreen';
import { ShiftManagementScreen } from '../../modules/staffAttendance/screens/ShiftManagementScreen';
import { ShiftAssignmentScreen } from '../../modules/staffAttendance/screens/ShiftAssignmentScreen';
import { DailyAttendanceDashboardScreen } from '../../modules/staffAttendance/screens/DailyAttendanceDashboardScreen';
import { AttendancePunchListScreen } from '../../modules/staffAttendance/screens/AttendancePunchListScreen';
import { ManualAttendanceEntryScreen } from '../../modules/staffAttendance/screens/ManualAttendanceEntryScreen';
import { AttendanceCorrectionRequestScreen } from '../../modules/staffAttendance/screens/AttendanceCorrectionRequestScreen';
import { AttendanceCorrectionApprovalScreen } from '../../modules/staffAttendance/screens/AttendanceCorrectionApprovalScreen';
import { MonthlyAttendanceReportScreen } from '../../modules/staffAttendance/screens/MonthlyAttendanceReportScreen';
import { VendorAttendanceReportScreen } from '../../modules/staffAttendance/screens/VendorAttendanceReportScreen';
import { StaffAttendanceDetailScreen } from '../../modules/staffAttendance/screens/StaffAttendanceDetailScreen';
import { BiometricDeviceListScreen } from '../../modules/staffAttendance/screens/BiometricDeviceListScreen';
import { BiometricDeviceDetailScreen } from '../../modules/staffAttendance/screens/BiometricDeviceDetailScreen';
import { BiometricStaffMappingScreen } from '../../modules/staffAttendance/screens/BiometricStaffMappingScreen';
import { BiometricSyncJobLogsScreen } from '../../modules/staffAttendance/screens/BiometricSyncJobLogsScreen';
import { BiometricSyncErrorReviewScreen } from '../../modules/staffAttendance/screens/BiometricSyncErrorReviewScreen';
import { DuplicatePunchReviewScreen } from '../../modules/staffAttendance/screens/DuplicatePunchReviewScreen';
import { MissingCheckoutReviewScreen } from '../../modules/staffAttendance/screens/MissingCheckoutReviewScreen';
import { StaffIdCardScreen } from '../../modules/staffAttendance/screens/StaffIdCardScreen';
import { AttendanceSettingsScreen } from '../../modules/staffAttendance/screens/AttendanceSettingsScreen';
import { ManageStaffChannelsScreen } from '../../modules/staffManagement/screens/ManageStaffChannelsScreen';

const Stack = createNativeStackNavigator<StaffAttendanceStackParamList>();
const options = { headerShown: false, animation: 'slide_from_right' as const, animationDuration: 220 };

export function StaffAttendanceStack() {
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen name="StaffAttendanceHome" component={StaffAttendanceHomeScreen} />
      <Stack.Screen name="StaffDirectory" component={StaffDirectoryScreen} />
      <Stack.Screen name="StaffDetail" component={StaffDetailScreen} />
      <Stack.Screen name="RegisterStaff" component={RegisterStaffScreen} />
      <Stack.Screen name="DomesticHelpDirectory" component={DomesticHelpDirectoryScreen} />
      <Stack.Screen name="DomesticHelpDetail" component={DomesticHelpDetailScreen} />
      <Stack.Screen name="DomesticHelpVerification" component={DomesticHelpVerificationScreen} />
      <Stack.Screen name="ShiftManagement" component={ShiftManagementScreen} />
      <Stack.Screen name="ShiftAssignment" component={ShiftAssignmentScreen} />
      <Stack.Screen name="DailyAttendanceDashboard" component={DailyAttendanceDashboardScreen} />
      <Stack.Screen name="AttendancePunchList" component={AttendancePunchListScreen} />
      <Stack.Screen name="ManualAttendanceEntry" component={ManualAttendanceEntryScreen} />
      <Stack.Screen name="AttendanceCorrectionRequest" component={AttendanceCorrectionRequestScreen} />
      <Stack.Screen name="AttendanceCorrectionApproval" component={AttendanceCorrectionApprovalScreen} />
      <Stack.Screen name="MonthlyAttendanceReport" component={MonthlyAttendanceReportScreen} />
      <Stack.Screen name="VendorAttendanceReport" component={VendorAttendanceReportScreen} />
      <Stack.Screen name="StaffAttendanceDetail" component={StaffAttendanceDetailScreen} />
      <Stack.Screen name="BiometricDeviceList" component={BiometricDeviceListScreen} />
      <Stack.Screen name="BiometricDeviceDetail" component={BiometricDeviceDetailScreen} />
      <Stack.Screen name="BiometricStaffMapping" component={BiometricStaffMappingScreen} />
      <Stack.Screen name="BiometricSyncJobLogs" component={BiometricSyncJobLogsScreen} />
      <Stack.Screen name="BiometricSyncErrorReview" component={BiometricSyncErrorReviewScreen} />
      <Stack.Screen name="DuplicatePunchReview" component={DuplicatePunchReviewScreen} />
      <Stack.Screen name="MissingCheckoutReview" component={MissingCheckoutReviewScreen} />
      <Stack.Screen name="StaffIdCard" component={StaffIdCardScreen} />
      <Stack.Screen name="AttendanceSettings" component={AttendanceSettingsScreen} />
      <Stack.Screen name="ManageStaffChannels" component={ManageStaffChannelsScreen} />
    </Stack.Navigator>
  );
}
