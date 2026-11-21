import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { FormField } from "../../../shared/forms/FormField";
import { AppButton } from "../../../shared/components/AppButton";
import { SuperAdminWarningBanner } from "../components/SuperAdminWarningBanner";
import { styles } from "../styles/screens/AdminImpersonationPlaceholderScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function AdminImpersonationPlaceholderScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [reason, setReason] = useState('');
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_5141ade24cda} subtitle={localizedUiText.m_bdd910a159fe}/>
        <ScrollView contentContainerStyle={styles.scroll}>
          <SuperAdminWarningBanner message={localizedUiText.m_22a255eb1f09}/>

          <FormField label={localizedUiText.m_4bae795f9328} value={reason} onChangeText={setReason} placeholder={localizedUiText.m_14d1ba00f382} multiline numberOfLines={4}/>

          <View style={styles.btnBox}>
            <AppButton title={localizedUiText.m_e985a3688bff} onPress={() => { }} disabled/>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

