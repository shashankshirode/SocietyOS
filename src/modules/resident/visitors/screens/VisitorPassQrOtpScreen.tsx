import { View, ScrollView } from "react-native";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { VisitorPassPanel } from "../../../../ui/patterns/VisitorPassPanel";
import { PrivacyNoticePanel } from "../../../../ui/patterns/PrivacyNoticePanel";
import { styles, createViewBackgroundColorStyle } from "../styles/screens/VisitorPassQrOtpScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
export function VisitorPassQrOtpScreen({ navigation }: {
    navigation: {
        navigate: (screen: string) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_534036a70157}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <VisitorPassPanel visitorName="Guest Pass" visitorType="GUEST" purpose={String(localizedUiText.m_aade86fb93fa)} validFrom="Today, 6:00 PM" validTill="Today, 10:00 PM" gateName="Main Gate" otpCode="8901" onSharePress={() => { }} onRegenerateOtp={() => { }}/>

        <View style={styles.noteContainer}>
          <PrivacyNoticePanel description={localizedUiText.m_73e05117b649} points={[
            getActiveUiLiteral("m_c6357e9bf222"),
            getActiveUiLiteral("m_ce0ab5a85e92"),
            getActiveUiLiteral("m_b98694c8a68a"),
        ]}/>
        </View>
      </ScrollView>
    </View>);
}
export default VisitorPassQrOtpScreen;

