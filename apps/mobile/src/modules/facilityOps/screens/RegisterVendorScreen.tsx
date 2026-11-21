import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ErrorState } from '../../../shared/feedback/ErrorState';
import { FormField } from '../../../shared/forms/FormField';
import type { FacilityOpsStackParamList } from '../../../app/navigation/navigation.types';
import type { VendorCategory } from '../../../shared/types/vendor.types';
import { FooterActions, MockFilePicker, ParkingScreen, Selector } from '../../resident/parking/components/ParkingUi';
import { useRegisterVendor } from '../data/useRegisterVendor';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<FacilityOpsStackParamList, 'RegisterVendor'>;
export function RegisterVendorScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [vendorName, setVendorName] = React.useState('');
    const [category, setCategory] = React.useState<VendorCategory>('SECURITY');
    const [contactPerson, setContactPerson] = React.useState('');
    const [mobileNumber, setMobileNumber] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [officeAddress, setOfficeAddress] = React.useState('');
    const [servicesOffered, setServicesOffered] = React.useState('');
    const [emergencySupport, setEmergencySupport] = React.useState<'NO' | 'YES'>('NO');
    const [documentLabel, setDocumentLabel] = React.useState('');
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const { submit, isSubmitting, error } = useRegisterVendor();
    async function handleSubmit() {
        const next: Record<string, string> = {};
        if (!vendorName.trim())
            next.vendorName = getActiveUiLiteral("m_800d9f0fbcd3");
        if (!contactPerson.trim())
            next.contactPerson = getActiveUiLiteral("m_24b4150fef34");
        if (!/^\d{10}$/.test(mobileNumber.trim()))
            next.mobileNumber = getActiveUiLiteral("m_9aa6a4d2fcf7");
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            next.email = getActiveUiLiteral("m_5ca8a4283ebc");
        if (!officeAddress.trim())
            next.officeAddress = getActiveUiLiteral("m_b9902b7f030c");
        if (!servicesOffered.trim())
            next.servicesOffered = getActiveUiLiteral("m_348dc1f3b4e9");
        setErrors(next);
        if (Object.keys(next).length)
            return;
        const result = await submit({ vendorName, category, contactPerson, mobileNumber, email, officeAddress, servicesOffered, emergencySupportAvailable: emergencySupport === 'YES', complianceDocumentLabel: documentLabel });
        if (result.ok)
            navigation.replace('VendorDetail', { vendorId: result.data.id });
    }
    return (<ParkingScreen title={localizedUiText.m_3061c0eea8f1} subtitle={localizedUiText.m_28adb2da5db6} onBack={navigation.goBack} footer={<FooterActions primaryLabel="Register mock vendor" onPrimary={handleSubmit} loading={isSubmitting}/>}>
      {error ? <ErrorState message={error.message}/> : null}
      <FormField label={localizedUiText.m_78724d2fff48} required value={vendorName} onChangeText={setVendorName} {...includeWhenPresent("error", errors.vendorName)}/>
      <Selector label={localizedUiText.m_e37903135c21} value={category} onChange={setCategory} options={[{ label: String(localizedUiText.m_8f6fb4eb7f42), value: 'SECURITY' }, { label: String(localizedUiText.m_6f352b468971), value: 'HOUSEKEEPING' }, { label: String(localizedUiText.m_871eee33f78a), value: 'LIFT_MAINTENANCE' }, { label: String(localizedUiText.m_a2eefbcb6bbe), value: 'ELECTRICAL' }, { label: String(localizedUiText.m_283bf30f8624), value: 'PLUMBING' }, { label: String(localizedUiText.m_f97e9da0e3b8), value: 'OTHER' }]}/>
      <FormField label={localizedUiText.m_744c01def422} required value={contactPerson} onChangeText={setContactPerson} {...includeWhenPresent("error", errors.contactPerson)}/>
      <FormField label={localizedUiText.m_187e80ba4d8a} required value={mobileNumber} onChangeText={setMobileNumber} keyboardType="phone-pad" maxLength={10} {...includeWhenPresent("error", errors.mobileNumber)}/>
      <FormField label={localizedUiText.m_ae176e9149ca} value={email} onChangeText={setEmail} {...includeWhenPresent("error", errors.email)}/>
      <FormField label={localizedUiText.m_a591d56f69fa} required value={officeAddress} onChangeText={setOfficeAddress} {...includeWhenPresent("error", errors.officeAddress)} multiline numberOfLines={3}/>
      <FormField label={localizedUiText.m_15ad1f431856} required value={servicesOffered} onChangeText={setServicesOffered} {...includeWhenPresent("error", errors.servicesOffered)}/>
      <Selector label={localizedUiText.m_667b501bbc0d} value={emergencySupport} onChange={setEmergencySupport} options={[{ label: String(localizedUiText.m_1ea442a134b2), value: 'NO' }, { label: String(localizedUiText.m_85a39ab345d6), value: 'YES' }]}/>
      <MockFilePicker label={localizedUiText.m_8a66bc30a985} fileName={documentLabel} helper="Tap to attach mock compliance document" onPress={() => setDocumentLabel('vendor-compliance.pdf')}/>
    </ParkingScreen>);
}

