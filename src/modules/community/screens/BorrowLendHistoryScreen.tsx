import { Text, View, FlatList } from "react-native";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { useBorrowHistory } from "../data/communityHooks";
import { styles } from "../styles/screens/BorrowLendHistoryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
export function BorrowLendHistoryScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: history, isLoading } = useBorrowHistory();
    const mockHistory = [
        {
            id: 'h-1',
            itemTitle: 'Sapiens (Book)',
            type: 'BORROWED',
            partner: 'Sanjay Nair (A-705)',
            date: '12 May 2026',
            status: 'RETURNED',
        },
        {
            id: 'h-2',
            itemTitle: 'Hot Glue Gun',
            type: 'LENT',
            partner: 'Neha Gupta (B-1103)',
            date: '05 May 2026',
            status: 'RETURNED',
        },
        {
            id: 'h-3',
            itemTitle: 'Carrom Board',
            type: 'LENT',
            partner: 'Kunal Sen (C-302)',
            date: '28 Apr 2026',
            status: 'RETURNED',
        },
    ];
    const displayData = history && history.length > 0 ? history : mockHistory;
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_6783fef2534e} onBack={() => navigation.goBack()}/>

      <FlatList data={displayData} keyExtractor={(item) => item.id} renderItem={({ item }) => (<View style={styles.historyCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.itemTitle}>{item.itemTitle}</Text>
                <Text style={styles.partnerText}>
                  {item.type === 'BORROWED' ? formatUiLiteral(localizedUiText.m_8033d6498077, [item.partner]) : formatUiLiteral(localizedUiText.m_e6ce5df5503f, [item.partner])}
                </Text>
              </View>
              <StatusBadge status={item.status} moduleType="borrow"/>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.dateText}>{localizedUiText.m_fd8294fa5ab9 + " "}{item.date}</Text>
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{item.type}</Text>
              </View>
            </View>
          </View>)} contentContainerStyle={styles.listContent} refreshing={isLoading} showsVerticalScrollIndicator={false}/>
    </ScreenContainer>);
}

