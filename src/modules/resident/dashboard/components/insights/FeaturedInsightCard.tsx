import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeText } from "../../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { useReducedMotion } from "../../../../../shared/motion/useReducedMotion";
import { StatusPill } from "../../../../../ui/components/StatusPill";
import type { DailyInsightViewModel } from "../../../contextualInsights/data/dailyInsight.types";
import { includeWhenPresent } from "../../../../../shared/utils/presentProperty";
import { styles, createAnimatedViewBackgroundColorBorderColorShadowColorStyle, createViewBackgroundColorStyle, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBorderTopColorStyle } from "../../styles/components/insights/FeaturedInsightCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export interface FeaturedInsightCardProps {
    insight: DailyInsightViewModel;
}
export function FeaturedInsightCard({ insight }: FeaturedInsightCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const reducedMotion = useReducedMotion();
    return (<Animated.View {...includeWhenPresent("entering", reducedMotion ? undefined : FadeInDown.delay(40).duration(240))} style={[
            styles.card,
            createAnimatedViewBackgroundColorBorderColorShadowColorStyle(colors.surfaceRaised, colors.border, colors.shadow),
        ]} testID="featured-insight-card">
      
      <View style={styles.badgeRow}>
        <View style={[styles.categoryBadge, createViewBackgroundColorStyle(colors.surfaceMuted)]}>
          <SafeText variant="tiny" style={[styles.categoryLabel, createSafeTextColorStyle(colors.textSecondary)]}>
            {insight.categoryLabel}
          </SafeText>
        </View>
        <StatusPill label={insight.severityLabel} tone={insight.severityTone} small/>
      </View>

      
      <View style={styles.heroRow}>
        <View style={styles.iconContainer}>
          <Ionicons name={insight.categoryIcon as keyof typeof Ionicons.glyphMap} size={22} color={colors.primary}/>
        </View>
        <View style={styles.heroText}>
          <SafeText variant="bodyStrong" style={[styles.title, createSafeTextColorStyle2(colors.textPrimary)]} numberOfLines={3} ellipsizeMode="tail">
            {insight.title}
          </SafeText>
          <SafeText variant="body" style={[styles.description, createSafeTextColorStyle3(colors.textSecondary)]}>
            {insight.description}
          </SafeText>
        </View>
      </View>

      
      <View style={[styles.footer, createViewBorderTopColorStyle(colors.border)]}>
        {insight.sourceLabel ? (<SafeText variant="caption" color="secondary" style={styles.sourceText} numberOfLines={1}>
            {insight.sourceLabel}
          </SafeText>) : null}
        <View style={styles.metadataRow}>
          {insight.locationLabel ? (<>
              <SafeText variant="tiny" color="muted" style={styles.metadataText} numberOfLines={1}>
                {insight.locationLabel}
              </SafeText>
              <SafeText variant="tiny" color="muted" style={styles.bullet}>·</SafeText>
            </>) : null}
          <SafeText variant="tiny" color="muted" style={styles.metadataText} numberOfLines={1}>{localizedUiText.m_3a5ecca188c0}{insight.updatedLabel}
          </SafeText>
        </View>
      </View>
    </Animated.View>);
}
export default FeaturedInsightCard;

