import { ScrollView, Text, View } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Colors } from "../../../shared/constants/colors";
import { AppHeader } from "../../../shared/components/AppHeader";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppButton } from "../../../shared/components/AppButton";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { InfoRow } from "../../../shared/components/InfoRow";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TreasurerStackParamList } from "../../../app/navigation/navigation.types";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/ReceiptDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function ReceiptDetailScreen({ route, navigation }: NativeStackScreenProps<TreasurerStackParamList, 'ReceiptDetail'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { receiptId } = route.params ?? { receiptId: 'rcpt-001' };
    const receipt = {
        id: receiptId,
        receiptNumber: `RCPT-2026-${receiptId.replace(/[^\d]/g, '') || '8239'}`,
        paymentNumber: 'PAY-2026-9902',
        unitNumber: 'A-1204',
        wing: 'A Wing',
        residentName: 'Shashank Shirode',
        amount: 8025,
        paymentMode: 'CHEQUE',
        paymentDate: new Date().toISOString().split('T')[0],
        referenceNumberMasked: 'CHQ******',
        receivedBy: 'Society Treasurer',
        createdAt: new Date().toISOString(),
        status: 'GENERATED',
        ledgerImpact: 'CREDITED_TO_FLAT_LEDGER'
    };
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_7e677ab8c7f3} showBack onBack={navigation.goBack}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(400)} style={styles.headerVisual}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark-done" size={36} color={Colors.success}/>
          </View>
          <Text style={styles.receiptNum}>{receipt.receiptNumber}</Text>
          <Text style={styles.amount}>₹{receipt.amount.toLocaleString()}</Text>
          <StatusBadge label={receipt.status} type="success"/>
        </Animated.View>

        <AppCard style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>{localizedUiText.m_45989de49fb7}</Text>
          <InfoRow label={localizedUiText.m_987aead6d4fd} value={receipt.residentName}/>
          <InfoRow label={localizedUiText.m_5b693eb078ba} value={`Unit ${receipt.unitNumber} (${receipt.wing})`}/>
          <InfoRow label={localizedUiText.m_10b5440f239d} {...includeWhenPresent("value", receipt.paymentDate)}/>
          <InfoRow label={localizedUiText.m_f14417611f08} value={receipt.paymentMode}/>
          <InfoRow label={localizedUiText.m_71bf90935fc2} value={receipt.referenceNumberMasked}/>
          <InfoRow label={localizedUiText.m_8e807949dbd5} value={receipt.receivedBy}/>
          <InfoRow label={localizedUiText.m_3fd9daea4397} value={receipt.ledgerImpact.replace(/_/g, ' ')}/>
        </AppCard>

        <AppButton title={localizedUiText.m_98bad4f12cd2} variant="secondary" onPress={() => AppAlert.alert(String(localizedUiText.m_df0fe79898ef), String(localizedUiText.m_086e0bc3d478))} style={styles.actionBtn}/>
        <AppButton title={localizedUiText.m_11a6767d5674} variant="primary" onPress={() => navigation.navigate('TreasurerHome')} style={styles.doneBtn}/>
      </ScrollView>
    </SafeAreaView>);
}

