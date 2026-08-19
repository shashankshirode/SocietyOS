import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '../../../shared/components/AppButton';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { StatusBadge, getParkingBadgeType } from '../../../shared/components/StatusBadge';
import type { FacilityOpsStackParamList } from '../../../app/navigation/navigation.types';
import { DetailCard, DetailRow, labelize, ParkingScreen, WarningText } from '../../resident/parking/components/ParkingUi';
import { useVendorDetail } from '../data/useVendorDetail';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'VendorDetail'>;
export function VendorDetailScreen({ navigation, route }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: vendor, isLoading, error, refetch } = useVendorDetail(route.params.vendorId);
    if (isLoading)
        return <LoadingState message={localizedUiText.m_926581a48ccd} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!vendor)
        return <ErrorState message={localizedUiText.m_c873cd47fdb2} onRetry={refetch}/>;
    return (<ParkingScreen title={vendor.name} subtitle={labelize(vendor.category)} onBack={navigation.goBack}>
      <DetailCard title={localizedUiText.m_920e413c7d41}><StatusBadge label={labelize(vendor.complianceStatus)} type={getParkingBadgeType(vendor.complianceStatus)}/></DetailCard>
      <DetailCard title={localizedUiText.m_a021de9db590}>
        <DetailRow label={localizedUiText.m_744c01def422} value={vendor.contactPerson}/>
        <DetailRow label={localizedUiText.m_63dceb8800b2} value={vendor.maskedPhone}/>
        <DetailRow label={localizedUiText.m_969ccbd3cf63} value={vendor.maskedEmail}/>
        <DetailRow label={localizedUiText.m_56ef8f20955f} value={vendor.officeAddress}/>
        <DetailRow label={localizedUiText.m_8593345cbd28} value={vendor.gstMasked ?? getActiveUiLiteral("m_67a926f7008e")}/>
        <DetailRow label={localizedUiText.m_e6205bc8ab80} value={vendor.panMasked ?? getActiveUiLiteral("m_67a926f7008e")}/>
        <DetailRow label={localizedUiText.m_d4eadb8e5c2c} value={`${vendor.activeAmcCount}`}/>
        <DetailRow label={localizedUiText.m_76b36751e15a} value={vendor.assignedAssets.join(', ')}/>
        <DetailRow label={localizedUiText.m_d66bdbd88ff4} value={`${vendor.openWorkOrders} / ${vendor.completedWorkOrders}`}/>
        <DetailRow label={localizedUiText.m_e6785ba241ed} value={`${vendor.slaScore}%`}/>
        <DetailRow label={localizedUiText.m_500ea9b3d813} value={vendor.residentFeedbackScore ? `${vendor.residentFeedbackScore}` : getActiveUiLiteral("m_1e31d9596d67")}/>
        <DetailRow label={localizedUiText.m_8a7525b1492f} value={vendor.notes} isLast/>
      </DetailCard>
      <WarningText>{localizedUiText.m_3a6cae157d05}</WarningText>
      <AppButton title={localizedUiText.m_6a368440235c} onPress={() => navigation.navigate('VendorDocuments', { vendorId: vendor.id })}/>
      <AppButton title={localizedUiText.m_7b21c63958d0} onPress={() => navigation.navigate('AmcContractList')} variant="secondary"/>
      <AppButton title={localizedUiText.m_c5d5bfc361bf} onPress={() => navigation.navigate('CreateWorkOrder', { vendorId: vendor.id })} variant="secondary"/>
      <AppButton title={localizedUiText.m_d48beeadcf3f} onPress={() => navigation.navigate('VendorScorecard', { vendorId: vendor.id })} variant="ghost"/>
      <AppButton title={localizedUiText.m_541978f0723d} onPress={() => undefined} variant="ghost"/>
      <AppButton title={localizedUiText.m_b6d71fc2dba7} onPress={() => undefined} variant="danger"/>
    </ParkingScreen>);
}

