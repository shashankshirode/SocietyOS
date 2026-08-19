import React from 'react';
import { Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import type { FacilityOpsStackParamList } from '../../../app/navigation/navigation.types';
import { DetailCard, DetailRow, labelize, ParkingScreen, WarningText } from '../../resident/parking/components/ParkingUi';
import { useVendorScorecard } from '../data/useVendorScorecard';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'VendorScorecard'>;
export function VendorScorecardScreen({ navigation, route }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useVendorScorecard(route.params.vendorId);
    if (isLoading)
        return <LoadingState message={localizedUiText.m_95fcf62bb2f3} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!data)
        return <ErrorState message={localizedUiText.m_6af8c6fa96b3} onRetry={refetch}/>;
    return (<ParkingScreen title={localizedUiText.m_931b76ace557} subtitle={data.vendorName} onBack={navigation.goBack}>
      <WarningText>{localizedUiText.m_30e6a50d9dae}</WarningText>
      <DetailCard title={localizedUiText.m_715b1458abbe}><DetailRow label={localizedUiText.m_292c06f0045a} value={labelize(data.category)}/><DetailRow label={localizedUiText.m_9f29530464f7} value={`${data.overallRating.toFixed(1)} / 5`} isLast/></DetailCard>
      <DetailCard title={localizedUiText.m_1d175fe3a9df}>
        <DetailRow label={localizedUiText.m_7f64d6b544dc} value={`${data.slaCompliance}%`}/>
        <DetailRow label={localizedUiText.m_ad60248f4b02} value={data.averageResponseTime}/>
        <DetailRow label={localizedUiText.m_85a9d6f416b2} value={`${data.completionRate}%`}/>
        <DetailRow label={localizedUiText.m_3ca3c3b16559} value={`${data.reopenRate}%`}/>
        <DetailRow label={localizedUiText.m_af32c73bb247} value={`${data.complaintLinkedPerformance}%`}/>
        <DetailRow label={localizedUiText.m_500ea9b3d813} value={`${data.residentFeedbackAverage}`}/>
        <DetailRow label={localizedUiText.m_ba6caaa4c999} value={`${data.amcRenewalDiscipline}%`}/>
        <DetailRow label={localizedUiText.m_d7c00863fceb} value={`${data.complianceValidity}%`}/>
        <DetailRow label={localizedUiText.m_5945b07ee4b3} value={`${data.safetyIncidents}`} isLast/>
      </DetailCard>
      <DetailCard title={localizedUiText.m_b11d27f88ceb}>{data.strengths.map((item) => <Text key={item}>{item}</Text>)}</DetailCard>
      <DetailCard title={localizedUiText.m_66883641891e}>{data.improvementAreas.map((item) => <Text key={item}>{item}</Text>)}</DetailCard>
    </ParkingScreen>);
}

