import { View, ScrollView } from "react-native";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { CertificatePreview } from "../../../../ui/patterns/CertificatePreview";
import { styles, createViewBackgroundColorStyle } from "../styles/screens/TenantNocScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function TenantNocScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_bb51c5c60ba5}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <CertificatePreview title={localizedUiText.m_5ed6aa0308c0} certificateNumber="NOC-TEN-2026-102" residentName="Rahul Verma (Tenant)" unitLabel="A-1204" issueDate="10 Feb 2026" validTill="09 Jan 2027" authorizedSignatory="Secretary, Management Committee"/>
      </ScrollView>
    </View>);
}
export default TenantNocScreen;

