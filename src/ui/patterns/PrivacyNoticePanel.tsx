import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useResidentTheme } from "../foundation/residentTheme";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle } from "./styles/PrivacyNoticePanel.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { getActiveUiLiteral } from "../../shared/localization/activeUiLiteral";
export interface PrivacyNoticePanelProps {
    title?: string;
    description: string;
    points?: string[];
}
export function PrivacyNoticePanel({ title = getActiveUiLiteral("m_f87c016833de"), description, points = [], }: PrivacyNoticePanelProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    const theme = useResidentTheme();
    return (<View style={[styles.container, createViewBackgroundColorBorderColorStyle(theme.accentSoft, theme.border)]}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={20} color={theme.accent}/>
        <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.accent)}>
          {title}
        </SafeText>
      </View>
      <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textSecondary)}>
        {description}
      </SafeText>
      {points.length > 0 && (<View style={styles.points}>
          {points.map((point, index) => (<View key={index} style={styles.pointRow}>
              <View style={[styles.bullet, createViewBackgroundColorStyle(theme.accent)]}/>
              <SafeText variant="tiny" style={createSafeTextColorStyle3(theme.textSecondary)}>
                {point}
              </SafeText>
            </View>))}
        </View>)}
    </View>);
}
export default PrivacyNoticePanel;

