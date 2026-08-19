import { FlatList, Text, View, ActivityIndicator } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../shared/constants/colors";
import { AppHeader } from "../../../shared/components/AppHeader";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppButton } from "../../../shared/components/AppButton";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { useDefaulterReport } from "../data/useDefaulterReport";
import type { Defaulter } from "../../../shared/types/accounting.types";
import { styles } from "../styles/screens/DefaulterReportScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
export function DefaulterReportScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: defaulters = [], isLoading, error, refetch } = useDefaulterReport();
    const handleSendReminder = (item: Defaulter) => {
        AppAlert.alert(String(localizedUiText.m_0673920bdbc9), formatUiLiteral(String(localizedUiText.m_954b94da9078), [item.residentDisplayName, item.unitNumber]), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_f6f4688ff23d),
                onPress: () => {
                    AppAlert.alert(String(localizedUiText.m_122f8864d808), formatUiLiteral(String(localizedUiText.m_7eccfa801bab), [item.residentDisplayName]));
                    refetch();
                },
            },
        ]);
    };
    const getAgingLabel = (bucket: string) => {
        return bucket.replace(/_/g, ' ');
    };
    const renderItem = ({ item, index }: {
        item: Defaulter;
        index: number;
    }) => (<Animated.View entering={FadeInLeft.delay(index * 30).duration(300)}>
      <AppCard style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.unitNum}>{item.unitNumber}</Text>
          <StatusBadge label={getAgingLabel(item.ageingBucket)} type="danger"/>
        </View>

        <Text style={styles.resident}>{item.residentDisplayName}</Text>
        <Text style={styles.wing}>{item.wing}{" " + localizedUiText.m_d9db0a24446b + " "}{item.oldestDueMonth}</Text>

        <View style={styles.duesRow}>
          <Text style={styles.duesLbl}>{localizedUiText.m_491bc6b1f4d7}</Text>
          <Text style={styles.duesVal}>₹{item.outstandingAmount.toLocaleString()}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{localizedUiText.m_fac81e15d33d + " "}{item.reminderCount}</Text>
          <Text style={styles.metaText}>{localizedUiText.m_fe0ff6792c12 + " "}{item.noticesSent}</Text>
        </View>

        <AppButton title={localizedUiText.m_0673920bdbc9} variant="secondary" compact onPress={() => handleSendReminder(item)} style={styles.reminderBtn}/>
      </AppCard>
    </Animated.View>);
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_9a9b44898fb4} showBack onBack={navigation.goBack}/>

      {isLoading ? (<View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary}/>
        </View>) : error ? (<EmptyState title={localizedUiText.m_e27b44e2a39e} description={error.message} iconName="alert-circle-outline"/>) : defaulters.length === 0 ? (<EmptyState title={localizedUiText.m_9740d1b68a1b} description={localizedUiText.m_2e1b38b8cb7d} iconName="checkmark-circle-outline"/>) : (<FlatList data={defaulters} renderItem={renderItem} keyExtractor={item => item.unitId} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}/>)}
    </SafeAreaView>);
}

