import { Text, View, FlatList, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { useBorrowRequests } from "../data/communityHooks";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CommunityStackParamList } from "../../../app/navigation/navigation.types";
import type { BorrowRequest } from "../../../shared/types/borrowLend.types";
import { styles } from "../styles/screens/BorrowRequestDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
type Props = NativeStackScreenProps<CommunityStackParamList, 'BorrowRequestDetail'>;
export function BorrowRequestDetailScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { requestId } = route.params;
    const isIncoming = requestId === 'incoming';
    const { data: requests, isLoading, refetch } = useBorrowRequests(isIncoming ? 'incoming' : 'outgoing');
    const handlePressRequest = (req: BorrowRequest) => {
        if (isIncoming && req.status === 'PENDING_APPROVAL') {
            navigation.navigate('BorrowApproval', { requestId: req.id });
        }
        else if (isIncoming && req.status === 'APPROVED') {
            navigation.navigate('ReturnConfirmation', { requestId: req.id });
        }
    };
    return (<ScreenContainer>
      <ResponsivePageHeader title={isIncoming ? localizedUiText.m_0a758b917afa : localizedUiText.m_2d00cc4257b8} onBack={() => navigation.goBack()}/>

      <FlatList data={requests} keyExtractor={(item) => item.id} renderItem={({ item }) => (<Pressable style={styles.requestCard} onPress={isIncoming && ['PENDING_APPROVAL', 'APPROVED'].includes(item.status) ? () => handlePressRequest(item) : undefined}>
            <View style={styles.cardHeader}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.itemTitle}</Text>
                <Text style={styles.personInfo}>
                  {isIncoming ? formatUiLiteral(localizedUiText.m_22b25cbd4a21, [item.borrowerName, item.borrowerUnit]) : formatUiLiteral(localizedUiText.m_2fa81e450f48, [item.ownerName, item.ownerUnit])}
                </Text>
              </View>
              <StatusBadge status={item.status} moduleType="borrow"/>
            </View>

            <Text style={styles.purposeText} numberOfLines={2}>{`"${item.purpose}"`}</Text>

            <View style={styles.cardFooter}>
              <Text style={styles.durationText}>{localizedUiText.m_298d6c7549e4 + " "}{item.durationDays}{" " + localizedUiText.m_e08c0aa8f558}</Text>
              {isIncoming && item.status === 'PENDING_APPROVAL' && (<View style={styles.actionPrompt}>
                  <Text style={styles.actionPromptText}>{localizedUiText.m_1acafc9093af}</Text>
                  <Ionicons name="chevron-forward" size={14} color={Colors.primary}/>
                </View>)}
              {isIncoming && item.status === 'APPROVED' && (<View style={styles.actionPrompt}>
                  <Text style={[styles.actionPromptText, styles.textColor]}>{localizedUiText.m_6ec1149cf27f}</Text>
                  <Ionicons name="chevron-forward" size={14} color={Colors.success}/>
                </View>)}
            </View>
          </Pressable>)} contentContainerStyle={styles.listContent} ListEmptyComponent={<View style={styles.emptyContainer}>
            <Ionicons name="mail-unread-outline" size={64} color={Colors.border}/>
            <Text style={styles.emptyTitle}>{localizedUiText.m_4b5d17faf1c5}</Text>
            <Text style={styles.emptySubtitle}>
              {isIncoming ? localizedUiText.m_cf4929a03aa6 : localizedUiText.m_e66667441770}
            </Text>
          </View>} refreshing={isLoading} onRefresh={refetch} showsVerticalScrollIndicator={false}/>
    </ScreenContainer>);
}

