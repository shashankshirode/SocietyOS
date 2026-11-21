import type { ResidentContextualInsightsRepository, GetResidentContextualInsightsInput, GetAreaWeatherSnapshotInput, GetLocalAdvisoriesInput, DismissContextualSuggestionInput, } from './residentContextualInsights.repository.types';
import type { ResidentContextualInsightsResult, AreaWeatherSnapshot, LocalAreaAdvisory, LocalAdvisoryType, WeatherConditionCode, } from './residentContextualInsights.types';
import { mockWeatherSnapshots, mockAdvisories } from './residentContextualInsights.mockData';
import { buildSuggestions, filterCurrentAdvisories } from '../utils/contextualSuggestionEngine';
import { mockResidentHomeContexts } from '../../homeContext/data/residentHomeContext.mockData';
import { mapContextToActive } from '../../homeContext/state/residentHomeContext.store';
import { getUserReportedAdvisories } from '../state/userReportedInsights.store';
import { getResidentMockRecords } from '../../mock/residentMockRegistry';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import { getRequiredProperty } from '../../../../shared/utils/requiredProperty';
const dismissedSuggestionIds = new Set<string>();
export const residentContextualInsightsMockSource: ResidentContextualInsightsRepository = {
    getContextualInsights: async (input: GetResidentContextualInsightsInput): Promise<ResidentContextualInsightsResult> => {
        const home = mockResidentHomeContexts.find((candidate) => candidate.societyId === input.societyId && candidate.unitId === input.unitId);
        if (!home) {
            return {
                activeAreaId: '',
                activeSocietyId: input.societyId,
                activeUnitId: input.unitId,
                weatherSnapshot: null,
                advisories: [],
                suggestions: [],
                topSuggestion: null,
                lastUpdatedIso: '2026-07-11T08:00:00.000Z',
                nextRefreshDueIso: '2026-07-11T10:00:00.000Z',
            };
        }
        const activeHome = mapContextToActive(home);
        const context = { activeHome, dataScopeKey: activeHome.dataScopeKey };
        const conditions: readonly WeatherConditionCode[] = [
            'rain',
            'partlyCloudy',
            'drizzle',
            'heavyRain',
            'cloudy',
            'wind',
        ];
        const nowMs = Date.now();
        const weatherSnapshot: AreaWeatherSnapshot = {
            areaId: home.societyAreaId,
            areaName: home.societyAreaName,
            city: home.city,
            latitude: 18 + Number(home.homeContextId.slice(-1)) / 10,
            longitude: 73 + Number(home.homeContextId.slice(-1)) / 10,
            temperatureCelsius: 21 + Number(home.homeContextId.slice(-1)),
            feelsLikeCelsius: 22 + Number(home.homeContextId.slice(-1)),
            humidityPercent: 55 + Number(home.homeContextId.slice(-1)) * 3,
            precipitationProbabilityPercent: 10 + Number(home.homeContextId.slice(-1)) * 8,
            windSpeedKmph: 8 + Number(home.homeContextId.slice(-1)),
            conditionCode: getRequiredItem(conditions, Number(home.homeContextId.slice(-1)) - 1, "residentContextualInsights.mockSource.ts"),
            observedAtIso: new Date(nowMs - 15 * 60 * 1000).toISOString(),
            validUntilIso: new Date(nowMs + 60 * 60 * 1000).toISOString(),
            provider: 'backendMock',
        };
        const advisoryTypes: readonly LocalAdvisoryType[] = [
            'roadBlock',
            'waterlogging',
            'gateCongestion',
            'liftOutage',
            'powerCut',
            'securityAlert',
        ];
        const advisoryMessageKeys = [
            'resident.contextualInsights.advisory.roadBlockSuggestion',
            'resident.contextualInsights.advisory.waterloggingSuggestion',
            'resident.contextualInsights.advisory.gateCongestionSuggestion',
            'resident.contextualInsights.advisory.liftOutageSuggestion',
            'resident.contextualInsights.advisory.powerCutSuggestion',
            'resident.contextualInsights.advisory.securityAlertSuggestion',
        ] as const;
        const advisories: LocalAreaAdvisory[] = getResidentMockRecords(context, 'contextualInsights').map((record) => {
            const messageKey = getRequiredItem(advisoryMessageKeys, record.ordinal % advisoryMessageKeys.length, "residentContextualInsights.mockSource.ts");
            return {
                id: record.id,
                societyId: record.societyId,
                areaId: home.societyAreaId,
                type: getRequiredItem(advisoryTypes, record.ordinal % advisoryTypes.length, "residentContextualInsights.mockSource.ts"),
                priority: getRequiredItem((['low', 'medium', 'high', 'critical'] as const), record.ordinal % 4, "residentContextualInsights.mockSource.ts"),
                titleMessageKey: messageKey,
                descriptionMessageKey: messageKey,
                shortSuggestionMessageKey: messageKey,
                reportedAtIso: record.createdAtIso,
                validUntilIso: record.status === 'active' || record.status === 'pending'
                    ? new Date(nowMs + (record.ordinal + 1) * 30 * 60 * 1000).toISOString()
                    : new Date(nowMs - (record.ordinal + 1) * 30 * 60 * 1000).toISOString(),
                source: record.ordinal % 2 === 0 ? 'facilityTeam' : 'guardReport',
            };
        });
        const userReported = getUserReportedAdvisories(input.societyId);
        const allAdvisories = [...userReported, ...advisories];
        const currentAdvisories = filterCurrentAdvisories(allAdvisories, nowMs);
        const allSuggestions = buildSuggestions(weatherSnapshot, currentAdvisories, nowMs);
        const suggestions = allSuggestions.filter((sug) => !dismissedSuggestionIds.has(sug.id));
        const topSuggestion = suggestions.length > 0 ? getRequiredItem(suggestions, 0, "residentContextualInsights.mockSource.ts") : null;
        return {
            activeAreaId: home.societyAreaId,
            activeSocietyId: input.societyId,
            activeUnitId: input.unitId,
            weatherSnapshot,
            advisories: currentAdvisories,
            suggestions,
            topSuggestion,
            lastUpdatedIso: new Date(nowMs).toISOString(),
            nextRefreshDueIso: new Date(nowMs + 30 * 60 * 1000).toISOString(),
        };
    },
    getAreaWeatherSnapshot: async (input: GetAreaWeatherSnapshotInput): Promise<AreaWeatherSnapshot> => {
        if (input.areaId === 'area-tathawade') {
            return getRequiredProperty(mockWeatherSnapshots, 'tathawadeClear', 'weather snapshots');
        }
        return getRequiredProperty(mockWeatherSnapshots, 'nashikRain', 'weather snapshots');
    },
    getLocalAdvisories: async (input: GetLocalAdvisoriesInput): Promise<LocalAreaAdvisory[]> => {
        if (input.areaId === 'area-tathawade') {
            return filterCurrentAdvisories(getRequiredProperty(mockAdvisories, 'tathawadeRoadBlock', 'local advisories'));
        }
        return filterCurrentAdvisories(getRequiredProperty(mockAdvisories, 'waterlogging', 'local advisories'));
    },
    dismissSuggestion: async (input: DismissContextualSuggestionInput): Promise<ResidentContextualInsightsResult> => {
        dismissedSuggestionIds.add(input.suggestionId);
        return residentContextualInsightsMockSource.getContextualInsights({
            userId: input.userId,
            societyId: input.societyId,
            unitId: input.unitId,
        });
    },
};
export default residentContextualInsightsMockSource;
