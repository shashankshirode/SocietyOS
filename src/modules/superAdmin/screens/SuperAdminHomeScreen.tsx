import React from 'react';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ScreenScaffold } from '../../../shared/layout/ScreenScaffold';
import { CommandCenter } from '../../../ui/patterns/CommandCenter';
import { useSuperAdminHome } from '../hooks/useSuperAdminHome';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'SuperAdminHome'>;
export function SuperAdminHomeScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useSuperAdminHome();
    if (isLoading) {
        return (<ScreenScaffold>
        <LoadingState message={localizedUiText.m_23b87850823d}/>
      </ScreenScaffold>);
    }
    if (error || !data) {
        return (<ScreenScaffold>
        <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>
      </ScreenScaffold>);
    }
    return (<CommandCenter role="SUPER_ADMIN" title={localizedUiText.m_59011ae626a4} subtitle={formatUiLiteral(localizedUiText.m_d1fb3b681b63, [data.currentAdmin.name])} contextItems={[data.platformName, `${data.activeSocieties} societies`, `${data.openSupportTickets} tickets`]} metrics={[
            { icon: 'building', label: String(localizedUiText.m_97d04342608b), value: data.activeSocieties, detail: getActiveUiLiteral("m_c5aede3e6faa") },
            { icon: 'add', label: String(localizedUiText.m_a2198f472ce2), value: data.onboardingSocieties, detail: getActiveUiLiteral("m_64c6314ef551") },
            { icon: 'support', label: String(localizedUiText.m_fb8fb2a2745d), value: data.openSupportTickets, detail: getActiveUiLiteral("m_86fb8488c671") },
            { icon: 'warning', label: String(localizedUiText.m_b5c9bf80e506), value: data.criticalAlerts, detail: getActiveUiLiteral("m_db1cae99279b") },
        ]} actions={[
            { id: 'platform', icon: 'audit', label: String(localizedUiText.m_27d17a1cb51b), description: String(localizedUiText.m_c063bd5cf47d), onPress: () => navigation.navigate('PlatformDashboard') },
            { id: 'directory', icon: 'building', label: String(localizedUiText.m_acb2d231d94a), description: String(localizedUiText.m_802092ee9450), onPress: () => navigation.navigate('SocietyDirectory') },
            { id: 'onboard', icon: 'add', label: String(localizedUiText.m_54f5e6613f85), description: String(localizedUiText.m_99cd5b8d1226), onPress: () => navigation.navigate('SocietyOnboarding') },
            { id: 'flags', icon: 'settings', label: String(localizedUiText.m_c60c04dc77f9), description: String(localizedUiText.m_0f80eca88649), onPress: () => navigation.navigate('FeatureFlagManagement') },
            { id: 'support', icon: 'support', label: String(localizedUiText.m_bc5ea409794b), description: String(localizedUiText.m_07124e99ceeb), ...includeWhenPresent("badge", data.openSupportTickets > 0 ? 'OPEN' : undefined), onPress: () => navigation.navigate('SupportConsole') },
            { id: 'lookup', icon: 'search', label: String(localizedUiText.m_a206732601a4), description: String(localizedUiText.m_0058a3162c8e), onPress: () => navigation.navigate('PlatformUserLookup') },
            { id: 'alerts', icon: 'warning', label: String(localizedUiText.m_56de8fa8e7f6), description: String(localizedUiText.m_648ace464d71), ...includeWhenPresent("badge", data.criticalAlerts > 0 ? 'ALERT' : undefined), onPress: () => navigation.navigate('OperationalAlerts') },
            { id: 'audit', icon: 'audit', label: String(localizedUiText.m_6dc67772f004), description: String(localizedUiText.m_320f469c65c6), onPress: () => navigation.navigate('PlatformAuditLog') },
            { id: 'settings', icon: 'settings', label: String(localizedUiText.m_b18b122ea1b3), description: String(localizedUiText.m_70176d25b99c), onPress: () => navigation.navigate('PlatformSettings') },
            { id: 'blueprint', icon: 'check', label: String(localizedUiText.m_5a5997709e54), description: String(localizedUiText.m_29d4e046e2b5), onPress: () => navigation.navigate('BlueprintFeatureCoverage') },
        ]} feedTitle="Platform watchlist" feedItems={[
            { id: 'critical-alerts', title: String(localizedUiText.m_68600cfa7124), subtitle: formatUiLiteral(String(localizedUiText.m_bc3c7ec404db), [data.criticalAlerts]), status: 'ALERT', statusTone: 'danger' },
            { id: 'support-tickets', title: String(localizedUiText.m_1fceb2ce4985), subtitle: formatUiLiteral(String(localizedUiText.m_8e64c29bab3f), [data.openSupportTickets]), status: 'SUPPORT', statusTone: 'warning' },
        ]} testID="super-admin-command-center"/>);
}

