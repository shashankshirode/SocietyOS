import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../../shared/layouts/ResponsivePageHeader";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useOccupancyHistory } from "../hooks/useOccupancyHistory";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { StatusBadge } from "../../../../shared/components/StatusBadge";
import { AppButton } from "../../../../shared/components/AppButton";
import { styles, createViewBackgroundColorBorderColorStyle, createTextColorStyle, createTextColorStyle2 } from "../styles/screens/OccupancySummaryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function OccupancySummaryScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { data, isLoading, error, refetch } = useOccupancyHistory();
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={localizedUiText.m_df6f536618bf} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ResponsivePageHeader title={localizedUiText.m_98510fff4fe1} subtitle={localizedUiText.m_838e98f28206} onBack={() => navigation.goBack()}/>
        <FlatList data={data} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
              <View style={styles.header}>
                <Text style={[styles.flat, createTextColorStyle(colors.textPrimary)]}>{localizedUiText.m_9285cedcf26a + " "}{item.flatNumber}</Text>
                <StatusBadge label={item.documentStatus} type={item.documentStatus === 'APPROVED' ? 'success' : 'warning'}/>
              </View>
              <Text style={[styles.name, createTextColorStyle2(colors.textSecondary)]}>{localizedUiText.m_4fe2a9a354a7 + " "}{item.occupantName} ({item.occupantType})</Text>
              <AppButton title={localizedUiText.m_c57eba41f163} onPress={() => navigation.navigate('OccupancyHistoryDetail', { recordId: item.id })} variant="outline" style={styles.btn}/>
            </View>)}/>
      </SafeAreaView>
    </ScreenContainer>);
}

