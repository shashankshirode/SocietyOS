import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuthSession } from '../../../core/auth/useAuthSession';
import { MOCK_PERSONAS } from '../../../core/identity/personaRegistry';
import { SafeText } from '../../../shared/components/SafeText';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { AppBottomSheet } from '../../../ui/bottomSheet';

interface PersonaSwitcherSheetProps {
  visible: boolean;
  onClose: () => void;
}

const PERSONA_OPTIONS: {
  key: keyof typeof MOCK_PERSONAS;
  name: string;
  roleLabel: string;
  unitOrScope: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    key: 'rohan',
    name: 'Rohan Sharma',
    roleLabel: 'Primary Owner & Household Admin',
    unitOrScope: 'Palm Grove · Unit B-804',
    icon: 'home',
  },
  {
    key: 'sunita',
    name: 'Sunita Sharma',
    roleLabel: 'Family Member (Daily Capabilities)',
    unitOrScope: 'Palm Grove · Unit B-804',
    icon: 'people',
  },
  {
    key: 'amit',
    name: 'Amit Sharma',
    roleLabel: 'Family Member (Restricted)',
    unitOrScope: 'Palm Grove · Unit B-804',
    icon: 'person',
  },
  {
    key: 'priya',
    name: 'Priya Mehta',
    roleLabel: 'Active Tenant & Household Admin',
    unitOrScope: 'Palm Grove · Unit A-302',
    icon: 'key',
  },
  {
    key: 'vikram',
    name: 'Vikram Singh',
    roleLabel: 'Security Guard',
    unitOrScope: 'Main Gate Security Post',
    icon: 'shield',
  },
  {
    key: 'rajesh',
    name: 'Rajesh Varma',
    roleLabel: 'Facility Manager',
    unitOrScope: 'Clubhouse & Work Orders',
    icon: 'construct',
  },
  {
    key: 'meera',
    name: 'Meera Iyer',
    roleLabel: 'Treasurer & Accounts',
    unitOrScope: 'Society Finance & Invoicing',
    icon: 'wallet',
  },
  {
    key: 'suresh',
    name: 'Suresh Kulkarni',
    roleLabel: 'Society Admin & Secretary',
    unitOrScope: 'Management Committee',
    icon: 'ribbon',
  },
];

export function PersonaSwitcherSheet({ visible, onClose }: PersonaSwitcherSheetProps) {
  const { theme, semantic } = useAppTheme();
  const { session, startMockSessionForPersona } = useAuthSession();

  const handleSelect = async (key: keyof typeof MOCK_PERSONAS) => {
    await startMockSessionForPersona(key);
    onClose();
  };

  const header = (
    <View style={styles.header}>
      <SafeText variant="h3">Switch Active Persona</SafeText>
      <SafeText variant="caption" color="secondary">
        Test roles, capabilities, shared household state, and actor attribution
      </SafeText>
    </View>
  );

  return (
    <AppBottomSheet visible={visible} onClose={onClose} header={header}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {PERSONA_OPTIONS.map((item) => {
          const isSelected = session?.userId === MOCK_PERSONAS[item.key].user.id;
          return (
            <Pressable
              key={item.key}
              onPress={() => void handleSelect(item.key)}
              style={[
                styles.item,
                {
                  borderColor: isSelected ? semantic.accent.moss : semantic.border.subtle,
                  backgroundColor: isSelected ? semantic.surface.focus : semantic.surface.soft,
                },
              ]}
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: isSelected ? semantic.accent.moss : semantic.surface.soft },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={isSelected ? '#FFFFFF' : semantic.text.secondary}
                />
              </View>
              <View style={styles.meta}>
                <View style={styles.nameRow}>
                  <SafeText variant="bodyStrong">{item.name}</SafeText>
                  {isSelected && (
                    <View style={[styles.badge, { backgroundColor: semantic.accent.moss }]}>
                      <SafeText variant="tiny" style={{ color: '#FFFFFF' }}>ACTIVE</SafeText>
                    </View>
                  )}
                </View>
                <SafeText variant="caption" style={{ color: semantic.text.secondary }}>
                  {item.roleLabel}
                </SafeText>
                <SafeText variant="tiny" style={{ color: semantic.text.tertiary, marginTop: 2 }}>
                  {item.unitOrScope}
                </SafeText>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  scroll: {
    maxHeight: 480,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
});
