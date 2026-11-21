import { View, ScrollView } from "react-native";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { CertificatePreview } from "../../../../ui/patterns/CertificatePreview";
import { styles, createViewBackgroundColorStyle } from "../styles/screens/QrVerifiableCertificatePlaceholderScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function QrVerifiableCertificatePlaceholderScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_6b8220e2bffa}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <CertificatePreview title={localizedUiText.m_212142c0f102} certificateNumber="CERT-QR-9901-SEC" residentName="Shashank Shirode" unitLabel="A-1204" issueDate="Today" verificationCode="VERIFIED-BY-BLOCKCHAIN-OS"/>
      </ScrollView>
    </View>);
}
export default QrVerifiableCertificatePlaceholderScreen;

