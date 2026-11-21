import { Ionicons } from "@expo/vector-icons";
import { View, Text, FlatList } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useBiometricSyncErrors } from "../data/useBiometricSyncErrors";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import { SyncErrorCard } from "../components/SyncErrorCard";
import { AttendancePrivacyNotice } from "../components/AttendancePrivacyNotice";
import { styles } from "../styles/screens/BiometricSyncErrorReviewScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'BiometricSyncErrorReview'>;
export function BiometricSyncErrorReviewScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { syncJobId } = route.params;
    const { data, isLoading, error, refetch, resolve, ignore } = useBiometricSyncErrors(syncJobId);
    const handleResolve = (id: string) => {
        AppAlert.prompt(String(localizedUiText.m_4b87b5f34ce4), getActiveUiLiteral("m_2410e0f4dc95"), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_c8f193b315c8),
                onPress: async (note?: string) => {
                    if (!note?.trim()) {
                        AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_88c896557575));
                        return;
                    }
                    await resolve(id, note);
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_bf8bb9528b2d));
                },
            },
        ]);
    };
    const handleIgnore = (id: string) => {
        AppAlert.alert(String(localizedUiText.m_7325b8dc5f42), String(localizedUiText.m_3fc1609ed517), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_d37b60bc3850),
                style: 'destructive',
                onPress: async () => {
                    await ignore(id, getActiveUiLiteral("m_4103373dd023"));
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_b042f5a406a9));
                },
            },
        ]);
    };
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{localizedUiText.m_a681b78aabc1}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_4318cbe53be4}</Text>
      </View>

      <AttendancePrivacyNotice />

      {isLoading ? (<LoadingState message={localizedUiText.m_d36b39cceae1}/>) : error ? (<ErrorState message={error.message} onRetry={refetch}/>) : (<FlatList data={data} keyExtractor={item => item.id} renderItem={({ item }) => (<SyncErrorCard error={item} onResolvePress={() => handleResolve(item.id)} onIgnorePress={() => handleIgnore(item.id)}/>)} contentContainerStyle={styles.listContent} ListEmptyComponent={<View style={styles.empty}>
              <Ionicons name="checkmark-circle-outline" size={48} color={Colors.success}/>
              <Text style={styles.emptyText}>{localizedUiText.m_5e2c920b5efa}</Text>
            </View>}/>)}
    </ScreenContainer>);
}

