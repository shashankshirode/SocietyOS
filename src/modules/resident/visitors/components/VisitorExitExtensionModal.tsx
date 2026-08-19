import { useState } from "react";
import { View } from "react-native";
import { AppButton } from "../../../../shared/components/AppButton";
import { SafeText } from "../../../../shared/components/SafeText";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { AppModal } from "../../../../ui/modal/AppModal";
import { ModalHeader } from "../../../../ui/modal/ModalHeader";
import { WrapRow } from "../../../../ui/layout/WrapRow";
import { t } from "../../household/components/householdComponentUtils";
import { addMinutesToIso } from "../utils/visitorExitPolicyResolver";
import { formatVisitorExitTime } from "./visitorExitFormatters";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2 } from "../styles/components/VisitorExitExtensionModal.styles";
export interface VisitorExitExtensionModalProps {
    visible: boolean;
    currentExpectedExitAtIso: string;
    onSubmit: (expectedExitAtIso: string, reason: string) => void;
    onClose: () => void;
}
const extensionMinutes = [30, 60, 120, 180] as const;
const reasonKeys = [
    'visitor.exitAssurance.repairTakingLonger',
    'visitor.exitAssurance.waitingForParts',
    'visitor.exitAssurance.guestStayedLonger',
    'visitor.exitAssurance.deliveryIssue',
    'visitor.exitAssurance.renovationStillGoingOn',
    'visitor.exitAssurance.otherReason',
] as const;
export function VisitorExitExtensionModal({ visible, currentExpectedExitAtIso, onSubmit, onClose, }: VisitorExitExtensionModalProps) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const [selectedExitAtIso, setSelectedExitAtIso] = useState(addMinutesToIso(currentExpectedExitAtIso, 60));
    const [reasonKey, setReasonKey] = useState<(typeof reasonKeys)[number]>(reasonKeys[0]);
    return (<AppModal visible={visible} onClose={onClose}>
      <ModalHeader title={t(messages, 'visitor.exitAssurance.extendTime')} onClose={onClose}/>
      <View style={styles.content}>
        <SafeText variant="caption" style={createSafeTextColorStyle(theme.textSecondary)}>
          {t(messages, 'visitor.exitAssurance.newExpectedExitTime')}
        </SafeText>
        <WrapRow gap={8}>
          {extensionMinutes.map((minutes) => {
            const optionIso = addMinutesToIso(currentExpectedExitAtIso, minutes);
            const selected = selectedExitAtIso === optionIso;
            return (<PressableScale key={minutes} onPress={() => setSelectedExitAtIso(optionIso)}>
                <View style={[
                    styles.chip,
                    createViewBackgroundColorBorderColorStyle(selected ? theme.accent : theme.surface, selected ? 'transparent' : theme.border),
                ]}>
                  <SafeText variant="tiny" style={createSafeTextColorStyle2(selected ? '#FFFFFF' : theme.textPrimary)}>
                    {formatVisitorExitTime(optionIso)}
                  </SafeText>
                </View>
              </PressableScale>);
        })}
        </WrapRow>
        <SafeText variant="caption" style={createSafeTextColorStyle3(theme.textSecondary)}>
          {t(messages, 'visitor.exitAssurance.extensionReason')}
        </SafeText>
        <WrapRow gap={8}>
          {reasonKeys.map((key) => {
            const selected = reasonKey === key;
            return (<PressableScale key={key} onPress={() => setReasonKey(key)}>
                <View style={[
                    styles.chip,
                    createViewBackgroundColorBorderColorStyle2(selected ? theme.accent : theme.surface, selected ? 'transparent' : theme.border),
                ]}>
                  <SafeText variant="tiny" style={createSafeTextColorStyle4(selected ? '#FFFFFF' : theme.textPrimary)}>
                    {t(messages, key)}
                  </SafeText>
                </View>
              </PressableScale>);
        })}
        </WrapRow>
        <AppButton title={t(messages, 'visitor.exitAssurance.extendTime')} onPress={() => onSubmit(selectedExitAtIso, reasonKey)}/>
      </View>
    </AppModal>);
}

