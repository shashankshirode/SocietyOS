import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenContainer } from '../../../shared/layouts/ScreenContainer';
import { ResponsivePageHeader } from '../../../shared/layouts/ResponsivePageHeader';
import { FormField } from '../../../shared/forms/FormField';
import { AppButton } from '../../../shared/components/AppButton';
import { AppCard } from '../../../shared/cards/AppCard';
import { SectionHeader } from '../../../shared/components/SectionHeader';
import { AppSelect } from '../../../shared/forms/AppSelect';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';
import { getActiveUiLiteral } from '../../../shared/localization/activeUiLiteral';
import { includeWhenPresent } from '../../../shared/utils/presentProperty';
import type { Society, SocietyAddress, SocietyRegionalConfig, SocietyType, LaunchMode } from '../data/societyProperty.types';

interface SocietyFormProps {
  mode: 'create' | 'edit';
  initialData?: Society | undefined;
  onSubmit: (data: Society) => Promise<void>;
  onCancel: () => Promise<void>;
  isSubmitting?: boolean;
}

const SOCIETY_TYPES: { value: SocietyType; label: string }[] = [
  { value: 'STANDALONE_BUILDING', label: 'Standalone Building' },
  { value: 'COOPERATIVE_HOUSING_SOCIETY', label: 'Cooperative Housing Society' },
  { value: 'GATED_APARTMENT', label: 'Gated Apartment' },
  { value: 'VILLA_COMMUNITY', label: 'Villa Community' },
  { value: 'LARGE_TOWNSHIP', label: 'Large Township' },
  { value: 'MIXED_USE_COMPLEX', label: 'Mixed Use Complex' },
];

const LAUNCH_MODES: { value: LaunchMode; label: string }[] = [
  { value: 'FREE_LAUNCH', label: 'Free Launch' },
  { value: 'INTERNAL_DEMO', label: 'Internal Demo' },
  { value: 'PILOT', label: 'Pilot' },
  { value: 'PAID', label: 'Paid' },
];

const TIMEZONES = [
  'Asia/Kolkata', 'Asia/Dubai', 'Asia/Singapore', 'Asia/Hong_Kong', 'Asia/Tokyo',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'America/New_York', 'America/Los_Angeles',
  'UTC',
];

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'HKD', 'JPY'];

const FINANCIAL_YEAR_MONTHS = Array.from({ length: 12 }, (_, i) => ({ label: `Month ${i + 1}`, value: String(i + 1) }));

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Marathi', value: 'mr' },
];

