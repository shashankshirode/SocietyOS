import { useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { SearchBar } from "../../../shared/lists/SearchBar";
import { FilterChips } from "../../../shared/lists/FilterChips";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { useSocietyDirectory } from "../hooks/useSocietyDirectory";
import { PlatformSocietyRow } from "../components/PlatformSocietyRow";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/SocietyDirectoryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'SocietyDirectory'>;
export function SocietyDirectoryScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useSocietyDirectory();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('ALL');
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    const filteredData = data.filter((s) => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.city.toLowerCase().includes(searchQuery.toLowerCase());
        if (activeFilter === 'ACTIVE')
            return matchesSearch && s.status === 'ACTIVE';
        if (activeFilter === 'ONBOARDING')
            return matchesSearch && s.status === 'ONBOARDING';
        return matchesSearch;
    });
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_acb2d231d94a} subtitle={localizedUiText.m_10a935db25a8}/>
        <View style={styles.filters}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder={localizedUiText.m_c72d806dbd3e}/>
          <FilterChips options={[
            { label: String(localizedUiText.m_a52ace420f21), value: 'ALL' },
            { label: String(localizedUiText.m_92340695899b), value: 'ACTIVE' },
            { label: String(localizedUiText.m_a2198f472ce2), value: 'ONBOARDING' },
        ]} selected={activeFilter} onSelect={(val) => setActiveFilter(val)}/>
        </View>

        <FlatList data={filteredData} keyExtractor={(item) => item.id} renderItem={({ item }) => (<PlatformSocietyRow society={item} onPress={() => navigation.navigate('PlatformSocietyDetail', { societyId: item.id })}/>)} ListEmptyComponent={<EmptyState title={localizedUiText.m_c4a416c74230} description={localizedUiText.m_e172dc90f11a}/>}/>
      </SafeAreaView>
    </ScreenContainer>);
}

