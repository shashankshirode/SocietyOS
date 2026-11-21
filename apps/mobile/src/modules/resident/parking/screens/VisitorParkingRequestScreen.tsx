import React from 'react';
import { FormField } from '../../../../shared/forms/FormField';
import { ErrorState } from '../../../../shared/feedback/ErrorState';
import { useCreateVisitorParkingPass } from '../data/useCreateVisitorParkingPass';
import { FooterActions, ParkingScreen, Selector } from '../components/ParkingUi';
import type { VisitorParkingRequestScreenProps } from '../../../../app/navigation/navigation.types';
import type { VehicleType } from '../../../../shared/types/vehicle.types';
import { VisualDateTimePicker } from '../../../../ui/patterns/VisualDateTimePicker';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
type FormState = {
    visitorName: string;
    mobileNumber: string;
    vehicleNumber: string;
    vehicleType: VehicleType;
    visitPurpose: string;
    expectedDate: string;
    expectedTime: string;
    duration: string;
    visitingFlat: string;
    notes: string;
};
const todayStr = getRequiredItem(new Date().toISOString().split('T'), 0, "VisitorParkingRequestScreen.tsx");
const initialState: FormState = {
    visitorName: '',
    mobileNumber: '',
    vehicleNumber: '',
    vehicleType: 'CAR',
    visitPurpose: '',
    expectedDate: todayStr,
    expectedTime: '12:00 PM',
    duration: '02:00 PM',
    visitingFlat: 'A-1204',
    notes: ''
};
const vehicleNumberRegex = /^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,2}\s?\d{4}$/i;
export function VisitorParkingRequestScreen({ navigation, route }: VisitorParkingRequestScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [form, setForm] = React.useState<FormState>(initialState);
    const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({});
    const { submit, isSubmitting, error } = useCreateVisitorParkingPass();
    function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((current) => ({ ...current, [key]: value }));
        setErrors((current) => ({ ...current, [key]: undefined }));
    }
    function validate() {
        const nextErrors: Partial<Record<keyof FormState, string>> = {};
        if (!form.visitorName.trim())
            nextErrors.visitorName = getActiveUiLiteral("m_b6e2a910e2a8");
        if (!/^\d{10}$/.test(form.mobileNumber.trim()))
            nextErrors.mobileNumber = getActiveUiLiteral("m_c36c7631a5e6");
        if (!form.vehicleNumber.trim())
            nextErrors.vehicleNumber = getActiveUiLiteral("m_e19e238650bb");
        if (form.vehicleNumber.trim() && !vehicleNumberRegex.test(form.vehicleNumber.trim()))
            nextErrors.vehicleNumber = getActiveUiLiteral("m_00ebcae9c73a");
        if (!form.visitPurpose.trim())
            nextErrors.visitPurpose = getActiveUiLiteral("m_512ba0e2a531");
        if (!form.expectedDate.trim())
            nextErrors.expectedDate = getActiveUiLiteral("m_654fe3e47ad5");
        if (!form.expectedTime.trim())
            nextErrors.expectedTime = getActiveUiLiteral("m_d3d53f01ddd3");
        if (!form.duration.trim())
            nextErrors.duration = getActiveUiLiteral("m_11bcfae2938d");
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }
    async function handleSubmit() {
        if (!validate())
            return;
        const result = await submit({
            societyId: 'society-001',
            unitId: route.params.unitId,
            visitorName: form.visitorName,
            mobileNumber: form.mobileNumber,
            vehicleNumber: form.vehicleNumber,
            vehicleType: form.vehicleType,
            visitPurpose: form.visitPurpose,
            expectedDate: form.expectedDate,
            expectedTime: form.expectedTime,
            duration: form.duration,
            visitingFlat: form.visitingFlat,
            ...includeWhenPresent("notes", form.notes || undefined)
        });
        if (result.ok) {
            navigation.replace('VisitorParkingPassDetail', { passId: result.data.id });
        }
    }
    return (<ParkingScreen title={localizedUiText.m_550101a95236} subtitle={localizedUiText.m_9b48ea20a508} onBack={navigation.goBack} footer={<FooterActions primaryLabel="Create parking pass" onPrimary={handleSubmit} loading={isSubmitting}/>}>
      {error ? <ErrorState message={error.message}/> : null}
      <FormField label={localizedUiText.m_8d9178364056} required value={form.visitorName} onChangeText={(text) => setField('visitorName', text)} {...includeWhenPresent("error", errors.visitorName)}/>
      <FormField label={localizedUiText.m_187e80ba4d8a} required value={form.mobileNumber} onChangeText={(text) => setField('mobileNumber', text)} {...includeWhenPresent("error", errors.mobileNumber)} keyboardType="phone-pad" maxLength={10}/>
      <FormField label={localizedUiText.m_d1073e6ebd81} required value={form.vehicleNumber} onChangeText={(text) => setField('vehicleNumber', text)} {...includeWhenPresent("error", errors.vehicleNumber)} placeholder={localizedUiText.m_b68c578afa5d}/>
      <Selector label={localizedUiText.m_83cf1561724b} value={form.vehicleType} onChange={(value) => setField('vehicleType', value)} options={[
            { label: String(localizedUiText.m_a5cdf07dbbc1), value: 'CAR' },
            { label: String(localizedUiText.m_37958504001d), value: 'TWO_WHEELER' },
            { label: String(localizedUiText.m_20e95ada67c7), value: 'EV' },
            { label: String(localizedUiText.m_ea7d0b763435), value: 'COMMERCIAL' },
            { label: String(localizedUiText.m_f97e9da0e3b8), value: 'OTHER' },
        ]}/>
       <FormField label={localizedUiText.m_0c864b9e04e7} required value={form.visitPurpose} onChangeText={(text) => setField('visitPurpose', text)} {...includeWhenPresent("error", errors.visitPurpose)}/>
      
      <VisualDateTimePicker label={localizedUiText.m_9f177c6e657a} value={form.expectedDate} onChange={(val) => setField('expectedDate', val)} mode="date"/>

      <VisualDateTimePicker label={localizedUiText.m_261711c1012e} value={form.expectedTime} onChange={(val) => setField('expectedTime', val)} mode="time"/>

      <VisualDateTimePicker label={localizedUiText.m_4fc52a3c4c55} value={form.duration} onChange={(val) => setField('duration', val)} mode="time"/>

      <FormField label={localizedUiText.m_f57f06910d21} value={form.visitingFlat} onChangeText={(text) => setField('visitingFlat', text)}/>
      <FormField label={localizedUiText.m_f0dbfd3a1e8b} value={form.notes} onChangeText={(text) => setField('notes', text)} multiline numberOfLines={3}/>
    </ParkingScreen>);
}

