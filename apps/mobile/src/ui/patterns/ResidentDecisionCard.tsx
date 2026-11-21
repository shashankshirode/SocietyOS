import { View, Pressable } from "react-native";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { useMessages } from "../../shared/constants/useMessages";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle, createPressableBorderColorStyle, createPressableBackgroundColorStyle } from "./styles/ResidentDecisionCard.styles";
export interface ResidentDecisionCardProps {
    title: string;
    description: string;
    meta?: string;
    onAccept: () => void;
    onReject: () => void;
    acceptLabel?: string;
    rejectLabel?: string;
}
export function ResidentDecisionCard({ title, description, meta, onAccept, onReject, acceptLabel, rejectLabel, }: ResidentDecisionCardProps) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors, dark } = useAppTheme();
    const messages = useMessages();
    return (<View style={[
            styles.container,
            createViewBackgroundColorBorderColorStyle(dark ? colors.surfaceElevated : colors.surface, colors.border),
        ]} accessibilityLabel={messages.residentAccessibility.decisionCard}>
      <View style={styles.content}>
        <View style={styles.header}>
          <SafeText variant="bodyStrong" color="primary" style={styles.safeTextFlex}>
            {title}
          </SafeText>
          {meta && (<SafeText variant="tiny" color="muted">
              {meta}
            </SafeText>)}
        </View>

        <SafeText variant="caption" style={createSafeTextColorStyle(colors.textSecondary)}>
          {description}
        </SafeText>
      </View>

      <View style={styles.footer}>
        <Pressable style={[styles.btn, styles.btnReject, createPressableBorderColorStyle(colors.border)]} onPress={onReject}>
          <SafeText variant="caption" color="danger">
            {rejectLabel || localizedUiText.m_ab604a360777}
          </SafeText>
        </Pressable>

        <Pressable style={[styles.btn, createPressableBackgroundColorStyle(colors.primary)]} onPress={onAccept}>
          <SafeText variant="caption" style={styles.safeTextColorFontWeight}>
            {acceptLabel || localizedUiText.m_89713b9c9c1b}
          </SafeText>
        </Pressable>
      </View>
    </View>);
}

