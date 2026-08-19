import { useState } from "react";
import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "../../household/components/householdComponentUtils";
import { useDailyContextHint } from "../hooks/useDailyContextHint";
import { ContextualInsightIcon } from "./ContextualInsightIcon";
import { DailyInsightsBottomSheet } from "../../dashboard/components/insights/DailyInsightsBottomSheet";
import { ContextualInsightSkeleton } from "./ContextualInsightSkeleton";
import { ContextualInsightErrorState } from "./ContextualInsightErrorState";
import { residentColors } from "../../../../shared/theme/residentColors";
import { styles } from "../styles/components/DailyContextHint.styles";
export interface DailyContextHintProps {
    societyId: string;
    unitId: string;
}
export function DailyContextHint({ societyId, unitId }: DailyContextHintProps) {
    const messages = useMessages();
    const [sheetVisible, setSheetVisible] = useState(false);
    const { topSuggestion, isLoading, error, refetch, dismissSuggestion, enabled, } = useDailyContextHint(societyId, unitId);
    if (!enabled || error || !topSuggestion)
        return null;
    if (isLoading)
        return <ContextualInsightSkeleton />;
    return (<View style={styles.outerContainer}>
      <Pressable onPress={() => setSheetVisible(true)} accessibilityRole="button" accessibilityLabel={t(messages, 'residentAccessibility.contextualInsights.openDetails')} style={[
            styles.container,
            styles.pressableBackgroundColorBorderColor,
        ]}>
        <ContextualInsightIcon name={topSuggestion.iconName} priority={topSuggestion.priority} size={14}/>
        <SafeText variant="tiny" style={[styles.suggestionText, styles.safeTextColor]} numberOfLines={1} ellipsizeMode="tail">
          {t(messages, topSuggestion.oneLineMessageKey)}
        </SafeText>
        <Ionicons name="chevron-forward" size={12} color={residentColors.onBrandMuted}/>
      </Pressable>

      <DailyInsightsBottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} data={{
            activeAreaId: 'area-mock',
            activeSocietyId: societyId,
            activeUnitId: unitId,
            weatherSnapshot: topSuggestion.weatherSnapshot || null,
            advisories: topSuggestion.advisory ? [topSuggestion.advisory] : [],
            suggestions: [topSuggestion],
            topSuggestion,
            lastUpdatedIso: new Date().toISOString(),
            nextRefreshDueIso: new Date().toISOString(),
        }} onDismissSuggestion={(id) => {
            dismissSuggestion(id);
            setSheetVisible(false);
        }} isLoading={isLoading} error={error} onRetry={refetch}/>
    </View>);
}
export default DailyContextHint;

