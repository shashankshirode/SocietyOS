import { dailyInsightMessages } from '../../../../../messages/en/residentDashboard.messages';
import { formatRelativeTime } from '../../../contextualInsights/utils/formatRelativeTime';
import type { ResidentContextualSuggestion, ResidentContextualInsightsResult } from '../../../contextualInsights/data/residentContextualInsights.types';
import type { DailyInsightViewModel, DailyInsightCategory, DailyInsightSeverity, DailyInsightActionViewModel } from '../../../contextualInsights/data/dailyInsight.types';
import type { EnglishMessagesType } from '../../../../../messages/en';
import { resolveMessage } from '../../../../../messages/resolveMessage';
import { includeWhenPresent } from "../../../../../shared/utils/presentProperty";
export function resolveCategory(suggestion: ResidentContextualSuggestion): DailyInsightCategory {
    if (suggestion.advisory) {
        const advType = suggestion.advisory.type;
        if (advType === 'roadBlock' || advType === 'waterlogging' || advType === 'parkingCongestion') {
            return 'road';
        }
        if (advType === 'gateCongestion' || advType === 'securityAlert') {
            return 'security';
        }
        if (advType === 'liftOutage' || advType === 'powerCut') {
            return 'utility';
        }
        if (advType === 'maintenanceWork') {
            return 'maintenance';
        }
        if (advType === 'societyEvent' || advType === 'none') {
            return 'community';
        }
        if (advType === 'airQuality') {
            return 'weather';
        }
    }
    return suggestion.weatherSnapshot ? 'weather' : 'community';
}
export function resolveSeverity(priority: 'low' | 'medium' | 'high' | 'critical', category: DailyInsightCategory, title: string): DailyInsightSeverity {
    const titleLower = title.toLowerCase();
    if (priority === 'critical') {
        const isRealEmergency = titleLower.includes('fire') ||
            titleLower.includes('evacuate') ||
            titleLower.includes('gas leak') ||
            titleLower.includes('medical') ||
            titleLower.includes('trapped') ||
            titleLower.includes('critical emergency');
        if (isRealEmergency) {
            return 'critical';
        }
        return 'urgent';
    }
    if (priority === 'high') {
        return 'important';
    }
    if (priority === 'medium') {
        return 'advisory';
    }
    return 'information';
}
export function getSeverityTone(severity: DailyInsightSeverity): 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'muted' {
    switch (severity) {
        case 'critical':
        case 'urgent':
            return 'danger';
        case 'important':
            return 'warning';
        case 'advisory':
            return 'info';
        case 'information':
        default:
            return 'neutral';
    }
}
const categoryIcons: Record<DailyInsightCategory, string> = {
    weather: 'rainy-outline',
    road: 'trail-sign-outline',
    utility: 'build-outline',
    security: 'shield-checkmark-outline',
    maintenance: 'construct-outline',
    community: 'people-outline',
    health: 'heart-outline',
    emergency: 'alert-circle-outline'
};
export function mapSuggestionToViewModel(suggestion: ResidentContextualSuggestion, result: ResidentContextualInsightsResult, messages: EnglishMessagesType): DailyInsightViewModel {
    const isCustomAdvisory = Boolean(suggestion.advisory && 'customTitle' in suggestion.advisory);
    const customAdv = isCustomAdvisory ? (suggestion.advisory as any) : null;

    const rawTitle = customAdv ? customAdv.customTitle : (resolveMessage(messages, suggestion.titleMessageKey) || 'Advisory');
    const category = resolveCategory(suggestion);
    const severity = resolveSeverity(suggestion.priority, category, rawTitle);
    const title = rawTitle.replace(/\s+/g, ' ').trim();
    let description = customAdv ? customAdv.customDescription : (resolveMessage(messages, suggestion.detailMessageKey) || '').replace(/\s+/g, ' ').trim();
    if (!description) {
        description = 'Open this advisory to view the details.';
    }
    const rawRec = customAdv
        ? ''
        : (suggestion.advisory?.shortSuggestionMessageKey
            ? resolveMessage(messages, suggestion.advisory.shortSuggestionMessageKey)
            : resolveMessage(messages, suggestion.oneLineMessageKey));
    const normalizedRec = (rawRec || '').replace(/\s+/g, ' ').trim();
    const shouldShowRecommendation = normalizedRec.length > 0 && normalizedRec !== description;
    const recommendation = shouldShowRecommendation ? normalizedRec : undefined;
    let sourceLabel = undefined;
    const sourceName = suggestion.advisory?.source || (suggestion.weatherSnapshot ? 'weatherService' : 'system');
    let displayName = 'System';
    if (sourceName === 'facilityTeam')
        displayName = 'Facility Team';
    else if (sourceName === 'societyAdmin')
        displayName = 'Society Office';
    else if (sourceName === 'residentReports')
        displayName = customAdv?.reporterName ? `Resident (${customAdv.reporterName})` : 'Resident Advisory';
    else if (sourceName === 'guardReport')
        displayName = 'Security Team';
    else if (sourceName === 'weatherService')
        displayName = 'Weather Service';
    else if (sourceName === 'municipalFeed')
        displayName = 'Municipal Feed';
    sourceLabel = dailyInsightMessages.sheet.reportedBy(displayName);
    let locationLabel = undefined;
    if (suggestion.advisory?.areaId && suggestion.advisory.areaId !== 'area-mock') {
        const cleanArea = suggestion.advisory.areaId.replace(/Nearby society area/i, '').trim();
        if (cleanArea)
            locationLabel = cleanArea;
    }
    else if (suggestion.weatherSnapshot) {
        locationLabel = `${suggestion.weatherSnapshot.areaName}`;
    }
    if (locationLabel && locationLabel.toLowerCase().includes('nearby society area')) {
        locationLabel = undefined;
    }
    const freshnessIso = suggestion.advisory?.reportedAtIso ?? suggestion.weatherSnapshot?.observedAtIso ?? result.lastUpdatedIso;
    const updatedLabel = formatRelativeTime(freshnessIso, { now: new Date(result.lastUpdatedIso) });
    const actions: DailyInsightActionViewModel[] = [];
    if (suggestion.action) {
        const actType = suggestion.action.actionType;
        let viewAction: DailyInsightActionViewModel['action'] = 'dismiss';
        if (actType === 'openDetails')
            viewAction = 'openDetails';
        else if (actType === 'openVisitors')
            viewAction = 'callSecurity';
        else if (actType === 'openEmergency')
            viewAction = 'callSecurity';
        else if (actType === 'openNotices')
            viewAction = 'openNotice';

        if (viewAction !== 'openDetails') {
            actions.push({
                id: 'action-primary',
                label: resolveMessage(messages, suggestion.action.labelMessageKey) || 'Take Action',
                type: 'primary',
                action: viewAction
            });
        }
    }
    const locationText = locationLabel ? ` active for ${locationLabel}` : '';
    const explanation = `This update applies to your selected residence. It was reported by the ${displayName}.${locationText ? ' The advisory is' + locationText + '.' : ''}`;
    return {
        id: suggestion.id,
        categoryLabel: category.charAt(0).toUpperCase() + category.slice(1) + ' update',
        categoryIcon: categoryIcons[category] || 'newspaper-outline',
        severityLabel: severity.charAt(0).toUpperCase() + severity.slice(1),
        severityTone: getSeverityTone(severity),
        title,
        description,
        ...includeWhenPresent("recommendation", recommendation),
        sourceLabel,
        ...includeWhenPresent("locationLabel", locationLabel),
        updatedLabel,
        explanation,
        actions
    };
}
