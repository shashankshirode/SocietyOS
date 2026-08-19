import { useState } from "react";
import { FlatList, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../shared/constants/colors";
import { AppHeader } from "../../../shared/components/AppHeader";
import { AppCard } from "../../../shared/cards/AppCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { SearchBar } from "../../../shared/lists/SearchBar";
import { FilterChips } from "../../../shared/lists/FilterChips";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { WarningBanner } from "../../../shared/feedback/WarningBanner";
import { useAdminResidents } from "../data/useAdminResidents";
import type { AdminResident } from "../../../shared/types/admin.types";
import { styles } from "../styles/screens/ResidentDirectoryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function ResidentDirectoryScreen({ navigation }: {
    navigation: {
        navigate: (route: string, params?: JsonObject) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: residents = [], isLoading, error } = useAdminResidents();
    const [search, setSearch] = useState('');
    const [selectedRole, setSelectedRole] = useState('ALL');
    const roles = ['ALL', 'OWNER', 'TENANT', 'FAMILY'];
    const filtered = residents.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.unitNumber.toLowerCase().includes(search.toLowerCase());
        const matchesRole = selectedRole === 'ALL' || r.role === selectedRole;
        return matchesSearch && matchesRole;
    });
    const getKycBadgeType = (status: string) => {
        switch (status) {
            case 'VERIFIED': return 'success';
            case 'PENDING': return 'warning';
            case 'REJECTED': return 'danger';
            default: return 'neutral';
        }
    };
    const renderResidentItem = ({ item, index }: {
        item: AdminResident;
        index: number;
    }) => (<Animated.View entering={FadeInLeft.delay(index * 30).duration(300)}>
      <AppCard style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{item.name}</Text>
          <StatusBadge label={item.role} type="info"/>
        </View>
        <Text style={styles.unitLabel}>{localizedUiText.m_4e545960f1bf + " "}{item.unitNumber} ({item.wing})</Text>
        
        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLbl}>{localizedUiText.m_6a8c4e0e0703}</Text>
            <Text style={styles.detailVal}>{item.mobileMasked}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLbl}>{localizedUiText.m_17507dcf8457}</Text>
            <Text style={styles.detailVal}>{item.emailMasked}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLbl}>{localizedUiText.m_a20969304997}</Text>
            <StatusBadge label={item.kycStatus} type={getKycBadgeType(item.kycStatus)} style={styles.smallBadge}/>
          </View>
        </View>
      </AppCard>
    </Animated.View>);
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_70761c1912c0} showBack onBack={navigation.goBack}/>
      
      <WarningBanner message={localizedUiText.m_e07e2f70efae}/>

      <View style={styles.controls}>
        <SearchBar value={search} onChangeText={setSearch} placeholder={localizedUiText.m_28093dd4406b}/>
        <FilterChips options={roles.map(r => ({ label: r, value: r }))} selected={selectedRole} onChange={setSelectedRole}/>
      </View>

      {isLoading ? (<View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary}/>
        </View>) : error ? (<EmptyState title={localizedUiText.m_a491ddff9c85} description={error.message} iconName="alert-circle-outline"/>) : filtered.length === 0 ? (<EmptyState title={localizedUiText.m_3071b9d52508} description={localizedUiText.m_d8c32a443970} iconName="people-outline"/>) : (<FlatList data={filtered} renderItem={renderResidentItem} keyExtractor={item => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}/>)}
    </SafeAreaView>);
}

