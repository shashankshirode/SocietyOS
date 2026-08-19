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
import { useDraftBills } from "../data/useDraftBills";
import type { DraftBill } from "../../../shared/types/accounting.types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TreasurerStackParamList } from "../../../app/navigation/navigation.types";
import { getRequiredItem } from "../../../shared/utils/requiredItem";
import { styles } from "../styles/screens/DraftBillReviewScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function DraftBillReviewScreen({ route, navigation }: NativeStackScreenProps<TreasurerStackParamList, 'DraftBillReview'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { cycleId } = route.params ?? { cycleId: 'bc-001' };
    const { data: draftBills = [], isLoading, error, publishBills, isPublishing } = useDraftBills(cycleId);
    const handlePublishAll = () => {
        AppAlert.alert(String(localizedUiText.m_49304035858a), String(localizedUiText.m_3284d619cf27), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_ff151035b355),
                onPress: async () => {
                    await publishBills();
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_b06b8538ceb3));
                    navigation.goBack();
                },
            },
        ]);
    };
    const renderItem = ({ item, index }: {
        item: DraftBill;
        index: number;
    }) => (<Animated.View entering={FadeInLeft.delay(index * 30).duration(300)}>
      <AppCard style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.unitNum}>{item.unitNumber}</Text>
          <StatusBadge label={item.status} type={item.status === 'PUBLISHED' ? 'success' : 'warning'}/>
        </View>

        <Text style={styles.owner}>{localizedUiText.m_e6c5b4a033e1 + " "}{item.ownerName}</Text>
        <Text style={styles.wing}>{item.wing}</Text>

        <View style={styles.chargesSummary}>
          <View style={styles.chargeItem}>
            <Text style={styles.chargeLbl}>{localizedUiText.m_6e52475474a0}</Text>
            <Text style={styles.chargeVal}>₹{item.previousDue.toLocaleString()}</Text>
          </View>
          <View style={styles.chargeItem}>
            <Text style={styles.chargeLbl}>{localizedUiText.m_84b56ae8bccb}</Text>
            <Text style={styles.chargeVal}>₹{item.currentCharges.toLocaleString()}</Text>
          </View>
          <View style={styles.chargeItem}>
            <Text style={styles.chargeLbl}>{localizedUiText.m_07907a24bce9}</Text>
            <Text style={[styles.chargeVal, styles.textFontWeightColor]}>
              ₹{item.totalPayable.toLocaleString()}
            </Text>
          </View>
        </View>

        {item.hasWarning && item.warningMessage ? (<View style={styles.warningBox}>
            <Text style={styles.warningText}>⚠️ {item.warningMessage}</Text>
          </View>) : null}
      </AppCard>
    </Animated.View>);
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_bece152cee58} showBack onBack={navigation.goBack}/>

      {draftBills.length > 0 && getRequiredItem(draftBills, 0, "DraftBillReviewScreen.tsx").status === 'DRAFT' ? (<View style={styles.publishHeader}>
          <AppButton title={localizedUiText.m_61b69a4de0c2} variant="primary" onPress={handlePublishAll} loading={isPublishing}/>
        </View>) : null}

      {isLoading ? (<View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary}/>
        </View>) : error ? (<EmptyState title={localizedUiText.m_3ba747dc00f6} description={error.message} iconName="alert-circle-outline"/>) : draftBills.length === 0 ? (<EmptyState title={localizedUiText.m_879752e90cff} description={localizedUiText.m_00e990de407c} iconName="alert-circle-outline"/>) : (<FlatList data={draftBills} renderItem={renderItem} keyExtractor={item => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}/>)}
    </SafeAreaView>);
}

