import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentDocuments } from "../data/useDocuments";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { useFeatureFlags } from "../../../../core/featureFlags/useFeatureFlag";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { PrivacyNoticePanel } from "../../../../ui/patterns/PrivacyNoticePanel";
import { ResidentInfoMosaic } from "../../../../ui/patterns/ResidentInfoMosaic";
import { SafeText } from "../../../../shared/components/SafeText";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { useMessages } from "../../../../shared/constants/useMessages";
import { DocumentStatus } from "../data/documents.enums";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createSafeTextColorStyle4, createSafeTextColorStyle5, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle3 } from "../styles/screens/DocumentVaultHomeScreen.styles";
type Props = {
    navigation: {
        navigate: (screen: string, params?: JsonObject) => void;
        goBack: () => void;
    };
};
export function DocumentVaultHomeScreen({ navigation }: Props) {
    const localizedUiText = useMessages().uiLiterals;
    const theme = useResidentTheme();
    const messages = useMessages();
    const { isEnabled } = useFeatureFlags();
    const { data: documents = [] } = useResidentDocuments();
    const stats = useMemo(() => {
        const verified = documents.filter((d) => d.status === DocumentStatus.VERIFIED).length;
        const pending = documents.filter((d) => d.status === DocumentStatus.PENDING_VERIFICATION).length;
        const required = documents.filter((d) => d.status === DocumentStatus.REQUIRED).length;
        const expired = documents.filter((d) => d.status === DocumentStatus.EXPIRED).length;
        return [
            { id: '1', label: messages.documents.statusVerified || String(localizedUiText.m_4f7838402f37), value: verified, iconName: 'checkmark-circle-outline' },
            { id: '2', label: messages.documents.statusPending || String(localizedUiText.m_331551b0de41), value: pending, iconName: 'time-outline' },
            { id: '3', label: messages.documents.statusMissing || String(localizedUiText.m_4850b174b713), value: required, iconName: 'alert-circle-outline' },
            { id: '4', label: messages.documents.statusExpired || String(localizedUiText.m_424a2551d356), value: expired, iconName: 'close-circle-outline' },
        ];
    }, [documents, localizedUiText, messages]);
    const folders = [
        {
            id: 'my-docs',
            title: messages.documents.myFlatDocsTitle,
            subtitle: messages.documents.myFlatDocsDesc,
            icon: 'file-tray-full-outline',
            onPress: () => navigation.navigate('MyDocuments'),
        },
        {
            id: 'soc-docs',
            title: messages.documents.societyPublicDocsTitle,
            subtitle: messages.documents.societyPublicDocsDesc,
            icon: 'business-outline',
            onPress: () => navigation.navigate('SocietyDocuments'),
        },
        {
            id: 'upload-doc',
            title: messages.documents.uploadNewDocTitle,
            subtitle: messages.documents.uploadNewDocDesc,
            icon: 'cloud-upload-outline',
            onPress: () => navigation.navigate('UploadDocument'),
        },
    ];
    if (!isEnabled('documentVault')) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
        <ResidentPageHeader titleKey="resident.navigation.documents.title" title={localizedUiText.m_0394ca262c99} showBackButton/>
        <View style={styles.unavailableContainer}>
          <Ionicons name="lock-closed-outline" size={48} color={theme.textSecondary}/>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>
            {messages.documents.featureDisabledTitle}
          </SafeText>
          <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textSecondary)}>
            {messages.documents.featureDisabledDesc}
          </SafeText>
        </View>
      </View>);
    }
    return (<View style={[styles.root, createViewBackgroundColorStyle2(theme.background)]}>
      <ResidentPageHeader titleKey="resident.navigation.documents.title" title={localizedUiText.m_0394ca262c99} subtitle={messages.resident.navigation.documents.subtitle} showBackButton/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <PrivacyNoticePanel title={messages.documents.encryptedVaultTitle} description={messages.documents.encryptedVaultDesc}/>

        
        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle4(theme.textPrimary)]}>
            {messages.documents.vaultStatusOverview}
          </SafeText>
          <ResidentInfoMosaic items={stats}/>
        </View>

        
        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle5(theme.textPrimary)]}>
            {messages.documents.documentRepositories}
          </SafeText>
          <View style={styles.folderList}>
            {folders.map((f) => (<PressableScale key={f.id} onPress={f.onPress}>
                <View style={[styles.folderCard, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
                  <View style={[styles.folderIcon, createViewBackgroundColorStyle3(theme.accentSoft)]}>
                    <Ionicons name={f.icon as keyof typeof Ionicons.glyphMap} size={22} color={theme.accent}/>
                  </View>
                  <View style={styles.folderInfo}>
                    <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(theme.textPrimary)}>{f.title}</SafeText>
                    <SafeText variant="caption" color="secondary">{f.subtitle}</SafeText>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.textSecondary}/>
                </View>
              </PressableScale>))}
          </View>
        </View>
      </ScrollView>
    </View>);
}
export default DocumentVaultHomeScreen;
