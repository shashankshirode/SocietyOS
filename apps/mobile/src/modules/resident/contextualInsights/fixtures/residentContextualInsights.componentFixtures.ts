import type { ResidentContextualSuggestion } from '../data/residentContextualInsights.types';

export const componentFixtures = {
  rainWarning: {
    id: 'sug-weather-rain',
    priority: 'medium',
    iconName: 'rainy-outline',
    titleMessageKey: 'resident.contextualInsights.title',
    oneLineMessageKey: 'resident.contextualInsights.weather.rainSuggestion',
    detailMessageKey: 'resident.contextualInsights.weather.rainSuggestion',
  } as ResidentContextualSuggestion,
  roadBlock: {
    id: 'sug-adv-roadBlock',
    priority: 'high',
    iconName: 'warning-outline',
    titleMessageKey: 'resident.contextualInsights.title',
    oneLineMessageKey: 'resident.contextualInsights.advisory.roadBlockSuggestion',
    detailMessageKey: 'resident.contextualInsights.advisory.roadBlockSuggestion',
  } as ResidentContextualSuggestion,
};
export default componentFixtures;
