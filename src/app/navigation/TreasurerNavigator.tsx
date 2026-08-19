import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { TreasurerStackParamList } from './navigation.types';

import { TreasurerDashboardScreen } from '../../modules/accounting/screens/TreasurerDashboardScreen';
import { ChargeHeadListScreen } from '../../modules/accounting/screens/ChargeHeadListScreen';
import { BillingCycleListScreen } from '../../modules/accounting/screens/BillingCycleListScreen';
import { DraftBillReviewScreen } from '../../modules/accounting/screens/DraftBillReviewScreen';
import { FlatLedgerScreen } from '../../modules/accounting/screens/FlatLedgerScreen';
import { ManualPaymentEntryScreen } from '../../modules/accounting/screens/ManualPaymentEntryScreen';
import { ReceiptDetailScreen } from '../../modules/accounting/screens/ReceiptDetailScreen';
import { DefaulterReportScreen } from '../../modules/accounting/screens/DefaulterReportScreen';
import { TreasurerAccountScreen } from '../../modules/profile/screens/RoleAccountScreen';

import { RouteGuard } from '../../core/permissions/RouteGuard';
import { DepartmentChatStack } from './DepartmentChatStack';

const Stack = createNativeStackNavigator<TreasurerStackParamList>();
const options = { headerShown: false, animation: 'slide_from_right' as const, animationDuration: 220 };

export function TreasurerNavigator() {
  return (
    <RouteGuard permission="BILL_VIEW">
      <Stack.Navigator screenOptions={options}>
        <Stack.Screen name="TreasurerHome" component={TreasurerDashboardScreen} />
        <Stack.Screen name="TreasurerProfile" component={TreasurerAccountScreen} />
        <Stack.Screen name="ChargeHeads" component={ChargeHeadListScreen} />
        <Stack.Screen name="BillingCycles" component={BillingCycleListScreen} />
        <Stack.Screen name="DraftBillReview" component={DraftBillReviewScreen} />
        <Stack.Screen name="FlatLedger" component={FlatLedgerScreen} />
        <Stack.Screen name="ManualPaymentEntry" component={ManualPaymentEntryScreen} />
        <Stack.Screen name="ReceiptDetail" component={ReceiptDetailScreen} />
        <Stack.Screen name="DefaulterReport" component={DefaulterReportScreen} />
        <Stack.Screen name="DepartmentChat" component={DepartmentChatStack} />
      </Stack.Navigator>
    </RouteGuard>
  );
}

export default TreasurerNavigator;
