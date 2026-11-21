import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { AppButton } from "../../../shared/components/AppButton";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { usePlatformSocietyDetail } from "../hooks/usePlatformSocietyDetail";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/PlatformSocietyDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'PlatformSocietyDetail'>;
export function PlatformSocietyDetailScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { societyId } = route.params;
    const { data, isLoading, error, refetch } = usePlatformSocietyDetail(societyId);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={data.name} subtitle={`${data.city}, ${data.state}`}/>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{localizedUiText.m_e7296e4b22f3}</Text>
            <View style={styles.grid}>
              <View style={styles.col}>
                <Text style={styles.label}>{localizedUiText.m_920e413c7d41}</Text>
                <StatusBadge status={data.status} moduleType="platform" style={styles.badge}/>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>{localizedUiText.m_baaddf70fb5d}</Text>
                <Text style={styles.val}>{data.type.replace(/_/g, ' ')}</Text>
              </View>
            </View>
            <View style={[styles.grid, styles.viewMarginTop]}>
              <View style={styles.col}>
                <Text style={styles.label}>{localizedUiText.m_8528f505986d}</Text>
                <Text style={styles.val}>{data.totalUnits}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>{localizedUiText.m_5639b9f1265e}</Text>
                <Text style={styles.val}>{data.activeUsers}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{localizedUiText.m_a135a14530ee}</Text>
            <View style={styles.grid}>
              <View style={styles.col}>
                <Text style={styles.label}>{localizedUiText.m_8e55a488808c}</Text>
                <StatusBadge status={data.planCode} moduleType="platform" style={styles.badge}/>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>{localizedUiText.m_90c29fed578a}</Text>
                <StatusBadge status={data.billingMode} moduleType="platform" style={styles.badge}/>
              </View>
            </View>
          </View>

          <View style={styles.actionsBox}>
            <AppButton title={localizedUiText.m_3bafa497fdef} variant="outline" onPress={() => navigation.navigate('SocietyModuleConfiguration', { societyId })}/>
            <AppButton title={localizedUiText.m_e0fbfbc65b9e} variant="outline" onPress={() => navigation.navigate('SocietyAdminUsers', { societyId })}/>
            <AppButton title={localizedUiText.m_98ffb6fe8afd} variant="outline" onPress={() => navigation.navigate('HiddenCommercialControls', { societyId })}/>
            <AppButton title={localizedUiText.m_8ea5cdc7dcba} variant="outline" onPress={() => navigation.navigate('FreeLaunchPlanMapping', { societyId })}/>
            <AppButton title={localizedUiText.m_21f43a4a5f6d} variant="danger" onPress={() => navigation.navigate('AdminImpersonationPlaceholder', { societyId })}/>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

