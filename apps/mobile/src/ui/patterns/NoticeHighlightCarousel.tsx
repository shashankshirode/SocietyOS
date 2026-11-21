import React from "react";
import { FlatList, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { PressableScale } from "../../shared/motion/PressableScale";
import { SocietyNoticeCard, normalizeNotice } from "./SocietyNoticeCard";
import type { DashboardNoticeViewModel } from "../../modules/resident/dashboard/data/dashboard.viewModel.types";
import type { NoticeHighlight } from "../../modules/resident/dashboard/data/dashboard.types";
import { useResponsiveLayout } from "../layout/useResponsiveLayout";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewWidthStyle, createViewPaddingHorizontalStyle, createViewBackgroundColorBorderColorMarginHorizontalStyle, createViewPaddingHorizontalStyle2, createFlatListPaddingHorizontalStyle } from "./styles/NoticeHighlightCarousel.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { formatUiLiteral } from "../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../shared/localization/activeUiLiteral";
export interface NoticeHighlightCarouselProps {
    notices: (DashboardNoticeViewModel | NoticeHighlight)[];
    onNoticePress: (id: string) => void;
    onViewAllPress: () => void;
    sectionTitle?: string;
    sectionSubtitle?: string;
    viewAllLabel?: string;
    emptyTitle?: string;
    emptyDescription?: string;
    ackLabels?: Record<string, string>;
    categoryLabels?: Record<string, string>;
}
export function NoticeHighlightCarousel({ notices, onNoticePress, onViewAllPress, sectionTitle = 'Notices', sectionSubtitle, viewAllLabel = getActiveUiLiteral("m_ff5573a6f287"), emptyTitle, emptyDescription, }: NoticeHighlightCarouselProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { isTablet, isSmall, width, screenPadding } = useResponsiveLayout();
    const noticeCardWidth = isSmall || width < 360
        ? width - screenPadding * 2
        : Math.min(width * 0.78, 360);
    const normalizedNotices = React.useMemo(() => {
        return notices.map(normalizeNotice);
    }, [notices]);
    return (<View style={styles.container}>
      
      <View style={[styles.headerContainer, isTablet ? styles.headerRow : styles.headerColumn, createViewPaddingHorizontalStyle(screenPadding)]}>
        <View style={styles.headerTitleContainer}>
          <SafeText variant="title" style={createSafeTextColorStyle(colors.textPrimary)}>
            {sectionTitle}
          </SafeText>
          {sectionSubtitle ? (<SafeText variant="caption" color="secondary" numberOfLines={2} style={styles.subtitleText}>
              {sectionSubtitle}
            </SafeText>) : null}
        </View>
        <PressableScale onPress={onViewAllPress} accessibilityRole="button" accessibilityLabel={formatUiLiteral(localizedUiText.m_b64d270613a9, [viewAllLabel])} style={isTablet ? null : styles.viewAllMobile}>
          <View style={styles.viewFlexDirectionAlignItems}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(colors.primary)}>
              {viewAllLabel}
            </SafeText>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(colors.primary)}>
              {' →'}
            </SafeText>
          </View>
        </PressableScale>
      </View>

      {normalizedNotices.length === 0 ? (<View style={[styles.empty, createViewBackgroundColorBorderColorMarginHorizontalStyle(colors.surface, colors.border, screenPadding)]}> 
          <Ionicons name="newspaper-outline" size={28} color={colors.textMuted}/>
          {emptyTitle ? <SafeText variant="bodyStrong" color="primary">{emptyTitle}</SafeText> : null}
          {emptyDescription ? <SafeText variant="caption" color="muted" align="center">{emptyDescription}</SafeText> : null}
        </View>) : isTablet ? (<View style={[styles.gridContainer, createViewPaddingHorizontalStyle2(screenPadding)]}>
          {normalizedNotices.map((notice) => (<View key={notice.id} style={createViewWidthStyle((width - screenPadding * 2 - 16) / 2)}>
              <SocietyNoticeCard notice={notice} onPress={onNoticePress}/>
            </View>))}
        </View>) : (<FlatList horizontal showsHorizontalScrollIndicator={false} data={normalizedNotices} keyExtractor={(item) => item.id} renderItem={({ item }) => (<SocietyNoticeCard notice={item} onPress={onNoticePress} width={noticeCardWidth}/>)} contentContainerStyle={[
                styles.listContent,
                createFlatListPaddingHorizontalStyle(screenPadding)
            ]} snapToInterval={noticeCardWidth + 12} decelerationRate="fast" accessibilityRole="list"/>)}
    </View>);
}

