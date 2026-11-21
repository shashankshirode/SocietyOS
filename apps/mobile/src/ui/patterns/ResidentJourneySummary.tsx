import { View, Pressable } from "react-native";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { useMessages } from "../../shared/constants/useMessages";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle, createPressableBorderColorStyle, createPressableBackgroundColorStyle } from "./styles/ResidentJourneySummary.styles";
export interface ResidentJourneySummaryProps {
    journeyType: 'visitor' | 'billing' | 'complaint' | 'noc' | 'moveOut' | 'facility' | 'parcel' | 'kyc' | 'emergency';
    status: string;
    nextStep: string;
    deadline?: string;
    responsibleParty?: string;
    primaryActionLabel?: string;
    secondaryActionLabel?: string;
    onPrimaryActionPress?: () => void;
    onSecondaryActionPress?: () => void;
}
export function ResidentJourneySummary({ journeyType, status, nextStep, deadline, responsibleParty, primaryActionLabel, secondaryActionLabel, onPrimaryActionPress, onSecondaryActionPress, }: ResidentJourneySummaryProps) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors, dark } = useAppTheme();
    const messages = useMessages();
    const titleMap: Record<string, string> = {
        visitor: messages.journey.visitorPassSummary,
        billing: messages.journey.billPaymentSummary,
        complaint: messages.journey.complaintStatusSummary,
        noc: messages.journey.nocClearanceSummary,
        moveOut: messages.journey.moveOutSummary,
        facility: messages.journey.facilityBookingSummary,
        parcel: messages.journey.parcelPickupSummary,
        kyc: messages.journey.kycVerificationSummary,
        emergency: messages.journey.emergencyAlertSummary,
    };
    return (<View style={[
            styles.container,
            createViewBackgroundColorBorderColorStyle(dark ? colors.surfaceElevated : colors.surface, colors.border),
        ]} accessibilityLabel={messages.residentAccessibility.journeySummary}>
      <SafeText variant="bodyStrong" color="primary">
        {titleMap[journeyType] || localizedUiText.m_791f7b649137}
      </SafeText>

      <View style={styles.grid}>
        <View style={styles.row}>
          <SafeText variant="caption" color="muted">
            {messages.journey.currentStatusLabel}
          </SafeText>
          <SafeText variant="caption" style={createSafeTextColorStyle(colors.primary)}>
            {status}
          </SafeText>
        </View>

        <View style={styles.row}>
          <SafeText variant="caption" color="muted">
            {messages.journey.nextStepLabel}
          </SafeText>
          <SafeText variant="caption" color="primary">
            {nextStep}
          </SafeText>
        </View>

        {deadline && (<View style={styles.row}>
            <SafeText variant="caption" color="muted">
              {messages.journey.deadlineLabel}
            </SafeText>
            <SafeText variant="caption" color="danger">
              {deadline}
            </SafeText>
          </View>)}

        {responsibleParty && (<View style={styles.row}>
            <SafeText variant="caption" color="muted">
              {messages.journey.responsiblePartyLabel}
            </SafeText>
            <SafeText variant="caption" color="secondary">
              {responsibleParty}
            </SafeText>
          </View>)}
      </View>

      {(onPrimaryActionPress || onSecondaryActionPress) && (<View style={styles.actions}>
          {onSecondaryActionPress && (<Pressable style={[styles.btn, styles.btnSecondary, createPressableBorderColorStyle(colors.border)]} onPress={onSecondaryActionPress}>
              <SafeText variant="caption" color="primary">
                {secondaryActionLabel || messages.actions.secondaryActionLabel}
              </SafeText>
            </Pressable>)}

          {onPrimaryActionPress && (<Pressable style={[styles.btn, createPressableBackgroundColorStyle(colors.primary)]} onPress={onPrimaryActionPress}>
              <SafeText variant="caption" style={styles.safeTextColorFontWeight}>
                {primaryActionLabel || messages.actions.primaryActionLabel}
              </SafeText>
            </Pressable>)}
        </View>)}
    </View>);
}

