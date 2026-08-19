import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { useFeatureFlagManagement } from "../hooks/useFeatureFlagManagement";
import { FeatureFlagRow } from "../components/FeatureFlagRow";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/FeatureFlagManagementScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'FeatureFlagManagement'>;
export function FeatureFlagManagementScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useFeatureFlagManagement();
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_d692c761cbf9} subtitle={localizedUiText.m_e6053b3ee35b}/>
        <ScrollView contentContainerStyle={styles.scroll}>
          {data.map((item) => (<FeatureFlagRow key={item.flagKey} flag={item} onValueChange={() => navigation.navigate('FeatureFlagChangeConfirmation', {
                flagKey: item.flagKey,
            })}/>))}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

