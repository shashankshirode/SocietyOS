import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NoticeDetailFromHomeScreenProps } from "../../../../app/navigation/navigation.types";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { useMockStore } from "../../../../core/mockStore/useMockStore";
import { AppButton } from "../../../../shared/components/AppButton";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { StatusPill } from "../../../../ui/components/StatusPill";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { AppStatusModal } from "../../../../ui/modal";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { useAcknowledgeNotice } from "../data/useAcknowledgeNotice";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createSafeTextColorStyle3, createViewBackgroundColorStyle2, createSafeTextColorStyle4, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2 } from "../styles/screens/NoticeDetailScreen.styles";
export function NoticeDetailScreen({ route }: NoticeDetailFromHomeScreenProps) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const noticeMessages = messages.resident.notices;
    const { notice } = route.params;
    const { state, updateNotice } = useMockStore();
    const currentNotice = state.notices.find((item) => item.id === notice.id) ?? notice;
    const [acknowledged, setAcknowledged] = useState(currentNotice.acknowledged ?? false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showAttachment, setShowAttachment] = useState(false);
    const { submit: acknowledgeNotice, isSubmitting } = useAcknowledgeNotice();
    const dateLabel = formatResidentDate(currentNotice.date);
    const handleAcknowledge = async () => {
        const result = await acknowledgeNotice(notice.id);
        if (!result.ok)
            return;
        updateNotice(notice.id, { acknowledged: true, status: 'READ' });
        setAcknowledged(true);
        setShowSuccess(true);
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={noticeMessages.detailTitle}/>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
          <View style={styles.headerRow}>
            <StatusPill label={noticeMessages.categories[currentNotice.category]} tone={currentNotice.category === 'EMERGENCY' ? 'danger' : 'info'} small/>
            {currentNotice.isImportant ? <StatusPill label={noticeMessages.importantLabel} tone="warning" small/> : null}
          </View>
          <SafeText variant="title" style={[styles.title, createSafeTextColorStyle3(theme.textPrimary)]}>{currentNotice.title}</SafeText>
          <View style={styles.metaRow}>
            <Ionicons name="person-circle-outline" size={16} color={theme.textSecondary}/>
            <SafeText variant="tiny" color="muted" style={styles.metaText}>
              {noticeMessages.postedByLine(currentNotice.postedBy, dateLabel)}
            </SafeText>
          </View>
          <View style={[styles.divider, createViewBackgroundColorStyle2(theme.border)]}/>
          <SafeText variant="body" style={[styles.bodyText, createSafeTextColorStyle4(theme.textPrimary)]}>
            {currentNotice.body || noticeMessages.noDescription}
          </SafeText>
          {currentNotice.attachment ? (<Pressable onPress={() => setShowAttachment(true)} accessibilityRole="button" style={[styles.attachment, createPressableBackgroundColorBorderColorStyle(theme.background, theme.border)]}>
              <Ionicons name="document-attach" size={20} color={theme.accent}/>
              <View style={styles.attachmentText}>
                <SafeText variant="caption" style={createSafeTextColorStyle(theme.textPrimary)} numberOfLines={1}>{currentNotice.attachment.name}</SafeText>
                <SafeText variant="tiny" color="muted">{currentNotice.attachment.size} · {noticeMessages.attachmentType}</SafeText>
              </View>
              <Ionicons name="download-outline" size={16} color={theme.textSecondary}/>
            </Pressable>) : null}
        </View>

        {currentNotice.acknowledgementRequired ? (<View style={styles.ackSection}>
            {acknowledged ? (<View style={[styles.ackDone, createViewBackgroundColorBorderColorStyle2(theme.successSoft, theme.success)]}>
                <Ionicons name="checkmark-circle" size={18} color={theme.success}/>
                <SafeText variant="caption" style={createSafeTextColorStyle2(theme.success)}>
                  {noticeMessages.acknowledgedOn(dateLabel)}
                </SafeText>
              </View>) : (<AppButton title={noticeMessages.acknowledge} onPress={handleAcknowledge} loading={isSubmitting} iconLeft={<Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF"/>}/>)}
          </View>) : null}
      </ScrollView>

      <AppStatusModal visible={showSuccess} type="success" title={noticeMessages.acknowledgementSuccessTitle} message={noticeMessages.acknowledgementSuccessDescription} actionLabel={messages.buttons.done} onClose={() => setShowSuccess(false)}/>
      <AppStatusModal visible={showAttachment} type="info" title={noticeMessages.attachmentDownloadTitle} message={noticeMessages.attachmentDownloadDescription(currentNotice.attachment?.name ?? noticeMessages.attachmentLabel)} actionLabel={messages.buttons.done} onClose={() => setShowAttachment(false)}/>
    </View>);
}
export default NoticeDetailScreen;

