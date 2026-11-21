import { View, Text, FlatList } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useBiometricDevices } from "../data/useBiometricDevices";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { BiometricDeviceCard } from "../components/BiometricDeviceCard";
import { AttendancePrivacyNotice } from "../components/AttendancePrivacyNotice";
import { styles } from "../styles/screens/BiometricDeviceListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'BiometricDeviceList'>;
export function BiometricDeviceListScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useBiometricDevices();
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{localizedUiText.m_333f57f51ea2}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_c879a245970b}</Text>
      </View>

      <AttendancePrivacyNotice />

      {isLoading ? (<LoadingState message={localizedUiText.m_5e4c7f27c4aa}/>) : error ? (<ErrorState message={error.message} onRetry={refetch}/>) : (<FlatList data={data} keyExtractor={item => item.id} renderItem={({ item }) => (<BiometricDeviceCard device={item} onPress={() => navigation.navigate('BiometricDeviceDetail', { deviceId: item.id })}/>)} contentContainerStyle={styles.listContent} ListEmptyComponent={<View style={styles.empty}>
              <Text style={styles.emptyText}>{localizedUiText.m_2b611b595f08}</Text>
            </View>}/>)}
    </ScreenContainer>);
}

