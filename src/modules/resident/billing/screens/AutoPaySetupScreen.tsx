import React, { useState } from 'react';
import { View, Switch, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BillStackParamList } from '../../../../app/navigation/navigation.types';
import { SafeText } from '../../../../shared/components/SafeText';
import { SocietyScreen } from '../../../../shared/components/SocietyScreen';
import { SocietyDetailHeader } from '../../../../shared/components/SocietyDetailHeader';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';

type Props = NativeStackScreenProps<BillStackParamList, 'AutoPaySetup'>;

export function AutoPaySetupScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [autoPayEnabled, setAutoPayEnabled] = useState(true);

  return (
    <SocietyScreen testID="auto-pay-setup-screen">
      <SocietyDetailHeader
        title="Auto Pay"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + 20,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Toggle Card */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 3,
            elevation: 1,
          }}
        >
          <View style={{ flex: 1, paddingRight: 16 }}>
            <SafeText
              variant="bodyStrong"
              style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '600' }}
            >
              Enable auto-pay for maintenance bills
            </SafeText>
          </View>
          <Switch
            value={autoPayEnabled}
            onValueChange={setAutoPayEnabled}
            trackColor={{ false: colors.border, true: '#064F43' }}
            thumbColor="#FFFFFF"
            testID="auto-pay-toggle"
          />
        </View>

        {/* Informational Callout */}
        <View
          style={{
            backgroundColor: '#F0F9FF',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#BAE6FD',
            padding: 18,
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 12,
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: '#E0F2FE',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="information-circle" size={18} color="#0284C7" />
          </View>
          <View style={{ flex: 1 }}>
            <SafeText
              variant="body"
              style={{ color: '#0369A1', fontSize: 14, lineHeight: 20 }}
            >
              Bills will be paid automatically using your default payment method 3 days before due date.
            </SafeText>
          </View>
        </View>
      </ScrollView>
    </SocietyScreen>
  );
}

export default AutoPaySetupScreen;
