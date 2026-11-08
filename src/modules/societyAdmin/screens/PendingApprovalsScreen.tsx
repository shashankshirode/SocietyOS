import React, { useState, useMemo } from "react";
import { FlatList, Text, View, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../shared/constants/colors";
import { AppHeader } from "../../../shared/components/AppHeader";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppButton } from "../../../shared/components/AppButton";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { usePendingApprovals } from "../data/usePendingApprovals";
import { useApprovalAction } from "../data/useApprovalAction";
import type { AdminApproval } from "../../../shared/types/admin.types";
import { styles, createTextColorStyle } from "../styles/screens/PendingApprovalsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";

type ApprovalCategoryFilter = 'ALL' | 'RESIDENTS' | 'NOCS' | 'FACILITIES' | 'VEHICLES';

export function PendingApprovalsScreen({ navigation }: {
    navigation: {
        navigate: (route: string, params?: unknown) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: approvals = [], isLoading, error, refetch } = usePendingApprovals();
    const { execute, isSubmitting } = useApprovalAction();

    const [selectedCategory, setSelectedCategory] = useState<ApprovalCategoryFilter>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredApprovals = useMemo(() => {
        return approvals.filter((item) => {
            const matchesCategory =
                selectedCategory === 'ALL' ||
                (selectedCategory === 'RESIDENTS' && (item.type === 'TENANT_ONBOARDING' || item.type === 'MOVE_OUT' || item.type === 'STAFF_PASS')) ||
                (selectedCategory === 'NOCS' && (item.type === 'RENOVATION' || item.summary.toLowerCase().includes('noc'))) ||
                (selectedCategory === 'FACILITIES' && item.type === 'AMENITY_SPECIAL') ||
                (selectedCategory === 'VEHICLES' && item.type === 'VEHICLE_ADDITION');

            if (!matchesCategory) {
                return false;
            }

            if (!searchQuery.trim()) {
                return true;
            }

            const query = searchQuery.trim().toLowerCase();
            return (
                item.requestedBy.toLowerCase().includes(query) ||
                item.unitNumber.toLowerCase().includes(query) ||
                item.summary.toLowerCase().includes(query) ||
                item.approvalNumber.toLowerCase().includes(query)
            );
        });
    }, [approvals, selectedCategory, searchQuery]);

    const handleAction = async (action: 'approve' | 'reject', item: AdminApproval) => {
        AppAlert.alert(formatUiLiteral(String(localizedUiText.m_a76c44df8205), [action === 'approve' ? String(localizedUiText.m_6007acbe30b2) : String(localizedUiText.m_ab604a360777)]), formatUiLiteral(String(localizedUiText.m_d8ca6faabc62), [action, item.unitNumber]), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_eebdd24a77d9),
                style: action === 'reject' ? 'destructive' : 'default',
                onPress: async () => {
                    await execute(action, item.id);
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), formatUiLiteral(String(localizedUiText.m_f5a723a3d15f), [action]));
                    refetch();
                },
            },
        ]);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'URGENT': return Colors.danger;
            case 'HIGH': return Colors.warning;
            default: return Colors.primary;
        }
    };

    const renderApprovalItem = ({ item, index }: {
        item: AdminApproval;
        index: number;
    }) => (<Animated.View {...(FadeInLeft?.delay ? { entering: FadeInLeft.delay(index * 30).duration(300) } : {})}>
      <AppCard style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.appNum}>{item.approvalNumber}</Text>
          <Text style={[styles.priority, createTextColorStyle(getPriorityColor(item.priority))]}>{item.priority}</Text>
        </View>
        
        <Text style={styles.typeLabel}>{item.type.replace(/_/g, ' ')}</Text>
        <Text style={styles.desc}>{item.summary}</Text>
        
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{localizedUiText.m_5704b7c3727f + " "}{item.requestedBy} ({item.requestedByRole})</Text>
          <Text style={styles.metaText}>{localizedUiText.m_9311e5cc88d5 + " "}{item.unitNumber} ({item.wing})</Text>
        </View>

        <View style={styles.buttonRow}>
          <AppButton title={localizedUiText.m_ab604a360777} variant="danger" compact onPress={() => handleAction('reject', item)} disabled={isSubmitting} style={styles.appButtonFlex}/>
          <AppButton title={localizedUiText.m_6007acbe30b2} variant="primary" compact onPress={() => handleAction('approve', item)} disabled={isSubmitting} style={styles.appButtonFlex2}/>
        </View>
      </AppCard>
    </Animated.View>);

    const categories: { key: ApprovalCategoryFilter; label: string }[] = [
        { key: 'ALL', label: 'All Requests' },
        { key: 'RESIDENTS', label: 'Residents' },
        { key: 'NOCS', label: 'NOCs' },
        { key: 'FACILITIES', label: 'Facilities' },
        { key: 'VEHICLES', label: 'Vehicles' },
    ];

    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_495aae902643} showBack onBack={navigation.goBack}/>

      <View style={styles.controlsContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, flat, or reference..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            testID="approval-search-input"
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScrollView}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
                onPress={() => setSelectedCategory(cat.key)}
                testID={`approval-tab-${cat.key}`}
              >
                <Text style={[styles.tabChipText, isActive && styles.tabChipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.countHeaderRow}>
        <Text style={styles.countHeaderText}>
          {filteredApprovals.length} pending approval{filteredApprovals.length === 1 ? '' : 's'}
        </Text>
      </View>

      {isLoading ? (<View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary}/>
        </View>) : error ? (<EmptyState title={localizedUiText.m_a7e04dec5f64} description={error.message} iconName="alert-circle-outline"/>) : filteredApprovals.length === 0 ? (<EmptyState title={localizedUiText.m_261de9be5f4a} description={localizedUiText.m_e8fe02926c7c} iconName="checkmark-circle-outline"/>) : (<FlatList data={filteredApprovals} renderItem={renderApprovalItem} keyExtractor={item => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}/>)}
    </SafeAreaView>);
}

