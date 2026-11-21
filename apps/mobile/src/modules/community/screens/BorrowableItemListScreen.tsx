import { useState } from "react";
import { Text, View, FlatList, Pressable, TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { FilterChips } from "../../../shared/lists/FilterChips";
import { BorrowableItemCard } from "../components/CommunityComponents";
import { useBorrowableItems } from "../data/communityHooks";
import type { Absent } from "../../../shared/types/absence.types";
import { styles } from "../styles/screens/BorrowableItemListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function BorrowableItemListScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [selectedCategory, setSelectedCategory] = useState<string | Absent>(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const { data: items, isLoading, refetch } = useBorrowableItems(selectedCategory, searchQuery || undefined);
    const categories = [
        { label: String(localizedUiText.m_fe3b58f14752), value: undefined },
        { label: String(localizedUiText.m_ea93d6a262ec), value: 'TOOLS' },
        { label: String(localizedUiText.m_9da7f76bc81d), value: 'BOOKS' },
        { label: String(localizedUiText.m_b8ab7d4e7778), value: 'APPLIANCES' },
        { label: String(localizedUiText.m_9b1f5daf0a3d), value: 'SPORTS' },
        { label: String(localizedUiText.m_fd16c1f32fde), value: 'TOYS' },
        { label: String(localizedUiText.m_ebdad9ba4c5e), value: 'OTHERS' },
    ];
    const handleCategorySelect = (val: string | Absent) => {
        setSelectedCategory(val);
    };
    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_1d192fb9dba4} onBack={() => navigation.goBack()}/>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={Colors.neutral} style={styles.searchIcon}/>
          <TextInput placeholder={localizedUiText.m_541d0db4ce8a} placeholderTextColor={Colors.neutral} style={styles.searchInput} value={searchQuery} onChangeText={handleSearch}/>
          {searchQuery ? (<Pressable onPress={() => handleSearch('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color={Colors.neutral}/>
            </Pressable>) : null}
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <FilterChips options={categories} selected={selectedCategory} onSelect={handleCategorySelect}/>
      </View>

      <FlatList data={items} keyExtractor={(item) => item.id} renderItem={({ item }) => (<BorrowableItemCard item={item} onPress={() => navigation.navigate('BorrowableItemDetail', { itemId: item.id })}/>)} contentContainerStyle={styles.listContent} ListEmptyComponent={<View style={styles.emptyContainer}>
            <Ionicons name="hammer-outline" size={64} color={Colors.border}/>
            <Text style={styles.emptyTitle}>{localizedUiText.m_949da6a3278e}</Text>
            <Text style={styles.emptySubtitle}>{localizedUiText.m_772e08d6df8b}</Text>
          </View>} refreshing={isLoading} onRefresh={refetch} showsVerticalScrollIndicator={false}/>
    </ScreenContainer>);
}

