import { View } from "react-native";
import { AppButton } from "../components/AppButton";
import { SafeText } from "../components/SafeText";
import { AppIcon } from "../icons/AppIcon";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createViewBackgroundColorStyle, createViewBackgroundColorStyle2 } from "./styles/AccessRestrictedState.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { getActiveUiLiteral } from "../localization/activeUiLiteral";
type AccessRestrictedStateProps = {
    title?: string;
    description?: string;
    requiredPermission?: string;
    onBack?: () => void;
};
export function AccessRestrictedState({ title = getActiveUiLiteral("m_233f644f36b8"), description = getActiveUiLiteral("m_1f784782b11d"), requiredPermission, onBack, }: AccessRestrictedStateProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    return (<View style={[styles.container, createViewBackgroundColorStyle(colors.background)]}>
      <View style={[styles.iconCircle, createViewBackgroundColorStyle2(colors.dangerSoft)]}>
        <AppIcon name="lock" size={32} color={colors.danger}/>
      </View>
      <SafeText variant="title" color="primary" align="center" numberOfLines={3} style={styles.title}>{title}</SafeText>
      <SafeText variant="body" color="secondary" align="center" numberOfLines={5} style={styles.description}>
        {description}
      </SafeText>
      {requiredPermission ? (<SafeText variant="caption" color="muted" align="center" numberOfLines={3} style={styles.permission}>{localizedUiText.m_ea61648646ff}{requiredPermission}
        </SafeText>) : null}
      <SafeText variant="caption" color="muted" align="center" numberOfLines={3} style={styles.support}>{localizedUiText.m_4227fffdf459}</SafeText>
      {onBack ? (<AppButton title={localizedUiText.m_6aadac2f2b7a} onPress={onBack} variant="secondary" size="sm" style={styles.button}/>) : null}
    </View>);
}

