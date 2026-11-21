import { useState } from "react";
import { Text, View, FlatList, Pressable, TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { FilterChips } from "../../../shared/lists/FilterChips";
import { SkillProfileCard } from "../components/CommunityComponents";
import { useResidentSkillDirectory, useResidentServices } from "../data/communityHooks";
import type { Absent } from "../../../shared/types/absence.types";
import { styles } from "../styles/screens/ResidentSkillDirectoryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function ResidentSkillDirectoryScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [selectedCategory, setSelectedCategory] = useState<string | Absent>(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const { data: profiles, isLoading, refetch } = useResidentSkillDirectory(selectedCategory, searchQuery || undefined);
    const { data: services } = useResidentServices();
    const handleCategorySelect = (categorySlug: string | Absent) => {
        setSelectedCategory(categorySlug);
    };
    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_b0f76f451e7d} onBack={() => navigation.goBack()} rightActions={<Pressable onPress={() => navigation.navigate('CreateSkillProfile')}>
            <Text style={styles.myProfileText}>{localizedUiText.m_991bfa015514}</Text>
          </Pressable>}/>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={Colors.neutral} style={styles.searchIcon}/>
          <TextInput placeholder={localizedUiText.m_9224930d6aec} placeholderTextColor={Colors.neutral} style={styles.searchInput} value={searchQuery} onChangeText={handleSearch}/>
          {searchQuery ? (<Pressable onPress={() => handleSearch('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color={Colors.neutral}/>
            </Pressable>) : null}
        </View>
        <Pressable style={styles.serviceReqButton} onPress={() => navigation.navigate('ResidentServiceListing')}>
          <Ionicons name="clipboard-outline" size={22} color={Colors.textPrimary}/>
        </Pressable>
      </View>

      <View style={styles.categoriesContainer}>
        <FilterChips options={[
            { label: String(localizedUiText.m_7a8b4ce4cde3), value: undefined },
            ...(services?.map(s => ({ label: s.name, value: s.slug })) || [])
        ]} selected={selectedCategory} onSelect={handleCategorySelect}/>
      </View>

      <FlatList data={profiles} keyExtractor={(item) => item.id} renderItem={({ item }) => (<SkillProfileCard profile={item} onPress={() => navigation.navigate('SkillProfileDetail', { profileId: item.id })}/>)} contentContainerStyle={styles.listContent} ListEmptyComponent={<View style={styles.emptyContainer}>
            <Ionicons name="school-outline" size={64} color={Colors.border}/>
            <Text style={styles.emptyTitle}>{localizedUiText.m_5a9d8969916e}</Text>
            <Text style={styles.emptySubtitle}>{localizedUiText.m_bf42b6c39194}</Text>
          </View>} refreshing={isLoading} onRefresh={refetch} showsVerticalScrollIndicator={false}/>
    </ScreenContainer>);
}

