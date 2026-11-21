import { Text, View } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createViewBackgroundColorStyle, createTextColorStyle } from "./styles/StatusRibbon.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
interface StatusRibbonProps {
    text: string;
    status?: 'success' | 'warning' | 'danger' | 'info';
}
export function StatusRibbon({ text, status = 'info' }: StatusRibbonProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const statusColorsMap = {
        success: { bg: colors.successSoft || '#DCFCE7', text: colors.success || String(localizedUiText.m_56c1214f3d08) },
        warning: { bg: colors.warningSoft || '#FEF3C7', text: colors.warning || String(localizedUiText.m_dfa3ff8fbf58) },
        danger: { bg: colors.dangerSoft || '#FEE2E2', text: colors.danger || String(localizedUiText.m_35ce4f50b46f) },
        info: { bg: colors.infoSoft || '#E0F2FE', text: colors.info || String(localizedUiText.m_da7dc8e47c52) },
    };
    const activeColor = statusColorsMap[status];
    return (<View style={[styles.ribbon, createViewBackgroundColorStyle(activeColor.bg)]}>
      <Text style={[styles.text, createTextColorStyle(activeColor.text)]}>
        {text.toUpperCase()}
      </Text>
    </View>);
}

