import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { StatusPill } from "../components/StatusPill";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { PressableScale } from "../../shared/motion/PressableScale";
import type { DashboardNoticeViewModel } from "../../modules/resident/dashboard/data/dashboard.viewModel.types";
import type { NoticeHighlight } from "../../modules/resident/dashboard/data/dashboard.types";
import { useResponsiveLayout } from "../layout/useResponsiveLayout";
import { formatResidentDate } from "../../core/localization/dateTimeFormatters";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createPressableScaleWidthStyle, createViewBackgroundColorBorderColorStyle, createSafeTextColorStyle2 } from "./styles/SocietyNoticeCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { getActiveUiLiteral } from "../../shared/localization/activeUiLiteral";
export interface SocietyNoticeCardProps {
    notice: DashboardNoticeViewModel | NoticeHighlight;
    onPress: (id: string) => void;
    width?: number;
}
export function normalizeNotice(item: DashboardNoticeViewModel | NoticeHighlight): DashboardNoticeViewModel {
    if (!item) {
        return {
            id: '',
            categoryLabel: 'General',
            get title() {
                return getActiveUiLiteral("m_65659145569b");
            },
            summary: getActiveUiLiteral("m_3f6c296e578b"),
            get formattedPublishedTime() {
                return getActiveUiLiteral("m_5eda7c0bf89e");
            },
            acknowledgementRequired: false,
            statusTone: 'neutral'
        };
    }
    if ('categoryLabel' in item && 'formattedPublishedTime' in item) {
        return item;
    }
    const categoryKeys: Record<string, string> = {
        important: 'Important',
        maintenance: 'Maintenance',
        event: 'Event',
        emergency: 'Emergency',
        general: 'General'
    };
    const categoryLabel = categoryKeys[item.category] || item.category;
    const title = item.title.replace(/\s+/g, ' ').trim();
    let summary = (item.summary || '').replace(/\s+/g, ' ').trim();
    if (!summary) {
        summary = getActiveUiLiteral("m_3f6c296e578b");
    }
    let formattedPublishedTime = 'Recently published';
    if (item.publishedAtLabel) {
        formattedPublishedTime = item.publishedAtLabel;
    }
    else if (item.publishedDate) {
        const parsedDate = new Date(item.publishedDate);
        if (!Number.isNaN(parsedDate.getTime())) {
            formattedPublishedTime = formatResidentDate(parsedDate);
        }
    }
    let attachmentLabel = undefined;
    if (item.attachmentName) {
        attachmentLabel = '1 attachment';
    }
    let statusLabel = undefined;
    let statusTone: 'neutral' | 'info' | 'warning' | 'success' | 'danger' = 'neutral';
    if (item.acknowledgementRequired) {
        statusLabel = item.acknowledgementStatus === 'acknowledged' ? 'Acknowledged' : getActiveUiLiteral("m_b05830acb746");
        statusTone = item.acknowledgementStatus === 'acknowledged' ? 'success' : 'warning';
    }
    else if (item.acknowledgementStatus === 'acknowledged') {
        statusLabel = 'Acknowledged';
        statusTone = 'success';
    }
    return {
        id: item.id,
        categoryLabel,
        title,
        summary,
        formattedPublishedTime,
        ...includeWhenPresent("attachmentLabel", attachmentLabel),
        ...includeWhenPresent("statusLabel", statusLabel),
        statusTone,
        acknowledgementRequired: Boolean(item.acknowledgementRequired)
    };
}
const categoryConfig: Record<string, {
    icon: keyof typeof Ionicons.glyphMap;
    tone: 'danger' | 'primary' | 'success' | 'warning' | 'neutral';
}> = {
    important: { icon: 'alert-circle', tone: 'danger' },
    general: { icon: 'megaphone-outline', tone: 'primary' },
    event: { icon: 'calendar-outline', tone: 'success' },
    maintenance: { icon: 'construct-outline', tone: 'warning' },
    emergency: { icon: 'warning', tone: 'danger' }
};
export function SocietyNoticeCard({ notice: rawNotice, onPress, width: customWidth }: SocietyNoticeCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    const { colors } = useAppTheme();
    const { isSmall } = useResponsiveLayout();
    const notice = normalizeNotice(rawNotice);
    const categoryLower = String(notice.categoryLabel).toLowerCase();
    let categoryKey = 'general';
    if (categoryLower.includes('meeting') || categoryLower.includes('important') || categoryLower.includes('agm')) {
        categoryKey = 'important';
    }
    else if (categoryLower.includes('maintenance') || categoryLower.includes('cleaning') || categoryLower.includes('water')) {
        categoryKey = 'maintenance';
    }
    else if (categoryLower.includes('event') || categoryLower.includes('festival') || categoryLower.includes('celebration')) {
        categoryKey = 'event';
    }
    else if (categoryLower.includes('emergency') || categoryLower.includes('safety') || categoryLower.includes('drill')) {
        categoryKey = 'emergency';
    }
    const config = categoryConfig[categoryKey] || { icon: 'megaphone-outline', tone: 'primary' };
    const accent = colors[config.tone];
    const bg = colors[`${config.tone}Soft` as 'dangerSoft' | 'primarySoft' | 'successSoft' | 'warningSoft' | 'neutralSoft'] || colors.surfaceMuted;
    const ackPart = notice.statusLabel ? `${notice.statusLabel}.` : '';
    const attachPart = notice.attachmentLabel ? `${notice.attachmentLabel}.` : '';
    const accessibilityLabel = `${notice.categoryLabel} Notice. ${notice.title}. Published ${notice.formattedPublishedTime}. ${ackPart} ${attachPart} Double tap to open.`;
    const shouldStack = isSmall || (customWidth && customWidth < 340);
    return (<PressableScale onPress={() => onPress(notice.id)} accessibilityRole="button" accessibilityLabel={accessibilityLabel} style={customWidth ? createPressableScaleWidthStyle(customWidth) : null}>
      <View style={[styles.card, createViewBackgroundColorBorderColorStyle(bg, colors.border)]}>
        <View style={styles.contentGroup}>
          
          <View style={styles.categoryRow}>
            <Ionicons name={config.icon} size={16} color={accent}/>
            <SafeText variant="tiny" style={[styles.categoryLabel, createSafeTextColorStyle2(accent)]} numberOfLines={1}>
              {notice.categoryLabel}
            </SafeText>
          </View>

          
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.textPrimary)} numberOfLines={3} ellipsizeMode="tail">
            {notice.title}
          </SafeText>

          
          <SafeText variant="caption" color="secondary" numberOfLines={2} ellipsizeMode="tail" style={styles.summaryText}>
            {notice.summary}
          </SafeText>
        </View>

        
        <View style={[styles.footer, shouldStack ? styles.footerStacked : styles.footerRow]}>
          
          <View style={styles.metadataGroup}>
            <SafeText variant="tiny" color="muted" style={styles.timestamp} numberOfLines={1}>
              {notice.formattedPublishedTime}
            </SafeText>
            {notice.attachmentLabel ? (<View style={styles.attachmentBadge}>
                <Ionicons name="attach-outline" size={14} color={colors.textMuted}/>
                {!shouldStack && (<SafeText variant="tiny" color="muted" numberOfLines={1} style={styles.attachmentText}>
                    {notice.attachmentLabel}
                  </SafeText>)}
              </View>) : null}
          </View>

          
          {notice.statusLabel ? (<View style={shouldStack ? styles.badgeLeftAlign : null}>
              <StatusPill label={notice.statusLabel} tone={notice.statusTone} small/>
            </View>) : null}
        </View>
      </View>
    </PressableScale>);
}
