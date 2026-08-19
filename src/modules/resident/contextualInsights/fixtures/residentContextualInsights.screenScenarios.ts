import type { ResidentContextualInsightsResult } from '../data/residentContextualInsights.types';

export const screenScenarios = {
  normalClear: {
    activeAreaId: 'area-tathawade',
    activeSocietyId: 'soc-tathawade',
    activeUnitId: 'unit-1',
    weatherSnapshot: {
      areaId: 'area-tathawade',
      areaName: 'Tathawade',
      city: 'Pune',
      latitude: 18.6186,
      longitude: 73.7516,
      temperatureCelsius: 29,
      conditionCode: 'clear',
      observedAtIso: new Date().toISOString(),
      validUntilIso: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      provider: 'backendMock',
    },
    advisories: [],
    suggestions: [
      {
        id: 'sug-weather-clear',
        priority: 'low',
        iconName: 'sunny-outline',
        titleMessageKey: 'resident.contextualInsights.title',
        oneLineMessageKey: 'resident.contextualInsights.weather.clearSuggestion',
        detailMessageKey: 'resident.contextualInsights.weather.clearSuggestion',
        action: {
          labelMessageKey: 'resident.contextualInsights.actions.viewDetails',
          actionType: 'openDetails',
        },
      },
    ],
    topSuggestion: {
      id: 'sug-weather-clear',
      priority: 'low',
      iconName: 'sunny-outline',
      titleMessageKey: 'resident.contextualInsights.title',
      oneLineMessageKey: 'resident.contextualInsights.weather.clearSuggestion',
      detailMessageKey: 'resident.contextualInsights.weather.clearSuggestion',
      action: {
        labelMessageKey: 'resident.contextualInsights.actions.viewDetails',
        actionType: 'openDetails',
      },
    },
    lastUpdatedIso: new Date().toISOString(),
    nextRefreshDueIso: new Date().toISOString(),
  } as ResidentContextualInsightsResult,
};
export default screenScenarios;
