import { FlatList, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../shared/constants/colors";
import { AppHeader } from "../../../shared/components/AppHeader";
import { AppCard } from "../../../shared/cards/AppCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { useFlatLedger } from "../data/useFlatLedger";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TreasurerStackParamList } from "../../../app/navigation/navigation.types";
import type { LedgerEntry } from "../../../shared/types/ledger.types";
import { styles } from "../styles/screens/FlatLedgerScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function FlatLedgerScreen({ route, navigation }: NativeStackScreenProps<TreasurerStackParamList, 'FlatLedger'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { unitId = 'unit-001' } = route.params ?? {};
    const { data: ledger, isLoading, error } = useFlatLedger(unitId);
    const renderEntryItem = ({ item, index }: {
        item: LedgerEntry;
        index: number;
    }) => (<Animated.View entering={FadeInLeft.delay(index * 20).duration(300)}>
      <AppCard style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.entryDate}>{item.date}</Text>
          <StatusBadge label={item.type} type={item.type === 'BILL' ? 'neutral' : 'success'}/>
        </View>

        <Text style={styles.desc}>{item.description}</Text>
        <Text style={styles.refNum}>{localizedUiText.m_823960a09c43 + " "}{item.referenceNumber}</Text>

        <View style={styles.amountsRow}>
          <View>
            <Text style={styles.lbl}>{localizedUiText.m_d2ccb765f83d}</Text>
            <Text style={styles.debitVal}>
              {item.debit > 0 ? `₹${item.debit.toLocaleString()}` : '—'}
            </Text>
          </View>
          <View style={styles.viewAlignItems}>
            <Text style={styles.lbl}>{localizedUiText.m_4c5b4c1e7e51}</Text>
            <Text style={styles.creditVal}>
              {item.credit > 0 ? `₹${item.credit.toLocaleString()}` : '—'}
            </Text>
          </View>
          <View style={styles.viewAlignItems2}>
            <Text style={styles.lbl}>{localizedUiText.m_d05e07b7c14e}</Text>
            <Text style={styles.balanceVal}>₹{item.balance.toLocaleString()}</Text>
          </View>
        </View>
      </AppCard>
    </Animated.View>);
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_3a7ee5724404} showBack onBack={navigation.goBack}/>

      {isLoading ? (<View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary}/>
        </View>) : error ? (<EmptyState title={localizedUiText.m_e5705ff91f54} description={error.message} iconName="alert-circle-outline"/>) : !ledger ? (<EmptyState title={localizedUiText.m_5c33a511f9be} description={localizedUiText.m_0767ca944e94} iconName="journal-outline"/>) : (<View style={styles.viewFlex}>
          <View style={styles.summaryPanel}>
            <Text style={styles.panelTitle}>{localizedUiText.m_4e545960f1bf + " "}{ledger.unitNumber}{" " + localizedUiText.m_ee69eb4afc76}</Text>
            <Text style={styles.owner}>{localizedUiText.m_9a638cfefd87 + " "}{ledger.ownerName}</Text>
            <View style={styles.summaryBoxGrid}>
              <View style={styles.summaryBoxItem}>
                <Text style={styles.summaryBoxLbl}>{localizedUiText.m_a32f3e160106}</Text>
                <Text style={styles.summaryBoxVal}>₹{ledger.totalDebits.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryBoxItem}>
                <Text style={styles.summaryBoxLbl}>{localizedUiText.m_2a6b24ad2872}</Text>
                <Text style={[styles.summaryBoxVal, styles.textColor]}>
                  ₹{ledger.totalCredits.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          <FlatList data={ledger.entries} renderItem={renderEntryItem} keyExtractor={item => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}/>
        </View>)}
    </SafeAreaView>);
}

