import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ResidentPageHeader } from '../../../ui/patterns/ResidentPageHeader';
import { AppButton } from '../../../shared/components/AppButton';
import { AppSelectField, type SelectOption } from '../../../ui/forms/AppSelectField';
import { FormField } from '../../../shared/forms/FormField';
import { SafeText } from '../../../shared/components/SafeText';
import { AppIcon } from '../../../shared/icons/AppIcon';
import type { AppIconName } from '../../../shared/icons/icon.types';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';
import { useSociety } from '../../../core/auth/SocietyProvider';
import { visitorPassService } from '../services/visitorPassService';
import type { VisitorType, VisitorCategory, VehicleType, EmergencyType } from '../../../shared/types/visitorPhase8.types';
import { styles } from '../styles/screens/WalkInRegistrationScreen.styles';

const VISITOR_TYPES: { value: VisitorType; label: string; category: VisitorCategory; icon: AppIconName }[] = [
    { value: 'GUEST', label: 'Guest', category: 'guest', icon: 'person' },
    { value: 'DELIVERY', label: 'Delivery', category: 'delivery', icon: 'cube-outline' },
    { value: 'CAB', label: 'Cab', category: 'cab', icon: 'car-outline' },
    { value: 'VENDOR', label: 'Vendor', category: 'vendor', icon: 'construct-outline' },
    { value: 'SERVICE_PROVIDER', label: 'Service Provider', category: 'serviceProvider', icon: 'build-outline' },
    { value: 'DOMESTIC_HELP', label: 'Domestic Help', category: 'domesticHelp', icon: 'home-outline' },
    { value: 'STAFF', label: 'Staff', category: 'staff', icon: 'person-circle-outline' },
    { value: 'COURIER', label: 'Courier', category: 'parcel', icon: 'cube-outline' },
    { value: 'MATERIAL_MOVEMENT', label: 'Material Movement', category: 'other', icon: 'business-outline' },
    { value: 'EMERGENCY', label: 'Emergency', category: 'other', icon: 'alert-circle-outline' },
    { value: 'OTHER', label: 'Other', category: 'other', icon: 'help-circle-outline' },
];

const VEHICLE_TYPES: SelectOption<VehicleType>[] = [
    { value: 'CAR', label: 'Car' },
    { value: 'BIKE', label: 'Bike' },
    { value: 'SCOOTER', label: 'Scooter' },
    { value: 'AUTO_RICKSHAW', label: 'Auto Rickshaw' },
    { value: 'TRUCK', label: 'Truck' },
    { value: 'TEMPO', label: 'Tempo' },
    { value: 'VAN', label: 'Van' },
    { value: 'OTHER', label: 'Other' },
];

const EMERGENCY_TYPES: SelectOption<EmergencyType>[] = [
    { value: 'AMBULANCE', label: 'Ambulance' },
    { value: 'FIRE', label: 'Fire' },
    { value: 'POLICE', label: 'Police' },
    { value: 'EMERGENCY_MAINTENANCE', label: 'Emergency Maintenance' },
    { value: 'OTHER', label: 'Other' },
];

const VALIDITY_OPTIONS: SelectOption<string>[] = [
    { label: '2 Hours (120 min)', value: '120' },
    { label: '4 Hours (240 min)', value: '240' },
    { label: '8 Hours (480 min)', value: '480' },
    { label: '12 Hours (720 min)', value: '720' },
    { label: '24 Hours (1440 min)', value: '1440' },
];

