import { View, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentPreview } from "../data/useResidentPreview";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { PrivacyNoticePanel } from "../../../../ui/patterns/PrivacyNoticePanel";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import type { ResidentPreviewScreenProps } from "../../../../app/navigation/navigation.types";
import { styles, createSafeTextColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle3 } from "../styles/screens/ResidentPreviewScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function ResidentPreviewScreen({ navigation, route }: ResidentPreviewScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const id = route.params.residentId;
    const { data: resident, isLoading } = useResidentPreview(id);
    if (isLoading || !resident) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
        <ResidentPageHeader title={localizedUiText.m_d6a81d114d5c}/>
      </View>);
    }
    const handleAction = () => {
        if (resident.connectionStatus === 'CONNECTED') {
            let threadId = 'thread-001';
            if (resident.id === 'resident-007')
                threadId = 'thread-002';
            if (resident.id === 'resident-008')
                threadId = 'thread-003';
            navigation.navigate('ChatConversation', { threadId });
        }
        else {
            navigation.navigate('CreateContactRequest', { recipientResidentId: resident.id });
        }
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle2(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_d6a81d114d5c}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
          <View style={[styles.avatarWrap, createViewBackgroundColorStyle3(theme.accentSoft)]}>
            <Ionicons name="person-outline" size={32} color={theme.accent}/>
          </View>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>
            {resident.name}
          </SafeText>
          <SafeText variant="caption" color="secondary">{localizedUiText.m_9285cedcf26a}{resident.flatNumber}{" " + localizedUiText.m_fe1ea81d83a5 + " "}{resident.tower}
          </SafeText>
          {resident.bio ? (<SafeText variant="caption" color="muted" align="center" style={styles.safeTextMarginTop}>
              &quot;{resident.bio}&quot;
            </SafeText>) : null}
        </View>

        <PrivacyNoticePanel title={localizedUiText.m_a9259b8a268d} description={localizedUiText.m_109955edaac7}/>

        <View style={styles.actions}>
          <AppButton title={resident.connectionStatus === 'CONNECTED' ? localizedUiText.m_0fe0571facd9 : localizedUiText.m_400487c3102e} onPress={handleAction} iconLeft={<Ionicons name={resident.connectionStatus === 'CONNECTED' ? 'chatbubbles-outline' : 'person-add-outline'} size={18} color="#FFFFFF"/>}/>
        </View>
      </ScrollView>
    </View>);
}
export default ResidentPreviewScreen;

