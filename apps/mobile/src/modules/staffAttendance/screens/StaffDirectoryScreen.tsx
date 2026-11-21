import { useState } from "react";
import { View, Text, TextInput, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useStaffDirectory } from "../data/useStaffDirectory";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import { StaffCard } from "../components/StaffCard";
import type { StaffCategory } from "../../../shared/types/staff.types";
import { styles } from "../styles/screens/StaffDirectoryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'StaffDirectory'>;
const categories: {
    label: string;
    value: StaffCategory | 'ALL';
}[] = [
    { get label() {
            return getActiveUiLiteral("m_e0495a8ba457");
        }, value: 'ALL' },
    { get label() {
            return getActiveUiLiteral("m_8f6fb4eb7f42");
        }, value: 'SECURITY_GUARD' },
    { get label() {
            return getActiveUiLiteral("m_6f352b468971");
        }, value: 'HOUSEKEEPING' },
    { get label() {
            return getActiveUiLiteral("m_d2f1384e8004");
        }, value: 'FACILITY_STAFF' },
    { get label() {
            return getActiveUiLiteral("m_494ee23c96b6");
        }, value: 'GARDENER' },
    { get label() {
            return getActiveUiLiteral("m_be93c38bca87");
        }, value: 'PLUMBER' },
    { get label() {
            return getActiveUiLiteral("m_8200b435d4a1");
        }, value: 'ELECTRICIAN' },
];
export function StaffDirectoryScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<StaffCategory | 'ALL'>('ALL');
    const filters = {
        search,
        ...(selectedCategory !== 'ALL' && { category: selectedCategory }),
    };
    const { data, isLoading, error, refetch } = useStaffDirectory(filters);
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{localizedUiText.m_8cbe5978e821}</Text>
          <Pressable style={styles.addButton} onPress={() => navigation.navigate('RegisterStaff')}>
            <Ionicons name="add" size={20} color={Colors.white}/>
            <Text style={styles.addText}>{localizedUiText.m_bb7234ec1245}</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>{localizedUiText.m_acaaf84ef49e}</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={Colors.neutral}/>
        <TextInput style={styles.searchInput} placeholder={localizedUiText.m_44ac34e4a1fa} value={search} onChangeText={setSearch}/>
        {search.length > 0 && (<Pressable onPress={() => setSearch('')}>
            <Ionicons name="close" size={18} color={Colors.neutral}/>
          </Pressable>)}
      </View>

      <View style={styles.filtersContainer}>
        <FlatList horizontal showsHorizontalScrollIndicator={false} data={categories} keyExtractor={item => item.value} renderItem={({ item }) => {
            const active = selectedCategory === item.value;
            return (<Pressable style={[styles.filterChip, active && styles.activeChip]} onPress={() => setSelectedCategory(item.value)}>
                <Text style={[styles.chipText, active && styles.activeChipText]}>{item.label}</Text>
              </Pressable>);
        }} contentContainerStyle={styles.chipsContent} extraData={localizedUiText}/>
      </View>

      {isLoading ? (<LoadingState message={localizedUiText.m_f7ddddb95d78}/>) : error ? (<ErrorState message={error.message} onRetry={refetch}/>) : (<FlatList data={data} keyExtractor={item => item.id} renderItem={({ item }) => (<StaffCard staff={item} onPress={() => navigation.navigate('StaffDetail', { staffId: item.id })}/>)} contentContainerStyle={styles.listContent} ListEmptyComponent={<View style={styles.empty}>
              <Ionicons name="people-outline" size={48} color={Colors.neutral}/>
              <Text style={styles.emptyText}>{localizedUiText.m_bcaaaa6518f2}</Text>
            </View>} extraData={localizedUiText}/>)}
    </ScreenContainer>);
}

