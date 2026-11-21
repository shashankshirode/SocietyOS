import type { EnglishMessagesType } from '../../../../../messages/en';
import { t } from '../../../household/components/householdComponentUtils';
import type { LocalAreaAdvisory, LocalAdvisoryType, ResidentContextualInsightsResult, ResidentContextualSuggestion, } from '../../../contextualInsights/data/residentContextualInsights.types';
import type { ResidentInsightAction, ResidentInsightCategory, ResidentInsightDetail, ResidentInsightSource, } from '../../../contextualInsights/data/residentInsight.types';
import { includeWhenPresent } from "../../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../../shared/types/absence.types";
const CATEGORY_BY_ADVISORY_TYPE: Record<LocalAdvisoryType, ResidentInsightCategory> = {
    roadBlock: 'traffic',
    waterlogging: 'civic',
    gateCongestion: 'traffic',
    liftOutage: 'utility',
    powerCut: 'utility',
    securityAlert: 'safety',
    parkingCongestion: 'traffic',
    societyEvent: 'society',
    maintenanceWork: 'society',
    airQuality: 'civic',
    none: 'society'
};
const TITLE_KEY_BY_CATEGORY: Record<ResidentInsightCategory, string> = {
    weather: 'resident.dashboard.insights.titleByCategory.weather',
    traffic: 'resident.dashboard.insights.titleByCategory.traffic',
    civic: 'resident.dashboard.insights.titleByCategory.civic',
    society: 'resident.dashboard.insights.titleByCategory.society',
    safety: 'resident.dashboard.insights.titleByCategory.safety',
    utility: 'resident.dashboard.insights.titleByCategory.utility'
};
const SOURCE_KEY_BY_TYPE: Record<ResidentInsightSource['type'], string> = {
    system: 'resident.dashboard.insights.source.system',
    facilityTeam: 'resident.dashboard.insights.source.facilityTeam',
    societyOffice: 'resident.dashboard.insights.source.societyOffice',
    weatherService: 'resident.dashboard.insights.source.weatherService',
    localAuthority: 'resident.dashboard.insights.source.localAuthority'
};
function resolveCategory(suggestion: ResidentContextualSuggestion): ResidentInsightCategory {
    if (suggestion.advisory) {
        return CATEGORY_BY_ADVISORY_TYPE[suggestion.advisory.type];
    }
    return suggestion.weatherSnapshot ? 'weather' : 'society';
}
function resolveSource(advisory?: LocalAreaAdvisory): ResidentInsightSource {
    if (!advisory) {
        return {
            id: 'weather-service',
            label: 'weatherService',
            labelMessageKey: SOURCE_KEY_BY_TYPE.weatherService,
            type: 'weatherService',
            verified: true
        };
    }
    if (advisory.source === 'municipalFeed') {
        return {
            id: advisory.source,
            label: advisory.source,
            labelMessageKey: SOURCE_KEY_BY_TYPE.localAuthority,
            type: 'localAuthority',
            verified: true
        };
    }
    if (advisory.source === 'societyAdmin') {
        return {
            id: advisory.source,
            label: advisory.source,
            labelMessageKey: SOURCE_KEY_BY_TYPE.societyOffice,
            type: 'societyOffice',
            verified: true
        };
    }
    if (advisory.source === 'facilityTeam' || advisory.source === 'guardReport') {
        return {
            id: advisory.source,
            label: advisory.source,
            labelMessageKey: SOURCE_KEY_BY_TYPE.facilityTeam,
            type: 'facilityTeam',
            verified: advisory.source === 'facilityTeam'
        };
    }
    return {
        id: advisory.source,
        label: advisory.source,
        labelMessageKey: SOURCE_KEY_BY_TYPE.system,
        type: 'system',
        verified: false
    };
}
function resolveFreshnessLabel(messages: EnglishMessagesType, iso?: string): string | Absent {
    if (!iso) {
        return undefined;
    }
    const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
    if (minutes < 1) {
        return t(messages, 'resident.dashboard.insights.freshness.justNow');
    }
    if (minutes < 60) {
        return t(messages, 'resident.dashboard.insights.freshness.minutesAgo', minutes);
    }
    const hours = Math.max(1, Math.round(minutes / 60));
    return t(messages, 'resident.dashboard.insights.freshness.hoursAgo', hours);
}
function resolveAreaLabel(messages: EnglishMessagesType, suggestion: ResidentContextualSuggestion): string {
    if (suggestion.weatherSnapshot) {
        return `${suggestion.weatherSnapshot.areaName}, ${suggestion.weatherSnapshot.city}`;
    }
    return t(messages, 'resident.dashboard.insights.area.localArea');
}
function resolveActions(suggestion: ResidentContextualSuggestion): ResidentInsightAction[] {
    return [
        {
            id: 'mark-read',
            labelMessageKey: suggestion.action?.actionType === 'dismiss'
                ? 'resident.dashboard.insights.dismiss'
                : 'resident.dashboard.insights.markAsRead',
            type: 'primary',
            action: 'markAsRead'
        },
        {
            id: 'why-this',
            labelMessageKey: 'resident.dashboard.insights.whyAmISeeingThis',
            type: 'link',
            action: 'learnMore'
        },
    ];
}
export function mapSuggestionToInsightDetail({ messages, result, suggestion, }: {
    messages: EnglishMessagesType;
    result: ResidentContextualInsightsResult;
    suggestion: ResidentContextualSuggestion;
}): ResidentInsightDetail {
    const category = resolveCategory(suggestion);
    const source = resolveSource(suggestion.advisory);
    const summary = t(messages, suggestion.detailMessageKey);
    const title = t(messages, TITLE_KEY_BY_CATEGORY[category]);
    const recommendation = suggestion.advisory?.shortSuggestionMessageKey
        ? t(messages, suggestion.advisory.shortSuggestionMessageKey)
        : t(messages, suggestion.oneLineMessageKey);
    const freshnessIso = suggestion.advisory?.reportedAtIso ?? suggestion.weatherSnapshot?.observedAtIso ?? result.lastUpdatedIso;
    return {
        id: suggestion.id,
        title,
        summary,
        detailedDescription: summary,
        category,
        priority: suggestion.priority,
        source,
        areaLabel: resolveAreaLabel(messages, suggestion),
        ...includeWhenPresent("freshnessLabel", resolveFreshnessLabel(messages, freshnessIso)),
        recommendation,
        impactSummary: t(messages, 'resident.dashboard.insights.impactSummary'),
        actions: resolveActions(suggestion)
    };
}

