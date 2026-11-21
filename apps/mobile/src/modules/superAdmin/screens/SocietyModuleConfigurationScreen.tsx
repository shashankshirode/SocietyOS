import { ScrollView, Text, View, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { useModuleConfiguration } from "../hooks/useModuleConfiguration";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/SocietyModuleConfigurationScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'SocietyModuleConfiguration'>;
export function SocietyModuleConfigurationScreen({ route }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { societyId } = route.params;
    const { data, isLoading, error, refetch } = useModuleConfiguration(societyId);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_6780a295ee18} subtitle={localizedUiText.m_3057e1b368a9}/>
        <ScrollView contentContainerStyle={styles.scroll}>
          {data.map((item) => (<View key={item.moduleKey} style={styles.row}>
              <View style={styles.infoCol}>
                <Text style={styles.name}>{item.moduleName}</Text>
                <Text style={styles.flag}>{item.featureFlagKey}</Text>
              </View>
              <Switch value={item.enabled} onValueChange={() => { }} trackColor={{ false: Colors.border, true: Colors.primaryLight }} thumbColor={item.enabled ? Colors.primary : Colors.textMuted} disabled/>
            </View>))}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

