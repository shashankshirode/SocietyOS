import { useState, useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { AppCard } from "../../../shared/cards/AppCard";
import { SearchBar } from "../../../shared/lists/SearchBar";
import { FilterChips } from "../../../shared/lists/FilterChips";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { useGateActivity } from "../data/useGateActivity";
import type { GateActivityLogScreenProps } from "../../../app/navigation/navigation.types";
import type { GateActivityLog } from "../../../shared/types/gate.types";
import { styles } from "../styles/screens/GateActivityLogScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type FilterChip = 'ALL' | 'VISITORS' | 'DELIVERY' | 'CAB' | 'VENDOR' | 'STAFF' | 'REJECTED' | 'OFFLINE';
const FILTER_CHIPS: {
    key: FilterChip;
    label: string;
}[] = [
    { key: 'ALL', get label() {
            return getActiveUiLiteral("m_4381dd5d8bd3");
        } },
    { key: 'VISITORS', get label() {
            return getActiveUiLiteral("m_3c8e0fde6fcc");
        } },
    { key: 'DELIVERY', get label() {
            return getActiveUiLiteral("m_2eb75b5144e5");
        } },
    { key: 'CAB', get label() {
            return getActiveUiLiteral("m_67d3d419f6af");
        } },
    { key: 'VENDOR', get label() {
            return getActiveUiLiteral("m_720b6017f2e9");
        } },
    { key: 'STAFF', get label() {
            return getActiveUiLiteral("m_681927e34b77");
        } },
    { key: 'REJECTED', get label() {
            return getActiveUiLiteral("m_aea4a04a8042");
        } },
    { key: 'OFFLINE', get label() {
            return getActiveUiLiteral("m_6dfd28f41d10");
        } },
];
export function GateActivityLogScreen({ navigation }: GateActivityLogScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterChip>('ALL');
    const { data, isLoading, error, refetch } = useGateActivity();
    const logs = useMemo(() => data ?? [], [data]);
    const filteredLogs = useMemo(() => {
        let result = logs;
        if (activeFilter === 'VISITORS') {
            result = result.filter((l) => l.activityType === 'GUEST');
        }
        else if (activeFilter === 'DELIVERY') {
            result = result.filter((l) => l.activityType === 'DELIVERY');
        }
        else if (activeFilter === 'CAB') {
            result = result.filter((l) => l.activityType === 'CAB');
        }
        else if (activeFilter === 'VENDOR') {
            result = result.filter((l) => l.activityType === 'VENDOR');
        }
        else if (activeFilter === 'STAFF') {
            result = result.filter((l) => l.activityType === 'STAFF');
        }
        else if (activeFilter === 'REJECTED') {
            result = result.filter((l) => l.status === 'REJECTED');
        }
        else if (activeFilter === 'OFFLINE') {
            result = result.filter((l) => l.entrySource === 'OFFLINE');
        }
        if (searchQuery.trim().length > 0) {
            const q = searchQuery.toLowerCase();
            result = result.filter((l) => l.personName.toLowerCase().includes(q) ||
                l.flatOrCommon.toLowerCase().includes(q) ||
                (l.vehicleNumber && l.vehicleNumber.toLowerCase().includes(q)) ||
                (l.passCode && l.passCode.toLowerCase().includes(q)));
        }
        return result;
    }, [activeFilter, logs, searchQuery]);
    const getLogIcon = (type: string) => {
        switch (type) {
            case 'DELIVERY': return 'cube-outline';
            case 'CAB': return 'car-outline';
            case 'VENDOR': return 'construct-outline';
            case 'STAFF': return 'people-outline';
            default: return 'person-outline';
        }
    };
    const renderLogItem = ({ item }: {
        item: GateActivityLog;
    }) => {
        const isCheckIn = item.status === 'CHECKED_IN' || item.status === 'APPROVED';
        const isRejected = item.status === 'REJECTED';
        return (<AppCard style={styles.logCard}>
        <View style={styles.logRow}>
          <View style={styles.iconContainer}>
            <Ionicons name={getLogIcon(item.activityType)} size={20} color={Colors.primary}/>
          </View>
          <View style={styles.logContent}>
            <Text style={styles.personName}>{item.personName}</Text>
            <Text style={styles.logMeta}>{localizedUiText.m_9285cedcf26a}{item.flatOrCommon} · {item.activityType}{" " + localizedUiText.m_8a02cbb790af + " "}{item.entrySource}
            </Text>
            <Text style={styles.logGuard}>{localizedUiText.m_9eb0f9ac7fd3 + " "}{item.guardName}</Text>
          </View>
          <View style={styles.logRight}>
            <Text style={styles.logTime}>{item.time}</Text>
            {isRejected ? (<StatusBadge label={localizedUiText.m_04cc0e71ffcf} type="danger" style={styles.statusBadge}/>) : (<Text style={[styles.logStatus, isCheckIn ? styles.inText : styles.outText]}>
                {isCheckIn ? localizedUiText.m_fed1d872f6d5 : localizedUiText.m_c57929ed1408}
              </Text>)}
          </View>
        </View>
      </AppCard>);
    };
    if (isLoading) {
        return (<SafeAreaView style={styles.safeArea} edges={['top']}>
        <LoadingState message={localizedUiText.m_2e7f56f46be1} showCardPlaceholder/>
      </SafeAreaView>);
    }
    if (error) {
        return (<SafeAreaView style={styles.safeArea} edges={['top']}>
        <ErrorState message={error.message} onRetry={refetch}/>
      </SafeAreaView>);
    }
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{localizedUiText.m_00321a1d12a5}</Text>
      </View>

      
      <View style={styles.searchContainer}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder={localizedUiText.m_5bfec7bdccac}/>
      </View>

      
      <FilterChips options={FILTER_CHIPS} selectedKey={activeFilter} onSelect={setActiveFilter}/>

      
      <FlatList data={filteredLogs} renderItem={renderLogItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} ListEmptyComponent={<EmptyState title={localizedUiText.m_45bb558665ff} description={searchQuery ? localizedUiText.m_8e7d4c30eb54 : localizedUiText.m_76ffd90cd7c0} iconName="list-circle-outline"/>} extraData={localizedUiText}/>
    </SafeAreaView>);
}

