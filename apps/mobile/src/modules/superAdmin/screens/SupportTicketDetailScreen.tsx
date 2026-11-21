import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { AppButton } from "../../../shared/components/AppButton";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { useSupportTicketDetail } from "../hooks/useSupportTicketDetail";
import { styles } from "../styles/screens/SupportTicketDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = {
    route: {
        params: {
            ticketId: string;
        };
    };
    navigation: {
        navigate: (route: string, params?: JsonObject) => void;
        goBack: () => void;
    };
};
export function SupportTicketDetailScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { ticketId } = route.params;
    const { data, isLoading, error, refetch } = useSupportTicketDetail(ticketId);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={data.ticketNumber} subtitle={data.subject}/>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{localizedUiText.m_cdf429e93b3a}</Text>
            <View style={styles.grid}>
              <View style={styles.col}>
                <Text style={styles.label}>{localizedUiText.m_d5acfd8330f5}</Text>
                <Text style={styles.val}>{data.societyName}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>{localizedUiText.m_292c06f0045a}</Text>
                <Text style={styles.val}>{data.category.replace(/_/g, ' ')}</Text>
              </View>
            </View>
            <View style={[styles.grid, styles.viewMarginTop]}>
              <View style={styles.col}>
                <Text style={styles.label}>{localizedUiText.m_920e413c7d41}</Text>
                <StatusBadge status={data.status} moduleType="platform" style={styles.badge}/>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>{localizedUiText.m_d60dbba07922}</Text>
                <StatusBadge status={data.priority} moduleType="platform" style={styles.badge}/>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{localizedUiText.m_526e0087cc3f}</Text>
            <Text style={styles.descText}>{data.description}</Text>
          </View>

          <View style={styles.actions}>
            <AppButton title={localizedUiText.m_318e4ba2a178} variant="outline" onPress={() => navigation.navigate('SupportTicketEscalation', { ticketId })}/>
            <AppButton title={localizedUiText.m_254810512399} onPress={() => navigation.goBack()}/>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

