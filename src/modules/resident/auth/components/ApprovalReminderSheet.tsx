import { useState } from "react";
import { View } from "react-native";
import { AppBottomSheet } from "../../../../ui/bottomSheet/AppBottomSheet";
import { AppText } from "../../../../shared/components/AppText";
import { AppButton } from "../../../../shared/components/AppButton";
import { FormField } from "../../../../shared/forms/FormField";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import type { ResidenceMembership, AccessReminderResult } from "../data/membership.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles, createAppTextColorStyle, createAppTextColorStyle2, createAppTextColorStyle3, createViewBackgroundColorStyle } from "../styles/components/ApprovalReminderSheet.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
interface ApprovalReminderSheetProps {
    visible: boolean;
    membership: ResidenceMembership | null;
    onSendReminder: (membershipId: string, note: string) => Promise<AccessReminderResult>;
    onDismiss: () => void;
}
export function ApprovalReminderSheet({ visible, membership, onSendReminder, onDismiss, }: ApprovalReminderSheetProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AccessReminderResult | null>(null);
    const handleSend = async () => {
        if (!membership)
            return;
        setLoading(true);
        try {
            const response = await onSendReminder(membership.membershipId, note);
            setResult(response);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDismiss = () => {
        setNote('');
        setResult(null);
        onDismiss();
    };
    if (!membership)
        return null;
    return (<AppBottomSheet visible={visible} onClose={handleDismiss} onDismiss={handleDismiss}>
      <View style={styles.sheetHeader}>
        <AppText variant="h2" style={createAppTextColorStyle(colors.textPrimary)}>{localizedUiText.m_b73aa187cf0c}</AppText>
      </View>

      <View style={styles.content}>
        {result ? (<View style={styles.result}>
            <Ionicons name={result.sent ? 'checkmark-circle' : 'alert-circle'} size={48} color={result.sent ? colors.success : colors.warning}/>
            <AppText variant="body" style={createAppTextColorStyle2(colors.textPrimary)}>
              {result.sent
                ? localizedUiText.m_4f5e51e0e130 : localizedUiText.m_5e3237ae7839}
            </AppText>
            <AppButton title={localizedUiText.m_11a6767d5674} onPress={handleDismiss} fullWidth/>
          </View>) : (<>
            <View style={[styles.contextCard, createViewBackgroundColorStyle(colors.surfaceMuted)]}>
              <AppText variant="body" style={styles.appTextFontWeight}>
                {membership.societyName}
              </AppText>
              <AppText variant="caption" style={createAppTextColorStyle3(colors.textSecondary)}>{localizedUiText.m_4e545960f1bf}{membership.unitDisplayName} · {membership.buildingName}
              </AppText>
            </View>

            <FormField label={localizedUiText.m_bcbc40ad9a54} value={note} onChangeText={setNote} placeholder={localizedUiText.m_e21376e399cc} maxLength={150}/>

            <AppButton title={localizedUiText.m_9f0e9e399a67} onPress={handleSend} loading={loading} fullWidth/>
          </>)}
      </View>
    </AppBottomSheet>);
}

