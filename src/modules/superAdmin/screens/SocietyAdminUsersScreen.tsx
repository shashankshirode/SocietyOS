import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { useSocietyAdminUsers } from "../hooks/useSocietyAdminUsers";
import { styles } from "../styles/screens/SocietyAdminUsersScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = {
    route: {
        params: {
            societyId: string;
        };
    };
};
export function SocietyAdminUsersScreen({ route }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { societyId } = route.params;
    const { data, isLoading, error, refetch } = useSocietyAdminUsers(societyId);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_e0fbfbc65b9e} subtitle={localizedUiText.m_9bec91e1bdb3}/>
        <ScrollView contentContainerStyle={styles.scroll}>
          {data.map((user) => (<View key={user.id} style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.status}>{user.status}</Text>
              </View>
              <Text style={styles.role}>{localizedUiText.m_44dd5f163cba + " "}{user.role.replace(/_/g, ' ')}</Text>
              <Text style={styles.contact}>{localizedUiText.m_17507dcf8457 + " "}{user.emailMasked}</Text>
              <Text style={styles.contact}>{localizedUiText.m_6a8c4e0e0703 + " "}{user.mobileMasked}</Text>
            </View>))}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

