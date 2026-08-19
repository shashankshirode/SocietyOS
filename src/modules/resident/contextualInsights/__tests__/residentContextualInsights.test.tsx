import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { mapWmoCodeToCondition } from '../utils/weatherCodeMapper';
import { sortAdvisories } from '../utils/advisoryPrioritySorter';
import { isCacheValid } from '../utils/areaInsightCachePolicy';
import { buildSuggestions } from '../utils/contextualSuggestionEngine';
import { WeatherInsightPill } from '../components/WeatherInsightPill';
import type { LocalAreaAdvisory } from '../data/residentContextualInsights.types';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
describe('Contextual Insights Utilities', () => {
    it('maps WMO code correctly', () => {
        expect(mapWmoCodeToCondition(0)).toBe('clear');
        expect(mapWmoCodeToCondition(3)).toBe('cloudy');
        expect(mapWmoCodeToCondition(63)).toBe('rain');
        expect(mapWmoCodeToCondition(81)).toBe('heavyRain');
        expect(mapWmoCodeToCondition(95)).toBe('thunderstorm');
    });
    it('sorts advisories by priority', () => {
        const advisories: LocalAreaAdvisory[] = [
            {
                id: '1',
                areaId: 'area',
                type: 'gateCongestion',
                priority: 'low',
                titleMessageKey: 'title1',
                descriptionMessageKey: 'desc1',
                shortSuggestionMessageKey: 'short1',
                reportedAtIso: '',
                validUntilIso: new Date(Date.now() + 60000).toISOString(),
                source: 'mock',
            },
            {
                id: '2',
                areaId: 'area',
                type: 'securityAlert',
                priority: 'critical',
                titleMessageKey: 'title2',
                descriptionMessageKey: 'desc2',
                shortSuggestionMessageKey: 'short2',
                reportedAtIso: '',
                validUntilIso: '',
                source: 'mock',
            },
            {
                id: '3',
                areaId: 'area',
                type: 'roadBlock',
                priority: 'high',
                titleMessageKey: 'title3',
                descriptionMessageKey: 'desc3',
                shortSuggestionMessageKey: 'short3',
                reportedAtIso: '',
                validUntilIso: '',
                source: 'mock',
            },
        ];
        const sorted = sortAdvisories(advisories);
        expect(getRequiredItem(sorted, 0, "residentContextualInsights.test.tsx").priority).toBe('critical');
        expect(getRequiredItem(sorted, 1, "residentContextualInsights.test.tsx").priority).toBe('high');
        expect(getRequiredItem(sorted, 2, "residentContextualInsights.test.tsx").priority).toBe('low');
    });
    it('checks cache validity correctly', () => {
        const future = new Date(Date.now() + 60000).toISOString();
        const past = new Date(Date.now() - 60000).toISOString();
        expect(isCacheValid(future)).toBe(true);
        expect(isCacheValid(past)).toBe(false);
    });
    it('builds prioritized suggestions correctly', () => {
        const weather = {
            areaId: 'area',
            areaName: 'Test Area',
            city: 'Pune',
            latitude: 0,
            longitude: 0,
            temperatureCelsius: 22,
            conditionCode: 'rain' as const,
            observedAtIso: '',
            validUntilIso: '',
            provider: 'backendMock' as const,
        };
        const advisories: LocalAreaAdvisory[] = [
            {
                id: 'road',
                areaId: 'area',
                type: 'roadBlock',
                priority: 'high',
                titleMessageKey: 'resident.contextualInsights.advisory.roadBlockSuggestion',
                descriptionMessageKey: 'resident.contextualInsights.advisory.roadBlockSuggestion',
                shortSuggestionMessageKey: 'resident.contextualInsights.advisory.roadBlockSuggestion',
                reportedAtIso: '',
                validUntilIso: new Date(Date.now() + 60000).toISOString(),
                source: 'mock',
            },
        ];
        const suggestions = buildSuggestions(weather, advisories);
        expect(getRequiredItem(suggestions, 0, "residentContextualInsights.test.tsx").priority).toBe('high');
        expect(getRequiredItem(suggestions, 1, "residentContextualInsights.test.tsx").priority).toBe('medium');
    });
});
describe('Contextual Insights Components', () => {
    it('renders WeatherInsightPill', async () => {
        const weather = {
            areaId: 'area',
            areaName: 'Test Area',
            city: 'Pune',
            latitude: 0,
            longitude: 0,
            temperatureCelsius: 22,
            conditionCode: 'rain' as const,
            observedAtIso: '',
            validUntilIso: '',
            provider: 'backendMock' as const,
        };
        await renderWithProviders(<WeatherInsightPill weather={weather}/>);
        expect(screen.getByText(/22°C/)).toBeTruthy();
        expect(screen.getByText(/Test Area/)).toBeTruthy();
    });
});

