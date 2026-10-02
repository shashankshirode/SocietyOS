import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenContainer } from '../../../shared/layouts/ScreenContainer';
import { ResponsivePageHeader } from '../../../shared/layouts/ResponsivePageHeader';
import { AppButton } from '../../../shared/components/AppButton';
import { AppCard } from '../../../shared/cards/AppCard';
import { AppIcon } from '../../../shared/icons/AppIcon';
import { SectionHeader } from '../../../shared/components/SectionHeader';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { EmptyState } from '../../../shared/components/EmptyState';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';
import { formatUiLiteral } from '../../../shared/localization/formatUiLiteral';
import { getActiveUiLiteral } from '../../../shared/localization/activeUiLiteral';
import { usePhases, useTowers, useWings, useFloors, usePropertyTree } from '../hooks/usePropertyHierarchy';
import type { Phase, Tower, Wing, Floor, PropertyHierarchyNode, PropertyHierarchyLevel } from '../data/societyProperty.types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';

type Props = {
  navigation: NativeStackNavigationProp<SuperAdminStackParamList, 'PROPERTY_HIERARCHY'>;
  route: RouteProp<SuperAdminStackParamList, 'PROPERTY_HIERARCHY'>;
};

const LEVEL_ICONS: Record<PropertyHierarchyLevel, string> = {
  SOCIETY: 'business',
  PHASE: 'layers',
  TOWER: 'home',
  BLOCK: 'grid',
  WING: 'grid',
  FLOOR: 'layers',
  UNIT: 'home',
};

const LEVEL_LABELS: Record<PropertyHierarchyLevel, string> = {
  SOCIETY: 'Society',
  PHASE: 'Phase',
  TOWER: 'Tower',
  BLOCK: 'Block',
  WING: 'Wing',
  FLOOR: 'Floor',
  UNIT: 'Unit',
};

