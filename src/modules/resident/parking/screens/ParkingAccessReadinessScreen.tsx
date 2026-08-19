import React from 'react';
import { LoadingState } from '../../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../../shared/feedback/ErrorState';
import { StatusBadge, getParkingBadgeType } from '../../../../shared/components/StatusBadge';
import { useParkingHardwareReadiness } from '../data/useParkingHardwareReadiness';
import { DetailCard, DetailRow, labelize, ParkingScreen, WarningText } from '../components/ParkingUi';
import type { ParkingAccessReadinessScreenProps } from '../../../../app/navigation/navigation.types';
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function ParkingAccessReadinessScreen({ navigation, route }: ParkingAccessReadinessScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useParkingHardwareReadiness(route.params.societyId);
    if (isLoading) {
        return <LoadingState message={localizedUiText.m_c1684b1b0c84} showCardPlaceholder/>;
    }
    if (error) {
        return <ErrorState message={error.message} onRetry={refetch}/>;
    }
    if (!data) {
        return <ErrorState message={localizedUiText.m_5d499cbd2af2} onRetry={refetch}/>;
    }
    return (<ParkingScreen title={localizedUiText.m_a17741fefcb4} subtitle={localizedUiText.m_9ef8297c4316} onBack={navigation.goBack}>
      <WarningText>{localizedUiText.m_520ace9b0639}</WarningText>
      <DetailCard title={localizedUiText.m_13d029ae4455}>
        <StatusBadge label={labelize(data.anprReadiness)} type={getParkingBadgeType(data.anprReadiness)}/>
        <DetailRow label={localizedUiText.m_f416aad7d4a0} value={labelize(data.rfidReadiness)}/>
        <DetailRow label={localizedUiText.m_66d6875c21fd} value={labelize(data.anprReadiness)}/>
        <DetailRow label={localizedUiText.m_4ba5e8e15c67} value={labelize(data.boomBarrierReadiness)}/>
        <DetailRow label={localizedUiText.m_28f7e0ad03ac} value={labelize(data.evChargingReadiness)}/>
        <DetailRow label={localizedUiText.m_367ed48f4a75} value={labelize(data.smartSensorReadiness)}/>
        <DetailRow label={localizedUiText.m_8a7525b1492f} value={data.notes} isLast/>
      </DetailCard>
    </ParkingScreen>);
}

