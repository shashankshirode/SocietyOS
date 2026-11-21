import React from 'react';
import { Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '../../../shared/components/AppButton';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { StatusBadge, getParkingBadgeType } from '../../../shared/components/StatusBadge';
import type { FacilityOpsStackParamList } from '../../../app/navigation/navigation.types';
import { DetailCard, DetailRow, labelize, ParkingScreen, WarningText } from '../../resident/parking/components/ParkingUi';
import { useWorkOrderDetail, useWorkOrderLifecycleAction } from '../data/useWorkOrderDetail';
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'WorkOrderDetail'>;
export function WorkOrderDetailScreen({ navigation, route }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useWorkOrderDetail(route.params.workOrderId);
    const start = useWorkOrderLifecycleAction('startWorkOrder');
    const complete = useWorkOrderLifecycleAction('completeWorkOrder');
    const verify = useWorkOrderLifecycleAction('verifyWorkOrder');
    const close = useWorkOrderLifecycleAction('closeWorkOrder');
    const reopen = useWorkOrderLifecycleAction('reopenWorkOrder');
    if (isLoading)
        return <LoadingState message={localizedUiText.m_587a14f2d3e0} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!data)
        return <ErrorState message={localizedUiText.m_fd9087aa3aa9} onRetry={refetch}/>;
    async function run(action: {
        submit: (id: string) => Promise<JsonValue>;
    }) { await action.submit(route.params.workOrderId); await refetch(); }
    return (<ParkingScreen title={data.workOrderNumber} subtitle={data.title} onBack={navigation.goBack}>
      <DetailCard title={localizedUiText.m_920e413c7d41}><StatusBadge label={labelize(data.status)} type={getParkingBadgeType(data.status)}/></DetailCard>
      <DetailCard title={localizedUiText.m_45989de49fb7}>
        <DetailRow label={localizedUiText.m_baaddf70fb5d} value={labelize(data.type)}/>
        <DetailRow label={localizedUiText.m_d60dbba07922} value={labelize(data.priority)}/>
        <DetailRow label={localizedUiText.m_80d298c9f240} value={data.linkedAssetName ?? getActiveUiLiteral("m_1e31d9596d67")}/>
        <DetailRow label={localizedUiText.m_f8aa82b42d07} value={data.vendorName ?? getActiveUiLiteral("m_13075c233611")}/>
        <DetailRow label={localizedUiText.m_8191888dd97c} value={data.assignedTo}/>
        <DetailRow label={localizedUiText.m_e1cb6d30fa3f} value={data.dueDate}/>
        <DetailRow label={localizedUiText.m_0653cccd663d} value={data.slaStatus}/>
        <DetailRow label={localizedUiText.m_526e0087cc3f} value={data.description}/>
        <DetailRow label={localizedUiText.m_03867aea70ac} value={data.evidenceLabel ?? getActiveUiLiteral("m_5a90a3f5b017")}/>
        <DetailRow label={localizedUiText.m_7140f4f19dec} value={data.verificationStatus} isLast/>
      </DetailCard>
      <DetailCard title={localizedUiText.m_9dcff98e275f}>{data.timeline.map((item) => <Text key={item.id}>{item.title}: {item.note}</Text>)}</DetailCard>
      <WarningText>{localizedUiText.m_cf8c75385b31}</WarningText>
      <AppButton title={localizedUiText.m_f40b29eebe1a} onPress={() => run(start)} variant="secondary"/>
      <AppButton title={localizedUiText.m_605f5becc3de} onPress={() => run(complete)} variant="secondary"/>
      <AppButton title={localizedUiText.m_bfd9d9ecad1f} onPress={() => run(verify)} variant="secondary"/>
      <AppButton title={localizedUiText.m_692e8744802e} onPress={() => run(close)} variant="ghost"/>
      <AppButton title={localizedUiText.m_c672ae30d753} onPress={() => run(reopen)} variant="ghost"/>
    </ParkingScreen>);
}

