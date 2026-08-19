import { ActivityIndicator, FlatList, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { formatCurrencyAmount } from "../../../../shared/formatters/currencyFormatter";
import { formatDate } from "../../../../shared/formatters/dateFormatter";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ContentFrame } from "../../../../ui/layout/ContentFrame";
import { getResidentScreenBottomPadding } from "../../../../ui/layout/residentScreenSpacing";
import { useResponsiveLayout } from "../../../../ui/layout/useResponsiveLayout";
import { ScreenErrorState } from "../../../../ui/states/ScreenErrorState";
import type { PaymentMethod } from "../../../../shared/types/bill.types";
import type { ResidentLedgerEntry } from "../data/residentBilling.types";
import { useFlatLedger } from "../hooks/useFlatLedger";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createSafeTextColorStyle9, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createFlatListPaddingBottomPaddingHorizontalStyle, createViewBackgroundColorBorderColorStyle2 } from "../styles/screens/FlatLedgerScreen.styles";
export function FlatLedgerScreen() {
    const theme = useResidentTheme();
    const messages = useMessages();
    const insets = useSafeAreaInsets();
    const { screenPadding } = useResponsiveLayout();
    const ledger = messages.resident.billing.ledgerScreen;
    const { entries, totalOutstanding, isLoading, isLoadingMore, error, loadMore, retry, } = useFlatLedger();
    const bottomPadding = getResidentScreenBottomPadding({
        safeAreaBottom: insets.bottom,
        hasBottomTabs: true,
        hasStickyFooter: false,
    });
    const paymentMethodLabel = (method?: PaymentMethod) => {
        const billing = messages.resident.billing;
        if (method === 'UPI')
            return billing.paymentMethodUPI;
        if (method === 'CARD')
            return billing.paymentMethodCard;
        if (method === 'NET_BANKING')
            return billing.paymentMethodNetBanking;
        if (method === 'CASH_CHEQUE')
            return billing.paymentMethodCashCheque;
        return billing.paymentMethodMock;
    };
    const renderEntry = ({ item }: {
        item: ResidentLedgerEntry;
    }) => {
        const isCredit = item.kind === 'paymentReceived';
        const title = isCredit ? ledger.paymentReceived(paymentMethodLabel(item.paymentMethod)) : ledger.billIssued;
        return (<View style={[styles.entryCard, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}> 
        <View style={[styles.entryIcon, createViewBackgroundColorStyle(isCredit ? theme.successSoft : theme.accentSoft)]}> 
          <Ionicons name={isCredit ? 'checkmark-circle-outline' : 'receipt-outline'} size={20} color={isCredit ? theme.success : theme.accent}/>
        </View>
        <View style={styles.entryInfo}>
          <SafeText variant="caption" style={createSafeTextColorStyle(theme.textPrimary)}>{title}</SafeText>
          <SafeText variant="tiny" style={createSafeTextColorStyle2(theme.textSecondary)} numberOfLines={1}>{item.billTitle}</SafeText>
          <SafeText variant="tiny" style={createSafeTextColorStyle3(theme.textSecondary)}>{formatDate(item.occurredAt)}</SafeText>
        </View>
        <SafeText variant="caption" style={createSafeTextColorStyle4(isCredit ? theme.success : theme.danger)}>
          {formatCurrencyAmount(item.amount, item.currencyCode)}
        </SafeText>
      </View>);
    };
    if (error && entries.length === 0) {
        return (<View style={[styles.root, createViewBackgroundColorStyle2(theme.background)]}> 
        <ResidentPageHeader title={ledger.title} titleKey="resident.billing.ledgerScreen.title"/>
        <ScreenErrorState title={messages.resident.billing.errors.ledgerTitle} message={messages.resident.billing.errors.ledgerDescription} onRetry={() => void retry()}/>
      </View>);
    }
    return (<View style={[styles.root, createViewBackgroundColorStyle3(theme.background)]}> 
      <ResidentPageHeader title={ledger.title} titleKey="resident.billing.ledgerScreen.title"/>
      <ContentFrame style={styles.listFrame}>
        <FlatList data={entries} keyExtractor={(entry) => entry.id} renderItem={renderEntry} contentContainerStyle={[
            styles.content,
            createFlatListPaddingBottomPaddingHorizontalStyle(bottomPadding, screenPadding),
        ]} ListHeaderComponent={(<View style={styles.headerStack}>
              <View style={[styles.balanceCard, createViewBackgroundColorBorderColorStyle2(theme.surface, theme.border)]}> 
                <SafeText variant="tiny" color="muted">{ledger.runningBalance}</SafeText>
                <SafeText variant="display" style={createSafeTextColorStyle5(totalOutstanding > 0 ? theme.danger : theme.success)}>
                  {formatCurrencyAmount(totalOutstanding)}
                </SafeText>
                <SafeText variant="caption" color="secondary" style={styles.safeTextFontWeight}>
                  {totalOutstanding > 0 ? ledger.outstandingBalance : ledger.allDuesCleared}
                </SafeText>
              </View>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle6(theme.textPrimary)}>{ledger.timeline}</SafeText>
            </View>)} ListEmptyComponent={!isLoading ? (<View style={styles.empty}>
              <Ionicons name="receipt-outline" size={38} color={theme.textSecondary}/>
              <SafeText variant="title" style={createSafeTextColorStyle7(theme.textPrimary)}>{ledger.emptyTitle}</SafeText>
              <SafeText variant="caption" align="center" style={createSafeTextColorStyle8(theme.textSecondary)}>{ledger.emptyDescription}</SafeText>
            </View>) : null} ListFooterComponent={isLoading || isLoadingMore ? (<View style={styles.loader}>
              <ActivityIndicator size="small" color={theme.accent}/>
              {isLoadingMore ? <SafeText variant="tiny" style={createSafeTextColorStyle9(theme.textSecondary)}>{ledger.loadingMore}</SafeText> : null}
            </View>) : null} onEndReached={() => void loadMore()} onEndReachedThreshold={0.35} showsVerticalScrollIndicator={false}/>
      </ContentFrame>
    </View>);
}
export default FlatLedgerScreen;