export function WalkInRegistrationScreen({ navigation }: {
    navigation: {
        goBack: () => void;
        navigate: (route: string, params?: Record<string, unknown>) => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { currentSociety } = useSociety();
    const [step, setStep] = useState<'type' | 'details' | 'vehicle' | 'confirm'>('type');
    const [visitorType, setVisitorType] = useState<VisitorType>('GUEST');
    const [visitorCategory, setVisitorCategory] = useState<VisitorCategory>('guest');
    const [visitorName, setVisitorName] = useState('');
    const [visitorPhone, setVisitorPhone] = useState('');
    const [visitorEmail, setVisitorEmail] = useState('');
    const [flatNumber, setFlatNumber] = useState('');
    const [purpose, setPurpose] = useState('');
    const [vehicleRegistration, setVehicleRegistration] = useState('');
    const [vehicleType, setVehicleType] = useState<VehicleType>('CAR');
    const [vehicleColor, setVehicleColor] = useState('');
    const [deliveryBrand, setDeliveryBrand] = useState('');
    const [deliveryTrackingId, setDeliveryTrackingId] = useState('');
    const [cabCompany, setCabCompany] = useState('');
    const [cabDriverName, setCabDriverName] = useState('');
    const [vendorCompany, setVendorCompany] = useState('');
    const [vendorContactPerson, setVendorContactPerson] = useState('');
    const [vendorServiceType, setVendorServiceType] = useState('');
    const [emergencyType, setEmergencyType] = useState<EmergencyType>('OTHER');
    const [emergencyDescription, setEmergencyDescription] = useState('');
    const [emergencyContactName, setEmergencyContactName] = useState('');
    const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [validityMinutes, setValidityMinutes] = useState(240);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps = ['type', 'details', 'vehicle', 'confirm'] as const;
    const currentStepIndex = steps.indexOf(step);

    const canGoNext = useCallback(() => {
        switch (step) {
            case 'type':
                return !!visitorType;
            case 'details':
                return visitorName.trim().length >= 2 && visitorPhone.length >= 10 && flatNumber.trim().length > 0 && purpose.trim().length > 0;
            case 'vehicle':
            case 'confirm':
                return true;
            default:
                return false;
        }
    }, [step, visitorType, visitorName, visitorPhone, flatNumber, purpose]);

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            const next = steps[currentStepIndex + 1];
            if (next) setStep(next);
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            const prev = steps[currentStepIndex - 1];
            if (prev) setStep(prev);
        }
        else {
            navigation.goBack();
        }
    };

    const handleSubmit = async () => {
        if (!currentSociety)
            return;
        setIsSubmitting(true);
        try {
            const now = new Date().toISOString();
            const payload = {
                name: visitorName.trim(),
                phone: visitorPhone.trim(),
                ...(visitorEmail.trim() ? { email: visitorEmail.trim() } : {}),
                type: visitorType,
                category: visitorCategory,
                expectedDate: new Date().toISOString().split('T')[0] ?? '',
                expectedTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
                expectedEntryAtIso: now,
                expectedExitAtIso: new Date(Date.now() + validityMinutes * 60 * 1000).toISOString(),
                flatNumber: flatNumber.trim(),
                purpose: purpose.trim(),
                ...(vehicleRegistration.trim() ? {
                    vehicleNumber: vehicleRegistration.trim().toUpperCase(),
                    vehicleType,
                    ...(vehicleColor.trim() ? { vehicleColor: vehicleColor.trim() } : {}),
                } : {}),
                validityWindowMinutes: validityMinutes,
                validityStartAtIso: now,
                validityEndAtIso: new Date(Date.now() + validityMinutes * 60 * 1000).toISOString(),
                ...(specialInstructions.trim() ? { description: specialInstructions.trim() } : {}),
                ...(deliveryBrand.trim() ? { deliveryBrand: deliveryBrand.trim() } : {}),
                ...(deliveryTrackingId.trim() ? { deliveryTrackingId: deliveryTrackingId.trim() } : {}),
                ...(cabCompany.trim() ? { cabCompany: cabCompany.trim() } : {}),
                ...(cabDriverName.trim() ? { cabDriverName: cabDriverName.trim() } : {}),
                ...(vendorCompany.trim() ? { vendorCompany: vendorCompany.trim() } : {}),
                ...(vendorContactPerson.trim() ? { vendorContactPerson: vendorContactPerson.trim() } : {}),
                ...(vendorServiceType.trim() ? { vendorServiceType: vendorServiceType.trim() } : {}),
                ...(emergencyDescription.trim() ? { emergencyDescription: emergencyDescription.trim(), emergencyType } : {}),
                ...(emergencyContactName.trim() ? { emergencyContactName: emergencyContactName.trim() } : {}),
                ...(emergencyContactPhone.trim() ? { emergencyContactPhone: emergencyContactPhone.trim() } : {}),
            };

            const visitor = await visitorPassService.createVisitorPass(
                payload,
                'guard-id',
                currentSociety.id
            );

            navigation.navigate('WalkInConfirmation', {
                visitor,
                otp: visitor.otp,
            });
        }
        catch (e) {
            Alert.alert('Error', e instanceof Error ? e.message : 'Failed to register visitor');
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 'type':
                return (
                  <View style={styles.stepContent}>
                    <SafeText variant="h3" style={styles.stepTitle}>{localizedUiText.m_select_visitor_type}</SafeText>
                    <SafeText variant="body" style={styles.stepSubtitle}>{localizedUiText.m_what_type_of_visitor}</SafeText>
                    <View style={styles.typeGrid}>
                      {VISITOR_TYPES.map((type) => (
                        <TouchableOpacity
                          key={type.value}
                          style={[
                            styles.typeCard,
                            visitorType === type.value && styles.typeCardSelected,
                          ]}
                          onPress={() => {
                            setVisitorType(type.value);
                            setVisitorCategory(type.category);
                          }}
                        >
                          <AppIcon
                            name={type.icon}
                            size={28}
                            color={visitorType === type.value ? colors.primary : colors.textMuted}
                          />
                          <SafeText
                            variant="caption"
                            style={[
                              styles.typeCardText,
                              visitorType === type.value && styles.typeCardTextSelected,
                            ]}
                          >
                            {type.label}
                          </SafeText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
            case 'details':
                return (
                  <View style={styles.stepContent}>
                    <SafeText variant="h3" style={styles.stepTitle}>{localizedUiText.m_visitor_details}</SafeText>
                    <SafeText variant="body" style={styles.stepSubtitle}>{localizedUiText.m_enter_visitor_information}</SafeText>
                    <View style={styles.formFields}>
                      {visitorName.trim().length === 0 ? (
                        <FormField label={localizedUiText.m_visitor_name} value={visitorName} onChangeText={setVisitorName} placeholder={localizedUiText.m_enter_name} required error={localizedUiText.m_required}/>
                      ) : (
                        <FormField label={localizedUiText.m_visitor_name} value={visitorName} onChangeText={setVisitorName} placeholder={localizedUiText.m_enter_name} required/>
                      )}
                      {visitorPhone.length > 0 && visitorPhone.length < 10 ? (
                        <FormField label={localizedUiText.m_phone_number} value={visitorPhone} onChangeText={setVisitorPhone} placeholder={localizedUiText.m_enter_phone} keyboardType="phone-pad" required error={localizedUiText.m_valid_phone_required}/>
                      ) : (
                        <FormField label={localizedUiText.m_phone_number} value={visitorPhone} onChangeText={setVisitorPhone} placeholder={localizedUiText.m_enter_phone} keyboardType="phone-pad" required/>
                      )}
                      <FormField label={localizedUiText.m_email_optional} value={visitorEmail} onChangeText={setVisitorEmail} placeholder={localizedUiText.m_enter_email} keyboardType="email-address"/>
                      {flatNumber.trim().length === 0 ? (
                        <FormField label={localizedUiText.m_flat_number} value={flatNumber} onChangeText={setFlatNumber} placeholder={localizedUiText.m_enter_flat} required error={localizedUiText.m_required}/>
                      ) : (
                        <FormField label={localizedUiText.m_flat_number} value={flatNumber} onChangeText={setFlatNumber} placeholder={localizedUiText.m_enter_flat} required/>
                      )}
                      {purpose.trim().length === 0 ? (
                        <FormField label={localizedUiText.m_purpose} value={purpose} onChangeText={setPurpose} placeholder={localizedUiText.m_enter_purpose} multiline numberOfLines={3} required error={localizedUiText.m_required}/>
                      ) : (
                        <FormField label={localizedUiText.m_purpose} value={purpose} onChangeText={setPurpose} placeholder={localizedUiText.m_enter_purpose} multiline numberOfLines={3} required/>
                      )}
                      <AppSelectField
                        label={localizedUiText.m_validity_minutes}
                        value={validityMinutes.toString()}
                        onChange={(val) => setValidityMinutes(parseInt(val, 10) || 240)}
                        options={VALIDITY_OPTIONS}
                      />
                    </View>

                    {visitorType === 'DELIVERY' && (
                      <View style={styles.conditionalSection}>
                        <SafeText variant="bodyStrong" style={styles.sectionTitle}>{localizedUiText.m_delivery_details}</SafeText>
                        <View style={styles.formFields}>
                          <FormField label={localizedUiText.m_delivery_brand} value={deliveryBrand} onChangeText={setDeliveryBrand} placeholder={localizedUiText.m_enter_brand}/>
                          <FormField label={localizedUiText.m_tracking_id} value={deliveryTrackingId} onChangeText={setDeliveryTrackingId} placeholder={localizedUiText.m_enter_tracking_id}/>
                        </View>
                      </View>
                    )}

                    {visitorType === 'CAB' && (
                      <View style={styles.conditionalSection}>
                        <SafeText variant="bodyStrong" style={styles.sectionTitle}>{localizedUiText.m_cab_details}</SafeText>
                        <View style={styles.formFields}>
                          <FormField label={localizedUiText.m_cab_company} value={cabCompany} onChangeText={setCabCompany} placeholder={localizedUiText.m_enter_company}/>
                          <FormField label={localizedUiText.m_driver_name} value={cabDriverName} onChangeText={setCabDriverName} placeholder={localizedUiText.m_enter_driver_name}/>
                        </View>
                      </View>
                    )}

                    {visitorType === 'VENDOR' && (
                      <View style={styles.conditionalSection}>
                        <SafeText variant="bodyStrong" style={styles.sectionTitle}>{localizedUiText.m_vendor_details}</SafeText>
                        <View style={styles.formFields}>
                          <FormField label={localizedUiText.m_vendor_company} value={vendorCompany} onChangeText={setVendorCompany} placeholder={localizedUiText.m_enter_company}/>
                          <FormField label={localizedUiText.m_contact_person} value={vendorContactPerson} onChangeText={setVendorContactPerson} placeholder={localizedUiText.m_enter_contact_person}/>
                          <FormField label={localizedUiText.m_service_type} value={vendorServiceType} onChangeText={setVendorServiceType} placeholder={localizedUiText.m_enter_service_type}/>
                        </View>
                      </View>
                    )}

                    {visitorType === 'EMERGENCY' && (
                      <View style={styles.conditionalSection}>
                        <SafeText variant="bodyStrong" style={styles.sectionTitle}>{localizedUiText.m_emergency_details}</SafeText>
                        <View style={styles.formFields}>
                          <AppSelectField label={localizedUiText.m_emergency_type} value={emergencyType} onChange={setEmergencyType} options={EMERGENCY_TYPES} required/>
                          <FormField label={localizedUiText.m_description} value={emergencyDescription} onChangeText={setEmergencyDescription} placeholder={localizedUiText.m_enter_description} multiline numberOfLines={3}/>
                          <FormField label={localizedUiText.m_emergency_contact_name} value={emergencyContactName} onChangeText={setEmergencyContactName} placeholder={localizedUiText.m_enter_contact_name}/>
                          <FormField label={localizedUiText.m_emergency_contact_phone} value={emergencyContactPhone} onChangeText={setEmergencyContactPhone} placeholder={localizedUiText.m_enter_contact_phone} keyboardType="phone-pad"/>
                        </View>
                      </View>
                    )}
                  </View>
                );
            case 'vehicle':
                return (
                  <View style={styles.stepContent}>
                    <SafeText variant="h3" style={styles.stepTitle}>{localizedUiText.m_vehicle_details}</SafeText>
                    <SafeText variant="body" style={styles.stepSubtitle}>{localizedUiText.m_optional_vehicle_info}</SafeText>
                    <View style={styles.formFields}>
                      <FormField label={localizedUiText.m_vehicle_registration} value={vehicleRegistration} onChangeText={setVehicleRegistration} placeholder={localizedUiText.m_enter_registration}/>
                      <AppSelectField label={localizedUiText.m_vehicle_type} value={vehicleType} onChange={setVehicleType} options={VEHICLE_TYPES}/>
                      <FormField label={localizedUiText.m_vehicle_color} value={vehicleColor} onChangeText={setVehicleColor} placeholder={localizedUiText.m_enter_color}/>
                    </View>
                    <View style={styles.infoBox}>
                      <AppIcon name="information-circle-outline" size={20} color={colors.info}/>
                      <SafeText variant="caption" style={styles.infoText}>
                        {localizedUiText.m_vehicle_optional}
                      </SafeText>
                    </View>
                  </View>
                );
            case 'confirm':
                return (
                  <View style={styles.stepContent}>
                    <SafeText variant="h3" style={styles.stepTitle}>{localizedUiText.m_review_and_confirm}</SafeText>
                    <SafeText variant="body" style={styles.stepSubtitle}>{localizedUiText.m_verify_information}</SafeText>
                    <View style={styles.confirmCard}>
                      <View style={styles.confirmRow}>
                        <SafeText variant="caption" style={styles.confirmLabel}>{localizedUiText.m_visitor_type}</SafeText>
                        <SafeText variant="body" style={styles.confirmValue}>
                          {VISITOR_TYPES.find(t => t.value === visitorType)?.label || visitorType}
                        </SafeText>
                      </View>
                      <View style={styles.confirmRow}>
                        <SafeText variant="caption" style={styles.confirmLabel}>{localizedUiText.m_visitor_name}</SafeText>
                        <SafeText variant="body" style={styles.confirmValue}>{visitorName}</SafeText>
                      </View>
                      <View style={styles.confirmRow}>
                        <SafeText variant="caption" style={styles.confirmLabel}>{localizedUiText.m_phone_number}</SafeText>
                        <SafeText variant="body" style={styles.confirmValue}>{visitorPhone}</SafeText>
                      </View>
                      <View style={styles.confirmRow}>
                        <SafeText variant="caption" style={styles.confirmLabel}>{localizedUiText.m_flat_number}</SafeText>
                        <SafeText variant="body" style={styles.confirmValue}>{flatNumber}</SafeText>
                      </View>
                      <View style={styles.confirmRow}>
                        <SafeText variant="caption" style={styles.confirmLabel}>{localizedUiText.m_purpose}</SafeText>
                        <SafeText variant="body" style={styles.confirmValue}>{purpose}</SafeText>
                      </View>
                      {vehicleRegistration ? (
                        <View style={styles.confirmRow}>
                          <SafeText variant="caption" style={styles.confirmLabel}>{localizedUiText.m_vehicle}</SafeText>
                          <SafeText variant="body" style={styles.confirmValue}>{vehicleRegistration} ({vehicleType})</SafeText>
                        </View>
                      ) : null}
                      <View style={styles.confirmRow}>
                        <SafeText variant="caption" style={styles.confirmLabel}>{localizedUiText.m_validity}</SafeText>
                        <SafeText variant="body" style={styles.confirmValue}>{validityMinutes} minutes</SafeText>
                      </View>
                    </View>
                  </View>
                );
            default:
                return null;
        }
    };

    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ResidentPageHeader title={localizedUiText.m_walk_in_registration} showBackButton onBackPress={handleBack}/>

        <View style={styles.progressContainer}>
          {steps.map((s, i) => (
            <View key={s} style={styles.progressStep}>
              <View style={[
                  styles.progressCircle,
                  i < currentStepIndex && styles.progressCircleCompleted,
                  i === currentStepIndex && styles.progressCircleActive,
              ]}>
                {i < currentStepIndex && <AppIcon name="checkmark" size={12} color={colors.white}/>}
                {i >= currentStepIndex && <SafeText variant="caption" style={styles.progressNumber}>{i + 1}</SafeText>}
              </View>
              <SafeText variant="caption" style={[
                  styles.progressLabel,
                  i === currentStepIndex && styles.progressLabelActive,
              ]}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SafeText>
              {i < steps.length - 1 && (
                <View style={[
                    styles.progressLine,
                    i < currentStepIndex && styles.progressLineCompleted,
                ]}/>
              )}
            </View>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {renderStepContent()}
        </ScrollView>

        <View style={styles.footer}>
          {step !== 'confirm' && (
            <AppButton
              title={currentStepIndex === steps.length - 2 ? localizedUiText.m_register : localizedUiText.m_next}
              variant="primary"
              onPress={handleNext}
              disabled={!canGoNext() || isSubmitting}
              fullWidth
            />
          )}
          {step === 'confirm' && (
            <AppButton
              title={localizedUiText.m_register}
              variant="primary"
              onPress={handleSubmit}
              disabled={isSubmitting}
              loading={isSubmitting}
              fullWidth
            />
          )}
          {step !== 'type' && (
            <AppButton
              title={localizedUiText.m_back}
              variant="outline"
              onPress={handleBack}
              fullWidth
              style={styles.backButton}
            />
          )}
        </View>
      </SafeAreaView>
    );
}
