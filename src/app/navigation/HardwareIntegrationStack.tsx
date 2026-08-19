import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HardwareIntegrationStackParamList } from './navigation.types';


import { HardwareHomeScreen } from '../../modules/hardwareIntegration/screens/HardwareHomeScreen';
import { DeviceRegistryScreen } from '../../modules/hardwareIntegration/screens/DeviceRegistryScreen';
import { HardwareDeviceDetailScreen } from '../../modules/hardwareIntegration/screens/HardwareDeviceDetailScreen';
import { RegisterHardwareDeviceScreen } from '../../modules/hardwareIntegration/screens/RegisterHardwareDeviceScreen';
import { DeviceLocationMappingScreen } from '../../modules/hardwareIntegration/screens/DeviceLocationMappingScreen';
import { GateHardwareDashboardScreen } from '../../modules/hardwareIntegration/screens/GateHardwareDashboardScreen';
import { RfidReadinessScreen } from '../../modules/hardwareIntegration/screens/RfidReadinessScreen';
import { RfidTagMappingScreen } from '../../modules/hardwareIntegration/screens/RfidTagMappingScreen';
import { AnprReadinessScreen } from '../../modules/hardwareIntegration/screens/AnprReadinessScreen';
import { AnprVehicleMatchReviewScreen } from '../../modules/hardwareIntegration/screens/AnprVehicleMatchReviewScreen';
import { BoomBarrierPlaceholderScreen } from '../../modules/hardwareIntegration/screens/BoomBarrierPlaceholderScreen';
import { CctvAccessPlaceholderScreen } from '../../modules/hardwareIntegration/screens/CctvAccessPlaceholderScreen';
import { CctvCameraRegistryScreen } from '../../modules/hardwareIntegration/screens/CctvCameraRegistryScreen';
import { SmartMeterDashboardScreen } from '../../modules/hardwareIntegration/screens/SmartMeterDashboardScreen';
import { SmartMeterReadingDetailScreen } from '../../modules/hardwareIntegration/screens/SmartMeterReadingDetailScreen';
import { MeterReadingImportPlaceholderScreen } from '../../modules/hardwareIntegration/screens/MeterReadingImportPlaceholderScreen';
import { EvChargingDashboardScreen } from '../../modules/hardwareIntegration/screens/EvChargingDashboardScreen';
import { EvChargerDetailScreen } from '../../modules/hardwareIntegration/screens/EvChargerDetailScreen';
import { EvChargingSessionPlaceholderScreen } from '../../modules/hardwareIntegration/screens/EvChargingSessionPlaceholderScreen';
import { BiometricConnectorAlignmentScreen } from '../../modules/hardwareIntegration/screens/BiometricConnectorAlignmentScreen';
import { HardwareSyncJobLogsScreen } from '../../modules/hardwareIntegration/screens/HardwareSyncJobLogsScreen';
import { HardwareEventLogsScreen } from '../../modules/hardwareIntegration/screens/HardwareEventLogsScreen';
import { HardwareErrorReviewScreen } from '../../modules/hardwareIntegration/screens/HardwareErrorReviewScreen';
import { IntegrationHealthDashboardScreen } from '../../modules/hardwareIntegration/screens/IntegrationHealthDashboardScreen';
import { DevicePermissionMatrixScreen } from '../../modules/hardwareIntegration/screens/DevicePermissionMatrixScreen';
import { HardwarePrivacyRulesScreen } from '../../modules/hardwareIntegration/screens/HardwarePrivacyRulesScreen';
import { HardwareAuditLogScreen } from '../../modules/hardwareIntegration/screens/HardwareAuditLogScreen';
import { HardwareSettingsScreen } from '../../modules/hardwareIntegration/screens/HardwareSettingsScreen';

const Stack = createNativeStackNavigator<HardwareIntegrationStackParamList>();
const options = { headerShown: false, animation: 'slide_from_right' as const, animationDuration: 220 };

export function HardwareIntegrationStack() {
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen name="HardwareHome" component={HardwareHomeScreen} />
      <Stack.Screen name="DeviceRegistry" component={DeviceRegistryScreen} />
      <Stack.Screen name="HardwareDeviceDetail" component={HardwareDeviceDetailScreen} />
      <Stack.Screen name="RegisterHardwareDevice" component={RegisterHardwareDeviceScreen} />
      <Stack.Screen name="DeviceLocationMapping" component={DeviceLocationMappingScreen} />
      <Stack.Screen name="GateHardwareDashboard" component={GateHardwareDashboardScreen} />
      <Stack.Screen name="RfidReadiness" component={RfidReadinessScreen} />
      <Stack.Screen name="RfidTagMapping" component={RfidTagMappingScreen} />
      <Stack.Screen name="AnprReadiness" component={AnprReadinessScreen} />
      <Stack.Screen name="AnprVehicleMatchReview" component={AnprVehicleMatchReviewScreen} />
      <Stack.Screen name="BoomBarrierPlaceholder" component={BoomBarrierPlaceholderScreen} />
      <Stack.Screen name="CctvAccessPlaceholder" component={CctvAccessPlaceholderScreen} />
      <Stack.Screen name="CctvCameraRegistry" component={CctvCameraRegistryScreen} />
      <Stack.Screen name="SmartMeterDashboard" component={SmartMeterDashboardScreen} />
      <Stack.Screen name="SmartMeterReadingDetail" component={SmartMeterReadingDetailScreen} />
      <Stack.Screen name="MeterReadingImportPlaceholder" component={MeterReadingImportPlaceholderScreen} />
      <Stack.Screen name="EvChargingDashboard" component={EvChargingDashboardScreen} />
      <Stack.Screen name="EvChargerDetail" component={EvChargerDetailScreen} />
      <Stack.Screen name="EvChargingSessionPlaceholder" component={EvChargingSessionPlaceholderScreen} />
      <Stack.Screen name="BiometricConnectorAlignment" component={BiometricConnectorAlignmentScreen} />
      <Stack.Screen name="HardwareSyncJobLogs" component={HardwareSyncJobLogsScreen} />
      <Stack.Screen name="HardwareEventLogs" component={HardwareEventLogsScreen} />
      <Stack.Screen name="HardwareErrorReview" component={HardwareErrorReviewScreen} />
      <Stack.Screen name="IntegrationHealthDashboard" component={IntegrationHealthDashboardScreen} />
      <Stack.Screen name="DevicePermissionMatrix" component={DevicePermissionMatrixScreen} />
      <Stack.Screen name="HardwarePrivacyRules" component={HardwarePrivacyRulesScreen} />
      <Stack.Screen name="HardwareAuditLog" component={HardwareAuditLogScreen} />
      <Stack.Screen name="HardwareSettings" component={HardwareSettingsScreen} />
    </Stack.Navigator>
  );
}
