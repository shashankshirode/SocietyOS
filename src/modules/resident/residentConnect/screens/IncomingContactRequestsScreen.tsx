import { useState, useMemo } from "react";
import { View, Pressable, FlatList, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useIncomingRequests } from "../data/useContactRequests";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ChatPageHeader } from "../../../chat/components/ChatPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { StatusPill } from "../../../../ui/components/StatusPill";
import { WrapRow } from "../../../../ui/layout/WrapRow";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { formatResidentLocalDate } from "../../../../shared/utils/formatters";
import type { IncomingContactRequestsScreenProps } from "../../../../app/navigation/navigation.types";
import type { ContactRequest } from "../../../../shared/types/residentConnect.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createPressableBackgroundColorBorderColorStyle, createFlatListPaddingBottomStyle } from "../styles/screens/IncomingContactRequestsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
type FilterType = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export function IncomingContactRequestsScreen({ navigation }: IncomingContactRequestsScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
    const [filter, setFilter] = useState<FilterType>('PENDING');
    const { items: requests = [], isRefreshing, isLoadingMore, hasMore, loadMore, refresh, } = useIncomingRequests();
    const filteredRequests = useMemo(() => {
        return requests.filter((r) => r.status === filter);
    }, [requests, filter]);
    const chips: {
        key: FilterType;
        label: string;
    }[] = [
        { key: 'PENDING', label: String(localizedUiText.m_6da02e71e215) },
        { key: 'ACCEPTED', label: String(localizedUiText.m_a00fb0c50741) },
        { key: 'REJECTED', label: String(localizedUiText.m_dce083a2c47f) },
    ];
    const renderItem = ({ item }: {
        item: ContactRequest;
    }) => (<PressableScale onPress={() => navigation.navigate('ContactRequestDetail', { requestId: item.id })}>
      <View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
        <View style={styles.cardHeader}>
          <View style={[styles.avatar, createViewBackgroundColorStyle(theme.accentSoft)]}>
            <Ionicons name="person" size={16} color={theme.accent}/>
          </View>
          <View style={styles.info}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>
              {item.fromResidentName}
            </SafeText>
            <SafeText variant="tiny" color="muted">{localizedUiText.m_9285cedcf26a}{item.fromFlat}
            </SafeText>
          </View>
          <StatusPill label={item.urgency} tone={item.urgency === 'URGENT' ? 'danger' : 'info'} small/>
        </View>

        <View style={[styles.divider, createViewBackgroundColorStyle2(theme.border)]}/>

        <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textPrimary)}>{localizedUiText.m_1edf47d5fb6c}{item.subject}
        </SafeText>
        <SafeText variant="tiny" color="secondary" numberOfLines={2}>
          {item.message}
        </SafeText>

        <View style={styles.footer}>
          <SafeText variant="tiny" color="muted">{localizedUiText.m_abfa77dfab63}{formatResidentLocalDate(item.createdAt)}
          </SafeText>
          <Ionicons name="chevron-forward" size={16} color={theme.textSecondary}/>
        </View>
      </View>
    </PressableScale>);
    return (<View style={[styles.root, createViewBackgroundColorStyle3(theme.background)]}>
      <ChatPageHeader title={localizedUiText.m_c34f16ffb8aa} showBackButton={true} onBackPress={() => navigation.goBack()}/>

      <View style={styles.filterBar}>
        <WrapRow gap={8}>
          {chips.map((chip) => {
            const isSelected = filter === chip.key;
            return (<Pressable key={chip.key} onPress={() => setFilter(chip.key)} style={[
                    styles.chip,
                    createPressableBackgroundColorBorderColorStyle(isSelected ? theme.accent : theme.surface, isSelected ? 'transparent' : theme.border),
                ]}>
                <SafeText variant="tiny" style={createSafeTextColorStyle3(isSelected ? '#FFFFFF' : theme.textSecondary)}>
                  {chip.label}
                </SafeText>
              </Pressable>);
        })}
        </WrapRow>
      </View>

      <FlatList data={filteredRequests} keyExtractor={(item) => item.id} renderItem={renderItem} contentContainerStyle={[styles.listContent, createFlatListPaddingBottomStyle(insets.bottom + 20)]} showsVerticalScrollIndicator={false} refreshing={isRefreshing} onRefresh={refresh} onEndReached={() => {
            if (hasMore && !isLoadingMore) {
                void loadMore();
            }
        }} onEndReachedThreshold={0.5} ListFooterComponent={() => isLoadingMore ? (<View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={theme.accent}/>
          </View>) : null} ListEmptyComponent={<View style={styles.emptyContainer}>
            <Ionicons name="mail-outline" size={42} color={theme.textSecondary} style={styles.ioniconsMarginBottom}/>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle4(theme.textPrimary)}>{localizedUiText.m_1afbf8822e39}</SafeText>
            <SafeText variant="caption" align="center" style={createSafeTextColorStyle5(theme.textSecondary)}>{localizedUiText.m_e9575dc5ea43}</SafeText>
          </View>}/>
    </View>);
}
export default IncomingContactRequestsScreen;

