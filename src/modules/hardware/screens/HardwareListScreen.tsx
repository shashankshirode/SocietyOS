import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useHardwareDevices } from "../hooks/useHardwareDevices";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { AppButton } from "../../../shared/components/AppButton";
import { styles, createViewBackgroundColorBorderColorStyle, createTextColorStyle, createTextColorStyle2 } from "../styles/screens/HardwareListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function HardwareListScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { data, isLoading, error, refetch } = useHardwareDevices();
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={localizedUiText.m_44327a06aecd} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ResponsivePageHeader title={localizedUiText.m_3626f9ece013} subtitle={localizedUiText.m_d5a8de23f409} onBack={() => navigation.goBack()}/>
        <FlatList data={data} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
              <View style={styles.header}>
                <Text style={[styles.title, createTextColorStyle(colors.textPrimary)]}>{item.name}</Text>
                <StatusBadge label={item.status} type={item.status === 'ONLINE' ? 'success' : 'warning'}/>
              </View>
              <Text style={[styles.desc, createTextColorStyle2(colors.textSecondary)]}>{localizedUiText.m_9efec7461fb2 + " "}{item.ipAddress} ({item.type})</Text>
              <AppButton title={localizedUiText.m_2b6df574a3de} onPress={() => navigation.navigate('HardwareLogDetail', { deviceId: item.id })} variant="outline" style={styles.btn}/>
            </View>)}/>
      </SafeAreaView>
    </ScreenContainer>);
}