export function SocietyForm({ mode, initialData, onSubmit, onCancel, isSubmitting }: SocietyFormProps) {
  const localizedUiText = useGeneratedUiMessages().uiLiterals;
  const { colors } = useAppTheme();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState(initialData?.name ?? '');
  const [registrationNumber, setRegistrationNumber] = useState(initialData?.registrationNumber ?? '');
  const [type, setType] = useState<SocietyType>(initialData?.type ?? 'GATED_APARTMENT');

  const [address, setAddress] = useState<SocietyAddress>(initialData?.address ?? {
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const [regionalConfig, setRegionalConfig] = useState<SocietyRegionalConfig>(initialData?.regionalConfig ?? {
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    financialYearStartMonth: 4,
    defaultLanguage: 'en',
  });

  const [primaryContactName, setPrimaryContactName] = useState('');
  const [primaryContactMobile, setPrimaryContactMobile] = useState('');
  const [primaryContactEmail, setPrimaryContactEmail] = useState('');
  const [initialAdminEmail, setInitialAdminEmail] = useState('');
  const [launchMode, setLaunchMode] = useState<LaunchMode>((initialData?.billingMode as LaunchMode) ?? 'FREE_LAUNCH');
  const [defaultLanguage, setDefaultLanguage] = useState(initialData?.regionalConfig?.defaultLanguage ?? 'en');
  const [enabledModuleTemplate, setEnabledModuleTemplate] = useState('GATED_APARTMENT');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name ?? '');
      setRegistrationNumber(initialData.registrationNumber ?? '');
      setType(initialData.type ?? 'GATED_APARTMENT');
      setAddress(initialData.address ?? { line1: '', line2: '', city: '', state: '', pincode: '', country: 'India' });
      setRegionalConfig(initialData.regionalConfig ?? { timezone: 'Asia/Kolkata', currency: 'INR', financialYearStartMonth: 4, defaultLanguage: 'en' });
      setPrimaryContactName('');
      setPrimaryContactMobile('');
      setPrimaryContactEmail('');
      setInitialAdminEmail('');
      setLaunchMode((initialData.billingMode as LaunchMode) ?? 'FREE_LAUNCH');
      setDefaultLanguage(initialData.regionalConfig?.defaultLanguage ?? 'en');
      setEnabledModuleTemplate('GATED_APARTMENT');
    }
  }, [initialData]);

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) nextErrors.name = getActiveUiLiteral("m_88ba7bbded5f");
    if (!address.line1.trim()) nextErrors.addressLine1 = getActiveUiLiteral("m_077b293e578d");
    if (!address.city.trim()) nextErrors.city = getActiveUiLiteral("m_d15125122df6");
    if (!address.state.trim()) nextErrors.state = getActiveUiLiteral("m_a1ebd51b027e");
    if (!address.pincode.trim()) nextErrors.pincode = 'Pincode is required';
    if (!primaryContactName.trim()) nextErrors.primaryContactName = getActiveUiLiteral("m_e9b86a62317e");
    if (!primaryContactMobile.trim() || primaryContactMobile.length !== 10) {
      nextErrors.primaryContactMobile = getActiveUiLiteral("m_dbd208a6f663");
    }
    if (!primaryContactEmail.trim() || !primaryContactEmail.includes('@')) {
      nextErrors.primaryContactEmail = getActiveUiLiteral("m_ae9fdf4f1f95");
    }
    if (!initialAdminEmail.trim() || !initialAdminEmail.includes('@')) {
      nextErrors.initialAdminEmail = getActiveUiLiteral("m_ae9fdf4f1f95");
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const societyData: Society = {
      id: initialData?.id ?? '',
      name,
      registrationNumber: registrationNumber || '',
      type,
      status: initialData?.status ?? 'DRAFT',
      address,
      regionalConfig,
      planCode: 'PREMIUM',
      billingMode: launchMode,
      totalUnits: initialData?.totalUnits ?? 0,
      activeUsers: initialData?.activeUsers ?? 0,
      enabledModulesCount: initialData?.enabledModulesCount ?? 0,
      createdAt: initialData?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activatedAt: initialData?.activatedAt ?? '',
    };

    try {
      await onSubmit(societyData);
    } catch (error) {
      Alert.alert(
        getActiveUiLiteral("m_233f644f36b8"),
        error instanceof Error ? error.message : getActiveUiLiteral("m_ddf785b79c42")
      );
    }
  };

  return (
    <ScreenContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <ResponsivePageHeader
          title={mode === 'create' ? getActiveUiLiteral("m_3362c251f881") : getActiveUiLiteral("m_7fe1cfa40e83")}
          subtitle={mode === 'create' ? getActiveUiLiteral("m_9f88513588ed") : getActiveUiLiteral("m_dfc7d751c37d")}
          onBack={onCancel}
        />
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <AppCard style={{ marginBottom: 16 }}>
            <SectionHeader title={getActiveUiLiteral("m_a0d57349fb67")} />
            <FormField
              label={getActiveUiLiteral("m_ab1a0aa91701")}
              value={name}
              onChangeText={setName}
              {...includeWhenPresent("error", errors.name)}
              placeholder={getActiveUiLiteral("m_351186298fc9")}
            />
            <FormField
              label={getActiveUiLiteral("m_29894a6ccc25")}
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
              placeholder={getActiveUiLiteral("m_22021f209024")}
            />
            <AppSelect
              label={getActiveUiLiteral("m_fc33f73246f4")}
              value={type}
              onChange={setType}
              options={SOCIETY_TYPES}
              {...includeWhenPresent("error", errors.type)}
            />
          </AppCard>

          <AppCard style={{ marginBottom: 16 }}>
            <SectionHeader title={getActiveUiLiteral("m_1c072121e16f")} />
            <FormField
              label={getActiveUiLiteral("m_0094c0767ba7")}
              value={address.line1}
              onChangeText={(v) => setAddress({ ...address, line1: v })}
              {...includeWhenPresent("error", errors.addressLine1)}
              placeholder={getActiveUiLiteral("m_6a640ab49227")}
            />
            <FormField
              label={getActiveUiLiteral("m_087361815c0a")}
              value={address.line2}
              onChangeText={(v) => setAddress({ ...address, line2: v })}
              placeholder={getActiveUiLiteral("m_f3bd69ffa0eb")}
            />
            <FormField
              label={getActiveUiLiteral("m_8126489668eb")}
              value={address.city}
              onChangeText={(v) => setAddress({ ...address, city: v })}
              {...includeWhenPresent("error", errors.city)}
              placeholder={getActiveUiLiteral("m_22021f209024")}
            />
            <FormField
              label={getActiveUiLiteral("m_ed28b3fd5e49")}
              value={address.state}
              onChangeText={(v) => setAddress({ ...address, state: v })}
              {...includeWhenPresent("error", errors.state)}
              placeholder={getActiveUiLiteral("m_85c361081aab")}
            />
            <FormField
              label={getActiveUiLiteral("m_7a6c4da06ed9")}
              value={address.pincode}
              onChangeText={(v) => setAddress({ ...address, pincode: v })}
              keyboardType="numeric"
              {...includeWhenPresent("error", errors.pincode)}
              placeholder={getActiveUiLiteral("m_0fa80a900c83")}
            />
            <FormField
              label={getActiveUiLiteral("m_ca1143eb9999")}
              value={address.country}
              onChangeText={(v) => setAddress({ ...address, country: v })}
              placeholder={getActiveUiLiteral("m_77290962379c")}
            />
          </AppCard>

          <AppCard style={{ marginBottom: 16 }}>
            <SectionHeader title={getActiveUiLiteral("m_c3b74c9d50e3")} />
            <AppSelect
              label={getActiveUiLiteral("m_f116bca63a65")}
              value={regionalConfig.timezone}
              onChange={(v) => setRegionalConfig({ ...regionalConfig, timezone: v })}
              options={TIMEZONES.map((t) => ({ label: t, value: t }))}
            />
            <AppSelect
              label={getActiveUiLiteral("m_9202a63dd74e")}
              value={regionalConfig.currency}
              onChange={(v) => setRegionalConfig({ ...regionalConfig, currency: v })}
              options={CURRENCIES.map((c) => ({ label: c, value: c }))}
            />
            <AppSelect
              label={getActiveUiLiteral("m_e4292c599a99")}
              value={String(regionalConfig.financialYearStartMonth)}
              onChange={(v) => setRegionalConfig({ ...regionalConfig, financialYearStartMonth: parseInt(v, 10) })}
              options={FINANCIAL_YEAR_MONTHS}
            />
            <AppSelect
              label={getActiveUiLiteral("m_7c67697ec08a")}
              value={regionalConfig.defaultLanguage}
              onChange={(v) => setRegionalConfig({ ...regionalConfig, defaultLanguage: v })}
              options={LANGUAGES}
            />
          </AppCard>

          {mode === 'create' && (
            <AppCard style={{ marginBottom: 16 }}>
              <SectionHeader title={getActiveUiLiteral("m_b62fad3c6d17")} />
              <FormField
                label={getActiveUiLiteral("m_087361815c0a")}
                value={primaryContactName}
                onChangeText={setPrimaryContactName}
                {...includeWhenPresent("error", errors.primaryContactName)}
                placeholder={getActiveUiLiteral("m_f3bd69ffa0eb")}
              />
              <FormField
                label={getActiveUiLiteral("m_8126489668eb")}
                value={primaryContactMobile}
                onChangeText={setPrimaryContactMobile}
                keyboardType="phone-pad"
                {...includeWhenPresent("error", errors.primaryContactMobile)}
                placeholder={getActiveUiLiteral("m_77290962379c")}
              />
              <FormField
                label={getActiveUiLiteral("m_ed28b3fd5e49")}
                value={primaryContactEmail}
                onChangeText={setPrimaryContactEmail}
                keyboardType="email-address"
                {...includeWhenPresent("error", errors.primaryContactEmail)}
                placeholder={getActiveUiLiteral("m_0fa80a900c83")}
              />
              <FormField
                label={getActiveUiLiteral("m_ca1143eb9999")}
                value={initialAdminEmail}
                onChangeText={setInitialAdminEmail}
                keyboardType="email-address"
                {...includeWhenPresent("error", errors.initialAdminEmail)}
                placeholder={getActiveUiLiteral("m_0fa80a900c83")}
              />
              <AppSelect
                label={getActiveUiLiteral("m_b62fad3c6d17")}
                value={launchMode}
                onChange={setLaunchMode}
                options={LAUNCH_MODES}
              />
              <AppSelect
                label={getActiveUiLiteral("m_ab1a0aa91701")}
                value={defaultLanguage}
                onChange={setDefaultLanguage}
                options={LANGUAGES}
              />
              <FormField
                label={getActiveUiLiteral("m_a1a33b30acd3")}
                value={enabledModuleTemplate}
                onChangeText={setEnabledModuleTemplate}
                placeholder={getActiveUiLiteral("m_f3bd69ffa0eb")}
              />
            </AppCard>
          )}

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
            <AppButton
              title={getActiveUiLiteral("m_6aadac2f2b7a")}
              onPress={onCancel}
              variant="outline"
              style={{ flex: 1 }}
            />
            <AppButton
              title={mode === 'create' ? getActiveUiLiteral("m_1282d9db3fce") : getActiveUiLiteral("m_daee7606b339")}
              onPress={handleSubmit}
              loading={isSubmitting ?? false}
              disabled={isSubmitting ?? false}
              style={{ flex: 1 }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
}