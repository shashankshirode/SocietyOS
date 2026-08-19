import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { useCommercialControlDetail } from "../hooks/useCommercialControlDetail";
import { SuperAdminWarningBanner } from "../components/SuperAdminWarningBanner";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/HiddenCommercialControlsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'HiddenCommercialControls'>;
export function HiddenCommercialControlsScreen({ route }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const societyId = route.params?.societyId ?? 'soc-001';
    const { data, isLoading, error, refetch } = useCommercialControlDetail(societyId);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_a53a7fc1123f} subtitle={localizedUiText.m_a5d18b21472b}/>
        <ScrollView contentContainerStyle={styles.scroll}>
          <SuperAdminWarningBanner message={localizedUiText.m_9118759cc6b3}/>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{localizedUiText.m_d0994dfec223}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_8e55a488808c}</Text>
              <StatusBadge status={data.planCode} moduleType="platform" style={styles.badge}/>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_90c29fed578a}</Text>
              <StatusBadge status={data.billingMode} moduleType="platform" style={styles.badge}/>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_c7a08e1d87b6}</Text>
              <StatusBadge status={data.subscriptionStatus} moduleType="platform" style={styles.badge}/>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_42cd6ccf7795}</Text>
              <Text style={styles.val}>{data.freeLaunchStatus ? localizedUiText.m_85a39ab345d6 : localizedUiText.m_1ea442a134b2}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_d61884f904b6}</Text>
              <Text style={styles.val}>{data.futureBillingReadiness}</Text>
            </View>
          </View>

          {data.commercialNotes && (<View style={styles.card}>
              <Text style={styles.sectionTitle}>{localizedUiText.m_d9fffb4b4432}</Text>
              <Text style={styles.notesText}>{data.commercialNotes}</Text>
            </View>)}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

