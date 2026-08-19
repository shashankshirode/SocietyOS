import React from 'react';
import { FormField } from '../../../../shared/forms/FormField';
import { ErrorState } from '../../../../shared/feedback/ErrorState';
import { useCreateParkingIncident } from '../data/useCreateParkingIncident';
import { FooterActions, ParkingScreen, Selector, WarningText } from '../components/ParkingUi';
import type { WrongParkingReportScreenProps } from '../../../../app/navigation/navigation.types';
import type { ParkingIncidentPriority, ParkingIncidentType } from '../../../../shared/types/parking.types';
import { FilePickerButton } from '../../../../shared/files/FilePickerButton';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
type FormState = {
    vehicleNumber: string;
    location: string;
    issueType: ParkingIncidentType;
    description: string;
    photoLabel: string;
    isVehicleBlocked: 'NO' | 'YES';
    priority: ParkingIncidentPriority;
    consent: 'NO' | 'YES';
};
const vehicleNumberRegex = /^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,2}\s?\d{4}$/i;
export function WrongParkingReportScreen({ navigation, route }: WrongParkingReportScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [form, setForm] = React.useState<FormState>({
        vehicleNumber: '',
        location: '',
        issueType: 'PARKED_IN_MY_SLOT',
        description: '',
        photoLabel: '',
        isVehicleBlocked: 'NO',
        priority: 'NORMAL',
        consent: 'NO'
    });
    const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({});
    const { submit, isSubmitting, error } = useCreateParkingIncident();
    function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((current) => ({ ...current, [key]: value }));
        setErrors((current) => ({ ...current, [key]: undefined }));
    }
    function validate() {
        const nextErrors: Partial<Record<keyof FormState, string>> = {};
        if (!form.location.trim())
            nextErrors.location = getActiveUiLiteral("m_867513fcfc13");
        if (!form.issueType)
            nextErrors.issueType = getActiveUiLiteral("m_704cd09fc7a0");
        if (form.description.trim().length < 15)
            nextErrors.description = getActiveUiLiteral("m_db47c49ae0bb");
        if (form.consent !== 'YES')
            nextErrors.consent = getActiveUiLiteral("m_938d5bd89b6e");
        if (form.vehicleNumber.trim() && !vehicleNumberRegex.test(form.vehicleNumber.trim()))
            nextErrors.vehicleNumber = getActiveUiLiteral("m_00ebcae9c73a");
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }
    async function handleSubmit() {
        if (!validate())
            return;
        const result = await submit({
            societyId: 'society-001',
            unitId: route.params.unitId,
            issueType: form.issueType,
            ...includeWhenPresent("vehicleNumber", form.vehicleNumber || undefined),
            location: form.location,
            description: form.description,
            priority: form.priority,
            reportedBy: 'Shashank',
            reportedFlat: 'A-1204',
            ...includeWhenPresent("evidenceLabel", form.photoLabel || undefined),
            isVehicleBlocked: form.isVehicleBlocked === 'YES'
        });
        if (result.ok) {
            navigation.replace('ParkingIncidentDetail', { incidentId: result.data.id });
        }
    }
    return (<ParkingScreen title={localizedUiText.m_6252779e606a} subtitle={localizedUiText.m_3425d611cc29} onBack={navigation.goBack} footer={<FooterActions primaryLabel="Submit report" onPrimary={handleSubmit} loading={isSubmitting} danger/>}>
      {error ? <ErrorState message={error.message}/> : null}
      <WarningText>{localizedUiText.m_c12f4ff2687c}</WarningText>
      <FormField label={localizedUiText.m_1e9f072a9743} value={form.vehicleNumber} onChangeText={(text) => setField('vehicleNumber', text)} {...includeWhenPresent("error", errors.vehicleNumber)}/>
      <FormField label={localizedUiText.m_3014094c38a1} required value={form.location} onChangeText={(text) => setField('location', text)} {...includeWhenPresent("error", errors.location)}/>
      <Selector label={localizedUiText.m_7efaf83a1b51} value={form.issueType} onChange={(value) => setField('issueType', value)} {...includeWhenPresent("error", errors.issueType)} options={[
            { label: String(localizedUiText.m_722e2efc4526), value: 'PARKED_IN_MY_SLOT' },
            { label: String(localizedUiText.m_54575f8fff4a), value: 'BLOCKING_EXIT' },
            { label: String(localizedUiText.m_fc2344952b93), value: 'BLOCKING_DRIVEWAY' },
            { label: String(localizedUiText.m_cfe5d1e529cd), value: 'VISITOR_IN_RESIDENT_SLOT' },
            { label: String(localizedUiText.m_91c624293b27), value: 'DOUBLE_PARKED' },
            { label: String(localizedUiText.m_05b04a2feddb), value: 'UNKNOWN_VEHICLE' },
            { label: String(localizedUiText.m_f97e9da0e3b8), value: 'OTHER' },
        ]}/>
      <FormField label={localizedUiText.m_526e0087cc3f} required value={form.description} onChangeText={(text) => setField('description', text)} {...includeWhenPresent("error", errors.description)} multiline numberOfLines={4}/>
      <FilePickerButton label={form.photoLabel ? formatUiLiteral(localizedUiText.m_af6340907d2b, [form.photoLabel]) : localizedUiText.m_53fb7a6a9fc6} allowedSource="both" onFilePicked={(file) => setField('photoLabel', file.name)}/>
      <Selector label={localizedUiText.m_d0461702a4ef} value={form.isVehicleBlocked} onChange={(value) => setField('isVehicleBlocked', value)} options={[{ label: String(localizedUiText.m_1ea442a134b2), value: 'NO' }, { label: String(localizedUiText.m_85a39ab345d6), value: 'YES' }]}/>
      <Selector label={localizedUiText.m_03d37e9a5379} value={form.priority} onChange={(value) => setField('priority', value)} options={[{ label: String(localizedUiText.m_a7248eeb45eb), value: 'NORMAL' }, { label: String(localizedUiText.m_c4ebc6d4a583), value: 'HIGH' }, { label: String(localizedUiText.m_1b015904cc17), value: 'URGENT' }]}/>
      <Selector label={localizedUiText.m_d37e0cd00f18} value={form.consent} onChange={(value) => setField('consent', value)} {...includeWhenPresent("error", errors.consent)} options={[{ label: String(localizedUiText.m_3aafce44421b), value: 'YES' }, { label: String(localizedUiText.m_bc1c29a467ae), value: 'NO' }]}/>
    </ParkingScreen>);
}

