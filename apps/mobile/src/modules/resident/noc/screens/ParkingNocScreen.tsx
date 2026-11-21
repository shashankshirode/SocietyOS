import { View, ScrollView } from "react-native";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { CertificatePreview } from "../../../../ui/patterns/CertificatePreview";
import { styles, createViewBackgroundColorStyle } from "../styles/screens/ParkingNocScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function ParkingNocScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_0b47300949b5}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <CertificatePreview title={localizedUiText.m_0bff1d5b0364} certificateNumber="NOC-PK-2026-440" residentName="Shashank Shirode" unitLabel="A-1204 (Slot B2-12)" issueDate="18 Jan 2026" authorizedSignatory="Society Parking Auditor"/>
      </ScrollView>
    </View>);
}
export default ParkingNocScreen;

