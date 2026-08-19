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
import { styles } from "../styles/screens/FreeLaunchPlanMappingScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'FreeLaunchPlanMapping'>;
export function FreeLaunchPlanMappingScreen({ route }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { societyId } = route.params;
    const { data, isLoading, error, refetch } = useCommercialControlDetail(societyId);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_3ee02a53ed46} subtitle={localizedUiText.m_6a66a6481531}/>
        <ScrollView contentContainerStyle={styles.scroll}>
          <SuperAdminWarningBanner message={localizedUiText.m_5494d63f2ef8}/>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{localizedUiText.m_96ccedb3ae35}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_d5acfd8330f5}</Text>
              <Text style={styles.val}>{data.societyName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_da8d40487ba3}</Text>
              <Text style={[styles.val, data.freeLaunchStatus && styles.success]}>
                {data.freeLaunchStatus ? localizedUiText.m_92340695899b : localizedUiText.m_ac7c949f1211}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_8e55a488808c}</Text>
              <StatusBadge status={data.planCode} moduleType="platform" style={styles.badge}/>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_90c29fed578a}</Text>
              <StatusBadge status={data.billingMode} moduleType="platform" style={styles.badge}/>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

