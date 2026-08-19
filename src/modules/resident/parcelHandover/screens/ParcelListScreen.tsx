import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../../shared/layouts/ResponsivePageHeader";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useParcelHandover } from "../hooks/useParcelHandover";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { StatusBadge } from "../../../../shared/components/StatusBadge";
import { AppButton } from "../../../../shared/components/AppButton";
import { styles, createViewBackgroundColorBorderColorStyle, createTextColorStyle, createTextColorStyle2 } from "../styles/screens/ParcelListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function ParcelListScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { data, isLoading, error, refetch } = useParcelHandover();
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={localizedUiText.m_88a6a08eed03} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ResponsivePageHeader title={localizedUiText.m_6615077dab9d} subtitle={localizedUiText.m_b8d8c39e5a0a} onBack={() => navigation.goBack()}/>
        <FlatList data={data} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
              <View style={styles.header}>
                <Text style={[styles.title, createTextColorStyle(colors.textPrimary)]}>{item.courierCompany}{" " + localizedUiText.m_804583352041}</Text>
                <StatusBadge label={item.status} type={item.status === 'COLLECTED' ? 'success' : 'warning'}/>
              </View>
              <Text style={[styles.desc, createTextColorStyle2(colors.textSecondary)]}>{localizedUiText.m_d10a8728e8a8 + " "}{item.recipientFlat} — {item.recipientName}</Text>
              <AppButton title={localizedUiText.m_a642412a38c4} onPress={() => navigation.navigate('ParcelDetails', { parcelId: item.id })} variant="outline" style={styles.btn}/>
            </View>)}/>
      </SafeAreaView>
    </ScreenContainer>);
}

