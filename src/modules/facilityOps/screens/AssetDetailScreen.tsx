import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '../../../shared/components/AppButton';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { StatusBadge, getParkingBadgeType } from '../../../shared/components/StatusBadge';
import type { FacilityOpsStackParamList } from '../../../app/navigation/navigation.types';
import { DetailCard, DetailRow, labelize, ParkingScreen, WarningText } from '../../resident/parking/components/ParkingUi';
import { useAssetDetail } from '../data/useAssetDetail';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'AssetDetail'>;
export function AssetDetailScreen({ navigation, route }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useAssetDetail(route.params.assetId);
    if (isLoading)
        return <LoadingState message={localizedUiText.m_0f03997e32c8} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!data)
        return <ErrorState message={localizedUiText.m_bc6bb6757d5d} onRetry={refetch}/>;
    return (<ParkingScreen title={data.assetName} subtitle={data.assetCode} onBack={navigation.goBack}>
      <DetailCard title={localizedUiText.m_55898449eb74}><StatusBadge label={labelize(data.status)} type={getParkingBadgeType(data.status)}/><DetailRow label={localizedUiText.m_cda9a4b26b5d} value={`${data.healthScore}%`} isLast/></DetailCard>
      <DetailCard title={localizedUiText.m_f9e2cf4f4044}>
        <DetailRow label={localizedUiText.m_292c06f0045a} value={labelize(data.category)}/>
        <DetailRow label={localizedUiText.m_15b61974b270} value={data.location}/>
        <DetailRow label={localizedUiText.m_fa2ad235b734} value={`${data.installationDate} / ${data.purchaseDate}`}/>
        <DetailRow label={localizedUiText.m_f8aa82b42d07} value={data.vendorName}/>
        <DetailRow label={localizedUiText.m_00f6262604fa} value={data.amcContractNumber ?? getActiveUiLiteral("m_1e31d9596d67")}/>
        <DetailRow label={localizedUiText.m_e80d52754062} value={data.warrantyExpiry}/>
        <DetailRow label={localizedUiText.m_69ab8f75b2a2} value={`${data.lastServiceDate} / ${data.nextServiceDate}`}/>
        <DetailRow label={localizedUiText.m_16b6668d9831} value={labelize(data.serviceFrequency)}/>
        <DetailRow label={localizedUiText.m_d6cc138aac15} value={`${data.breakdownCount}`}/>
        <DetailRow label={localizedUiText.m_8a7525b1492f} value={data.notes} isLast/>
      </DetailCard>
      <WarningText>{localizedUiText.m_a4072db83c68}</WarningText>
      <AppButton title={localizedUiText.m_c5d5bfc361bf} onPress={() => navigation.navigate('CreateWorkOrder', { assetId: data.id })}/>
      <AppButton title={localizedUiText.m_3170596b0f18} onPress={() => navigation.navigate('ServiceHistory')} variant="secondary"/>
      <AppButton title={localizedUiText.m_6a368440235c} onPress={() => navigation.navigate('AssetDocuments', { assetId: data.id })} variant="secondary"/>
      <AppButton title={localizedUiText.m_568044357ad1} onPress={() => navigation.navigate('AssetBreakdownReport', { assetId: data.id })} variant="danger"/>
    </ParkingScreen>);
}

