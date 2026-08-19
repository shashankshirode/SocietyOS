import { useState } from "react";
import { FlatList, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../shared/constants/colors";
import { AppHeader } from "../../../shared/components/AppHeader";
import { AppCard } from "../../../shared/cards/AppCard";
import { StatusBadge, getOccupancyStatusBadgeType } from "../../../shared/components/StatusBadge";
import { SearchBar } from "../../../shared/lists/SearchBar";
import { FilterChips } from "../../../shared/lists/FilterChips";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { useAdminUnits } from "../data/useAdminUnits";
import type { AdminUnit } from "../../../shared/types/admin.types";
import { styles } from "../styles/screens/UnitMasterScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function UnitMasterScreen({ navigation }: {
    navigation: {
        navigate: (route: string, params?: JsonObject) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: units = [], isLoading, error } = useAdminUnits();
    const [search, setSearch] = useState('');
    const [selectedWing, setSelectedWing] = useState('ALL');
    const wings = ['ALL', ...Array.from(new Set(units.map(u => u.wing)))];
    const filteredUnits = units.filter(u => {
        const matchesSearch = u.unitNumber.toLowerCase().includes(search.toLowerCase()) ||
            (u.ownerName && u.ownerName.toLowerCase().includes(search.toLowerCase()));
        const matchesWing = selectedWing === 'ALL' || u.wing === selectedWing;
        return matchesSearch && matchesWing;
    });
    const getOccupancyLabel = (status: string) => {
        return status.replace('_', ' ');
    };
    const renderUnitItem = ({ item, index }: {
        item: AdminUnit;
        index: number;
    }) => (<Animated.View entering={FadeInLeft.delay(index * 30).duration(300)}>
      <AppCard style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.unitNum}>{item.unitNumber}</Text>
          <StatusBadge label={getOccupancyLabel(item.occupancyStatus)} type={getOccupancyStatusBadgeType(item.occupancyStatus)}/>
        </View>
        <Text style={styles.wingLabel}>{item.wing}{" " + localizedUiText.m_11d6ef6c91a2 + " "}{item.floor}</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLbl}>{localizedUiText.m_e6c5b4a033e1}</Text>
          <Text style={styles.detailVal}>{item.ownerName || item.tenantName || localizedUiText.m_52fb93bedf15}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLbl}>{localizedUiText.m_7e1dfc62a487}</Text>
          <Text style={[styles.detailVal, item.outstandingAmount > 0 && styles.textColorFontWeight]}>
            ₹{item.outstandingAmount.toLocaleString()}
          </Text>
        </View>
      </AppCard>
    </Animated.View>);
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_199c39763358} showBack onBack={navigation.goBack}/>
      
      <View style={styles.controls}>
        <SearchBar value={search} onChangeText={setSearch} placeholder={localizedUiText.m_fa6c6fe7e438}/>
        <FilterChips options={wings.map(w => ({ label: w, value: w }))} selected={selectedWing} onChange={setSelectedWing}/>
      </View>

      {isLoading ? (<View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary}/>
        </View>) : error ? (<EmptyState title={localizedUiText.m_e85b9ea55032} description={error.message} iconName="alert-circle-outline"/>) : filteredUnits.length === 0 ? (<EmptyState title={localizedUiText.m_48f2efd90732} description={localizedUiText.m_1139ce4c5505} iconName="grid-outline"/>) : (<FlatList data={filteredUnits} renderItem={renderUnitItem} keyExtractor={item => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}/>)}
    </SafeAreaView>);
}

