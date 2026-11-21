import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '../../../shared/components/AppButton';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { StatusBadge, getParkingBadgeType } from '../../../shared/components/StatusBadge';
import type { FacilityOpsStackParamList } from '../../../app/navigation/navigation.types';
import { DetailCard, DetailRow, labelize, ParkingScreen } from '../../resident/parking/components/ParkingUi';
import { useAmcContractDetail } from '../data/useAmcContractDetail';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'AmcContractDetail'>;
export function AmcContractDetailScreen({ navigation, route }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useAmcContractDetail(route.params.contractId);
    if (isLoading)
        return <LoadingState message={localizedUiText.m_11c5a0059519} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!data)
        return <ErrorState message={localizedUiText.m_6406e859515f} onRetry={refetch}/>;
    return (<ParkingScreen title={data.contractNumber} subtitle={data.vendorName} onBack={navigation.goBack}>
      <DetailCard title={localizedUiText.m_4add0832d00b}><StatusBadge label={labelize(data.renewalStatus)} type={getParkingBadgeType(data.renewalStatus)}/></DetailCard>
      <DetailCard title={localizedUiText.m_a1ff07d3c534}>
        <DetailRow label={localizedUiText.m_292c06f0045a} value={labelize(data.category)}/>
        <DetailRow label={localizedUiText.m_3690a05eacd8} value={data.linkedAssets.join(', ')}/>
        <DetailRow label={localizedUiText.m_f5af9663964f} value={`${data.startDate} to ${data.endDate}`}/>
        <DetailRow label={localizedUiText.m_7554244829ed} value={data.renewalNoticeDate}/>
        <DetailRow label={localizedUiText.m_49e96d7cdf58} value={`Rs. ${data.contractAmount}`}/>
        <DetailRow label={localizedUiText.m_b2c87e39bc7b} value="Placeholder"/>
        <DetailRow label={localizedUiText.m_fb30046eef4a} value={data.serviceFrequency}/>
        <DetailRow label={localizedUiText.m_2bd4d4142e28} value={data.slaTerms}/>
        <DetailRow label={localizedUiText.m_2ca4c907311f} value={data.emergencyResponseTime}/>
        <DetailRow label={localizedUiText.m_0fa7bece6469} value={data.includedServices.join(', ')}/>
        <DetailRow label={localizedUiText.m_82dc9cadb7ac} value={data.excludedServices.join(', ')}/>
        <DetailRow label={localizedUiText.m_69ab8f75b2a2} value={`${data.lastServiceDate} / ${data.nextServiceDate}`}/>
        <DetailRow label={localizedUiText.m_b4e929d8bcfe} value={data.documents.join(', ')}/>
        <DetailRow label={localizedUiText.m_8a7525b1492f} value={data.notes} isLast/>
      </DetailCard>
      <AppButton title={localizedUiText.m_fa6285e8d2a6} onPress={() => navigation.navigate('AmcRenewalReminders')}/>
      <AppButton title={localizedUiText.m_a03fb628c2d1} onPress={() => navigation.navigate('ServiceHistory')} variant="secondary"/>
      <AppButton title={localizedUiText.m_7edcd3387306} onPress={() => navigation.navigate('CreateWorkOrder', {})} variant="secondary"/>
    </ParkingScreen>);
}

