import { View } from "react-native";
import { AppCheckbox } from "../../../../shared/forms/AppCheckbox";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "./householdComponentUtils";
import { styles } from "../styles/components/OwnerConsentPanel.styles";
type OwnerConsentPanelProps = {
    consentConfirmed: boolean;
    responsibilityAccepted: boolean;
    onConsentChange: () => void;
    onResponsibilityChange: () => void;
};
export function OwnerConsentPanel({ consentConfirmed, responsibilityAccepted, onConsentChange, onResponsibilityChange, }: OwnerConsentPanelProps) {
    const messages = useMessages();
    return (<View style={styles.panel}>
      <SafeText variant="bodyStrong" color="primary">{t(messages, 'resident.tenant.consent.title')}</SafeText>
      <SafeText variant="caption" color="muted">{t(messages, 'resident.tenant.consent.description')}</SafeText>
      <AppCheckbox checked={consentConfirmed} onPress={onConsentChange} label={t(messages, 'resident.tenant.consent.ownerConsentConfirmed')}/>
      <AppCheckbox checked={responsibilityAccepted} onPress={onResponsibilityChange} label={t(messages, 'resident.tenant.consent.responsibilityAccepted')}/>
    </View>);
}

