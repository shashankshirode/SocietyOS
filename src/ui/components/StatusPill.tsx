import { View, ViewStyle, StyleProp } from "react-native";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { styles, createViewBackgroundColorStyle, createSafeTextColorStyle } from "./styles/StatusPill.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { getActiveUiLiteral } from "../../shared/localization/activeUiLiteral";
export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'muted';
export interface StatusPillProps {
    label: string;
    tone?: StatusTone;
    small?: boolean;
    style?: StyleProp<ViewStyle>;
    testID?: string;
}
const toneMap: Record<StatusTone, {
    bg: string;
    text: string;
}> = {
    success: { bg: '#DCFCE7', get text() {
            return getActiveUiLiteral("m_56c1214f3d08");
        } },
    warning: { bg: '#FEF3C7', get text() {
            return getActiveUiLiteral("m_bfb4bc5e474c");
        } },
    danger: { bg: '#FEE2E2', get text() {
            return getActiveUiLiteral("m_35ce4f50b46f");
        } },
    info: { bg: '#E0F2FE', get text() {
            return getActiveUiLiteral("m_da7dc8e47c52");
        } },
    neutral: { bg: '#F1F5F9', get text() {
            return '#475569';
        } },
    muted: { bg: '#F1F5F9', get text() {
            return getActiveUiLiteral("m_c7131729c43b");
        } },
};
const toneMapDark: Record<StatusTone, {
    bg: string;
    text: string;
}> = {
    success: { bg: '#052E16', get text() {
            return getActiveUiLiteral("m_895a04e0671f");
        } },
    warning: { bg: '#451A03', get text() {
            return getActiveUiLiteral("m_4824bd238f43");
        } },
    danger: { bg: '#450A0A', get text() {
            return getActiveUiLiteral("m_5168f7b9fd6b");
        } },
    info: { bg: '#082F49', get text() {
            return getActiveUiLiteral("m_9b12411a09c8");
        } },
    neutral: { bg: '#1E293B', get text() {
            return getActiveUiLiteral("m_26eecfc60178");
        } },
    muted: { bg: '#1E293B', get text() {
            return getActiveUiLiteral("m_7d1217217b38");
        } },
};
export function StatusPill({ label, tone = 'neutral', small = false, style, testID }: StatusPillProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    const { dark } = useAppTheme();
    const palette = dark ? toneMapDark[tone] : toneMap[tone];
    return (<View style={[
            styles.pill,
            small && styles.pillSmall,
            createViewBackgroundColorStyle(palette.bg),
            style,
        ]} testID={testID}>
      <SafeText variant="tiny" style={[
            styles.text,
            small && styles.textSmall,
            createSafeTextColorStyle(palette.text),
        ]} numberOfLines={1}>
        {label}
      </SafeText>
    </View>);
}

