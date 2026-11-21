import { AppAlert } from "../../../../ui/modal/AppAlert";
import { View, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { CertificatePreview } from "../../../../ui/patterns/CertificatePreview";
import { AppButton } from "../../../../shared/components/AppButton";
import { useNocCertificate } from "../data/useNocCertificate";
import type { NocCertificateScreenProps } from "../../../../app/navigation/navigation.types";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createViewBackgroundColorStyle, createViewBackgroundColorStyle2 } from "../styles/screens/NocCertificateScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function NocCertificateScreen({ navigation, route }: NocCertificateScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const { certificateId } = route.params;
    const { data: cert, isLoading } = useNocCertificate(certificateId);
    if (isLoading || !cert) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
        <ResidentPageHeader title={localizedUiText.m_ca328c791183}/>
      </View>);
    }
    const handleDownload = () => {
        AppAlert.alert(String(localizedUiText.m_c4a7ee73a5f7), String(localizedUiText.m_3187ac5d3c1a));
    };
    const handleShare = () => {
        AppAlert.alert(String(localizedUiText.m_86191ab2e3fd), String(localizedUiText.m_a3460659acc5));
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle2(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_ca328c791183}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <CertificatePreview title={cert.title} certificateNumber={cert.certificateNumber} residentName={cert.residentName} unitLabel={cert.flatNumber} issueDate={cert.issueDate} {...includeWhenPresent("validTill", cert.expiryDate)} authorizedSignatory={cert.issuedBy} verificationCode={cert.verificationCode}/>

        <View style={styles.actions}>
          <AppButton title={localizedUiText.m_945c2db7a29e} onPress={handleDownload} iconLeft={<Ionicons name="download-outline" size={18} color="#FFFFFF"/>}/>

          <AppButton title={localizedUiText.m_518c4276ad34} variant="secondary" onPress={handleShare} iconLeft={<Ionicons name="share-social-outline" size={18} color={theme.accent}/>}/>
        </View>
      </ScrollView>
    </View>);
}
export default NocCertificateScreen;

