import type {
  AreaWeatherSnapshot,
  AppIconName,
  LocalAreaAdvisory,
  ResidentContextualSuggestion,
  ContextualInsightPriority,
} from '../data/residentContextualInsights.types';

export function buildSuggestions(
  weather: AreaWeatherSnapshot | null,
  advisories: LocalAreaAdvisory[],
  nowMs = Date.now(),
): ResidentContextualSuggestion[] {
  const suggestions: ResidentContextualSuggestion[] = [];

  
  for (const adv of filterCurrentAdvisories(advisories, nowMs)) {
    let iconName: AppIconName = 'warning-outline';
    if ('autoIconName' in adv && (adv as any).autoIconName) iconName = (adv as any).autoIconName;
    else if (adv.type === 'roadBlock') iconName = 'warning-outline';
    else if (adv.type === 'waterlogging') iconName = 'water-outline';
    else if (adv.type === 'gateCongestion') iconName = 'people-outline';
    else if (adv.type === 'liftOutage') iconName = 'arrow-down-outline';
    else if (adv.type === 'powerCut') iconName = 'flash-outline';
    else if (adv.type === 'securityAlert') iconName = 'shield-outline';
    else if (adv.type === 'parkingCongestion') iconName = 'car-outline';
    else if (adv.type === 'maintenanceWork') iconName = 'construct-outline';
    else if (adv.type === 'societyEvent') iconName = 'calendar-outline';

    suggestions.push({
      id: `sug-adv-${adv.id}`,
      priority: adv.priority,
      iconName,
      titleMessageKey: 'resident.contextualInsights.title',
      oneLineMessageKey: adv.shortSuggestionMessageKey,
      detailMessageKey: adv.descriptionMessageKey,
      advisory: adv,
      action: {
        labelMessageKey: 'resident.contextualInsights.actions.viewDetails',
        actionType: 'openDetails',
      },
    });
  }

  if (weather) {
    const code = weather.conditionCode;
    let priority: ContextualInsightPriority = 'low';
    let iconName: AppIconName = 'partly-sunny-outline';
    let oneLineMessageKey = 'resident.contextualInsights.weather.clearSuggestion';

    if (code === 'heavyRain' || code === 'thunderstorm') {
      priority = 'high';
      iconName = 'thunderstorm-outline';
      oneLineMessageKey = 'resident.contextualInsights.weather.heavyRainSuggestion';
    } else if (code === 'rain' || code === 'drizzle') {
      priority = 'medium';
      iconName = 'rainy-outline';
      oneLineMessageKey = 'resident.contextualInsights.weather.rainSuggestion';
    } else if (code === 'heat') {
      priority = 'medium';
      iconName = 'sunny-outline';
      oneLineMessageKey = 'resident.contextualInsights.weather.heatSuggestion';
    } else if (code === 'clear') {
      priority = 'low';
      iconName = 'sunny-outline';
      oneLineMessageKey = 'resident.contextualInsights.weather.clearSuggestion';
    }

    suggestions.push({
      id: `sug-weather-${weather.areaId}`,
      priority,
      iconName,
      titleMessageKey: 'resident.contextualInsights.title',
      oneLineMessageKey,
      detailMessageKey: oneLineMessageKey,
      weatherSnapshot: weather,
      action: {
        labelMessageKey: 'resident.contextualInsights.actions.viewDetails',
        actionType: 'openDetails',
      },
    });
  }

  const priorityWeights: Record<ContextualInsightPriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  suggestions.sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority]);

  return suggestions;
}

export function isAdvisoryCurrent(advisory: LocalAreaAdvisory, nowMs = Date.now()): boolean {
  const validUntilMs = Date.parse(advisory.validUntilIso);
  return Number.isFinite(validUntilMs) && validUntilMs > nowMs;
}

export function filterCurrentAdvisories(
  advisories: readonly LocalAreaAdvisory[],
  nowMs = Date.now(),
): LocalAreaAdvisory[] {
  return advisories.filter((advisory) => isAdvisoryCurrent(advisory, nowMs));
}
export default buildSuggestions;
