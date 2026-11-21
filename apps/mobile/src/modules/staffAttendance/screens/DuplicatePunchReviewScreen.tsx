import { View, Text, FlatList, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useDuplicatePunchReview } from "../data/useDuplicatePunchReview";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import { styles } from "../styles/screens/DuplicatePunchReviewScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'DuplicatePunchReview'>;
export function DuplicatePunchReviewScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch, resolve } = useDuplicatePunchReview();
    const handleResolve = (id: string, action: 'KEEP_EXISTING' | 'KEEP_NEWER' | 'IGNORE') => {
        AppAlert.alert(String(localizedUiText.m_644a891420c8), String(localizedUiText.m_6a8ede93deec), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_7f6c3da9dbde),
                onPress: async () => {
                    await resolve(id, 'KEEP_EXISTING');
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_66b36f214571));
                },
            },
            {
                text: String(localizedUiText.m_46360bd17092),
                onPress: async () => {
                    await resolve(id, 'KEEP_NEWER');
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_c0f65ec74c51));
                },
            },
        ]);
    };
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{localizedUiText.m_dd44b51f8e0f}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_07304bcb46bc}</Text>
      </View>

      {isLoading ? (<LoadingState message={localizedUiText.m_e3cebf180a8a}/>) : error ? (<ErrorState message={error.message} onRetry={refetch}/>) : (<FlatList data={data} keyExtractor={item => item.id} renderItem={({ item }) => {
                const formattedTime = new Date(item.punchTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (<View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.staffName}>{item.staffName || localizedUiText.m_f3775bd59b10}</Text>
                    <Text style={styles.code}>{item.staffCode || localizedUiText.m_e2f79e5b6033}</Text>
                  </View>
                  <Text style={styles.punchType}>{item.punchType}</Text>
                </View>

                <View style={styles.details}>
                  <Text style={styles.detailText}>{localizedUiText.m_9f8d3539c6f3 + " "}{item.deviceCode}</Text>
                  <Text style={styles.detailText}>{localizedUiText.m_663ad582a47e + " "}{formattedTime}</Text>
                  <Text style={styles.detailText}>{localizedUiText.m_45a4e3469617 + " "}{item.suggestedAction.replace('_', ' ')}</Text>
                </View>

                <View style={styles.actions}>
                  <Pressable style={({ pressed }) => [styles.btn, pressed && styles.pressed]} onPress={() => handleResolve(item.id, 'KEEP_EXISTING')}>
                    <Text style={styles.btnText}>{localizedUiText.m_c8f193b315c8}</Text>
                  </Pressable>
                </View>
              </View>);
            }} contentContainerStyle={styles.listContent} ListEmptyComponent={<View style={styles.empty}>
              <Ionicons name="checkmark-done-circle-outline" size={48} color={Colors.success}/>
              <Text style={styles.emptyText}>{localizedUiText.m_83acc9ff114a}</Text>
            </View>}/>)}
    </ScreenContainer>);
}

