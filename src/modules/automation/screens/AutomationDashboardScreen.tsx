import React from 'react';
import { ScrollView, Text, View, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../../shared/constants/colors';
import { ScreenContainer } from '../../../shared/layouts/ScreenContainer';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';

export function AutomationDashboardScreen({ navigation }: { navigation: any }) {
  const localizedUiText = useGeneratedUiMessages().uiLiterals;
  const { colors } = useAppTheme();

  const stats = [
    { label: localizedUiText.m_automation_active_rules || 'Active Rules', value: '12', color: Colors.primary },
    { label: localizedUiText.m_automation_executions_today || 'Executions Today', value: '47', color: Colors.success },
    { label: localizedUiText.m_automation_pending_approvals || 'Pending Approvals', value: '3', color: Colors.warning },
    { label: localizedUiText.m_automation_ai_requests || 'AI Requests', value: '89', color: Colors.info },
  ];

  const capabilities = [
    { name: localizedUiText.m_capability_complaint_routing || 'Smart Complaint Routing', icon: 'mail-open', route: 'ComplaintRouting', status: 'ENABLED' },
    { name: localizedUiText.m_capability_notice_drafting || 'Automated Notice Drafting', icon: 'document-text', route: 'NoticeDrafting', status: 'ENABLED' },
    { name: localizedUiText.m_capability_document_search || 'Smart Document Search', icon: 'search', route: 'DocumentSearch', status: 'ENABLED' },
    { name: localizedUiText.m_capability_bill_explanation || 'Bill Explanation', icon: 'cash', route: 'BillExplanation', status: 'ENABLED' },
    { name: localizedUiText.m_capability_meeting_summary || 'Meeting Summary', icon: 'people', route: 'MeetingSummary', status: 'ENABLED' },
    { name: localizedUiText.m_capability_maintenance_risk || 'Maintenance Risk Alerts', icon: 'alert-circle', route: 'MaintenanceRisk', status: 'ENABLED' },
  ];

  return (
    <ScreenContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={{ fontSize: 20, fontWeight: '600', color: colors.textPrimary, marginLeft: 12 }}>
            {localizedUiText.m_automation_dashboard_title || 'Automation Dashboard'}
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>
            {localizedUiText.m_automation_overview || 'Overview'}
          </Text>

          <FlatList
            data={stats}
            numColumns={2}
            renderItem={({ item }) => (
              <View style={{
                flex: 1,
                margin: 4,
                padding: 16,
                backgroundColor: colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
              }}>
                <Text style={{ fontSize: 28, fontWeight: '700', color: item.color }}>{item.value}</Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>{item.label}</Text>
              </View>
            )}
            keyExtractor={item => item.label}
          />

          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginTop: 24, marginBottom: 12 }}>
            {localizedUiText.m_automation_capabilities || 'Capabilities'}
          </Text>

          <FlatList
            data={capabilities}
            renderItem={({ item }) => (
              <Pressable
                style={{
                  padding: 16,
                  marginBottom: 8,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => navigation.navigate(item.route as any)}
              >
                <View style={{ marginRight: 12 }}>
                  <Ionicons name={item.icon} size={24} color={item.status === 'ENABLED' ? Colors.success : Colors.textSecondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: colors.textPrimary }}>{item.name}</Text>
                  <Text style={{ fontSize: 12, color: item.status === 'ENABLED' ? Colors.success : Colors.textSecondary }}>
                    {item.status}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </Pressable>
            )}
            keyExtractor={item => item.name}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', color: colors.textSecondary, padding: 32 }}>
                {localizedUiText.m_no_capabilities || 'No capabilities available'}
              </Text>
            }
          />
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
}