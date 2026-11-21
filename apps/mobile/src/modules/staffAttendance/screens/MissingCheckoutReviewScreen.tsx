import { View, Text, FlatList, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useMissingCheckoutReview } from "../data/useMissingCheckoutReview";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import { styles } from "../styles/screens/MissingCheckoutReviewScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'MissingCheckoutReview'>;
export function MissingCheckoutReviewScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch, createCorrection } = useMissingCheckoutReview();
    const handleResolve = (id: string, staffName: string) => {
        AppAlert.prompt(String(localizedUiText.m_8b5b5eeca445), formatUiLiteral(String(localizedUiText.m_46a90d49e03f), [staffName]), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_155f816c0407),
                onPress: async (time?: string) => {
                    if (!time?.trim() || !time.includes(':')) {
                        AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_1f657988a64c));
                        return;
                    }
                    await createCorrection(id, time, getActiveUiLiteral("m_41f36de039da"));
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_eb7d95171471));
                },
            },
        ]);
    };
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{localizedUiText.m_740ee09e67c8}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_3158de30e745}</Text>
      </View>

      {isLoading ? (<LoadingState message={localizedUiText.m_bdf35888e71e}/>) : error ? (<ErrorState message={error.message} onRetry={refetch}/>) : (<FlatList data={data} keyExtractor={item => item.id} renderItem={({ item }) => (<View style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.staffName}>{item.staffName}</Text>
                  <Text style={styles.code}>{item.staffCode} · {item.date}</Text>
                </View>
                <Text style={styles.shiftName}>{item.shiftName}</Text>
              </View>

              <View style={styles.details}>
                <Text style={styles.detailText}>{localizedUiText.m_279308a788ae + " "}{item.firstCheckInTime}</Text>
                <Text style={styles.detailText}>{localizedUiText.m_5995b5b679e7 + " "}{item.shiftEndTime}</Text>
                {item.hoursWorkedEstimate && (<Text style={styles.detailText}>{localizedUiText.m_5353be9d8140 + " "}{item.hoursWorkedEstimate}{localizedUiText.m_aaa9402664f1}</Text>)}
              </View>

              <View style={styles.actions}>
                <Pressable style={({ pressed }) => [styles.btn, pressed && styles.pressed]} onPress={() => handleResolve(item.id, item.staffName)}>
                  <Ionicons name="create-outline" size={14} color={Colors.white}/>
                  <Text style={styles.btnText}>{localizedUiText.m_9be93420612d}</Text>
                </Pressable>
              </View>
            </View>)} contentContainerStyle={styles.listContent} ListEmptyComponent={<View style={styles.empty}>
              <Ionicons name="checkmark-done-circle-outline" size={48} color={Colors.success}/>
              <Text style={styles.emptyText}>{localizedUiText.m_8e9b18ba1cb0}</Text>
            </View>}/>)}
    </ScreenContainer>);
}

