import { useState } from "react";
import { Text, View, FlatList, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { FilterChips } from "../../../shared/lists/FilterChips";
import { LostFoundCard } from "../components/CommunityComponents";
import { useLostFoundItems } from "../data/communityHooks";
import type { Absent } from "../../../shared/types/absence.types";
import { styles } from "../styles/screens/LostFoundListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function LostFoundListScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [activeTab, setActiveTab] = useState<'LOST' | 'FOUND'>('LOST');
    const [selectedCategory, setSelectedCategory] = useState<string | Absent>(undefined);
    const { data: items, isLoading, refetch } = useLostFoundItems(activeTab, selectedCategory);
    const categories = [
        { label: String(localizedUiText.m_fe3b58f14752), value: undefined },
        { label: String(localizedUiText.m_f0d66a79c138), value: 'KEYS' },
        { label: String(localizedUiText.m_e7fd629133a1), value: 'WALLETS' },
        { label: String(localizedUiText.m_7ae9c23d6592), value: 'ELECTRONICS' },
        { label: String(localizedUiText.m_b4e929d8bcfe), value: 'DOCUMENTS' },
        { label: String(localizedUiText.m_7dc1cd7eaff6), value: 'PETS' },
        { label: String(localizedUiText.m_ebdad9ba4c5e), value: 'OTHERS' },
    ];
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_b9b39c7466af} onBack={() => navigation.goBack()}/>

      
      <View style={styles.tabContainer}>
        <Pressable style={[styles.tab, activeTab === 'LOST' && styles.tabActive]} onPress={() => setActiveTab('LOST')}>
          <Text style={[styles.tabText, activeTab === 'LOST' && styles.tabTextActive]}>{localizedUiText.m_50ffb8519c02}</Text>
        </Pressable>
        <Pressable style={[styles.tab, activeTab === 'FOUND' && styles.tabActive]} onPress={() => setActiveTab('FOUND')}>
          <Text style={[styles.tabText, activeTab === 'FOUND' && styles.tabTextActive]}>{localizedUiText.m_3638394a41e5}</Text>
        </Pressable>
      </View>

      
      <View style={styles.categoriesContainer}>
        <FilterChips options={categories} selected={selectedCategory} onSelect={setSelectedCategory}/>
      </View>

      
      <FlatList data={items} keyExtractor={(item) => item.id} renderItem={({ item }) => (<LostFoundCard item={item} onPress={() => navigation.navigate('LostFoundDetail', { itemId: item.id })}/>)} contentContainerStyle={styles.listContent} ListEmptyComponent={<View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={Colors.border}/>
            <Text style={styles.emptyTitle}>{localizedUiText.m_3f5279cd3ab1}</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'LOST'
                ? localizedUiText.m_cb144b6acf0d : localizedUiText.m_d16d72e06c6d}
            </Text>
          </View>} refreshing={isLoading} onRefresh={refetch} showsVerticalScrollIndicator={false}/>

      
      <Pressable style={styles.fab} onPress={() => navigation.navigate('CreateLostFoundReport')}>
        <Ionicons name="megaphone-outline" size={24} color="#FFF"/>
      </Pressable>
    </ScreenContainer>);
}

