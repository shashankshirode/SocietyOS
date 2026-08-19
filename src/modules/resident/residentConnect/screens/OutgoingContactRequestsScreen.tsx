import { useState, useMemo } from "react";
import { FlatList, Pressable, Text, View, ActivityIndicator, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../../shared/constants/colors";
import { AppCard } from "../../../../shared/cards/AppCard";
import { ChatPageHeader } from "../../../chat/components/ChatPageHeader";
import { EmptyState } from "../../../../shared/feedback/EmptyState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { StatusBadge, getContactRequestStatusBadgeType, getContactRequestUrgencyBadgeType } from "../../../../shared/components/StatusBadge";
import { useOutgoingRequests } from "../data/useContactRequests";
import { getContactCategoryLabel, formatResidentLocalDate } from "../../../../shared/utils/formatters";
import type { OutgoingContactRequestsScreenProps } from "../../../../app/navigation/navigation.types";
import type { ContactRequest } from "../../../../shared/types/residentConnect.types";
import { styles, createFlatListPaddingBottomStyle } from "../styles/screens/OutgoingContactRequestsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function OutgoingContactRequestsScreen({ navigation }: OutgoingContactRequestsScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [statusFilter, setStatusFilter] = useState<'PENDING' | 'ACCEPTED' | 'REJECTED' | 'ALL'>('PENDING');
    const insets = useSafeAreaInsets();
    const { items: requests = [], isInitialLoading: isLoading, isRefreshing, isLoadingMore, hasMore, loadMore, refresh, errorMessage, } = useOutgoingRequests();
    const filteredRequests = useMemo(() => {
        return requests.filter((r) => statusFilter === 'ALL' || r.status === statusFilter);
    }, [requests, statusFilter]);
    if (isLoading && !isRefreshing)
        return <LoadingState />;
    if (errorMessage) {
        return (<ErrorState title={localizedUiText.m_3cc97f7fed90} message={localizedUiText.m_1b7bc7e07e29} onRetry={refresh}/>);
    }
    const renderItem = ({ item, index }: {
        item: ContactRequest;
        index: number;
    }) => {
        return (<Animated.View entering={FadeInLeft.delay(index * 30).duration(350)}>
        <AppCard style={styles.card} onPress={() => navigation.navigate('ContactRequestDetail', { requestId: item.id })}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.recipientFlat}>{localizedUiText.m_9285cedcf26a + " "}{item.toFlat}</Text>
              <Text style={styles.recipientName}>{item.toResidentName}</Text>
            </View>
            <View style={styles.badgesRow}>
              <StatusBadge label={item.urgency} type={getContactRequestUrgencyBadgeType(item.urgency)} style={styles.badge}/>
              <StatusBadge label={item.status} type={getContactRequestStatusBadgeType(item.status)} style={styles.badge}/>
            </View>
          </View>

          <View style={styles.divider}/>

          <Text style={styles.subjectText} numberOfLines={1}>{item.subject}</Text>
          <Text style={styles.previewText} numberOfLines={2}>{item.message}</Text>

          {item.status === 'REJECTED' && (<View style={styles.rejectionNotice}>
              <Text style={styles.rejectionText}>{localizedUiText.m_dc9be6b4ec2b}</Text>
            </View>)}

          {item.status === 'BLOCKED' && (<View style={styles.rejectionNotice}>
              <Text style={[styles.rejectionText, styles.textColor]}>{localizedUiText.m_1408d62fbe2e}</Text>
            </View>)}

          <View style={styles.cardFooter}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{getContactCategoryLabel(item.category)}</Text>
            </View>
            <Text style={styles.dateText}>{localizedUiText.m_45ad42321fbd + " "}{formatResidentLocalDate(item.createdAt)}</Text>
          </View>
        </AppCard>
      </Animated.View>);
    };
    return (<View style={styles.safeArea}>
      <ChatPageHeader title={localizedUiText.m_128387839c5b} showBackButton={true} onBackPress={() => navigation.goBack()}/>
      <View style={styles.mainContainer}>
        
        
        <View style={styles.filterOuter}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {(['PENDING', 'ACCEPTED', 'REJECTED', 'ALL'] as const).map((filter) => (<Pressable key={filter} style={[styles.filterChip, statusFilter === filter && styles.filterChipActive]} onPress={() => setStatusFilter(filter)}>
                <Text style={[styles.filterChipText, statusFilter === filter && styles.filterChipTextActive]}>
                  {filter.replace(/_/g, ' ')}
                </Text>
              </Pressable>))}
          </ScrollView>
        </View>

        <FlatList data={filteredRequests} renderItem={renderItem} keyExtractor={(item) => item.id} contentContainerStyle={[styles.listContent, createFlatListPaddingBottomStyle(insets.bottom + 40)]} showsVerticalScrollIndicator={false} refreshing={isRefreshing} onRefresh={refresh} onEndReached={() => {
            if (hasMore && !isLoadingMore) {
                void loadMore();
            }
        }} onEndReachedThreshold={0.5} ListFooterComponent={() => isLoadingMore ? (<View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={Colors.primary}/>
            </View>) : null} ListEmptyComponent={<EmptyState title={localizedUiText.m_98865cdaa978} description={localizedUiText.m_deb6099d3302} iconName="mail-outline"/>}/>
      </View>
    </View>);
}
export default OutgoingContactRequestsScreen;

