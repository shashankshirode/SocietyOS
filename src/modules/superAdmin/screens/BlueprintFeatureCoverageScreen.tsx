import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { AppIcon } from "../../../shared/icons/AppIcon";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { useBlueprintFeatureCoverage } from "../../../core/productBlueprint/useBlueprintFeatureCoverage";
import { validateBlueprintFeature } from "../../../core/productBlueprint/blueprintCoverageValidator";
import type { BlueprintFeature, BlueprintPhase, BlueprintFeatureStatus } from "../../../core/productBlueprint/blueprintFeature.types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../app/navigation/navigation.types";
import { styles, createTextColorStyle, createTextColorStyle2, createTextColorStyle3, createTouchableOpacityBackgroundColorBorderColorStyle, createTextColorStyle4, createViewBackgroundColorStyle, createTextColorStyle5, createTextColorStyle6, createTextColorStyle7, createTextColorStyle8, createTextColorStyle9, createTextColorStyle10, createViewBackgroundColorBorderColorStyle, createTextColorStyle11, createTextColorStyle12, createTextColorStyle13, createViewBackgroundColorStyle2, createViewBackgroundColorWidthStyle, createTextColorStyle14, createTextColorStyle15, createTextColorStyle16, createTextColorStyle17, createTextColorStyle18, createTextColorStyle19, createTextColorStyle20, createTextColorStyle21, createTextColorStyle22, createTextColorStyle23, createViewBackgroundColorBorderColorStyle2, createTextInputColorStyle, createTextColorStyle24, createTouchableOpacityBackgroundColorStyle, createTextColorStyle25, createTextColorStyle26, createTouchableOpacityBackgroundColorStyle2, createTextColorStyle27, createTextColorStyle28 } from "../styles/screens/BlueprintFeatureCoverageScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'BlueprintFeatureCoverage'>;
export function BlueprintFeatureCoverageScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { features, stats, searchQuery, setSearchQuery, selectedPhase, setSelectedPhase, selectedStatus, setSelectedStatus, } = useBlueprintFeatureCoverage();
    const renderFeatureCard = ({ item }: {
        item: BlueprintFeature;
    }) => {
        let statusBadgeType: 'success' | 'warning' | 'danger' | 'info' = 'success';
        if (item.status === 'PARTIAL')
            statusBadgeType = 'warning';
        else if (item.status === 'MISSING')
            statusBadgeType = 'danger';
        else if (item.status.startsWith('FRONTEND_READY'))
            statusBadgeType = 'info';
        const itemIssues = validateBlueprintFeature(item);
        const blockers = itemIssues.filter(iss => iss.severity === 'BLOCKER').length;
        return (<TouchableOpacity style={[styles.card, createTouchableOpacityBackgroundColorBorderColorStyle(colors.surface, colors.border)]} onPress={() => navigation.navigate('BlueprintFeatureDetail', { featureId: item.id })} activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <View style={styles.titleCol}>
            <Text style={[styles.featureName, createTextColorStyle4(colors.textPrimary)]}>
              {item.title}
            </Text>
            <View style={styles.badgeRow}>
              <View style={[styles.phaseTag, createViewBackgroundColorStyle(colors.surfaceSoft)]}>
                <Text style={[styles.phaseTagText, createTextColorStyle5(colors.textSecondary)]}>
                  {item.phase.replace('_', ' ')}
                </Text>
              </View>
              <StatusBadge label={item.status.replace(/_/g, ' ')} type={statusBadgeType}/>
            </View>
          </View>
          <AppIcon name="chevronRight" size={18} color={colors.textSecondary}/>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryItem, createTextColorStyle6(colors.textSecondary)]}>{localizedUiText.m_18297b836e8e}<Text style={createTextColorStyle(colors.textPrimary)}>{item.moduleName}</Text>
          </Text>
          <Text style={[styles.summaryItem, createTextColorStyle7(colors.textSecondary)]}>{localizedUiText.m_daf566894f5f}<Text style={createTextColorStyle2(colors.textPrimary)}>{item.screenNames.length}</Text>
          </Text>
          <Text style={[styles.summaryItem, createTextColorStyle8(colors.textSecondary)]}>{localizedUiText.m_bd5127e3c5ac}<Text style={createTextColorStyle3(colors.textPrimary)}>{item.requiredActions.length}</Text>
          </Text>
          {blockers > 0 ? (<Text style={[styles.summaryItem, createTextColorStyle9(colors.danger)]}>{localizedUiText.m_ca30f9d041fe}{blockers}
            </Text>) : (<Text style={[styles.summaryItem, createTextColorStyle10(colors.success)]}>{localizedUiText.m_762d297e48ec}{itemIssues.length}
            </Text>)}
        </View>
      </TouchableOpacity>);
    };
    const phases: (BlueprintPhase | 'ALL')[] = ['ALL', 'MVP', 'PHASE_1A', 'PHASE_2', 'PHASE_3', 'PHASE_4'];
    const statuses: (BlueprintFeatureStatus | 'ALL')[] = [
        'ALL',
        'IMPLEMENTED',
        'PARTIAL',
        'MISSING',
        'FRONTEND_READY_BACKEND_REQUIRED',
        'FRONTEND_READY_INTEGRATION_REQUIRED',
    ];
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ResponsivePageHeader title={localizedUiText.m_5a5997709e54} subtitle={localizedUiText.m_e806cee6d8e7}/>

        
        <View style={[styles.statsCard, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
          <View style={styles.statsRow}>
            <View>
              <Text style={[styles.statsTitle, createTextColorStyle11(colors.textSecondary)]}>{localizedUiText.m_a6a6527bb8b2}</Text>
              <Text style={[styles.statsCount, createTextColorStyle12(colors.textPrimary)]}>
                {stats.implemented} / {stats.totalFeatures}{localizedUiText.m_121e6b0cc52f}</Text>
            </View>
            <Text style={[styles.statsPercent, createTextColorStyle13(colors.success)]}>
              {stats.totalFeatures > 0 ? Math.round((stats.implemented / stats.totalFeatures) * 100) : 0}%
            </Text>
          </View>
          <View style={[styles.progressBarBg, createViewBackgroundColorStyle2(colors.border)]}>
            <View style={[
            styles.progressBarFill,
            createViewBackgroundColorWidthStyle(colors.success, `${stats.totalFeatures > 0 ? Math.round((stats.implemented / stats.totalFeatures) * 100) : 0}%`),
        ]}/>
          </View>

          
          <View style={styles.breakdownGrid}>
            <View style={styles.breakdownItem}>
              <Text style={[styles.breakdownLabel, createTextColorStyle14(colors.textSecondary)]}>{localizedUiText.m_a4d50fb85403}</Text>
              <Text style={[styles.breakdownVal, createTextColorStyle15(colors.warning)]}>{stats.partial}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={[styles.breakdownLabel, createTextColorStyle16(colors.textSecondary)]}>{localizedUiText.m_6be36ca49ee8}</Text>
              <Text style={[styles.breakdownVal, createTextColorStyle17(colors.danger)]}>{stats.missing}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={[styles.breakdownLabel, createTextColorStyle18(colors.textSecondary)]}>{localizedUiText.m_e55910322592}</Text>
              <Text style={[styles.breakdownVal, createTextColorStyle19(colors.info)]}>{stats.backendRequired}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={[styles.breakdownLabel, createTextColorStyle20(colors.textSecondary)]}>{localizedUiText.m_35b1739530e2}</Text>
              <Text style={[styles.breakdownVal, createTextColorStyle21(colors.info)]}>{stats.integrationRequired}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={[styles.breakdownLabel, createTextColorStyle22(colors.textSecondary)]}>{localizedUiText.m_cb9b9d5c9621}</Text>
              <Text style={[styles.breakdownVal, createTextColorStyle23(colors.danger)]}>{stats.blockerIssues}</Text>
            </View>
          </View>
        </View>

        
        <View style={[styles.searchBox, createViewBackgroundColorBorderColorStyle2(colors.surface, colors.border)]}>
          <AppIcon name="search" size={20} color={colors.textSecondary}/>
          <TextInput placeholder={localizedUiText.m_ed9eb297a3c2} placeholderTextColor={colors.textSecondary} value={searchQuery} onChangeText={setSearchQuery} style={[styles.searchInput, createTextInputColorStyle(colors.textPrimary)]}/>
          {searchQuery ? (<TouchableOpacity onPress={() => setSearchQuery('')}>
              <AppIcon name="close" size={20} color={colors.textSecondary}/>
            </TouchableOpacity>) : null}
        </View>

        
        <View style={styles.filtersPanel}>
          <Text style={[styles.filterTitle, createTextColorStyle24(colors.textSecondary)]}>{localizedUiText.m_0f221bd3257b}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {phases.map((p) => {
            const isSelected = selectedPhase === p;
            return (<TouchableOpacity key={p} style={[
                    styles.filterChip,
                    createTouchableOpacityBackgroundColorStyle(isSelected ? colors.primary : colors.surfaceSoft),
                ]} onPress={() => setSelectedPhase(p)}>
                  <Text style={[styles.filterChipText, createTextColorStyle25(isSelected ? '#FFFFFF' : colors.textPrimary)]}>
                    {p.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>);
        })}
          </ScrollView>

          <Text style={[styles.filterTitle, createTextColorStyle26(colors.textSecondary)]}>{localizedUiText.m_0e0a4a067ef5}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {statuses.map((s) => {
            const isSelected = selectedStatus === s;
            return (<TouchableOpacity key={s} style={[
                    styles.filterChip,
                    createTouchableOpacityBackgroundColorStyle2(isSelected ? colors.primary : colors.surfaceSoft),
                ]} onPress={() => setSelectedStatus(s)}>
                  <Text style={[styles.filterChipText, createTextColorStyle27(isSelected ? '#FFFFFF' : colors.textPrimary)]}>
                    {s.replace(/_/g, ' ')}
                  </Text>
                </TouchableOpacity>);
        })}
          </ScrollView>
        </View>

        
        <FlatList data={features} keyExtractor={(item) => item.id} renderItem={renderFeatureCard} contentContainerStyle={styles.listContainer} ListEmptyComponent={<View style={styles.emptyContainer}>
              <AppIcon name="empty" size={48} color={colors.textSecondary}/>
              <Text style={[styles.emptyText, createTextColorStyle28(colors.textSecondary)]}>{localizedUiText.m_3bd04d6067e9}</Text>
            </View>}/>
      </SafeAreaView>
    </ScreenContainer>);
}

