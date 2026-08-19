import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { useSupportTickets } from "../hooks/useSupportTickets";
import { SupportTicketCard } from "../components/SupportTicketCard";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/SupportConsoleScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'SupportConsole'>;
export function SupportConsoleScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useSupportTickets();
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_bc5ea409794b} subtitle={localizedUiText.m_b9d02d208fe8}/>
        <FlatList contentContainerStyle={styles.list} data={data} keyExtractor={(item) => item.id} renderItem={({ item }) => (<SupportTicketCard ticket={item} onPress={() => navigation.navigate('SupportTicketDetail', { ticketId: item.id })}/>)} ListEmptyComponent={<EmptyState title={localizedUiText.m_c8438d8e14a8} description={localizedUiText.m_38cc78a810a9}/>}/>
      </SafeAreaView>
    </ScreenContainer>);
}

