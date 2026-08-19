import { Pressable, ScrollView, View } from "react-native";
import { useNavigation, type NavigationProp } from "@react-navigation/native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "../../household/components/householdComponentUtils";
import type { ResidentContextualInsightsResult, ResidentContextualSuggestionAction } from "../data/residentContextualInsights.types";
import { ContextualInsightCard } from "./ContextualInsightCard";
import { WeatherInsightPill } from "./WeatherInsightPill";
import { AppBottomSheet } from "../../../../ui/bottomSheet";
import { ModalHeader } from "../../../../ui/modal";
import type { RootTabParamList } from "../../../../app/navigation/navigation.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2, createPressableBackgroundColorStyle, createViewBackgroundColorBorderColorStyle3 } from "../styles/components/ContextualInsightSheet.styles";
export interface ContextualInsightSheetProps {
    visible: boolean;
    onClose: () => void;
    data: ResidentContextualInsightsResult | null;
    onDismissSuggestion: (id: string) => void;
}
export function ContextualInsightSheet({ visible, onClose, data, onDismissSuggestion, }: ContextualInsightSheetProps) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const navigation = useNavigation<NavigationProp<RootTabParamList>>();
    if (!visible || !data)
        return null;
    const handleActionPress = (action: ResidentContextualSuggestionAction) => {
        onClose();
        if (action.actionType === 'openVisitors') {
            navigation.navigate('VisitorTab', { screen: 'VisitorList' });
        }
        else if (action.actionType === 'openEmergency') {
            navigation.navigate('HomeTab', { screen: 'EmergencySos' });
        }
    };
    return (<AppBottomSheet visible={visible} onClose={onClose} testID="contextual-insight-sheet" header={<ModalHeader title={t(messages, 'resident.contextualInsights.title')} onClose={onClose}/>}>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {data.weatherSnapshot && (<View style={[styles.infoCard, createViewBackgroundColorBorderColorStyle(colors.background, colors.border)]}>
              <SafeText variant="caption" color="muted" style={styles.sectionTitle}>
                {t(messages, 'resident.contextualInsights.weather.temperature')}
              </SafeText>
              <WeatherInsightPill weather={data.weatherSnapshot}/>
              
              <View style={styles.grid}>
                <View style={styles.gridItem}>
                  <SafeText variant="tiny" color="muted">
                    {t(messages, 'resident.contextualInsights.weatherParams.feelsLike')}
                  </SafeText>
                  <SafeText variant="caption" style={createSafeTextColorStyle(colors.textPrimary)}>
                    {data.weatherSnapshot.temperatureCelsius}{localizedUiText.m_11c4350690a3}</SafeText>
                </View>
                <View style={styles.gridItem}>
                  <SafeText variant="tiny" color="muted">
                    {t(messages, 'resident.contextualInsights.weatherParams.provider')}
                  </SafeText>
                  <SafeText variant="caption" style={createSafeTextColorStyle2(colors.textPrimary)}>
                    {data.weatherSnapshot.provider}
                  </SafeText>
                </View>
              </View>
            </View>)}

          
          {data.advisories && data.advisories.length > 0 && (<View style={[styles.infoCard, createViewBackgroundColorBorderColorStyle2(colors.background, colors.border)]}>
              <SafeText variant="caption" color="muted" style={styles.sectionTitle}>
                {t(messages, 'resident.contextualInsights.advisoryParams.metadataTitle')}
              </SafeText>
              {data.advisories.map((adv) => (<View key={adv.id} style={styles.advisoryRow}>
                  <View style={styles.grid}>
                    <View style={styles.gridItem}>
                      <SafeText variant="tiny" color="muted">
                        {t(messages, 'resident.contextualInsights.advisoryParams.source')}
                      </SafeText>
                      <SafeText variant="caption" style={createSafeTextColorStyle3(colors.textPrimary)}>
                        {adv.source}
                      </SafeText>
                    </View>
                    <View style={styles.gridItem}>
                      <SafeText variant="tiny" color="muted">
                        {t(messages, 'resident.contextualInsights.advisoryParams.priority')}
                      </SafeText>
                      <SafeText variant="caption" style={createSafeTextColorStyle4(colors.textPrimary)}>
                        {adv.priority}
                      </SafeText>
                    </View>
                  </View>
                </View>))}
            </View>)}

          
          <View style={styles.suggestionsList}>
            {data.suggestions.map((sug) => (<View key={sug.id}>
                <ContextualInsightCard suggestion={sug} onDismiss={onDismissSuggestion}/>
                {sug.action && sug.action.actionType !== 'openDetails' && (<Pressable style={[styles.actionBtn, createPressableBackgroundColorStyle(colors.primary)]} onPress={() => {
                    if (sug.action)
                        handleActionPress(sug.action);
                }}>
                    <SafeText variant="caption" style={createSafeTextColorStyle5(colors.textInverse)}>
                      {t(messages, sug.action.labelMessageKey)}
                    </SafeText>
                  </Pressable>)}
              </View>))}
            {data.suggestions.length === 0 && (<SafeText variant="caption" color="muted" style={styles.emptyText}>
                {t(messages, 'resident.contextualInsights.empty.noSuggestion')}
              </SafeText>)}
          </View>

          
          <View style={[styles.infoCard, createViewBackgroundColorBorderColorStyle3(colors.background, colors.border)]}>
            <SafeText variant="caption" style={createSafeTextColorStyle6(colors.textPrimary)}>
              {t(messages, 'resident.contextualInsights.info.title')}
            </SafeText>
            <SafeText variant="tiny" color="muted">
              {t(messages, 'resident.contextualInsights.info.description')}
            </SafeText>
          </View>
        </ScrollView>
    </AppBottomSheet>);
}
export default ContextualInsightSheet;

