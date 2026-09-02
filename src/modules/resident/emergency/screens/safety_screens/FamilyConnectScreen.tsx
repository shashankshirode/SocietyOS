import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { Text, View, Pressable, ScrollView } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { EmergencySafetyStackParamList } from "../../../../../app/navigation/navigation.types";
import { useFamilyConnect } from "../../data/useFamilyConnect";
import { LoadingState } from "../../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../../../shared/layouts/ScreenContainer";
import { EmergencyPrivacyNotice } from "../../components/EmergencyPrivacyNotice";
import { styles } from "../../styles/screens/safety_screens/FamilyConnectScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../../shared/localization/formatUiLiteral";
import { SocietySwitch } from "../../../../../ui/controls/SocietySwitch";
type Props = NativeStackScreenProps<EmergencySafetyStackParamList, 'FamilyConnect'>;
export function FamilyConnectScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, updateConnect, refetch } = useFamilyConnect();
    const handleToggle = async (value: boolean) => {
        try {
            await updateConnect(value);
            AppAlert.alert(String(localizedUiText.m_8b2d0675b4b0), formatUiLiteral(String(localizedUiText.m_c5f20a35ff9f), [value ? String(localizedUiText.m_fb9cf75606b4) : String(localizedUiText.m_17eb3c0168d0)]));
        }
        catch {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_63f6bf5375c1));
        }
    };
    if (isLoading)
        return <LoadingState message={localizedUiText.m_3759f66bfbb5}/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!data)
        return <ErrorState message={localizedUiText.m_3b41ba9c7cb8}/>;
    const connData = data;
    return (<ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{localizedUiText.m_c19e21903a9a}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_3118eb73afe2}</Text>

        <EmergencyPrivacyNotice style={styles.notice}/>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>{localizedUiText.m_75efe52d0207}</Text>
              <Text style={styles.rowDesc}>{localizedUiText.m_19e4a314c0e4}</Text>
            </View>
            <SocietySwitch value={connData.enabled} onValueChange={handleToggle}/>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{localizedUiText.m_428e9f39c0ae}{connData.contacts.length})</Text>
          {connData.contacts.length === 0 ? (<Text style={styles.emptyText}>{localizedUiText.m_c50b5b8df7e3}</Text>) : (connData.contacts.map((c) => (<View key={c.id} style={styles.contactRow}>
                <View>
                  <Text style={styles.contactName}>{c.name}</Text>
                  <Text style={styles.contactPhone}>{c.mobileMasked}</Text>
                </View>
                <Text style={styles.priority}>{localizedUiText.m_d60dbba07922 + " "}{c.priority}</Text>
              </View>)))}
        </View>

        <Pressable style={styles.btn} onPress={() => navigation.navigate('EmergencyContactManagement')}>
          <Text style={styles.btnText}>{localizedUiText.m_e1847f189615}</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>);
}
