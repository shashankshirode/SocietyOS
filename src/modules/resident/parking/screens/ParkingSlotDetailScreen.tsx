import React from 'react';
import { LoadingState } from '../../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../../shared/feedback/ErrorState';
import { AppButton } from '../../../../shared/components/AppButton';
import { StatusBadge, getParkingBadgeType } from '../../../../shared/components/StatusBadge';
import { useParkingSlotDetail } from '../data/useParkingSlotDetail';
import { useRequestParkingSlotChange } from '../data/useParkingActions';
import { DetailCard, DetailRow, labelize, ParkingScreen } from '../components/ParkingUi';
import type { ParkingSlotDetailScreenProps } from '../../../../app/navigation/navigation.types';
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
export function ParkingSlotDetailScreen({ navigation, route }: ParkingSlotDetailScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: slot, isLoading, error, refetch } = useParkingSlotDetail(route.params.slotId);
    const requestChange = useRequestParkingSlotChange();
    if (isLoading) {
        return <LoadingState message={localizedUiText.m_e4715e0bd9e8} showCardPlaceholder/>;
    }
    if (error) {
        return <ErrorState message={error.message} onRetry={refetch}/>;
    }
    if (!slot) {
        return <ErrorState message={localizedUiText.m_a8af0cf20cfc} onRetry={refetch}/>;
    }
    const currentSlot = slot;
    async function handleRequestChange() {
        const result = await requestChange.submit({ societyId: currentSlot.societyId, slotId: currentSlot.id });
        if (result.ok && result.data) {
            navigation.goBack();
        }
    }
    return (<ParkingScreen title={slot.slotNumber} subtitle={`${slot.level} · ${slot.zone}`} onBack={navigation.goBack}>
      <DetailCard title={localizedUiText.m_5bcc7d3bcde6}>
        <StatusBadge label={labelize(slot.allocationStatus)} type={getParkingBadgeType(slot.allocationStatus)}/>
        <DetailRow label={localizedUiText.m_2f3a0951c596} value={labelize(slot.slotType)}/>
        <DetailRow label={localizedUiText.m_6063c4ed8e04} value={slot.linkedFlat ?? getActiveUiLiteral("m_1e31d9596d67")}/>
        <DetailRow label={localizedUiText.m_0d6fb0233969} value={slot.linkedVehicleNumber ?? getActiveUiLiteral("m_1e31d9596d67")}/>
        <DetailRow label={localizedUiText.m_e1892bbf1083} value={slot.allocationStartDate ?? getActiveUiLiteral("m_b37c7879f6c3")}/>
        <DetailRow label={localizedUiText.m_1b6198901957} value={slot.allocationEndDate ?? 'Permanent'}/>
        <DetailRow label={localizedUiText.m_5e60e5dac09f} value={slot.stickerRfidLinkage}/>
        <DetailRow label={localizedUiText.m_b2b8f7c1716a} value={slot.visitorParkingAllowedNearby ? getActiveUiLiteral("m_491bef5d32a7") : getActiveUiLiteral("m_9bf39d10da2a")}/>
        <DetailRow label={localizedUiText.m_8a7525b1492f} value={slot.notes} isLast/>
      </DetailCard>
      <DetailCard title={localizedUiText.m_ff8059dc6752}>
        <AppButton title={localizedUiText.m_ac5941689674} onPress={() => slot.linkedVehicleId && navigation.navigate('VehicleDetail', { vehicleId: slot.linkedVehicleId })} variant="secondary"/>
        <AppButton title={localizedUiText.m_c4556e007d5d} onPress={() => navigation.navigate('WrongParkingReport', { unitId: slot.linkedUnitId ?? 'unit-a-1204' })} variant="danger"/>
        <AppButton title={localizedUiText.m_8aa2fde5e89f} onPress={handleRequestChange} loading={requestChange.isSubmitting} variant="ghost"/>
        <AppButton title={localizedUiText.m_55ce9720bc42} onPress={() => navigation.navigate('ParkingViolationHistory', { unitId: slot.linkedUnitId ?? 'unit-a-1204' })} variant="ghost"/>
      </DetailCard>
    </ParkingScreen>);
}

