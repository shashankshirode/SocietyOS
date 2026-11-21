import { AppAlert } from "../../../../ui/modal/AppAlert";
import { View, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { CertificatePreview } from "../../../../ui/patterns/CertificatePreview";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { useNocRequestDetail } from "../data/useNocRequestDetail";
import type { NocRequestDetailScreenProps } from "../../../../app/navigation/navigation.types";
import { ResidentProgressCoach, type ProgressStep } from "../../../../ui/patterns/ResidentProgressCoach";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorBorderColorStyle, createSafeTextColorStyle2 } from "../styles/screens/NocRequestDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
export function NocRequestDetailScreen({ navigation, route }: NocRequestDetailScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const { requestId } = route.params;
    const { data: noc, isLoading } = useNocRequestDetail(requestId);
    if (isLoading || !noc) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
        <ResidentPageHeader title={localizedUiText.m_b3472fd2773b}/>
      </View>);
    }
    const isGenerated = noc.status === 'GENERATED' || noc.status === 'APPROVED';
    const coachSteps: ProgressStep[] = noc.timeline.map((step) => {
        let status: ProgressStep['status'] = 'pending';
        if (step.status === 'COMPLETED')
            status = 'completed';
        else if (step.status === 'CURRENT')
            status = 'current';
        return {
            title: step.title,
            ...includeWhenPresent("description", step.description),
            status
        };
    });
    const handleDownload = () => {
        AppAlert.alert(String(localizedUiText.m_c4a7ee73a5f7), String(localizedUiText.m_2a8a42f92428));
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle2(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_55911532e93a}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {isGenerated ? (<CertificatePreview title={formatUiLiteral(localizedUiText.m_366542a4d9ec, [noc.nocType.replace('_', ' ')])} certificateNumber={noc.certificateId || 'NOC-VER-82847'} residentName={noc.residentName} unitLabel={noc.flatNumber} issueDate={noc.submittedDate} verificationCode={noc.id}/>) : (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{localizedUiText.m_b2059c6fde96}</SafeText>
            <SafeText variant="caption" color="secondary">{localizedUiText.m_6cc5ad2e47e3}{noc.nocType.replace('_', ' ')}{localizedUiText.m_148304483aba}</SafeText>
            <SafeText variant="caption" color="secondary">{localizedUiText.m_755c8b2a9fb1}{noc.status}
            </SafeText>
            <SafeText variant="tiny" color="muted">{localizedUiText.m_201ab1d2d5c1}{formatResidentDate(noc.submittedDate)}
            </SafeText>
          </View>)}

        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle2(theme.textPrimary)]}>{localizedUiText.m_0cc0e31562c4}</SafeText>
          <ResidentProgressCoach steps={coachSteps} instruction={isGenerated
            ? getActiveUiLiteral("m_c18c80a23f5a") : getActiveUiLiteral("m_975d73b24e67")}/>
        </View>

        {isGenerated && (<View style={styles.actions}>
            <AppButton title={localizedUiText.m_a476e6678b5a} onPress={handleDownload} iconLeft={<Ionicons name="download-outline" size={18} color="#FFFFFF"/>}/>
          </View>)}
      </ScrollView>
    </View>);
}
export default NocRequestDetailScreen;

