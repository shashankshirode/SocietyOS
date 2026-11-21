import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { Text, View, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { EmergencySafetyStackParamList } from "../../../../../app/navigation/navigation.types";
import { useSeniorDailyCheckIn } from "../../data/useSeniorDailyCheckIn";
import { LoadingState } from "../../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../../../shared/theme";
import { styles } from "../../styles/screens/safety_screens/SeniorDailyCheckInScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<EmergencySafetyStackParamList, 'SeniorDailyCheckIn'>;
export function SeniorDailyCheckInScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, checkIn, refetch } = useSeniorDailyCheckIn();
    const handleCheckIn = async () => {
        try {
            await checkIn({ status: 'COMPLETED', notes: getActiveUiLiteral("m_6ca6eb1d4dea") });
            AppAlert.alert(String(localizedUiText.m_ee98fa0753df), String(localizedUiText.m_7e07f217688e));
        }
        catch {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_ea889be4970f));
        }
    };
    const handleRequestHelp = async () => {
        try {
            await checkIn({ status: 'HELP_REQUESTED', notes: getActiveUiLiteral("m_4d2bffc316b5") });
            AppAlert.alert(String(localizedUiText.m_fafc05454e39), String(localizedUiText.m_d7db350413cf));
        }
        catch {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_c750705ddf70));
        }
    };
    if (isLoading)
        return <LoadingState message={localizedUiText.m_9842bca6f477}/>;
    if (!data)
        return <ErrorState message={localizedUiText.m_3b41ba9c7cb8}/>;
    const chkinData = data;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    const todayCheckIn = chkinData?.find((c) => c.date === new Date().toISOString().split('T')[0]);
    return (<ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{localizedUiText.m_af4b9750f54b}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_7445f289d2b5}</Text>

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>{localizedUiText.m_e4a7a009829a}</Text>
          <Text style={[styles.statusText, todayCheckIn?.status === 'COMPLETED' ? styles.successText : styles.pendingText]}>
            {todayCheckIn?.status || localizedUiText.m_332011b91ccd}
          </Text>
        </View>

        {!todayCheckIn && (<View style={styles.actions}>
            <Pressable style={styles.checkInBtn} onPress={handleCheckIn}>
              <Ionicons name="checkmark-circle" size={48} color={Colors.white}/>
              <Text style={styles.btnText}>{localizedUiText.m_2b60696e1aac}</Text>
            </Pressable>

            <Pressable style={styles.helpBtn} onPress={handleRequestHelp}>
              <Ionicons name="help-circle" size={24} color={Colors.white}/>
              <Text style={styles.helpBtnText}>{localizedUiText.m_88429fea51d1}</Text>
            </Pressable>
          </View>)}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{localizedUiText.m_998ecd7aada9}</Text>
          <View style={styles.historyCard}>
            {chkinData?.map(c => (<View key={c.id} style={styles.historyRow}>
                <Text style={styles.historyDate}>{c.date}</Text>
                <Text style={styles.historyStatus}>{c.status}</Text>
              </View>))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

