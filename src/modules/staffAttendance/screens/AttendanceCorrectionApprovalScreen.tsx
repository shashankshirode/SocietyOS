import { View, Text, FlatList, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useAttendanceCorrections } from "../data/useAttendanceCorrections";
import { useAttendanceCorrectionApproval } from "../data/useAttendanceCorrectionApproval";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import { CorrectionRequestCard } from "../components/CorrectionRequestCard";
import { styles } from "../styles/screens/AttendanceCorrectionApprovalScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'AttendanceCorrectionApproval'>;
export function AttendanceCorrectionApprovalScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useAttendanceCorrections({ status: 'PENDING' });
    const { approve, reject } = useAttendanceCorrectionApproval();
    const handleApprove = (id: string, requestNumber: string) => {
        AppAlert.prompt(String(localizedUiText.m_797193f6d660), getActiveUiLiteral("m_5790c659ccc7"), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_6007acbe30b2),
                onPress: async (note?: string) => {
                    await approve(id, note || getActiveUiLiteral("m_6208403bbba9"));
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), formatUiLiteral(String(localizedUiText.m_b4b58460a38a), [requestNumber]));
                    void refetch();
                },
            },
        ]);
    };
    const handleReject = (id: string, requestNumber: string) => {
        AppAlert.prompt(String(localizedUiText.m_e169f18ad7a2), getActiveUiLiteral("m_41e187b17cfa"), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_ab604a360777),
                style: 'destructive',
                onPress: async (reason?: string) => {
                    if (!reason?.trim()) {
                        AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_8f19018a9682));
                        return;
                    }
                    await reject(id, reason);
                    AppAlert.alert(String(localizedUiText.m_aea4a04a8042), formatUiLiteral(String(localizedUiText.m_b7e8e2bc1d39), [requestNumber]));
                    void refetch();
                },
            },
        ]);
    };
    const handleReview = (id: string, requestNumber: string) => {
        AppAlert.alert(String(localizedUiText.m_f179bd11a92a), formatUiLiteral(String(localizedUiText.m_1067a30dec07), [requestNumber]), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_ab604a360777),
                style: 'destructive',
                onPress: () => handleReject(id, requestNumber),
            },
            {
                text: String(localizedUiText.m_6007acbe30b2),
                onPress: () => handleApprove(id, requestNumber),
            },
        ]);
    };
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{localizedUiText.m_2a67cd2797b7}</Text>
          <Pressable style={styles.reqBtn} onPress={() => navigation.navigate('AttendanceCorrectionRequest')}>
            <Ionicons name="add" size={18} color={Colors.primary}/>
            <Text style={styles.reqBtnText}>{localizedUiText.m_c648d3997024}</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>{localizedUiText.m_d03bebfc2298}</Text>
      </View>

      {isLoading ? (<LoadingState message={localizedUiText.m_d9d83c66de31}/>) : error ? (<ErrorState message={error.message} onRetry={refetch}/>) : (<FlatList data={data} keyExtractor={item => item.id} renderItem={({ item }) => (<CorrectionRequestCard request={item} onPress={() => handleReview(item.id, item.requestNumber)}/>)} contentContainerStyle={styles.listContent} ListEmptyComponent={<View style={styles.empty}>
              <Ionicons name="checkmark-circle-outline" size={48} color={Colors.success}/>
              <Text style={styles.emptyText}>{localizedUiText.m_fe06138f06d2}</Text>
            </View>}/>)}
    </ScreenContainer>);
}

