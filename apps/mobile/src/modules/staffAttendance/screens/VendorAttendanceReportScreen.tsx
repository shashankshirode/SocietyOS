import { View, Text, FlatList, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useVendorAttendanceReport } from "../data/useVendorAttendanceReport";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { styles } from "../styles/screens/VendorAttendanceReportScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'VendorAttendanceReport'>;
export function VendorAttendanceReportScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useVendorAttendanceReport();
    const handleVerifyInvoice = (vendorName: string) => {
        AppAlert.alert(String(localizedUiText.m_a3417ebce8df), formatUiLiteral(String(localizedUiText.m_b18b39872235), [vendorName]), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            { text: String(localizedUiText.m_6fee46ab178d), onPress: () => AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_98a64efc191e)) },
        ]);
    };
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{localizedUiText.m_1df288db0342}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_92bddb776aa3}</Text>
      </View>

      <View style={styles.alertBox}>
        <Ionicons name="information-circle-outline" size={18} color={Colors.info}/>
        <Text style={styles.alertText}>{localizedUiText.m_4541977a9c73}</Text>
      </View>

      {isLoading ? (<LoadingState message={localizedUiText.m_bd22b6680f96}/>) : error ? (<ErrorState message={error.message} onRetry={refetch}/>) : (<FlatList data={data} keyExtractor={item => item.vendorId} renderItem={({ item }) => (<View style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.vendorName}>{item.vendorName}</Text>
                  <Text style={styles.invoiceMonth}>{item.invoiceMonth}</Text>
                </View>
                <StatusBadge status={item.verificationStatus} moduleType="parking"/>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>{localizedUiText.m_00d401fbd091}</Text>
                  <Text style={styles.statVal}>{item.staffCount}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>{localizedUiText.m_6f554bd6e7dd}</Text>
                  <Text style={styles.statVal}>{item.expectedManDays}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>{localizedUiText.m_219824d3c4ff}</Text>
                  <Text style={[styles.statVal, Colors.success && styles.textColor]}>
                    {item.presentManDays}
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>{localizedUiText.m_c14da1e94396}</Text>
                  <Text style={styles.statVal}>{item.lateCount}</Text>
                </View>
              </View>

              {item.verificationStatus === 'UNDER_REVIEW' && (<Pressable style={({ pressed }) => [styles.verifyBtn, pressed && styles.btnPressed]} onPress={() => handleVerifyInvoice(item.vendorName)}>
                  <Ionicons name="checkmark-done" size={16} color={Colors.primary}/>
                  <Text style={styles.verifyBtnText}>{localizedUiText.m_62795cf3a7b7}</Text>
                </Pressable>)}
            </View>)} contentContainerStyle={styles.listContent}/>)}
    </ScreenContainer>);
}

