import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../../app/navigation/navigation.types';
import { TenantAgreementForm } from '../components/TenantAgreementForm';
import { TenantOnboardingStepper } from '../components/TenantOnboardingStepper';
import type { TenantAgreementInput } from '../data/residentHousehold.types';
import { useHouseholdOverview } from '../hooks/useHouseholdOverview';
import { useTenantOnboarding } from '../hooks/useTenantOnboarding';
import { validateTenantAgreement, type TenantAgreementFieldError } from '../validators/tenantOnboarding.validators';
import { FieldErrorSummary, HouseholdScreenLayout, PrimaryAction, useHouseholdMessages } from './HouseholdScreenLayout';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
type Props = NativeStackScreenProps<HomeStackParamList, 'AddTenantAgreement'>;
const defaultInput: TenantAgreementInput = {
    agreementStartDate: '',
    agreementEndDate: '',
    ...includeWhenPresent("monthlyRent", undefined),
    ...includeWhenPresent("securityDeposit", undefined),
    ...includeWhenPresent("lockInPeriodMonths", undefined),
    numberOfOccupants: 1,
    tenantMoveInDate: '',
    ownerApprovalConfirmed: false,
    rulesAcknowledgementRequired: true,
    ...includeWhenPresent("rentAgreementDocumentId", undefined)
};
export function AddTenantAgreementScreen({ navigation, route }: Props) {
    const [input, setInput] = React.useState<TenantAgreementInput>(defaultInput);
    const [errors, setErrors] = React.useState<TenantAgreementFieldError[]>([]);
    const overview = useHouseholdOverview();
    const onboarding = useTenantOnboarding(route.params.requestId);
    const { messages, text } = useHouseholdMessages();
    const fieldError = (field: keyof TenantAgreementInput) => {
        const error = errors.find((item) => item.field === field);
        return error ? text(error.messageKey) : undefined;
    };
    const handleNext = async () => {
        const result = validateTenantAgreement(input, { maxOccupancy: overview.data?.maxOccupancy ?? 1 });
        setErrors(result.fieldErrors);
        if (!result.isValid) {
            return;
        }
        await onboarding.updateAgreementInfo(route.params.requestId, input);
        navigation.navigate('AddTenantDocuments', { requestId: route.params.requestId });
    };
    return (<HouseholdScreenLayout titleKey="resident.navigation.addTenant.title" subtitleKey="resident.navigation.addTenant.subtitle">
      <TenantOnboardingStepper activeStep={2}/>
      <FieldErrorSummary messageKeys={errors.map((error) => error.messageKey)} messages={messages}/>
      <TenantAgreementForm input={input} onChange={(patch) => setInput((current) => ({ ...current, ...patch }))} fieldError={fieldError}/>
      <PrimaryAction labelKey="resident.buttons.next" onPress={handleNext} disabled={onboarding.isMutating}/>
    </HouseholdScreenLayout>);
}
export default AddTenantAgreementScreen;

