import { useState, useMemo } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../../shared/constants/colors";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { EmptyState } from "../../../../shared/feedback/EmptyState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { useAcceptedContacts } from "../data/useAcceptedContacts";
import type { AcceptedContactsScreenProps } from "../../../../app/navigation/navigation.types";
import type { ResidentDirectoryEntry } from "../../../../shared/types/residentConnect.types";
import { styles } from "../styles/screens/AcceptedContactsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function AcceptedContactsScreen({ navigation }: AcceptedContactsScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [search, setSearch] = useState('');
    const { data: contacts = [], isLoading } = useAcceptedContacts();
    const filtered = useMemo(() => {
        return contacts.filter((c) => !search.trim() ||
            c.name.toLowerCase().includes(search.toLowerCase().trim()) ||
            c.flatNumber.toLowerCase().includes(search.toLowerCase().trim()));
    }, [contacts, search]);
    const handleOpenChat = (resident: ResidentDirectoryEntry) => {
        let threadId = 'thread-001';
        if (resident.id === 'resident-007')
            threadId = 'thread-002';
        if (resident.id === 'resident-008')
            threadId = 'thread-003';
        if (resident.id === 'resident-010')
            threadId = 'thread-004';
        if (resident.id === 'resident-011')
            threadId = 'thread-005';
        if (resident.id === 'resident-012')
            threadId = 'thread-006';
        navigation.navigate('ChatConversation', { threadId });
    };
    const renderItem = ({ item, index }: {
        item: ResidentDirectoryEntry;
        index: number;
    }) => {
        return (<Animated.View entering={FadeInLeft.delay(index * 30).duration(300)}>
        <AppCard style={styles.card} onPress={() => handleOpenChat(item)}>
          <View style={styles.cardRow}>
            <View style={styles.avatarCircle}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.primary}/>
            </View>

            <View style={styles.details}>
              <Text style={styles.nameText}>{item.name}</Text>
              <Text style={styles.flatText}>
                {item.tower}{" " + localizedUiText.m_758e256e9c5c + " "}{item.flatNumber} · {item.residentType}
              </Text>
            </View>

            <Pressable style={styles.chatBtn} onPress={() => handleOpenChat(item)}>
              <Ionicons name="chatbubbles" size={20} color={Colors.primary}/>
            </Pressable>
          </View>
        </AppCard>
      </Animated.View>);
    };
    return (<SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader title={localizedUiText.m_f524834bfe5d} showBack onBack={() => navigation.goBack()}/>
      <View style={styles.mainContainer}>
        
        
        <View style={styles.searchBarContainer}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} style={styles.searchIcon}/>
          <TextInput value={search} onChangeText={setSearch} placeholder={localizedUiText.m_c3d9e392b723} placeholderTextColor={Colors.textMuted} style={styles.searchInput}/>
        </View>

        {isLoading ? (<LoadingState />) : (<FlatList data={filtered} renderItem={renderItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} ListEmptyComponent={<EmptyState title={localizedUiText.m_43fb5a8dc6ce} description={localizedUiText.m_00aea6e3ace0} iconName="people-outline"/>}/>)}
      </View>
    </SafeAreaView>);
}
export default AcceptedContactsScreen;

