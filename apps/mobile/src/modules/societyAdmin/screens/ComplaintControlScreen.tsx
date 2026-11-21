import { useState } from "react";
import { FlatList, Text, View, ActivityIndicator } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../shared/constants/colors";
import { AppHeader } from "../../../shared/components/AppHeader";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppButton } from "../../../shared/components/AppButton";
import { StatusBadge, getComplaintStatusBadgeType } from "../../../shared/components/StatusBadge";
import { FilterChips } from "../../../shared/lists/FilterChips";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { useAdminComplaints } from "../data/useAdminComplaints";
import type { AdminComplaint } from "../../../shared/types/admin.types";
import { styles } from "../styles/screens/ComplaintControlScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
export function ComplaintControlScreen({ navigation }: {
    navigation: {
        navigate: (route: string, params?: JsonObject) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: complaints = [], isLoading, error, refetch } = useAdminComplaints();
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const statuses = ['ALL', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];
    const filtered = complaints.filter(c => {
        return selectedStatus === 'ALL' || c.status === selectedStatus;
    });
    const handleAssign = (item: AdminComplaint) => {
        AppAlert.alert(String(localizedUiText.m_3582dc7fe4d8), formatUiLiteral(String(localizedUiText.m_b0aa2018d000), [item.ticketNumber]), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_02ac12879625),
                onPress: () => {
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_864350ad5be6));
                    refetch();
                },
            },
            {
                text: String(localizedUiText.m_d14143362b36),
                onPress: () => {
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_d51ca2ab48f1));
                    refetch();
                },
            },
        ]);
    };
    const getComplaintStatusLabel = (status: string) => {
        return status.replace('_', ' ');
    };
    const renderComplaintItem = ({ item, index }: {
        item: AdminComplaint;
        index: number;
    }) => (<Animated.View entering={FadeInLeft.delay(index * 30).duration(300)}>
      <AppCard style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.ticketNum}>#{item.ticketNumber}</Text>
          <StatusBadge label={getComplaintStatusLabel(item.status)} type={getComplaintStatusBadgeType(item.status)}/>
        </View>

        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.unitText}>{localizedUiText.m_4e545960f1bf + " "}{item.unitNumber} ({item.wing})</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{localizedUiText.m_34574af1e694 + " "}{item.priority}</Text>
          <Text style={styles.metaText}>{localizedUiText.m_0e3965218de0 + " "}{item.assigneeName || localizedUiText.m_14d33bd014e6}</Text>
        </View>

        {item.status === 'OPEN' && (<AppButton title={localizedUiText.m_e04c084b1652} variant="primary" compact onPress={() => handleAssign(item)} style={styles.actionBtn}/>)}
      </AppCard>
    </Animated.View>);
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_17218d5840d0} showBack onBack={navigation.goBack}/>

      <View style={styles.filterSection}>
        <FilterChips options={statuses.map(s => ({ label: s, value: s }))} selected={selectedStatus} onChange={setSelectedStatus}/>
      </View>

      {isLoading ? (<View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary}/>
        </View>) : error ? (<EmptyState title={localizedUiText.m_bad04aa0988e} description={error.message} iconName="alert-circle-outline"/>) : filtered.length === 0 ? (<EmptyState title={localizedUiText.m_1c2623fa50c6} description={localizedUiText.m_423e1a4ada8b} iconName="alert-circle-outline"/>) : (<FlatList data={filtered} renderItem={renderComplaintItem} keyExtractor={item => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}/>)}
    </SafeAreaView>);
}

