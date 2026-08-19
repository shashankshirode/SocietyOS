import { ScrollView, View, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { ResidentPriorityCard } from "./ResidentPriorityCard";
import type { ResidentPriorityItem, ResidentPrioritySummaryData } from "../../modules/resident/dashboard/data/dashboard.types";
import { useResponsiveLayout } from "../layout/useResponsiveLayout";
import { styles, createSafeTextColorStyle, createViewWidthStyle, createSafeTextColorStyle2, createViewBackgroundColorStyle, createSafeTextColorStyle3, createViewBackgroundColorStyle2, createSafeTextColorStyle4, createViewBackgroundColorBorderColorStyle, createScrollViewPaddingHorizontalStyle, createPressablePaddingHorizontalStyle } from "./styles/ResidentTodayPriorityPanel.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { getActiveUiLiteral } from "../../shared/localization/activeUiLiteral";
export interface ResidentTodayPriorityPanelProps {
    title: string;
    subtitle: string;
    viewAllLabel: string;
    emptyTitle: string;
    emptyDescription: string;
    items: ResidentPriorityItem[];
    summary: ResidentPrioritySummaryData;
    onActionPress: (id: string) => void;
    onViewAllPress: () => void;
}
export function ResidentTodayPriorityPanel({ title, subtitle, viewAllLabel, emptyTitle, emptyDescription, items, summary, onActionPress, onViewAllPress, }: ResidentTodayPriorityPanelProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    const { colors } = useAppTheme();
    const { isTablet, width, screenPadding, isSmall, isNormal } = useResponsiveLayout();
    const visibleItems = items.slice(0, 3);
    const priorityCount = items.length;
    const showViewAll = priorityCount > 3;
    const formattedCount = priorityCount > 99 ? '99+' : String(priorityCount);
    const badgeLabel = isSmall || isNormal
        ? formattedCount
        : `${formattedCount} need attention`;
    const badgeAccessibilityLabel = `${priorityCount} ${priorityCount === 1 ? getActiveUiLiteral("m_48f2a1e019f4") : getActiveUiLiteral("m_d47992d38fa8")} attention`;
    const viewAllAccessibilityLabel = `View all ${priorityCount} priorities`;
    const renderHeader = () => {
        if (isTablet) {
            return (<View style={styles.headerTablet}>
          <View style={styles.titleContainerTablet}>
            <SafeText variant="title" color="primary" style={styles.titleText}>
              {title}
            </SafeText>
            <SafeText variant="caption" color="muted" numberOfLines={2} style={styles.subtitleText}>
              {subtitle}
            </SafeText>
          </View>
          {priorityCount > 0 && (<View style={styles.badgeViewAllContainerTablet}>
              <View style={[styles.badgeCompact, createViewBackgroundColorStyle(colors.dangerSoft)]} accessibilityRole="text" accessibilityLabel={badgeAccessibilityLabel}>
                <SafeText variant="tiny" style={[styles.badgeText, createSafeTextColorStyle3(colors.danger)]} numberOfLines={1}>
                  {badgeLabel}
                </SafeText>
              </View>
              {showViewAll && (<Pressable onPress={onViewAllPress} style={styles.viewAllButtonTablet} accessibilityRole="button" accessibilityLabel={viewAllAccessibilityLabel} hitSlop={8}>
                  <SafeText variant="caption" style={createSafeTextColorStyle(colors.primary)} numberOfLines={1}>
                    {viewAllLabel}
                  </SafeText>
                  <Ionicons name="arrow-forward" size={14} color={colors.primary}/>
                </Pressable>)}
            </View>)}
        </View>);
        }
        return (<View style={styles.headerMobile}>
        <View style={styles.headerRowMobile}>
          <View style={styles.titleContainerMobile}>
            <SafeText variant="title" color="primary" style={styles.titleText}>
              {title}
            </SafeText>
          </View>
          {priorityCount > 0 && (<View style={[styles.badgeCompact, createViewBackgroundColorStyle2(colors.dangerSoft)]} accessibilityRole="text" accessibilityLabel={badgeAccessibilityLabel}>
              <SafeText variant="tiny" style={[styles.badgeText, createSafeTextColorStyle4(colors.danger)]} numberOfLines={1}>
                {badgeLabel}
              </SafeText>
            </View>)}
        </View>
        <SafeText variant="caption" color="muted" numberOfLines={2} style={styles.subtitleText}>
          {subtitle}
        </SafeText>
      </View>);
    };
    const cardPadding = screenPadding;
    const cardWidth = width < 360
        ? width - cardPadding * 2
        : Math.min(width * 0.82, 420);
    return (<View style={styles.container} testID="resident-today-priority-panel" accessibilityRole="summary">
      {renderHeader()}

      {priorityCount === 0 ? (<View style={[styles.emptyCard, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]} accessibilityRole="text">
          <SafeText variant="bodyStrong" color="primary" align="center">
            {emptyTitle}
          </SafeText>
          <SafeText variant="caption" color="secondary" align="center">
            {emptyDescription}
          </SafeText>
        </View>) : isTablet ? (<View style={styles.tabletGrid} accessibilityRole="list">
          {visibleItems.map((item, index) => (<View key={item.id} style={styles.tabletGridItem}>
              <ResidentPriorityCard item={item} rank={index + 1} onActionPress={onActionPress}/>
            </View>))}
        </View>) : (<View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.rail, createScrollViewPaddingHorizontalStyle(cardPadding)]} accessibilityRole="list" snapToInterval={cardWidth + 12} decelerationRate="fast">
            {visibleItems.map((item, index) => (<View key={item.id} style={createViewWidthStyle(cardWidth)}>
                <ResidentPriorityCard item={item} rank={index + 1} onActionPress={onActionPress}/>
              </View>))}
          </ScrollView>
          {showViewAll && (<Pressable onPress={onViewAllPress} style={[styles.viewAllButtonMobile, createPressablePaddingHorizontalStyle(cardPadding)]} accessibilityRole="button" accessibilityLabel={viewAllAccessibilityLabel} hitSlop={12}>
              <SafeText variant="caption" style={createSafeTextColorStyle2(colors.primary)} numberOfLines={1}>
                {viewAllLabel}
              </SafeText>
              <Ionicons name="arrow-forward" size={14} color={colors.primary}/>
            </Pressable>)}
        </View>)}
    </View>);
}

