import { useState } from "react";
import { Text, View, FlatList, Pressable, TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResidentPageHeader } from "../../../ui/patterns/ResidentPageHeader";
import { FilterChips } from "../../../shared/lists/FilterChips";
import { MarketplaceListingCard, CommunityPrivacyNotice } from "../components/CommunityComponents";
import { useMarketplaceListings, useMarketplaceCategories } from "../data/communityHooks";
import type { Absent } from "../../../shared/types/absence.types";
import { styles } from "../styles/screens/MarketplaceListingFeedScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function MarketplaceListingFeedScreen({ navigation }: {
    navigation: {
        navigate: (screen: string, params?: JsonObject) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [selectedCategory, setSelectedCategory] = useState<string | Absent>(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const { data: listings, isLoading, refetch } = useMarketplaceListings(selectedCategory, searchQuery || undefined);
    const { data: categories } = useMarketplaceCategories();
    const handleCategorySelect = (categorySlug: string | Absent) => {
        setSelectedCategory(categorySlug);
    };
    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };
    return (<ScreenContainer>
      <ResidentPageHeader title={localizedUiText.m_c608981d8d68} titleKey="resident.navigation.marketplace.title" subtitleKey="resident.navigation.marketplace.subtitle" variant="marketplace" showBackButton onBackPress={() => navigation.goBack()}/>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={Colors.neutral} style={styles.searchIcon}/>
          <TextInput placeholder={localizedUiText.m_a0241849a87b} placeholderTextColor={Colors.neutral} style={styles.searchInput} value={searchQuery} onChangeText={handleSearch}/>
          {searchQuery ? (<Pressable onPress={() => handleSearch('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color={Colors.neutral}/>
            </Pressable>) : null}
        </View>
        <Pressable style={styles.filterButton} onPress={() => navigation.navigate('ListingSearchFilters')}>
          <Ionicons name="options-outline" size={22} color={Colors.textPrimary}/>
        </Pressable>
      </View>

      
      <View style={styles.categoriesContainer}>
        <FilterChips options={[
            { label: String(localizedUiText.m_477730fc1887), value: undefined },
            ...(categories?.map(cat => ({ label: cat.name, value: cat.slug })) || [])
        ]} selected={selectedCategory} onSelect={handleCategorySelect}/>
      </View>

      
      <FlatList data={listings} keyExtractor={(item) => item.id} renderItem={({ item }) => (<MarketplaceListingCard listing={item} onPress={() => navigation.navigate('MarketplaceListingDetail', { listingId: item.id })}/>)} contentContainerStyle={styles.listContent} ListHeaderComponent={<CommunityPrivacyNotice />} ListEmptyComponent={<View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={64} color={Colors.border}/>
            <Text style={styles.emptyTitle}>{localizedUiText.m_949da6a3278e}</Text>
            <Text style={styles.emptySubtitle}>{localizedUiText.m_e1bdca04f13d}</Text>
          </View>} refreshing={isLoading} onRefresh={refetch} showsVerticalScrollIndicator={false}/>

      
      <Pressable style={styles.fab} onPress={() => navigation.navigate('CreateMarketplaceListing')}>
        <Ionicons name="add" size={28} color="#FFF"/>
      </Pressable>
    </ScreenContainer>);
}
