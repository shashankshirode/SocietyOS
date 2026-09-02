import React, { useMemo, useRef, useState } from 'react';
import { Pressable, View, type TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { Visitor } from '../../../../shared/types/visitor.types';
import type { CreateVisitorPassScreenProps } from '../../../../app/navigation/navigation.types';
import { SocietyButton } from '../../../../shared/components/SocietyButton';
import { SafeText } from '../../../../shared/components/SafeText';
import { FormField } from '../../../../shared/forms/FormField';
import { SelectionGroup, type SelectionOption } from '../../../../shared/components/SelectionGroup';
import { useMessages } from '../../../../shared/constants/useMessages';
import { useResponsiveLayout } from '../../../../ui/layout/useResponsiveLayout';
import { VisitorPassPanel } from '../../../../ui/patterns/VisitorPassPanel';
import { useResidentTheme } from '../../../../ui/foundation/residentTheme';
import { ResidentAppHeader } from '../../navigation/ResidentAppHeader';
import { AdaptiveFlowComposer } from '../../experience/AdaptiveFlowComposer';
import { useResidenceContextGuard } from '../../experience/ResidenceContextGuard';
import { useCreateVisitorPass } from '../data/useCreateVisitorPass';
import { useVisitors } from '../data/useVisitors';
import { VisitorType } from '../data/visitors.enums';
import { visitorAccessPolicy } from '../data/visitorAccessPolicy';
import { resolveVisitorCategory } from '../utils/visitorExitPolicyResolver';
import { styles, backgroundBorder, colorStyle, backgroundStyle } from '../styles/screens/CreateVisitorPassScreen.styles';

type DayChoice = 'Today' | 'Tomorrow' | 'Choose date';

const typeOptions: SelectionOption<VisitorType>[] = [
  { key: VisitorType.GUEST, label: VisitorType.GUEST, icon: <Ionicons name="people-outline" size={22} color="#0D5C3A" /> },
  { key: VisitorType.DELIVERY, label: VisitorType.DELIVERY, icon: <Ionicons name="bag-handle-outline" size={22} color="#0D5C3A" /> },
  { key: VisitorType.CAB, label: VisitorType.CAB, icon: <Ionicons name="car-sport-outline" size={22} color="#0D5C3A" /> },
  { key: VisitorType.VENDOR, label: VisitorType.VENDOR, icon: <Ionicons name="construct-outline" size={22} color="#0D5C3A" /> },
];

const arrivalTimes = ['Now', '12:00 PM', '5:30 PM', '8:15 PM'] as const;

function dateForChoice(choice: DayChoice, customDate: string): Date {
  const date = choice === 'Choose date' && customDate ? new Date(customDate) : new Date();
  if (choice === 'Tomorrow') date.setDate(date.getDate() + 1);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function timeForChoice(choice: string, date: Date): Date {
  if (choice === 'Now') return date;
  const [clock = '12:00', meridiem = 'PM'] = choice.split(' ');
  const [hourText = '12', minuteText = '00'] = clock.split(':');
  date.setHours(Number(hourText) % 12 + (meridiem === 'PM' ? 12 : 0), Number(minuteText), 0, 0);
  return date;
}

export function CreateVisitorPassScreen({ navigation }: CreateVisitorPassScreenProps) {
  const messages = useMessages();
  const copy = messages.visitors;
  const theme = useResidentTheme();
  const { isStale } = useResidenceContextGuard();
  const { data: visitors = [] } = useVisitors();
  const { submit, isSubmitting } = useCreateVisitorPass();
  const nameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const [type, setType] = useState<VisitorType | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [day, setDay] = useState<DayChoice>('Today');
  const [customDate, setCustomDate] = useState('');
  const [arrival, setArrival] = useState<(typeof arrivalTimes)[number]>('12:00 PM');
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [purpose, setPurpose] = useState('');
  const [vehicleExpanded, setVehicleExpanded] = useState(false);
  const [vehicle, setVehicle] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [failure, setFailure] = useState('');
  const [created, setCreated] = useState<Visitor | null>(null);

  const recentVisitors = useMemo(() => {
    const seen = new Set<string>();
    return visitors.filter((visitor) => {
      const key = visitor.phone || visitor.name.toLowerCase();
      if (!visitor.name || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 3);
  }, [visitors]);

  const requiresPhone = type === VisitorType.GUEST || type === VisitorType.VENDOR;
  const nameError = name.trim().length < 2 ? copy.formName : '';
  const phoneError = requiresPhone && !/^\d{10}$/.test(phone.trim()) ? copy.formPhone : '';
  const canCreate = Boolean(type && !nameError && !phoneError && !isStale);
  const startAt = useMemo(() => timeForChoice(arrival, dateForChoice(day, customDate)), [arrival, customDate, day]);
  const endAt = useMemo(() => new Date(startAt.getTime() + durationMinutes * 60_000), [durationMinutes, startAt]);
  const purposeOptions = type ? visitorAccessPolicy.purposes[type] : [];

  const selectType = (nextType: VisitorType) => {
    setType(nextType);
    setDurationMinutes(visitorAccessPolicy.defaultDurationMinutes[nextType]);
    setPurpose(visitorAccessPolicy.purposes[nextType][0] ?? '');
    setFailure('');
  };

  const selectRecentVisitor = (visitor: Visitor) => {
    setName(visitor.name);
    setPhone(visitor.phone);
    selectType(visitor.type as VisitorType);
  };

  const createAccess = async () => {
    setAttempted(true);
    if (!canCreate || !type) return;
    const result = await submit({
      name,
      phone,
      type,
      expectedDate: day === 'Choose date' ? customDate : day,
      expectedTime: arrival,
      expectedEntryAtIso: startAt.toISOString(),
      expectedExitAtIso: endAt.toISOString(),
      visitorCategory: resolveVisitorCategory(type, purpose),
      purpose: purpose || type,
      ...(vehicle.trim() ? { vehicleNumber: vehicle.trim().toUpperCase() } : {}),
    });
    if (result.ok) {
      setCreated(result.data);
      setFailure('');
    } else {
      setFailure(result.error.message);
    }
  };

  const summary = created ? (
    <View style={styles.issued}>
      <SafeText variant="tiny" style={colorStyle(theme.success)}>{copy.accessReady}</SafeText>
      <VisitorPassPanel
        visitorName={created.name}
        visitorType={created.type}
        purpose={created.purpose}
        validFrom={created.expectedDate}
        validTill={endAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        gateName={copy.mainGate}
        otpCode={created.otp}
        credentialValue={`societyos://visitor/${created.id}`}
      />
    </View>
  ) : (
    <View style={[styles.accessObject, backgroundBorder(theme.surface, theme.border)]}>
      <SafeText variant="tiny" style={colorStyle(theme.accent)}>{copy.accessPreview}</SafeText>
      <SafeText variant="h2" numberOfLines={2}>{name.trim() || copy.visitorNamePlaceholder}</SafeText>
      <SafeText variant="body" color="secondary">{type ? `${type}${purpose ? ` · ${purpose}` : ''}` : copy.formType}</SafeText>
      <View style={styles.accessRule}/>
      <SafeText variant="tiny" color="muted">{day.toUpperCase()}</SafeText>
      <SafeText variant="bodyStrong">{arrival} → {endAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</SafeText>
      <SafeText variant="caption" color="secondary">{copy.mainGate}</SafeText>
      {vehicle ? <SafeText variant="caption" color="secondary">{vehicle.toUpperCase()}</SafeText> : null}
      <SafeText variant="tiny" color="muted">{copy.credentialAfterCreate}</SafeText>
    </View>
  );

  const command = (
    <SocietyButton
      title={created ? messages.common.done : copy.createAccess}
      onPress={created ? () => navigation.navigate('VisitorList') : () => { void createAccess(); }}
      disabled={!created && !canCreate}
      loading={isSubmitting}
      fullWidth
      size="lg"
    />
  );

  const dayOptions: SelectionOption<DayChoice>[] = [
    { key: 'Today', label: 'Today' },
    { key: 'Tomorrow', label: 'Tomorrow' },
    { key: 'Choose date', label: 'Choose date' },
  ];

  const arrivalOptions: SelectionOption<string>[] = arrivalTimes.map((t) => ({ key: t, label: t }));
  const durationOptions: SelectionOption<number>[] = visitorAccessPolicy.durationOptions.map((m) => ({
    key: m,
    label: copy.durationLabel(m),
  }));
  const purposeSelectionOptions: SelectionOption<string>[] = purposeOptions.map((p) => ({ key: p, label: p }));

  return (
    <View style={[styles.root, backgroundStyle(theme.background)]}>
      <ResidentAppHeader
        showBackButton={true}
        onBackPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('VisitorList'))}
        fallbackTab="VisitorTab"
        fallbackRoute="VisitorList"
        showNarrative={false}
      />
      <AdaptiveFlowComposer
        title={copy.openYourHome}
        subtitle={copy.whoAreYouOpeningTo}
        command={command}
        summary={summary}
      >
        {recentVisitors.length ? (
          <View style={styles.section}>
            <SafeText variant="tiny" color="muted">{copy.recentVisitors}</SafeText>
            <View style={styles.recentRow}>
              {recentVisitors.map((visitor) => (
                <Pressable
                  key={visitor.id}
                  onPress={() => selectRecentVisitor(visitor)}
                  style={[styles.recentPerson, backgroundBorder(theme.surface, theme.border)]}
                >
                  <SafeText variant="bodyStrong" numberOfLines={1}>{visitor.name}</SafeText>
                  <SafeText variant="tiny" color="secondary">{visitor.type}</SafeText>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        <SelectionGroup
          label={copy.formType}
          options={typeOptions}
          selected={type}
          onSelect={selectType}
        />

        {type ? (
          <View style={styles.fields}>
            <FormField
              ref={nameRef}
              label={type === VisitorType.DELIVERY ? copy.deliverySource : type === VisitorType.CAB ? copy.cabProvider : copy.visitorNameLabel}
              value={name}
              onChangeText={setName}
              onBlur={() => setNameTouched(true)}
              error={(attempted || nameTouched) ? nameError : ''}
              required
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
            />
            {requiresPhone ? (
              <FormField
                ref={phoneRef}
                label={copy.phoneLabel}
                value={phone}
                onChangeText={setPhone}
                onBlur={() => setPhoneTouched(true)}
                error={(attempted || phoneTouched) ? phoneError : ''}
                keyboardType="phone-pad"
                maxLength={10}
                required
              />
            ) : null}

            <SelectionGroup
              label={copy.expectedDateLabel}
              layout="wrap"
              options={dayOptions}
              selected={day}
              onSelect={(d) => setDay(d as DayChoice)}
            />
            {day === 'Choose date' ? (
              <FormField
                label={copy.expectedDateLabel}
                value={customDate}
                onChangeText={setCustomDate}
                placeholder="2026-08-24"
              />
            ) : null}

            <SelectionGroup
              label={copy.expectedTimeLabel}
              layout="wrap"
              options={arrivalOptions}
              selected={arrival}
              onSelect={(t) => setArrival(t as (typeof arrivalTimes)[number])}
            />

            <SelectionGroup
              label={copy.accessDurationLabel}
              layout="wrap"
              options={durationOptions}
              selected={durationMinutes}
              onSelect={(m) => setDurationMinutes(m as number)}
            />

            {purposeSelectionOptions.length ? (
              <SelectionGroup
                label={type === VisitorType.VENDOR ? copy.vendorWork : copy.purposeOfVisitLabel}
                layout="wrap"
                options={purposeSelectionOptions}
                selected={purpose}
                onSelect={(p) => setPurpose(p as string)}
              />
            ) : null}

            <Pressable
              onPress={() => setVehicleExpanded((current) => !current)}
              style={styles.disclosure}
            >
              <Ionicons
                name={vehicleExpanded ? 'remove-circle-outline' : 'add-circle-outline'}
                size={20}
                color={theme.accent}
              />
              <SafeText variant="bodyStrong">{copy.addVehicle}</SafeText>
            </Pressable>
            {vehicleExpanded ? (
              <FormField
                label={copy.vehicleNumberLabel}
                value={vehicle}
                onChangeText={setVehicle}
                autoCapitalize="characters"
                placeholder={copy.vehicleNumberPlaceholder}
              />
            ) : null}
          </View>
        ) : null}

        {isStale ? (
          <SafeText variant="caption" style={colorStyle(theme.danger)}>
            {copy.residenceChanged}
          </SafeText>
        ) : null}
        {failure ? (
          <SafeText variant="caption" style={colorStyle(theme.danger)}>
            {failure}
          </SafeText>
        ) : null}
      </AdaptiveFlowComposer>
    </View>
  );
}

export default CreateVisitorPassScreen;