export function PropertyHierarchyScreen({ navigation, route }: Props) {
  const { societyId } = route.params;
  const localizedUiText = useGeneratedUiMessages().uiLiterals;
  const { colors } = useAppTheme();
  const [activeTab, setActiveTab] = useState<PropertyHierarchyLevel>('PHASE');
  const [tree, setTree] = useState<PropertyHierarchyNode | null>(null);

  const { phases, isLoading: phasesLoading, error: phasesError, load: loadPhases, create: createPhase } = usePhases(societyId);
  const { towers, isLoading: towersLoading, error: towersError, load: loadTowers, create: createTower } = useTowers(societyId);
  const { load: loadTree } = usePropertyTree(societyId);

  useEffect(() => {
    loadPhases();
    loadTowers();
    loadTree();
  }, [loadPhases, loadTowers, loadTree]);

  const renderTreeNode = (node: PropertyHierarchyNode, depth: number = 0): React.ReactNode => {
    const children = node.children?.map((child) => renderTreeNode(child, depth + 1)) || [];
    const icon = LEVEL_ICONS[node.level];
    const isActive = activeTab === node.level && node.level !== 'SOCIETY';

    return (
      <View key={node.id} style={styles.treeNode}>
        <TouchableOpacity
          style={[styles.treeItem, { paddingLeft: depth * 20 + 12, backgroundColor: isActive ? colors.primarySoft : 'transparent' }]}
          onPress={() => {
            if (node.level !== 'SOCIETY' && node.level !== 'UNIT') {
              setActiveTab(node.level);
            }
          }}
        >
          <AppIcon name={icon} size={20} color={isActive ? colors.primary : colors.textSecondary} style={{ marginRight: 8 }} />
          <Text style={{ flex: 1, color: isActive ? colors.primary : colors.textPrimary, fontWeight: isActive ? '600' : '400' }}>
            {node.name}
          </Text>
          {node.children && node.children.length > 0 && (
            <AppIcon name="chevronDown" size={16} color={colors.textMuted} />
          )}
        </TouchableOpacity>
        {children}
      </View>
    );
  };

  const renderAddForm = () => {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    const extraFields = activeTab === 'TOWER' ? (
      <>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
          <AppButton
            title="Wings"
            onPress={() => {}}
            variant="outline"
            size="sm"
            style={{ flex: 1 }}
          />
          <AppButton
            title="Floors"
            onPress={() => {}}
            variant="outline"
            size="sm"
            style={{ flex: 1 }}
          />
          <AppButton
            title="Units/Floor"
            onPress={() => {}}
            variant="outline"
            size="sm"
            style={{ flex: 1 }}
          />
        </View>
      </>
    ) : null;

    return (
      <AppCard style={{ marginBottom: 16 }}>
        <SectionHeader title={formatUiLiteral(getActiveUiLiteral("m_54f5e6613f85"), [LEVEL_LABELS[activeTab]])} />
        <View style={{ gap: 12 }}>
          <AppCard style={{ padding: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary, marginBottom: 8 }}>Name</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, fontSize: 16 }}
              value={name}
              onChangeText={setName}
              placeholder={formatUiLiteral(getActiveUiLiteral("m_351186298fc9"), [LEVEL_LABELS[activeTab]])}
            />
            <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary, marginTop: 12, marginBottom: 8 }}>Code</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, fontSize: 16 }}
              value={code}
              onChangeText={setCode}
              placeholder={formatUiLiteral(getActiveUiLiteral("m_22021f209024"), [LEVEL_LABELS[activeTab]])}
            />
          </AppCard>
          {extraFields}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <AppButton
              title={getActiveUiLiteral("m_6aadac2f2b7a")}
              onPress={() => {}}
              variant="outline"
              style={{ flex: 1 }}
            />
            <AppButton
              title={getActiveUiLiteral("m_1282d9db3fce")}
              onPress={() => {
                if (activeTab === 'PHASE') {
                  const phaseOrder = (tree?.children?.filter(c => c.level === 'PHASE').length ?? 0);
                  createPhase({ name, code, description: '', orderIndex: phaseOrder });
                } else if (activeTab === 'TOWER') {
                  const towerOrder = (tree?.children?.filter(c => c.level === 'TOWER').length ?? 0);
                  createTower({ name, code, phaseId: '', wingsCount: 0, floorsCount: 0, unitsPerFloor: 0, orderIndex: towerOrder });
                }
              }}
              disabled={!name || !code}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </AppCard>
    );
  };

  if (!societyId) {
    return (
      <ScreenContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <ResponsivePageHeader title={getActiveUiLiteral("m_1c027aeecfa8")} />
          <ErrorState message={getActiveUiLiteral("m_ddf785b79c42")} onRetry={() => {}} />
        </SafeAreaView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <ResponsivePageHeader
          title={getActiveUiLiteral("m_6daae40e3975")}
          subtitle={getActiveUiLiteral("m_8cc873d5ca4c")}
        />
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <View style={styles.tabs} role="tablist">
            {(['PHASE', 'TOWER', 'WING', 'FLOOR'] as PropertyHierarchyLevel[]).map((level) => (
              <TouchableOpacity
                key={level}
                role="tab"
                aria-selected={activeTab === level}
                onPress={() => setActiveTab(level)}
                style={[styles.tab, activeTab === level && styles.tabActive]}
              >
                <AppIcon name={LEVEL_ICONS[level]} size={18} color={activeTab === level ? colors.primary : colors.textSecondary} />
                <Text style={{ marginLeft: 6, color: activeTab === level ? colors.primary : colors.textSecondary, fontWeight: activeTab === level ? '600' : '400' }}>
                  {LEVEL_LABELS[level]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {tree && (
            <AppCard style={{ marginBottom: 16 }}>
              <SectionHeader title={getActiveUiLiteral("m_1a3171e93781")} />
              <View style={styles.treeContainer}>
                {renderTreeNode(tree)}
              </View>
            </AppCard>
          )}

          {renderAddForm()}

          {activeTab === 'PHASE' && (
            <AppCard>
              <SectionHeader title={formatUiLiteral(getActiveUiLiteral("m_70761c1912c0"), [LEVEL_LABELS[activeTab]])} />
              {phasesLoading ? (
                <LoadingState message={getActiveUiLiteral("m_23b87850823d")} />
              ) : phasesError ? (
                <ErrorState message={phasesError} onRetry={loadPhases} />
              ) : phases.length === 0 ? (
                <EmptyState
                  title={formatUiLiteral(getActiveUiLiteral("m_1c027aeecfa8"), [LEVEL_LABELS[activeTab]])}
                  description={getActiveUiLiteral("m_495e13ae2b3d")}
                />
              ) : (
                phases.map((phase) => (
                  <View key={phase.id} style={styles.listItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '500', color: colors.textPrimary }}>{phase.name}</Text>
                      <Text style={{ fontSize: 12, color: colors.textSecondary }}>{phase.code}</Text>
                    </View>
                    <AppButton
                      title={getActiveUiLiteral("m_bb791fe68da8")}
                      onPress={() => navigation.navigate('TOWER_WING_FLOOR_SETUP', { phaseId: phase.id })}
                      size="sm"
                      variant="outline"
                    />
                  </View>
                ))
              )}
            </AppCard>
          )}

          {activeTab === 'TOWER' && (
            <AppCard>
              <SectionHeader title={formatUiLiteral(getActiveUiLiteral("m_70761c1912c0"), [LEVEL_LABELS[activeTab]])} />
              {towersLoading ? (
                <LoadingState message={getActiveUiLiteral("m_23b87850823d")} />
              ) : towersError ? (
                <ErrorState message={towersError} onRetry={loadTowers} />
              ) : towers.length === 0 ? (
                <EmptyState
                  title={formatUiLiteral(getActiveUiLiteral("m_1c027aeecfa8"), [LEVEL_LABELS[activeTab]])}
                  description={getActiveUiLiteral("m_495e13ae2b3d")}
                />
              ) : (
                towers.map((tower) => (
                  <View key={tower.id} style={styles.listItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '500', color: colors.textPrimary }}>{tower.name}</Text>
                      <Text style={{ fontSize: 12, color: colors.textSecondary }}>{tower.code} | {tower.wingsCount} wings | {tower.floorsCount} floors | {tower.unitsPerFloor} units/floor</Text>
                    </View>
                    <AppButton
                      title={getActiveUiLiteral("m_bb791fe68da8")}
                      onPress={() => navigation.navigate('TOWER_WING_FLOOR_SETUP', { towerId: tower.id })}
                      size="sm"
                      variant="outline"
                    />
                  </View>
                ))
              )}
            </AppCard>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#F0F9FF',
  },
  treeNode: {
    marginLeft: 8,
  },
  treeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 6,
  },
  treeContainer: {
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
});