import { View, Text, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useBiometricSyncJobs } from "../data/useBiometricSyncJobs";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import { SyncJobCard } from "../components/SyncJobCard";
import { AttendancePrivacyNotice } from "../components/AttendancePrivacyNotice";
import { styles } from "../styles/screens/BiometricSyncJobLogsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'BiometricSyncJobLogs'>;
export function BiometricSyncJobLogsScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useBiometricSyncJobs();
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{localizedUiText.m_ecb87d29537c}</Text>
          <Pressable style={styles.reviewBtn} onPress={() => navigation.navigate('BiometricSyncErrorReview', { syncJobId: 'job-010' })}>
            <Ionicons name="alert-circle-outline" size={16} color={Colors.primary}/>
            <Text style={styles.reviewBtnText}>{localizedUiText.m_d912a8e3440f}</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>{localizedUiText.m_e46dc280c49c}</Text>
      </View>

      <AttendancePrivacyNotice />

      {isLoading ? (<LoadingState message={localizedUiText.m_5f0543134b28}/>) : error ? (<ErrorState message={error.message} onRetry={refetch}/>) : (<FlatList data={data} keyExtractor={item => item.id} renderItem={({ item }) => <SyncJobCard job={item}/>} contentContainerStyle={styles.listContent} ListEmptyComponent={<View style={styles.empty}>
              <Text style={styles.emptyText}>{localizedUiText.m_d8d68c9a9226}</Text>
            </View>}/>)}
    </ScreenContainer>);
}

