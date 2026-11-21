import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { FormField } from '../../../shared/forms/FormField';
import type { FacilityOpsStackParamList } from '../../../app/navigation/navigation.types';
import type { WorkOrderPriority, WorkOrderType } from '../../../shared/types/workOrder.types';
import { FooterActions, MockFilePicker, ParkingScreen, Selector } from '../../resident/parking/components/ParkingUi';
import { useCreateWorkOrder } from '../data/useCreateWorkOrder';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'CreateWorkOrder'>;
export function CreateWorkOrderScreen({ navigation, route }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [type, setType] = React.useState<WorkOrderType>('REPAIR');
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [linkedAssetId, setLinkedAssetId] = React.useState(route.params.assetId ?? '');
    const [vendorId, setVendorId] = React.useState(route.params.vendorId ?? '');
    const [priority, setPriority] = React.useState<WorkOrderPriority>('MEDIUM');
    const [dueDate, setDueDate] = React.useState('');
    const [assignedTo, setAssignedTo] = React.useState('Suresh Patil');
    const [evidenceLabel, setEvidenceLabel] = React.useState('');
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const { submit, isSubmitting, error } = useCreateWorkOrder();
    async function handleSubmit() {
        const next: Record<string, string> = {};
        if (!title.trim())
            next.title = getActiveUiLiteral("m_7c15e7448e6f");
        if (description.trim().length < 15)
            next.description = getActiveUiLiteral("m_db47c49ae0bb");
        if (!dueDate.trim())
            next.dueDate = getActiveUiLiteral("m_fb543da22f4a");
        if ((type === 'PREVENTIVE_MAINTENANCE' || type === 'BREAKDOWN') && !linkedAssetId.trim())
            next.linkedAssetId = getActiveUiLiteral("m_0bbc643026e0");
        setErrors(next);
        if (Object.keys(next).length)
            return;
        const result = await submit({ type, title, description, linkedAssetId, vendorId, priority, dueDate, assignedTo, evidenceLabel, ...includeWhenPresent("sourceComplaintId", route.params.complaintId) });
        if (result.ok)
            navigation.replace('WorkOrderDetail', { workOrderId: result.data.id });
    }
    return (<ParkingScreen title={localizedUiText.m_c5d5bfc361bf} subtitle={localizedUiText.m_699a13c33707} onBack={navigation.goBack} footer={<FooterActions primaryLabel="Create work order" onPrimary={handleSubmit} loading={isSubmitting}/>}>
      {error ? <ErrorState message={error.message}/> : null}
      <Selector label={localizedUiText.m_798ae68782c2} value={type} onChange={setType} options={[{ label: String(localizedUiText.m_1196b6c538ec), value: 'REPAIR' }, { label: String(localizedUiText.m_3ffe201a2034), value: 'BREAKDOWN' }, { label: String(localizedUiText.m_33cd65272a2d), value: 'PREVENTIVE_MAINTENANCE' }, { label: String(localizedUiText.m_6e4fa13da486), value: 'INSPECTION' }, { label: String(localizedUiText.m_d96c516b74bd), value: 'COMPLAINT_LINKED' }]}/>
      <FormField label={localizedUiText.m_7e8cd2056da7} required value={title} onChangeText={setTitle} {...includeWhenPresent("error", errors.title)}/>
      <FormField label={localizedUiText.m_526e0087cc3f} required value={description} onChangeText={setDescription} {...includeWhenPresent("error", errors.description)} multiline numberOfLines={4}/>
      <FormField label={localizedUiText.m_9634cc89b8f9} value={linkedAssetId} onChangeText={setLinkedAssetId} {...includeWhenPresent("error", errors.linkedAssetId)}/>
      <FormField label={localizedUiText.m_da57e5601ee0} value={vendorId} onChangeText={setVendorId}/>
      <Selector label={localizedUiText.m_d60dbba07922} value={priority} onChange={setPriority} options={[{ label: String(localizedUiText.m_f793de205ead), value: 'LOW' }, { label: String(localizedUiText.m_8e588cd18774), value: 'MEDIUM' }, { label: String(localizedUiText.m_c4ebc6d4a583), value: 'HIGH' }, { label: String(localizedUiText.m_1b015904cc17), value: 'URGENT' }]}/>
      <FormField label={localizedUiText.m_e1cb6d30fa3f} required value={dueDate} onChangeText={setDueDate} {...includeWhenPresent("error", errors.dueDate)}/>
      <FormField label={localizedUiText.m_08ee4565a256} value={assignedTo} onChangeText={setAssignedTo}/>
      <MockFilePicker label={localizedUiText.m_750496431e38} fileName={evidenceLabel} helper="Tap to attach mock evidence" onPress={() => setEvidenceLabel('work-order-evidence.jpg')}/>
    </ParkingScreen>);
}

