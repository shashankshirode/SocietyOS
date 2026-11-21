import { View, ScrollView } from "react-native";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { CertificatePreview } from "../../../../ui/patterns/CertificatePreview";
import { styles, createViewBackgroundColorStyle } from "../styles/screens/ResidenceCertificateScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function ResidenceCertificateScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_a8e2fd17805f}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <CertificatePreview title={localizedUiText.m_d4a08f3b8f02} certificateNumber="NOC-RES-2026-004" residentName="Shashank Shirode" unitLabel="A-1204" issueDate="10 May 2026" authorizedSignatory="Chairman, Management Committee"/>
      </ScrollView>
    </View>);
}
export default ResidenceCertificateScreen;

