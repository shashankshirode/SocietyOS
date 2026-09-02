import React, { useMemo, useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppBottomSheet } from "../../../../../ui/bottomSheet";
import type { HomeStackParamList, RootTabParamList } from "../../../../../app/navigation/navigation.types";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../../shared/constants/useMessages";
import { PressableScale } from "../../../../../shared/motion/PressableScale";
import { SafeText } from "../../../../../shared/components/SafeText";
import { DailyInsightsHeader } from "./DailyInsightsHeader";
import { FeaturedInsightCard } from "./FeaturedInsightCard";
import { InsightRecommendationCard } from "./InsightRecommendationCard";
import { InsightActionsPanel } from "./InsightActionsPanel";
import { InsightInfoSection } from "./InsightInfoSection";
import { InsightLoadingState } from "./InsightLoadingState";
import { InsightEmptyState } from "./InsightEmptyState";
import { InsightErrorState } from "./InsightErrorState";
import { mapSuggestionToViewModel } from "./dailyInsightMapper";
import { ReportDailyInsightModal } from "../../../contextualInsights/components/ReportDailyInsightModal";
import { dailyInsightMessages } from "../../../../../messages/en/residentDashboard.messages";
import type { ResidentContextualInsightsResult } from "../../../contextualInsights/data/residentContextualInsights.types";
import type { DailyInsightViewModel } from "../../../contextualInsights/data/dailyInsight.types";
import { includeWhenPresent } from "../../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle } from "../../styles/components/insights/DailyInsightsBottomSheet.styles";
export interface DailyInsightsBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    data: ResidentContextualInsightsResult | null;
    onDismissSuggestion: (id: string) => void;
    isLoading?: boolean;
    error?: Error | null;
    onRetry?: () => void;
}
type DailyInsightsNavigation = NavigationProp<RootTabParamList & HomeStackParamList>;
export function DailyInsightsBottomSheet({ visible, onClose, data, onDismissSuggestion, isLoading = false, error = null, onRetry, }: DailyInsightsBottomSheetProps) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const navigation = useNavigation<DailyInsightsNavigation>();
    const { width } = useWindowDimensions();
    const [activeIndex, setActiveIndex] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [reportModalVisible, setReportModalVisible] = useState(false);
    React.useEffect(() => {
        if (!visible) {
            setActiveIndex(0);
            setShowExplanation(false);
            setReportModalVisible(false);
        }
    }, [visible]);
    const isTablet = width >= 768;
    const activeSuggestions = useMemo(() => {
        if (!data?.suggestions)
            return [];
        const nowTime = Date.now();
        return data.suggestions.filter((sug) => {
            const validUntil = sug.advisory?.validUntilIso;
            if (validUntil && new Date(validUntil).getTime() < nowTime) {
                return false;
            }
            return true;
        });
    }, [data?.suggestions]);
    React.useEffect(() => {
        if (activeIndex >= activeSuggestions.length && activeSuggestions.length > 0) {
            setActiveIndex(activeSuggestions.length - 1);
        }
    }, [activeSuggestions.length, activeIndex]);
    const mappedInsights: DailyInsightViewModel[] = useMemo(() => {
        if (!data)
            return [];
        return activeSuggestions.map((sug) => mapSuggestionToViewModel(sug, data, messages));
    }, [activeSuggestions, data, messages]);
    const currentInsight = mappedInsights[activeIndex] ?? null;
    if (!visible)
        return null;
    const handleAction = (action: string, insightItem: DailyInsightViewModel) => {
        if (action === 'acknowledge' || action === 'dismiss') {
            onDismissSuggestion(insightItem.id);
            if (mappedInsights.length > 1) {
                if (activeIndex >= mappedInsights.length - 1) {
                    setActiveIndex(Math.max(0, mappedInsights.length - 2));
                }
            }
            else {
                onClose();
            }
        }
        else if (action === 'learnMore') {
            setShowExplanation((prev) => !prev);
        }
        else if (action === 'openNotice') {
            navigation.navigate('NoticeListFromHome');
            onClose();
        }
        else if (action === 'callSecurity') {
            navigation.navigate('EmergencySos');
            onClose();
        }
    };
    return (<>
      <AppBottomSheet visible={visible} onClose={onClose} testID="daily-insights-bottom-sheet" header={<DailyInsightsHeader onClose={onClose} onReportPress={() => setReportModalVisible(true)} />}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {isLoading ? (<InsightLoadingState />) : error ? (<InsightErrorState {...includeWhenPresent("onRetry", onRetry)}/>) : mappedInsights.length === 0 || !currentInsight ? (<InsightEmptyState />) : (<View style={styles.container}>
              
              {mappedInsights.length > 1 && (<View style={styles.indicatorHeader}>
                  <SafeText variant="caption" color="secondary" style={styles.paginationText}>
                    {activeIndex + 1}{" " + localizedUiText.m_28391d3bc64e + " "}{mappedInsights.length}{localizedUiText.m_3061cec044b4}
                  </SafeText>
                </View>)}

              <View style={isTablet ? styles.tabletContentGrid : styles.contentStack}>
                
                <View style={isTablet ? styles.tabletCardContainer : null}>
                  <View style={styles.cardWithNavRow}>
                    {mappedInsights.length > 1 && (<PressableScale onPress={() => {
                      setActiveIndex((prev) => Math.max(0, prev - 1));
                      setShowExplanation(false);
                  }} disabled={activeIndex === 0} accessibilityRole="button" accessibilityLabel={localizedUiText.m_84f50d753248} style={[
                      styles.middleNavButton,
                      createViewBackgroundColorBorderColorStyle(colors.surface, colors.border),
                      activeIndex === 0 ? styles.disabledNavButton : null,
                  ]} testID="daily-insights-prev-btn">
                        <Ionicons name="chevron-back" size={20} color={activeIndex === 0 ? colors.textMuted : colors.primary}/>
                      </PressableScale>)}

                    <View style={styles.cardContainer}>
                      <FeaturedInsightCard insight={currentInsight}/>
                    </View>

                    {mappedInsights.length > 1 && (<PressableScale onPress={() => {
                      setActiveIndex((prev) => Math.min(mappedInsights.length - 1, prev + 1));
                      setShowExplanation(false);
                  }} disabled={activeIndex === mappedInsights.length - 1} accessibilityRole="button" accessibilityLabel={localizedUiText.m_17daa56a9276} style={[
                      styles.middleNavButton,
                      createViewBackgroundColorBorderColorStyle(colors.surface, colors.border),
                      activeIndex === mappedInsights.length - 1 ? styles.disabledNavButton : null,
                  ]} testID="daily-insights-next-btn">
                        <Ionicons name="chevron-forward" size={20} color={activeIndex === mappedInsights.length - 1 ? colors.textMuted : colors.primary}/>
                      </PressableScale>)}
                  </View>
                </View>

                <View style={styles.supportStack}>
                  
                  {currentInsight.recommendation ? (<InsightRecommendationCard recommendation={currentInsight.recommendation}/>) : null}

                  
                  <InsightActionsPanel actions={currentInsight.actions} onAction={(act) => handleAction(act, currentInsight)}/>

                  
                  <View style={styles.explanationSection}>
                    <PressableScale onPress={() => setShowExplanation((prev) => !prev)} style={styles.explanationLink} accessibilityRole="button" accessibilityLabel={localizedUiText.m_2ceb4ead4f4d} testID="why-this-insight-link">
                      <SafeText variant="caption" style={createSafeTextColorStyle(colors.primary)}>
                        {dailyInsightMessages.sheet.whyShown} {showExplanation ? '▲' : '▼'}
                      </SafeText>
                    </PressableScale>

                    {showExplanation && (<InsightInfoSection {...includeWhenPresent("explanation", currentInsight.explanation)}/>)}
                  </View>
                </View>
              </View>
            </View>)}
        </ScrollView>
      </AppBottomSheet>

      <ReportDailyInsightModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        societyId={data?.activeSocietyId || 'soc-1'}
        unitId={data?.activeUnitId || 'unit-1'}
        onSuccess={() => {
          onRetry?.();
        }}
      />
    </>);
}
export default DailyInsightsBottomSheet;
