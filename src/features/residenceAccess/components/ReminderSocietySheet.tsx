import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Pressable, ScrollView, View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { AppButton } from "../../../shared/components/AppButton";
import { FormField } from "../../../shared/forms/FormField";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { getPlatformKeyboardConfig } from "../../../shared/platform/platformKeyboard";
import { AppBottomSheet } from "../../../ui/bottomSheet/AppBottomSheet";
import { ModalHeader } from "../../../ui/modal/ModalHeader";
import { reminderDeliveryLabels, reminderReasonLabels, residenceAccessMessages } from "../../../messages/en/residenceAccess.messages";
import { presentResidenceDate } from "../services/residenceAccessDateTime";
import type { ResidenceAccessDetail, ResidenceApprovalReminderReason } from "../models/residenceAccess.types";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createPressableBorderColorBackgroundColorOpacityStyle } from "../styles/components/ReminderSocietySheet.styles";
const reminderReasons: readonly ResidenceApprovalReminderReason[] = [
    'REVIEW_DELAYED',
    'MOVE_IN_DATE_APPROACHING',
    'URGENT_VISITOR_ACCESS_REQUIRED',
    'DOCUMENT_CORRECTION_COMPLETED',
    'PAYMENT_OR_SERVICE_ACCESS_REQUIRED',
    'OTHER',
];
interface ReminderSocietySheetProps {
    readonly visible: boolean;
    readonly detail: ResidenceAccessDetail | null;
    readonly loading: boolean;
    readonly onSend: (reason: ResidenceApprovalReminderReason, optionalMessage?: string) => Promise<boolean>;
    readonly onDismiss: () => void;
}
export function ReminderSocietySheet({ visible, detail, loading, onSend, onDismiss, }: ReminderSocietySheetProps) {
    const { colors } = useAppTheme();
    const keyboard = getPlatformKeyboardConfig();
    const [reason, setReason] = useState<ResidenceApprovalReminderReason | null>(null);
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);
    const latestReminder = detail?.reminders[0];
    const expected = presentResidenceDate(detail?.accessRecord.expectedReviewAt);
    const previous = presentResidenceDate(latestReminder?.sentAt);
    const nextAllowed = presentResidenceDate(latestReminder?.nextAllowedReminderAt);
    const cooldownActive = Boolean(latestReminder && new Date(latestReminder.nextAllowedReminderAt).getTime() > Date.now());
    const reminderUnavailable = !detail?.eligibility.canSendReminder;
    const expectedWindowOpen = Boolean(detail?.accessRecord.expectedReviewAt &&
        new Date(detail.accessRecord.expectedReviewAt).getTime() > Date.now());
    const currentReminder = useMemo(() => detail?.reminders[0], [detail?.reminders]);
    useEffect(() => {
        if (visible && currentReminder && sent) {
            setSent(true);
        }
    }, [currentReminder, sent, visible]);
    const dismiss = () => {
        setReason(null);
        setMessage('');
        setSent(false);
        onDismiss();
    };
    const submit = async () => {
        if (!reason || cooldownActive || reminderUnavailable) {
            return;
        }
        const didSend = await onSend(reason, message.trim() || undefined);
        if (didSend) {
            setSent(true);
        }
    };
    if (!detail) {
        return null;
    }
    return (<AppBottomSheet visible={visible} onClose={dismiss} onDismiss={dismiss} preventDismiss={loading} header={(<ModalHeader title={residenceAccessMessages.reminder.title} subtitle={`${detail.residence.societyName} · ${detail.residence.unitNumber}`} {...includeWhenPresent("onClose", loading ? undefined : dismiss)} showClose={!loading}/>)}>
      <KeyboardAvoidingView {...includeWhenPresent("behavior", keyboard.behavior)} keyboardVerticalOffset={keyboard.keyboardVerticalOffset}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {sent && detail.reminders[0] ? (<View style={styles.success}>
              <Ionicons name="checkmark-circle" size={52} color={colors.success}/>
              <AppText variant="h3" weight="800" style={styles.center}>
                {residenceAccessMessages.reminder.successTitle}
              </AppText>
              <AppText variant="body" style={styles.center}>
                {residenceAccessMessages.reminder.sentAt(presentResidenceDate(detail.reminders[0].sentAt).absolute)}
              </AppText>
              <AppText variant="bodySmall" tone="secondary" style={styles.center}>
                {residenceAccessMessages.reminder.nextAllowed(presentResidenceDate(detail.reminders[0].nextAllowedReminderAt).absolute)}
              </AppText>
              <AppButton title={residenceAccessMessages.common.done} onPress={dismiss} fullWidth/>
            </View>) : (<>
              <AppText variant="body" tone="secondary">
                {residenceAccessMessages.reminder.subtitle}
              </AppText>
              <View style={[styles.infoCard, createViewBackgroundColorBorderColorStyle(colors.surfaceMuted, colors.border)]}>
                <AppText variant="caption" tone="secondary">
                  {residenceAccessMessages.reminder.expectedResponse}
                </AppText>
                <AppText variant="bodySmall" weight="700">
                  {detail.accessRecord.expectedReviewAt ? expected.absolute : residenceAccessMessages.common.notAvailable}
                </AppText>
                <AppText variant="caption" tone="secondary">
                  {residenceAccessMessages.reminder.previousReminder}
                </AppText>
                <AppText variant="bodySmall" weight="700">
                  {latestReminder
                ? `${previous.absolute} · ${reminderDeliveryLabels[latestReminder.deliveryStatus]}`
                : residenceAccessMessages.reminder.noPreviousReminder}
                </AppText>
              </View>
              {reminderUnavailable ? (<View style={[styles.notice, createViewBackgroundColorStyle(colors.warningSoft)]}>
                  <AppText variant="bodySmall" weight="800" color={colors.warning}>
                    {residenceAccessMessages.common.statusChangedTitle}
                  </AppText>
                  <AppText variant="caption">
                    {residenceAccessMessages.common.statusChangedBody}
                  </AppText>
                </View>) : cooldownActive ? (<View style={[styles.notice, createViewBackgroundColorStyle2(colors.warningSoft)]}>
                  <AppText variant="bodySmall" weight="800" color={colors.warning}>
                    {residenceAccessMessages.reminder.cooldownTitle}
                  </AppText>
                  <AppText variant="caption">
                    {residenceAccessMessages.reminder.nextAllowed(nextAllowed.absolute)}
                  </AppText>
                </View>) : expectedWindowOpen ? (<View style={[styles.notice, createViewBackgroundColorStyle3(colors.infoSoft)]}>
                  <AppText variant="caption">
                    {residenceAccessMessages.reminder.reviewNotDelayed}
                  </AppText>
                </View>) : null}
              <View style={styles.section}>
                <AppText variant="bodySmall" weight="800">
                  {residenceAccessMessages.reminder.selectReason}
                </AppText>
                {reminderReasons.map((value) => {
                const disabled = reminderUnavailable || cooldownActive || (value === 'REVIEW_DELAYED' && expectedWindowOpen);
                const selected = reason === value;
                return (<Pressable key={value} onPress={() => setReason(value)} disabled={disabled} accessibilityRole="radio" accessibilityState={{ selected, disabled }} style={[
                        styles.reason,
                        createPressableBorderColorBackgroundColorOpacityStyle(selected ? colors.primary : colors.border, selected ? colors.primarySoft : colors.surface, disabled ? 0.45 : 1),
                    ]}>
                      <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={20} color={selected ? colors.primary : colors.textMuted}/>
                      <AppText variant="bodySmall" style={styles.reasonText}>
                        {reminderReasonLabels[value]}
                      </AppText>
                    </Pressable>);
            })}
              </View>
              <FormField label={residenceAccessMessages.reminder.optionalMessage} value={message} onChangeText={setMessage} placeholder={residenceAccessMessages.reminder.optionalMessagePlaceholder} maxLength={180} multiline/>
              <AppButton title={residenceAccessMessages.reminder.confirm} onPress={submit} disabled={!reason || cooldownActive || reminderUnavailable} loading={loading} fullWidth/>
            </>)}
        </ScrollView>
      </KeyboardAvoidingView>
    </AppBottomSheet>);
}

