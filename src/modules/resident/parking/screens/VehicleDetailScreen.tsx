import React from 'react';
import { LoadingState } from '../../../../shared/feedback/LoadingState';
import { ErrorState } from '../../../../shared/feedback/ErrorState';
import { AppButton } from '../../../../shared/components/AppButton';
import { StatusBadge, getParkingBadgeType } from '../../../../shared/components/StatusBadge';
import { useVehicleDetail } from '../data/useVehicleDetail';
import { DetailCard, DetailRow, labelize, maskRfid, ParkingScreen, WarningText } from '../components/ParkingUi';
import type { VehicleDetailScreenProps } from '../../../../app/navigation/navigation.types';
import { formatResidentDate, formatResidentDateTime } from '../../../../core/localization/dateTimeFormatters';
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
export function VehicleDetailScreen({ navigation, route }: VehicleDetailScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: vehicle, isLoading, error, refetch } = useVehicleDetail(route.params.vehicleId);
    if (isLoading) {
        return <LoadingState message={localizedUiText.m_cd8c7e946455} showCardPlaceholder/>;
    }
    if (error) {
        return <ErrorState message={error.message} onRetry={refetch}/>;
    }
    if (!vehicle) {
        return <ErrorState message={localizedUiText.m_c31762addf76} onRetry={refetch}/>;
    }
    return (<ParkingScreen title={vehicle.vehicleNumber} subtitle={vehicle.makeModel} onBack={navigation.goBack}>
      <DetailCard title={localizedUiText.m_7140f4f19dec}>
        <StatusBadge label={labelize(vehicle.verificationStatus)} type={getParkingBadgeType(vehicle.verificationStatus)}/>
      </DetailCard>
      <DetailCard title={localizedUiText.m_c4a848179b59}>
        <DetailRow label={localizedUiText.m_83cf1561724b} value={labelize(vehicle.vehicleType)}/>
        <DetailRow label={localizedUiText.m_9ccbd9f47633} value={vehicle.makeModel}/>
        <DetailRow label={localizedUiText.m_6b73191a0a4b} value={vehicle.color}/>
        <DetailRow label={localizedUiText.m_b9966b6962a4} value={labelize(vehicle.fuelType)}/>
        <DetailRow label={localizedUiText.m_20e95ada67c7} value={vehicle.isEv ? 'Yes' : 'No'}/>
        <DetailRow label={localizedUiText.m_1ebec3096ad1} value={vehicle.linkedResidentName}/>
        <DetailRow label={localizedUiText.m_a6198b60dd46} value={vehicle.linkedFlat}/>
        <DetailRow label={localizedUiText.m_56e17b82763a} value={vehicle.parkingSlotNumber ?? getActiveUiLiteral("m_1e31d9596d67")} isLast/>
      </DetailCard>
      <DetailCard title={localizedUiText.m_0735f1acf7ca}>
        <DetailRow label={localizedUiText.m_ba3db1f2d5ab} value={vehicle.stickerNumber ?? getActiveUiLiteral("m_d8fc0ae30df5")}/>
        <DetailRow label={localizedUiText.m_b6c2cf9434fe} value={maskRfid(vehicle.rfidTagNumber)}/>
        <DetailRow label={localizedUiText.m_c4a7e6d7e841} value={labelize(vehicle.registrationDocumentStatus)}/>
        <DetailRow label={localizedUiText.m_7a110ac9384a} value={vehicle.insuranceExpiry ? formatResidentDate(vehicle.insuranceExpiry) : getActiveUiLiteral("m_b37c7879f6c3")}/>
        <DetailRow label={localizedUiText.m_3e81f4a728ec} value={vehicle.pollutionCertificateExpiry ? formatResidentDate(vehicle.pollutionCertificateExpiry) : getActiveUiLiteral("m_b37c7879f6c3")}/>
        <DetailRow label={localizedUiText.m_4732fb602c16} value={vehicle.lastGateEntry}/>
        <DetailRow label={localizedUiText.m_382ac5f308f7} value={formatResidentDateTime(vehicle.lastUpdatedAt)} isLast/>
      </DetailCard>
      <WarningText>{localizedUiText.m_8f957e6c20b7}</WarningText>
      <DetailCard title={localizedUiText.m_ff8059dc6752}>
        <AppButton title={localizedUiText.m_0f9daf0b40d1} onPress={() => vehicle.parkingSlotId && navigation.navigate('ParkingSlotDetail', { slotId: vehicle.parkingSlotId })} variant="secondary"/>
        <AppButton title={localizedUiText.m_b7469e79fa54} onPress={() => navigation.navigate('ParkingStickerRfid', { unitId: vehicle.unitId })} variant="ghost"/>
        <AppButton title={localizedUiText.m_55ce9720bc42} onPress={() => navigation.navigate('ParkingViolationHistory', { unitId: vehicle.unitId })} variant="ghost"/>
      </DetailCard>
    </ParkingScreen>);
}

