import { useState, useMemo, useEffect } from "react";
import { View, TextInput, Pressable, FlatList, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentDirectory } from "../data/useResidentDirectory";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ChatPageHeader } from "../../../chat/components/ChatPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { StatusPill } from "../../../../ui/components/StatusPill";
import { WrapRow } from "../../../../ui/layout/WrapRow";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import type { ResidentDirectoryScreenProps } from "../../../../app/navigation/navigation.types";
import type { ResidentDirectoryEntry } from "../../../../shared/types/residentConnect.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createFlatListPaddingBottomStyle, createViewBackgroundColorBorderColorStyle2, createTextInputColorStyle, createPressableBackgroundColorBorderColorStyle } from "../styles/screens/ResidentDirectoryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function ResidentDirectoryScreen({ navigation }: ResidentDirectoryScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [towerFilter, setTowerFilter] = useState<'ALL' | 'A Wing' | 'B Wing'>('ALL');
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(handler);
    }, [search]);
    const queryParams = useMemo(() => ({
        tower: towerFilter,
        search: debouncedSearch,
    }), [towerFilter, debouncedSearch]);
    const { items: directory = [], isRefreshing, isLoadingMore, hasMore, loadMore, refresh, } = useResidentDirectory(queryParams);
    const chips: {
        key: 'ALL' | 'A Wing' | 'B Wing';
        label: string;
    }[] = [
        { key: 'ALL', label: String(localizedUiText.m_e196a341ef47) },
        { key: 'A Wing', label: String(localizedUiText.m_932c8c39bdb5) },
        { key: 'B Wing', label: String(localizedUiText.m_eb6581097780) },
    ];
    const renderItem = ({ item }: {
        item: ResidentDirectoryEntry;
    }) => {
        const isHidden = item.visibilityStatus === 'HIDDEN';
        return (<PressableScale onPress={() => navigation.navigate('ResidentPreview', { residentId: item.id })}>
        <View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
          <View style={styles.cardHeader}>
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={16} color={theme.accent}/>
            </View>
            <View style={styles.info}>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>
                {isHidden ? localizedUiText.m_2725cac09829 : item.name}
              </SafeText>
              <SafeText variant="tiny" color="muted">{localizedUiText.m_9285cedcf26a}{item.flatNumber} • {item.tower}
              </SafeText>
            </View>
            <StatusPill label={item.connectionStatus.replace('_', ' ')} tone={item.connectionStatus === 'CONNECTED' ? 'success' : 'info'} small/>
          </View>
        </View>
      </PressableScale>);
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ChatPageHeader title={localizedUiText.m_acb2d231d94a} showBackButton={true} onBackPress={() => navigation.goBack()}/>

      <FlatList data={directory} keyExtractor={(item) => item.id} renderItem={renderItem} contentContainerStyle={[styles.listContent, createFlatListPaddingBottomStyle(insets.bottom + 40)]} showsVerticalScrollIndicator={false} refreshing={isRefreshing} onRefresh={refresh} onEndReached={() => {
            if (hasMore && !isLoadingMore) {
                void loadMore();
            }
        }} onEndReachedThreshold={0.5} ListFooterComponent={() => isLoadingMore ? (<View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={theme.accent}/>
          </View>) : null} ListHeaderComponent={<View style={styles.headerContainer}>
            <View style={styles.searchContainer}>
              <View style={[styles.searchBar, createViewBackgroundColorBorderColorStyle2(theme.surface, theme.border)]}>
                <Ionicons name="search-outline" size={16} color={theme.textSecondary}/>
                <TextInput value={search} onChangeText={setSearch} placeholder={localizedUiText.m_f46ff25055ee} placeholderTextColor={theme.textSecondary} style={[styles.searchInput, createTextInputColorStyle(theme.textPrimary)]}/>
              </View>
            </View>

            <View style={styles.filterBar}>
              <WrapRow gap={8}>
                {chips.map((chip) => {
                const isSelected = towerFilter === chip.key;
                return (<Pressable key={chip.key} onPress={() => setTowerFilter(chip.key)} style={[
                        styles.chip,
                        createPressableBackgroundColorBorderColorStyle(isSelected ? theme.accent : theme.surface, isSelected ? 'transparent' : theme.border),
                    ]}>
                      <SafeText variant="tiny" style={createSafeTextColorStyle2(isSelected ? '#FFFFFF' : theme.textSecondary)}>
                        {chip.label}
                      </SafeText>
                    </Pressable>);
            })}
              </WrapRow>
            </View>
          </View>} ListEmptyComponent={<View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={42} color={theme.textSecondary} style={styles.ioniconsMarginBottom}/>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(theme.textPrimary)}>
              {search.trim().length > 0 ? localizedUiText.m_658bf7df6bda : localizedUiText.m_404da7c1b7df}
            </SafeText>
            <SafeText variant="caption" align="center" style={createSafeTextColorStyle4(theme.textSecondary)}>
              {search.trim().length > 0
                ? localizedUiText.m_73e2b9b2d898 : localizedUiText.m_d61b7698c46c}
            </SafeText>
          </View>}/>
    </View>);
}
export default ResidentDirectoryScreen;

