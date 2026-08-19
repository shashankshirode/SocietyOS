import { View, ViewStyle } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2, createAnimatedViewBorderBottomColorStyle, createViewBackgroundColorStyle, createViewSpread1Style } from "./styles/ActivityFeed.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { getActiveUiLiteral } from "../../shared/localization/activeUiLiteral";
export interface ActivityItem {
    id: string;
    title: string;
    subtitle: string;
    timestamp?: string;
    status?: string;
    statusTone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}
interface ActivityFeedProps {
    title: string;
    items: ActivityItem[];
    emptyTitle?: string;
    emptySubtitle?: string;
    style?: ViewStyle;
}
function StatusDot({ tone }: {
    tone?: string;
}) {
    const toneColors: Record<string, string> = {
        success: '#15803D',
        warning: '#B45309',
        danger: '#B91C1C',
        info: '#0369A1',
        neutral: '#6B7280'
    };
    const color = toneColors[tone ?? 'neutral'] ?? toneColors.neutral;
    return <View style={[styles.dot, createViewSpread1Style(includeWhenPresent("backgroundColor", color))]}/>;
}
export function ActivityFeed({ title, items, emptyTitle = getActiveUiLiteral("m_5beceebdcca4"), emptySubtitle = getActiveUiLiteral("m_818bbe21b181"), style }: ActivityFeedProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    const { colors } = useAppTheme();
    return (<View {...includeWhenPresent("style", style)}>
      <SafeText variant="bodyStrong" color="secondary" style={styles.sectionTitle}>{title}</SafeText>
      {items.length === 0 ? (<View style={[styles.emptyCard, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
          <SafeText variant="body" color="muted">{emptyTitle}</SafeText>
          <SafeText variant="caption" color="muted">{emptySubtitle}</SafeText>
        </View>) : (<View style={[styles.feedCard, createViewBackgroundColorBorderColorStyle2(colors.surface, colors.border)]}>
          {items.map((item, index) => (<Animated.View key={item.id} entering={FadeInDown.delay(index * 60).duration(300).springify()} style={[styles.row, index < items.length - 1 && createAnimatedViewBorderBottomColorStyle(colors.border)]}>
              <StatusDot {...includeWhenPresent("tone", item.statusTone)}/>
              <View style={styles.rowBody}>
                <View style={styles.rowHeader}>
                  <SafeText variant="body" color="primary" numberOfLines={1} style={styles.rowTitle}>{item.title}</SafeText>
                  {item.status && (<View style={[styles.statusChip, createViewBackgroundColorStyle(getChipBg(item.statusTone))]}>
                      <SafeText variant="tiny" style={createSafeTextColorStyle(getChipFg(item.statusTone))}>{item.status}</SafeText>
                    </View>)}
                </View>
                <SafeText variant="caption" color="muted" numberOfLines={1}>{item.subtitle}</SafeText>
                {item.timestamp && <SafeText variant="tiny" color="muted">{item.timestamp}</SafeText>}
              </View>
            </Animated.View>))}
        </View>)}
    </View>);
}
function getChipBg(tone?: string): string {
    const map: Record<string, string> = { success: '#DCFCE7', warning: '#FEF3C7', danger: '#FEE2E2', info: '#E0F2FE', neutral: '#F1F5F9' };
    return map[tone ?? 'neutral'] ?? '#F1F5F9';
}
function getChipFg(tone?: string): string {
    const map: Record<string, string> = { success: '#15803D', warning: '#92400E', danger: '#B91C1C', info: '#0369A1', neutral: '#334155' };
    return map[tone ?? 'neutral'] ?? '#334155';
}

