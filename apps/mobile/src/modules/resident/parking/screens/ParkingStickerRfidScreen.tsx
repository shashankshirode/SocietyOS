import React from 'react';
import { FlatList } from 'react-native';
import { LoadingState } from '../../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../../shared/feedback/ErrorState';
import { EmptyState } from '../../../../shared/feedback/EmptyState';
import { AppButton } from '../../../../shared/components/AppButton';
import { StatusBadge, getParkingBadgeType } from '../../../../shared/components/StatusBadge';
import { useParkingStickerRfid } from '../data/useParkingStickerRfid';
import { useUpdateParkingHardware } from '../data/useParkingActions';
import { DetailCard, DetailRow, labelize, maskRfid, maskSticker, ParkingScreen, WarningText } from '../components/ParkingUi';
import type { ParkingStickerRfidScreenProps } from '../../../../app/navigation/navigation.types';
import { formatResidentDate } from '../../../../core/localization/dateTimeFormatters';
import type { ParkingHardwareActionInput } from '../../../../shared/types/parking.types';
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
export function ParkingStickerRfidScreen({ navigation, route }: ParkingStickerRfidScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data = [], isLoading, error, refetch } = useParkingStickerRfid(route.params.unitId);
    const updateHardware = useUpdateParkingHardware();
    if (isLoading) {
        return <LoadingState message={localizedUiText.m_28d5d841d59d} showCardPlaceholder/>;
    }
    if (error) {
        return <ErrorState message={error.message} onRetry={refetch}/>;
    }
    async function handleHardwareAction(input: ParkingHardwareActionInput) {
        const result = await updateHardware.submit(input);
        if (result.ok)
            await refetch();
    }
    return (<ParkingScreen title={localizedUiText.m_bb8ed728a906} subtitle={localizedUiText.m_04fbb2e7b377} onBack={navigation.goBack}>
      <WarningText>{localizedUiText.m_d5749ba5cd37}</WarningText>
      <FlatList data={data} keyExtractor={(item) => item.id} scrollEnabled={false} ListEmptyComponent={<EmptyState title={localizedUiText.m_e19d47968633} description={localizedUiText.m_a7b11e1e2a7f} iconName="radio-outline"/>} renderItem={({ item }) => (<DetailCard title={item.vehicleNumber}>
            <StatusBadge label={labelize(item.rfidStatus)} type={getParkingBadgeType(item.rfidStatus)}/>
            <DetailRow label={localizedUiText.m_343901ef9ff3} value={item.parkingSlotNumber}/>
            <DetailRow label={localizedUiText.m_ba3db1f2d5ab} value={maskSticker(item.stickerNumber)}/>
            <DetailRow label={localizedUiText.m_26ccd0a5cb4b} value={labelize(item.stickerStatus)}/>
            <DetailRow label={localizedUiText.m_5afe2189e84a} value={item.stickerIssuedDate ? formatResidentDate(item.stickerIssuedDate) : getActiveUiLiteral("m_d8fc0ae30df5")}/>
            <DetailRow label={localizedUiText.m_bbcc71caac6f} value={item.stickerValidUntil ? formatResidentDate(item.stickerValidUntil) : getActiveUiLiteral("m_d8fc0ae30df5")}/>
            <DetailRow label={localizedUiText.m_b6c2cf9434fe} value={maskRfid(item.rfidTagNumber)} isLast/>
            {item.stickerStatus === 'ISSUED' ? (<AppButton title={localizedUiText.m_eaf5055f3db5} onPress={() => handleHardwareAction({ recordId: item.id, vehicleId: item.vehicleId, action: 'MARK_STICKER_LOST' })} loading={updateHardware.isSubmitting} variant="danger"/>) : (<AppButton title={localizedUiText.m_71886204790a} onPress={() => handleHardwareAction({ recordId: item.id, vehicleId: item.vehicleId, action: 'REQUEST_STICKER' })} loading={updateHardware.isSubmitting} variant="secondary"/>)}
            {item.rfidStatus !== 'ACTIVE' && item.rfidStatus !== 'REQUESTED' ? (<AppButton title={localizedUiText.m_a2fb8403fe45} onPress={() => handleHardwareAction({ recordId: item.id, vehicleId: item.vehicleId, action: 'REQUEST_RFID' })} loading={updateHardware.isSubmitting} variant="ghost"/>) : null}
          </DetailCard>)}/>
    </ParkingScreen>);
}

