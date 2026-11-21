import { View, ScrollView } from "react-native";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { CertificatePreview } from "../../../../ui/patterns/CertificatePreview";
import { styles, createViewBackgroundColorStyle } from "../styles/screens/RenovationNocScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function RenovationNocScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_218986289afa}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <CertificatePreview title={localizedUiText.m_715f20497499} certificateNumber="NOC-RN-2026-112" residentName="Shashank Shirode" unitLabel="A-1204" issueDate="01 Jun 2026" validTill="31 Aug 2026" authorizedSignatory="Society Structural Engineer"/>
      </ScrollView>
    </View>);
}
export default RenovationNocScreen;

