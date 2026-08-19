import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../../../app/navigation/navigation.types";
import { AppButton } from "../../../../shared/components/AppButton";
import { FormField } from "../../../../shared/forms/FormField";
import { SafeText } from "../../../../shared/components/SafeText";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { EmptyState } from "../../../../shared/feedback/EmptyState";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { formatResidentDateTime } from "../../../../core/localization/dateTimeFormatters";
import { useActiveResidentHome } from "../../homeContext/hooks/useActiveResidentHome";
import { resolveRequestContext } from "../../homeContext/utils/resolveRequestContext";
import { residentLifecycleRepository } from "../data/residentLifecycle.repository";
import type { ShortStay } from "../data/residentLifecycle.types";
import { LifecycleCard, LifecycleScreenFrame } from "./LifecycleScreenFrame";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
import { styles, createViewBorderColorStyle, createViewBorderColorBackgroundColorStyle } from "../styles/screens/ShortStayManagementScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<HomeStackParamList, 'ShortStayManagement'>;
function parseIndianDateTime(value: string): string | Absent {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2})$/.exec(value.trim());
    if (!match)
        return undefined;
    const iso = `${match[3]}-${match[2]}-${match[1]}T${match[4]}:${match[5]}:00+05:30`;
    return Number.isNaN(Date.parse(iso)) ? undefined : new Date(iso).toISOString();
}
export function ShortStayManagementScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { activeContext } = useActiveResidentHome();
    const [stays, setStays] = useState<readonly ShortStay[]>([]);
    const [platform, setPlatform] = useState('');
    const [listingIdentifier, setListingIdentifier] = useState('');
    const [listingTitle, setListingTitle] = useState('');
    const [hostOrManager, setHostOrManager] = useState('');
    const [guestName, setGuestName] = useState('');
    const [guestCount, setGuestCount] = useState('1');
    const [checkInAt, setCheckInAt] = useState('');
    const [checkOutAt, setCheckOutAt] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [rulesAcknowledged, setRulesAcknowledged] = useState(false);
    const [error, setError] = useState<string | Absent>();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const requestContext = useMemo(() => resolveRequestContext({ activeHome: activeContext, dataScopeKey: activeContext.dataScopeKey }), [activeContext]);
    const load = useCallback(async () => {
        setLoading(true);
        try {
            setStays(await residentLifecycleRepository.listShortStays(requestContext));
            setError(undefined);
        }
        catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : getActiveUiLiteral("m_6783dd349c08"));
        }
        finally {
            setLoading(false);
        }
    }, [requestContext]);
    useEffect(() => {
        load();
    }, [load]);
    const createStay = async () => {
        const parsedCheckIn = parseIndianDateTime(checkInAt);
        const parsedCheckOut = parseIndianDateTime(checkOutAt);
        if (!platform.trim() || !listingIdentifier.trim() || !listingTitle.trim() || !hostOrManager.trim() || !guestName.trim()) {
            setError(getActiveUiLiteral("m_736b9a42f0c0"));
            return;
        }
        if (!parsedCheckIn || !parsedCheckOut) {
            setError(getActiveUiLiteral("m_ce18e65f26f9"));
            return;
        }
        setSubmitting(true);
        setError(undefined);
        try {
            await residentLifecycleRepository.createShortStay({ context: requestContext, platform, listingIdentifier, listingTitle, hostOrManager, guestName, guestCount: Number(guestCount), checkInAt: parsedCheckIn, checkOutAt: parsedCheckOut, vehicleNumber, rulesAcknowledged });
            await load();
        }
        catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : getActiveUiLiteral("m_4a5df22ac2c5"));
        }
        finally {
            setSubmitting(false);
        }
    };
    const applyAction = async (stay: ShortStay, action: 'checkIn' | 'checkOut' | 'cancel') => {
        setSubmitting(true);
        try {
            await residentLifecycleRepository.updateShortStayStatus({ context: requestContext, stayId: stay.stayId, action });
            await load();
        }
        catch (actionError) {
            setError(actionError instanceof Error ? actionError.message : getActiveUiLiteral("m_86a6da002c92"));
        }
        finally {
            setSubmitting(false);
        }
    };
    if (loading)
        return <LoadingState message={localizedUiText.m_d2e1195db064} showCardPlaceholder/>;
    return (<LifecycleScreenFrame title={localizedUiText.m_2c0fea6ac328} subtitle={formatUiLiteral(localizedUiText.m_46c028b5601b, [activeContext.societyName])}>
      <LifecycleCard title={localizedUiText.m_3a9bc3213060} description={localizedUiText.m_cf8f9d651ed1}>
        {stays.length === 0 ? <EmptyState title={localizedUiText.m_de3c5311b07d} description={localizedUiText.m_e8ea7217ccb3}/> : null}
        {stays.map((stay) => (<View key={stay.stayId} style={[styles.stay, createViewBorderColorStyle(colors.border)]}>
            <SafeText variant="bodyStrong">{stay.guestName} · {stay.guestCount}{" " + localizedUiText.m_21d1f8ed9293}</SafeText>
            <SafeText variant="caption" color="secondary">{stay.platform} · {stay.listingTitle}</SafeText>
            <SafeText variant="caption" color="secondary">{formatResidentDateTime(stay.checkInAt, { ...includeWhenPresent("locale", activeContext.locale), ...includeWhenPresent("timezone", activeContext.timezone) })}{" " + localizedUiText.m_663ea1bfffe5 + " "}{formatResidentDateTime(stay.checkOutAt, { ...includeWhenPresent("locale", activeContext.locale), ...includeWhenPresent("timezone", activeContext.timezone) })}</SafeText>
            <SafeText variant="caption" color={stay.status === 'rejected' || stay.status === 'overdue' ? 'danger' : 'success'}>{stay.status.replace(/([A-Z])/g, ' $1')}{" " + localizedUiText.m_3c2276d74951 + " "}{stay.kycStatus}</SafeText>
            <View style={styles.actions}>
              {stay.status === 'approved' ? <AppButton title={localizedUiText.m_20e82b4d236a} onPress={() => applyAction(stay, 'checkIn')} size="sm"/> : null}
              {stay.status === 'checkedIn' || stay.status === 'overdue' ? <AppButton title={localizedUiText.m_326e405a5be3} onPress={() => applyAction(stay, 'checkOut')} size="sm"/> : null}
              {stay.status !== 'completed' && stay.status !== 'cancelled' ? <AppButton title={localizedUiText.m_19766ed6ccb2} onPress={() => applyAction(stay, 'cancel')} variant="danger" size="sm"/> : null}
            </View>
          </View>))}
      </LifecycleCard>

      <LifecycleCard title={localizedUiText.m_5fbd5f4478bf} description={localizedUiText.m_dc68059c2aa6}>
        <FormField label={localizedUiText.m_c78ffe195710} value={platform} onChangeText={setPlatform} placeholder={localizedUiText.m_1a81b1df9f54} required/>
        <FormField label={localizedUiText.m_14f8f0a6dbfd} value={listingIdentifier} onChangeText={setListingIdentifier} required/>
        <FormField label={localizedUiText.m_ba77096dda3d} value={listingTitle} onChangeText={setListingTitle} required/>
        <FormField label={localizedUiText.m_6abe8451c271} value={hostOrManager} onChangeText={setHostOrManager} required/>
        <FormField label={localizedUiText.m_e34006b5ed3b} value={guestName} onChangeText={setGuestName} required/>
        <FormField label={localizedUiText.m_4800773dbb88} value={guestCount} onChangeText={setGuestCount} keyboardType="number-pad" required/>
        <FormField label={localizedUiText.m_adc719587244} value={checkInAt} onChangeText={setCheckInAt} placeholder={localizedUiText.m_b188f6687b54} required/>
        <FormField label={localizedUiText.m_93061eff839d} value={checkOutAt} onChangeText={setCheckOutAt} placeholder={localizedUiText.m_b188f6687b54} required/>
        <FormField label={localizedUiText.m_d1073e6ebd81} value={vehicleNumber} onChangeText={setVehicleNumber}/>
        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: rulesAcknowledged }} onPress={() => setRulesAcknowledged((value) => !value)} style={styles.consent}>
          <View style={[styles.checkbox, createViewBorderColorBackgroundColorStyle(colors.primary, rulesAcknowledged ? colors.primary : 'transparent')]}/>
          <SafeText variant="body" color="secondary" style={styles.consentText}>{localizedUiText.m_ef1ac03eacc3}</SafeText>
        </Pressable>
      </LifecycleCard>
      {error ? <SafeText variant="body" color="danger">{error}</SafeText> : null}
      <AppButton title={localizedUiText.m_2ee9e78757db} onPress={createStay} loading={submitting} disabled={!rulesAcknowledged} fullWidth/>
      <AppButton title={localizedUiText.m_76900f1bfd16} onPress={navigation.goBack} variant="ghost" fullWidth/>
    </LifecycleScreenFrame>);
}

