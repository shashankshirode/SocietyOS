import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppButton } from "../../shared/components/AppButton";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { useMessages } from "../../shared/constants/useMessages";
import { t } from "../../modules/resident/household/components/householdComponentUtils";
import type { PrerequisiteEvaluationResult, PrerequisiteAction } from "../../shared/prerequisites";
import { getPrimaryPrerequisiteDescriptionKey, getPrimaryPrerequisiteMessageKey } from "../../shared/prerequisites";
import { PrerequisiteBlockedBanner } from "./PrerequisiteBlockedBanner";
import { PrerequisiteChecklist } from "./PrerequisiteChecklist";
import { styles, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle } from "./styles/MissingPrerequisiteState.styles";
export interface MissingPrerequisiteStateProps {
    result: PrerequisiteEvaluationResult;
    onActionPress?: (action: PrerequisiteAction) => void;
    onSecondaryActionPress?: () => void;
}
export function MissingPrerequisiteState({ result, onActionPress, onSecondaryActionPress, }: MissingPrerequisiteStateProps) {
    const { colors, dark } = useAppTheme();
    const messages = useMessages();
    const primaryCheck = result.blockingChecks[0] ?? result.warningChecks[0];
    const primaryAction = primaryCheck?.action;
    return (<View style={[styles.container, createViewBackgroundColorStyle(colors.background)]} testID="missing-prerequisite-state">
      <View style={[styles.visual, createViewBackgroundColorBorderColorStyle(dark ? colors.surfaceElevated : colors.surface, colors.border)]}>
        <Ionicons name={primaryCheck?.status === 'restricted' ? 'lock-closed-outline' : 'construct-outline'} size={34} color={primaryCheck?.status === 'restricted' ? colors.danger : colors.primary}/>
      </View>
      <SafeText variant="h2" color="primary" align="center" numberOfLines={3}>
        {t(messages, getPrimaryPrerequisiteMessageKey(result))}
      </SafeText>
      <SafeText variant="body" color="secondary" align="center" numberOfLines={4} style={styles.description}>
        {t(messages, getPrimaryPrerequisiteDescriptionKey(result))}
      </SafeText>
      {primaryCheck ? <PrerequisiteBlockedBanner check={primaryCheck}/> : null}
      <PrerequisiteChecklist checks={result.checks}/>
      <View style={styles.actions}>
        {primaryAction && primaryAction.type !== 'none' ? (<AppButton title={t(messages, primaryAction.labelMessageKey)} onPress={() => onActionPress?.(primaryAction)} variant="primary"/>) : null}
        <AppButton title={t(messages, 'resident.prerequisites.contactAdmin')} onPress={() => onSecondaryActionPress?.()} variant="secondary"/>
      </View>
    </View>);
}

