import { useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../../../app/navigation/navigation.types";
import { AppButton } from "../../../../shared/components/AppButton";
import { FormField } from "../../../../shared/forms/FormField";
import { SafeText } from "../../../../shared/components/SafeText";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { useActiveResidentHome } from "../../homeContext/hooks/useActiveResidentHome";
import { resolveRequestContext } from "../../homeContext/utils/resolveRequestContext";
import { residentLifecycleRepository } from "../data/residentLifecycle.repository";
import type { RentalDeclaration, RentalOccupancyModel } from "../data/residentLifecycle.types";
import { LifecycleCard, LifecycleScreenFrame } from "./LifecycleScreenFrame";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
import { styles, createPressableBorderColorBackgroundColorStyle } from "../styles/screens/RentalDeclarationScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<HomeStackParamList, 'RentalDeclaration'>;
const occupancyModels: readonly RentalOccupancyModel[] = ['selfUse', 'longTermTenant', 'companyLease', 'brokerManagedStay', 'shortTermRental', 'vacant', 'underRenovation'];
function parseIndianDate(value: string): string | Absent {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
    if (!match)
        return undefined;
    const iso = `${match[3]}-${match[2]}-${match[1]}`;
    return Number.isNaN(Date.parse(`${iso}T00:00:00+05:30`)) ? undefined : iso;
}
export function RentalDeclarationScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { activeContext } = useActiveResidentHome();
    const [current, setCurrent] = useState<RentalDeclaration | null>(null);
    const [occupancyModel, setOccupancyModel] = useState<RentalOccupancyModel>('selfUse');
    const [managerName, setManagerName] = useState('');
    const [managerPhone, setManagerPhone] = useState('');
    const [effectiveFrom, setEffectiveFrom] = useState('');
    const [error, setError] = useState<string | Absent>();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const requestContext = useMemo(() => resolveRequestContext({ activeHome: activeContext, dataScopeKey: activeContext.dataScopeKey }), [activeContext]);
    useEffect(() => {
        setLoading(true);
        residentLifecycleRepository.getRentalDeclaration(requestContext).then((declaration) => {
            setCurrent(declaration);
            if (declaration)
                setOccupancyModel(declaration.occupancyModel);
        }).catch((loadError) => {
            setError(loadError instanceof Error ? loadError.message : getActiveUiLiteral("m_3fa0b8ee1b05"));
        }).finally(() => setLoading(false));
    }, [requestContext]);
    const submit = async () => {
        const effectiveDate = parseIndianDate(effectiveFrom);
        if (!effectiveDate) {
            setError(getActiveUiLiteral("m_6830c01cdede"));
            return;
        }
        setSubmitting(true);
        setError(undefined);
        try {
            const declaration = await residentLifecycleRepository.submitRentalDeclaration({ context: requestContext, occupancyModel, managerName, managerPhone, effectiveFrom: effectiveDate });
            setCurrent(declaration);
        }
        catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : getActiveUiLiteral("m_2f99d7ad8bbf"));
        }
        finally {
            setSubmitting(false);
        }
    };
    if (loading)
        return <LoadingState message={localizedUiText.m_523d6baf3465} showCardPlaceholder/>;
    return (<LifecycleScreenFrame title={localizedUiText.m_4c089f350090} subtitle={formatUiLiteral(localizedUiText.m_04db6a4ce7f3, [activeContext.displayUnitName])}>
      {current ? (<LifecycleCard title={localizedUiText.m_e8509ae4bab4} description={`${current.occupancyModel.replace(/([A-Z])/g, ' $1')} · ${current.status}`}>
          <SafeText variant="caption" color="secondary">{localizedUiText.m_a4f3df623c15 + " "}{formatResidentDate(current.effectiveFrom, { ...includeWhenPresent("locale", activeContext.locale), ...includeWhenPresent("timezone", activeContext.timezone) })}</SafeText>
        </LifecycleCard>) : null}
      <LifecycleCard title={localizedUiText.m_7b5a02701d1e} description={localizedUiText.m_7efd070ecf85}>
        <View style={styles.chips}>
          {occupancyModels.map((model) => (<Pressable key={model} accessibilityRole="radio" accessibilityState={{ selected: occupancyModel === model }} onPress={() => setOccupancyModel(model)} style={[styles.chip, createPressableBorderColorBackgroundColorStyle(occupancyModel === model ? colors.primary : colors.border, occupancyModel === model ? colors.primarySoft : colors.surface)]}>
              <SafeText variant="caption">{model.replace(/([A-Z])/g, ' $1')}</SafeText>
            </Pressable>))}
        </View>
      </LifecycleCard>
      {occupancyModel === 'brokerManagedStay' ? (<LifecycleCard title={localizedUiText.m_95ae70d0f7c0}>
          <FormField label={localizedUiText.m_7da3274653c6} value={managerName} onChangeText={setManagerName} required/>
          <FormField label={localizedUiText.m_43c1b01c1cf0} value={managerPhone} onChangeText={setManagerPhone} keyboardType="phone-pad" maxLength={10} required/>
        </LifecycleCard>) : null}
      <FormField label={localizedUiText.m_4f86b19b388a} value={effectiveFrom} onChangeText={setEffectiveFrom} placeholder={localizedUiText.m_4a8d1f7d5283} keyboardType="number-pad" required/>
      {occupancyModel === 'shortTermRental' ? <SafeText variant="body" color="warning">{localizedUiText.m_1746a7129ddb}</SafeText> : null}
      {error ? <SafeText variant="body" color="danger">{error}</SafeText> : null}
      <AppButton title={localizedUiText.m_356f7e6f42e8} onPress={submit} loading={submitting} fullWidth/>
      <AppButton title={localizedUiText.m_76900f1bfd16} onPress={navigation.goBack} variant="ghost" fullWidth/>
    </LifecycleScreenFrame>);
}

