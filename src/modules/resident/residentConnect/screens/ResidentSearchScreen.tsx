import { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../../shared/constants/colors";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { EmptyState } from "../../../../shared/feedback/EmptyState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { StatusBadge, getResidentConnectionBadgeType } from "../../../../shared/components/StatusBadge";
import { useResidentSearch } from "../data/useResidentSearch";
import type { ResidentSearchScreenProps } from "../../../../app/navigation/navigation.types";
import type { ResidentDirectoryEntry } from "../../../../shared/types/residentConnect.types";
import { ResidentDisplayName } from "../../../../ui/typography/ResidentDisplayName";
import { styles } from "../styles/screens/ResidentSearchScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function ResidentSearchScreen({ navigation }: ResidentSearchScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [query, setQuery] = useState('');
    const { data: results = [], isLoading } = useResidentSearch(query);
    const renderItem = ({ item, index }: {
        item: ResidentDirectoryEntry;
        index: number;
    }) => {
        return (<Animated.View entering={FadeInLeft.delay(index * 20).duration(300)}>
        <AppCard style={styles.resultCard} onPress={() => navigation.navigate('ResidentPreview', { residentId: item.id })}>
          <View style={styles.cardRow}>
            <View style={styles.avatar}>
              <Ionicons name="home-outline" size={18} color={Colors.primary}/>
            </View>

            <View style={styles.details}>
              <ResidentDisplayName displayName={item.visibilityStatus === 'HIDDEN' ? 'Resident' : item.name} style={styles.nameText}/>
              <Text style={styles.flatText}>
                {item.tower}{" " + localizedUiText.m_758e256e9c5c + " "}{item.flatNumber}
              </Text>
            </View>

            <View style={styles.rightCol}>
              <StatusBadge label={item.connectionStatus.replace(/_/g, ' ')} type={getResidentConnectionBadgeType(item.connectionStatus)} style={styles.badge}/>
            </View>
          </View>
        </AppCard>
      </Animated.View>);
    };
    return (<SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader title={localizedUiText.m_853ccbdc6425} showBack onBack={() => navigation.goBack()}/>
      <View style={styles.mainContainer}>
        
        <View style={styles.searchBarContainer}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} style={styles.searchIcon}/>
          <TextInput value={query} onChangeText={setQuery} placeholder={localizedUiText.m_6db523543f2a} placeholderTextColor={Colors.textMuted} autoFocus style={styles.searchInput}/>
          {query.length > 0 && (<Pressable onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted}/>
            </Pressable>)}
        </View>

        {isLoading && query.length > 0 ? (<LoadingState />) : (<FlatList data={results} renderItem={renderItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} ListEmptyComponent={query.trim().length === 0 ? (<View style={styles.helperBox}>
                  <Ionicons name="bulb-outline" size={32} color={Colors.textMuted}/>
                  <Text style={styles.helperTitle}>{localizedUiText.m_4ecd87250efc}</Text>
                  <Text style={styles.helperText}>{localizedUiText.m_3a6b8b5a5b2c}</Text>
                </View>) : (<EmptyState title={localizedUiText.m_f478a5307a49} description={localizedUiText.m_96ad8665f910} iconName="search-outline"/>)}/>)}
      </View>
    </SafeAreaView>);
}
export default ResidentSearchScreen;

