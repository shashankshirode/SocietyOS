import { useState, useEffect } from "react";
import { View } from "react-native";
import { ScreenScaffold } from "../../../../shared/layout/ScreenScaffold";
import { AppText } from "../../../../shared/components/AppText";
import { FormField } from "../../../../shared/forms/FormField";
import { HomeSetupFlow } from "../components/HomeSetupFlow";
import { ConsentRow } from "../components/ConsentRow";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useResidenceOnboarding } from "../hooks/useResidenceOnboarding";
import { authMessages } from "../messages/auth.messages";
import Ionicons from "@expo/vector-icons/Ionicons";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createScreenScaffoldBackgroundColorStyle, createAppTextColorStyle, createScreenScaffoldBackgroundColorStyle2, createAppTextColorStyle2, createAppTextColorStyle3, createAppTextColorStyle4, createAppTextColorStyle5, createAppTextColorStyle6, createAppTextColorStyle7, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle } from "../styles/screens/ResidenceOnboardingScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
interface ResidenceOnboardingScreenProps {
    membershipId: string;
    onComplete: () => void;
    onCancel: () => void;
}
export function ResidenceOnboardingScreen({ membershipId, onComplete, onCancel, }: ResidenceOnboardingScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { config, isLoading, currentStepIndex, saveStep, completeOnboarding, nextStep, prevStep, } = useResidenceOnboarding(membershipId);
    const [displayName, setDisplayName] = useState('');
    const [pushEnabled, setPushEnabled] = useState(false);
    const [inAppEnabled, setInAppEnabled] = useState(true);
    const [emergencyVolunteer, setEmergencyVolunteer] = useState(false);
    const [rulesConsent, setRulesConsent] = useState(false);
    const [communicationConsent, setCommunicationConsent] = useState(false);
    useEffect(() => {
        if (!config)
            return;
        const step = config.steps[currentStepIndex];
        if (!step)
            return;
        if (step.id === 'confirm-profile') {
            setDisplayName(displayName || 'Aarav Mehta');
        }
    }, [config, currentStepIndex, displayName]);
    if (isLoading || !config) {
        return (<ScreenScaffold style={createScreenScaffoldBackgroundColorStyle(colors.background)}>
        <View style={styles.loading}>
          <AppText variant="body" style={createAppTextColorStyle(colors.textSecondary)}>{localizedUiText.m_c6a478b0faa5}</AppText>
        </View>
      </ScreenScaffold>);
    }
    const step = config.steps[currentStepIndex];
    if (!step) {
        return (<ScreenScaffold style={createScreenScaffoldBackgroundColorStyle2(colors.background)}>
        <View style={styles.loading}>
          <AppText variant="body" style={createAppTextColorStyle2(colors.textSecondary)}>
            {authMessages.invalidOnboardingStep}
          </AppText>
        </View>
      </ScreenScaffold>);
    }
    const handleNext = async () => {
        let data: Record<string, string | boolean | number> = {};
        if (step.id === 'confirm-residence') {
            data = { confirmed: true };
        }
        else if (step.id === 'confirm-profile') {
            if (displayName.trim().length < 2)
                return;
            data = { displayName };
        }
        else if (step.id === 'notifications') {
            data = { pushEnabled, inAppEnabled };
        }
        else if (step.id === 'emergency') {
            data = { emergencyVolunteer };
        }
        else if (step.id === 'society-rules') {
            if (!rulesConsent || !communicationConsent)
                return;
            data = { rulesConsent, communicationConsent };
        }
        else if (step.id === 'optional-participation') {
            data = { emergencyVolunteer };
        }
        const saved = await saveStep(step.id, data);
        if (saved) {
            if (currentStepIndex === config.steps.length - 2) {
                const finished = await completeOnboarding(step.id);
                if (finished) {
                    onComplete();
                }
            }
            else {
                nextStep();
            }
        }
    };
    const handlePrimaryPress = () => {
        if (step.id === 'completion') {
            onComplete();
        }
        else {
            handleNext();
        }
    };
    const getPrimaryDisabled = () => {
        if (step.id === 'confirm-profile') {
            return displayName.trim().length < 2;
        }
        if (step.id === 'society-rules') {
            return !rulesConsent || !communicationConsent;
        }
        return false;
    };
    const getPrimaryLabel = () => {
        if (step.id === 'completion')
            return getActiveUiLiteral("m_609d53e03743");
        if (currentStepIndex === config.steps.length - 2)
            return getActiveUiLiteral("m_e6779afda449");
        return getActiveUiLiteral("m_684b45158391");
    };
    const stepTitle = `${authMessages.onboardingEyebrow} : ${step.title}`;
    return (<HomeSetupFlow title={stepTitle} subtitle={step.subtitle} currentStepIndex={currentStepIndex} totalSteps={config.steps.length} primaryLabel={getPrimaryLabel()} onPrimaryPress={handlePrimaryPress} primaryDisabled={getPrimaryDisabled()} secondaryLabel={currentStepIndex > 0 ? 'Back' : getActiveUiLiteral("m_648435d140c3")} onSecondaryPress={currentStepIndex > 0 ? prevStep : onCancel} {...includeWhenPresent("skipLabel", !step.required ? getActiveUiLiteral("m_a7ebfe536bfa") : undefined)} onSkipPress={handleNext}>
      
      {step.type === 'confirmResidence' && (<View style={styles.stack}>
          <View style={[styles.confirmBox, createViewBackgroundColorBorderColorStyle(colors.surfaceMuted, colors.border)]}>
            <View style={styles.logoRow}>
              <Ionicons name="business" size={20} color={colors.primary}/>
              <AppText variant="h2" style={styles.appTextFontWeight}>
                {config.societyName}
              </AppText>
            </View>
            <AppText variant="body" style={createAppTextColorStyle3(colors.textSecondary)}>{localizedUiText.m_9311e5cc88d5}{config.unitDisplayName}
            </AppText>
            <AppText variant="caption" style={createAppTextColorStyle4(colors.textMuted)}>{localizedUiText.m_eb5a328857de}{config.role.toUpperCase()}
            </AppText>
          </View>
          <AppText variant="bodySmall" style={createAppTextColorStyle5(colors.textSecondary)}>{localizedUiText.m_5a062d6e5a79}</AppText>
        </View>)}

      {step.type === 'confirmProfile' && (<View style={styles.stack}>
          <FormField label={localizedUiText.m_c39bd57c158a} value={displayName} onChangeText={setDisplayName} placeholder={localizedUiText.m_bbbec5562d23} required/>
        </View>)}

      {step.type === 'notificationPreferences' && (<View style={styles.stack}>
          <ConsentRow label={localizedUiText.m_d2f2b3594e55} description={localizedUiText.m_323d297388e5} value={pushEnabled} onValueChange={setPushEnabled}/>
          <ConsentRow label={localizedUiText.m_a2b5d7fac307} description={localizedUiText.m_df5d7ae1359c} value={inAppEnabled} onValueChange={setInAppEnabled}/>
        </View>)}

      {step.type === 'emergencyPreferences' && (<View style={styles.stack}>
          <ConsentRow label={localizedUiText.m_d95b0710975e} description={localizedUiText.m_7ecaacd70c24} value={emergencyVolunteer} onValueChange={setEmergencyVolunteer}/>
          <View style={[styles.alertBox, createViewBackgroundColorStyle(colors.infoSoft)]}>
            <Ionicons name="shield-checkmark" size={16} color={colors.info}/>
            <AppText variant="caption" style={createAppTextColorStyle6(colors.info)}>{localizedUiText.m_d197a52a3346}</AppText>
          </View>
        </View>)}

      {step.type === 'societyRules' && (<View style={styles.stack}>
          <ConsentRow label={localizedUiText.m_3ebf7dd2724b} description={localizedUiText.m_9dc895a7ec32} value={rulesConsent} onValueChange={setRulesConsent} required/>
          <ConsentRow label={localizedUiText.m_e0f936112a07} description={localizedUiText.m_3c55105c68d2} value={communicationConsent} onValueChange={setCommunicationConsent} required/>
        </View>)}

      {step.type === 'completion' && (<View style={styles.completion}>
          <Ionicons name="checkmark-circle" size={48} color={colors.success}/>
          <AppText variant="h2" style={styles.appTextFontWeight2}>{localizedUiText.m_c64ff3f41c66}</AppText>
          <AppText variant="body" style={createAppTextColorStyle7(colors.textSecondary)}>{localizedUiText.m_16cdb21e8194}{config.unitDisplayName}{localizedUiText.m_06d8955b38a5}</AppText>
        </View>)}
    </HomeSetupFlow>);
}

