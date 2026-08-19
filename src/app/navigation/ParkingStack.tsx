import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ParkingHomeScreen } from '../../modules/resident/parking/screens/ParkingHomeScreen';
import { MyVehiclesScreen } from '../../modules/resident/parking/screens/MyVehiclesScreen';
import { VehicleDetailScreen } from '../../modules/resident/parking/screens/VehicleDetailScreen';
import { AddVehicleScreen } from '../../modules/resident/parking/screens/AddVehicleScreen';
import { ParkingSlotDetailScreen } from '../../modules/resident/parking/screens/ParkingSlotDetailScreen';
import { VisitorParkingRequestScreen } from '../../modules/resident/parking/screens/VisitorParkingRequestScreen';
import { VisitorParkingPassDetailScreen } from '../../modules/resident/parking/screens/VisitorParkingPassDetailScreen';
import { WrongParkingReportScreen } from '../../modules/resident/parking/screens/WrongParkingReportScreen';
import { VehicleBlockingReportScreen } from '../../modules/resident/parking/screens/VehicleBlockingReportScreen';
import { ParkingIncidentListScreen } from '../../modules/resident/parking/screens/ParkingIncidentListScreen';
import { ParkingIncidentDetailScreen } from '../../modules/resident/parking/screens/ParkingIncidentDetailScreen';
import { ParkingViolationHistoryScreen } from '../../modules/resident/parking/screens/ParkingViolationHistoryScreen';
import { ParkingStickerRfidScreen } from '../../modules/resident/parking/screens/ParkingStickerRfidScreen';
import { ParkingRulesScreen } from '../../modules/resident/parking/screens/ParkingRulesScreen';
import { ParkingAccessReadinessScreen } from '../../modules/resident/parking/screens/ParkingAccessReadinessScreen';
import type { ParkingStackParamList } from './navigation.types';

const Stack = createNativeStackNavigator<ParkingStackParamList>();

const stackScreenOptions = {
  headerShown: false,
  animation: 'slide_from_right' as const,
  animationDuration: 220,
};

export function ParkingStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="ParkingHome" component={ParkingHomeScreen} />
      <Stack.Screen name="MyVehicles" component={MyVehiclesScreen} />
      <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
      <Stack.Screen name="AddVehicle" component={AddVehicleScreen} />
      <Stack.Screen name="ParkingSlotDetail" component={ParkingSlotDetailScreen} />
      <Stack.Screen name="VisitorParkingRequest" component={VisitorParkingRequestScreen} />
      <Stack.Screen name="VisitorParkingPassDetail" component={VisitorParkingPassDetailScreen} />
      <Stack.Screen name="WrongParkingReport" component={WrongParkingReportScreen} />
      <Stack.Screen name="VehicleBlockingReport" component={VehicleBlockingReportScreen} />
      <Stack.Screen name="ParkingIncidentList" component={ParkingIncidentListScreen} />
      <Stack.Screen name="ParkingIncidentDetail" component={ParkingIncidentDetailScreen} />
      <Stack.Screen name="ParkingViolationHistory" component={ParkingViolationHistoryScreen} />
      <Stack.Screen name="ParkingStickerRfid" component={ParkingStickerRfidScreen} />
      <Stack.Screen name="ParkingRules" component={ParkingRulesScreen} />
      <Stack.Screen name="ParkingAccessReadiness" component={ParkingAccessReadinessScreen} />
    </Stack.Navigator>
  );
}
