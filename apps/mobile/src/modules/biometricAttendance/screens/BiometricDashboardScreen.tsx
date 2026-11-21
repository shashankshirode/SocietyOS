import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useBiometricReadiness } from "../hooks/useBiometricReadiness";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { AppButton } from "../../../shared/components/AppButton";
import { styles, createViewBackgroundColorBorderColorStyle, createTextColorStyle, createTextColorStyle2 } from "../styles/screens/BiometricDashboardScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function BiometricDashboardScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { data, isLoading, error, refetch } = useBiometricReadiness();
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={localizedUiText.m_7017b6c24a3c} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ResponsivePageHeader title={localizedUiText.m_9266b5bbb102} subtitle={localizedUiText.m_5a15274e9327} onBack={() => navigation.goBack()}/>
        <FlatList data={data} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
              <View style={styles.header}>
                <Text style={[styles.title, createTextColorStyle(colors.textPrimary)]}>{item.deviceName}</Text>
                <StatusBadge label={item.status} type={item.status === 'ONLINE' ? 'success' : 'warning'}/>
              </View>
              <Text style={[styles.desc, createTextColorStyle2(colors.textSecondary)]}>{localizedUiText.m_bbdffe25dc7d + " "}{item.location}{" " + localizedUiText.m_9158d2cc90a4 + " "}{item.lastSyncTime}</Text>
              <AppButton title={localizedUiText.m_46b94afed259} onPress={() => navigation.navigate('BiometricDeviceDetail', { deviceId: item.id })} variant="outline" style={styles.btn}/>
            </View>)}/>
      </SafeAreaView>
    </ScreenContainer>);
}

