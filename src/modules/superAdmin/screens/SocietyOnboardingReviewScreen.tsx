import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { AppButton } from "../../../shared/components/AppButton";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { useOnboardingDraftDetail } from "../hooks/useOnboardingDraftDetail";
import { SuperAdminWarningBanner } from "../components/SuperAdminWarningBanner";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/SocietyOnboardingReviewScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'SocietyOnboardingReview'>;
export function SocietyOnboardingReviewScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { draftId } = route.params;
    const { data, isLoading, error, refetch } = useOnboardingDraftDetail(draftId);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    const handleActivate = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'SuperAdminHome' }],
        });
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_7fe1cfa40e83} subtitle={localizedUiText.m_dfc7d751c37d}/>
        <ScrollView contentContainerStyle={styles.scroll}>
          <SuperAdminWarningBanner message={localizedUiText.m_992b909b9f63}/>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{localizedUiText.m_a0d57349fb67}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_ab1a0aa91701}</Text>
              <Text style={styles.val}>{data.societyName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_a1a33b30acd3}</Text>
              <Text style={styles.val}>{data.city}, {data.state}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_9fb6669a77ea}</Text>
              <Text style={styles.val}>{data.approximateUnitCount}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_ca1143eb9999}</Text>
              <Text style={styles.val}>{data.primaryContactName} ({data.primaryContactMobile})</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_7a6c4da06ed9}</Text>
              <Text style={styles.val}>{data.initialAdminEmail}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{localizedUiText.m_c3b74c9d50e3}</Text>
            <Text style={styles.checkItem}>{localizedUiText.m_f116bca63a65}</Text>
            <Text style={styles.checkItem}>{localizedUiText.m_9202a63dd74e}</Text>
            <Text style={styles.checkItem}>{localizedUiText.m_e4292c599a99}</Text>
            <Text style={styles.checkItem}>{localizedUiText.m_7c67697ec08a}</Text>
          </View>

          <View style={styles.btnBox}>
            <AppButton title={localizedUiText.m_e64896eb6afe} onPress={handleActivate}/>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

