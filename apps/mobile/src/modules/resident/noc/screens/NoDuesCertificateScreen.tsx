import { View, ScrollView } from "react-native";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { CertificatePreview } from "../../../../ui/patterns/CertificatePreview";
import { styles, createViewBackgroundColorStyle } from "../styles/screens/NoDuesCertificateScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function NoDuesCertificateScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_c413dd6c386d}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <CertificatePreview title={localizedUiText.m_75a462e1d10a} certificateNumber="NOC-ND-2026-909" residentName="Shashank Shirode" unitLabel="A-1204" issueDate="Today" authorizedSignatory="Treasurer, Management Committee"/>
      </ScrollView>
    </View>);
}
export default NoDuesCertificateScreen;

