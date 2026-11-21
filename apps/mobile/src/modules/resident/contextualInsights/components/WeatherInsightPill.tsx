import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import type { AppIconName, AreaWeatherSnapshot } from "../data/residentContextualInsights.types";
import { ContextualInsightIcon } from "./ContextualInsightIcon";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle } from "../styles/components/WeatherInsightPill.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export interface WeatherInsightPillProps {
    weather: AreaWeatherSnapshot;
}
export function WeatherInsightPill({ weather }: WeatherInsightPillProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    let iconName: AppIconName = 'partly-sunny-outline';
    if (weather.conditionCode === 'clear')
        iconName = 'sunny-outline';
    else if (weather.conditionCode === 'rain' || weather.conditionCode === 'drizzle')
        iconName = 'rainy-outline';
    else if (weather.conditionCode === 'heavyRain')
        iconName = 'thunderstorm-outline';
    return (<View style={[styles.pill, createViewBackgroundColorBorderColorStyle(theme.accentSoft, theme.border)]}>
      <ContextualInsightIcon name={iconName} priority="medium" size={14}/>
      <SafeText variant="tiny" style={createSafeTextColorStyle(theme.textPrimary)}>
        {weather.temperatureCelsius}{localizedUiText.m_33329e52edf5 + " "}{weather.areaName}
      </SafeText>
    </View>);
}
export default WeatherInsightPill;

