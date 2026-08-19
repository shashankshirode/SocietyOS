import { View, ScrollView } from "react-native";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { CertificatePreview } from "../../../../ui/patterns/CertificatePreview";
import { styles, createViewBackgroundColorStyle } from "../styles/screens/MoveOutNocScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function MoveOutNocScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_ce3a82a85d07}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <CertificatePreview title={localizedUiText.m_6b8ec9baaf56} certificateNumber="NOC-MO-2026-881" residentName="Shashank Shirode" unitLabel="A-1204" issueDate="05 Jul 2026" authorizedSignatory="Society Facility Director"/>
      </ScrollView>
    </View>);
}
export default MoveOutNocScreen;

