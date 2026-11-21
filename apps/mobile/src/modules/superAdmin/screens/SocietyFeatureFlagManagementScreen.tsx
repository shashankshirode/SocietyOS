import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { ActionPanelScreen } from '../../blueprintShared/components/ActionPanelScreen';
import { useSocietyFeatureFlags } from '../hooks/useSocietyFeatureFlags';
import { getRequiredItem } from "../../../shared/utils/requiredItem";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'SOCIETY_FEATURE_FLAG_MANAGEMENT'>;
export function SocietyFeatureFlagManagementScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch, updateSocietyFeatureFlag, isUpdating } = useSocietyFeatureFlags();
    const [actionMessage, setActionMessage] = React.useState<string | null>(null);
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message ?? localizedUiText.m_5aa45c726174} onRetry={refetch}/>;
    const flags = data;
    const rows = flags.map((item) => ({ id: item.flagKey, title: item.displayName, subtitle: formatUiLiteral(String(localizedUiText.m_c282bf0c1b81), [item.moduleGroup, item.scope, item.riskLevel]), status: item.societyOverride ?? item.defaultValue ? 'ENABLED' : 'DISABLED' }));
    async function handleToggle() {
        const firstFlag = getRequiredItem(flags, 0, "SocietyFeatureFlagManagementScreen.tsx");
        const result = await updateSocietyFeatureFlag({ flagKey: firstFlag.flagKey, enabled: !(firstFlag.societyOverride ?? firstFlag.defaultValue), auditNote: getActiveUiLiteral("m_683bbc3c64e4") });
        if (result.ok)
            setActionMessage(`Feature flag ${firstFlag.flagKey} updated with audit note.`);
    }
    return (<ActionPanelScreen title={localizedUiText.m_13d24194f8c7} subtitle={localizedUiText.m_9e75568d3f13} rows={rows} actionTitle={isUpdating ? 'Updating...' : getActiveUiLiteral("m_a9d3d195f6bc")} actionMessage={actionMessage} onAction={handleToggle} onBack={() => navigation.goBack()}/>);
}

