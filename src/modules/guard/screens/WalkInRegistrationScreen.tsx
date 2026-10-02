import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResidentTheme } from '../../../../ui/foundation/residentTheme';
import { ResidentPageHeader } from '../../../../ui/patterns/ResidentPageHeader';
import { AppButton } from '../../../../shared/components/AppButton';
import { AppSelectField } from '../../../../ui/forms/AppSelectField';
import { FormField } from '../../../../shared/forms/FormField';
import { AppTextArea } from '../../../../shared/forms/AppTextArea';
import { StatusPill, type StatusTone } from '../../../../ui/components/StatusPill';
import { SafeText } from '../../../../shared/components/SafeText';
import { AppIcon } from '../../../../shared/icons/AppIcon';
import { useVisitorPassValidationService } from '../services/visitorPassValidationService';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useMessages as useGeneratedUiMessages } from '../../../../messages/useMessages';
import { useAuth } from '../../../../core/auth/AuthProvider';
import { useSociety } from '../../../../core/auth/SocietyProvider';
import { visitorApprovalService } from '../services/visitorApprovalService';
import { visitorPassValidationService } from '../services/visitorPassValidationService';
import type { VisitorType, VisitorCategory, VehicleType, EmergencyType, GateEntryType } from '../../../../shared/types/visitorPhase8.types';
import { styles, createTextColorStyle, createViewBackgroundColorStyle } from '../styles/screens/WalkInRegistrationScreen.styles';
import { useMessages as useGeneratedUiMessages } from '../../../../messages/useMessages';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { SafeText } from '../../../../shared/components/SafeText';
import { AppIcon } from '../../../../shared/icons/AppIcon';
import { format } from 'date-fns';
const VISITOR_TYPES = [
    { value: 'GUEST', label: 'Guest' },
    { value: 'DELIVERY', label: 'Delivery' },
    { value: 'CAB', label: 'Cab' },
    { value: 'VENDOR', label: 'Vendor' },
    { value: 'SERVICE_PROVIDER', label: 'Service Provider' },
    { value: 'DOMESTIC_HELP', label: 'Domestic Help' },
    { value: 'STAFF', label: 'Staff' },
    { value: 'COURIER', label: 'Courier' },
    { value: 'MATERIAL_MOVEMENT', label: 'Material Movement' },
    { value: 'EMERGENCY', label: 'Emergency' },
    { value: 'OTHER', label: 'Other' },
] as const;
const VEHICLE_TYPES = [
    { value: 'CAR', label: 'Car' },
    { value: 'BIKE', label: 'Bike' },
    { value: 'SCOOTER', label: 'Scooter' },
    { value: 'AUTO_RICKSHAW', label: 'Auto Rickshaw' },
    { value: 'TRUCK', label: 'Truck' },
    { value: 'TEMPO', label: 'Tempo' },
    { value: 'VAN', label: 'Van' },
    { value: 'OTHER', label: 'Other' },
] as const;
const EMERGENCY_TYPES = [
    { value: 'AMBULANCE', label: 'Ambulance' },
    { value: 'FIRE', label: 'Fire' },
    { value: 'POLICE', label: 'Police' },
    { value: 'EMERGENCY_MAINTENANCE', label: 'Emergency Maintenance' },
    { value: 'OTHER', label: 'Other' },
] as const;
export function WalkInRegistrationScreen({ navigation }: {
    navigation: {
        goBack: () => void;
        navigate: (route: string, params?: any) => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useAppTheme();
    const { userRole } = useAuth();
    const { currentSociety } = useSociety();
    const { validatePass } = useVisitorPassValidationService();
    const [step, setStep] = useState<'type' | 'details' | 'vehicle' | 'confirm'>('type');
    const [visitorType, setVisitorType] = useState<GateEntryType>('GUEST');
    const [visitorCategory, setVisitorCategory] = useState<any>('guest');
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
    const [isValidating, setIsValidating] = useState(false);
    const [validationResult, setValidationResult] = useState<any>(null);
    const [showPassCode, setShowPassCode] = useState(false);
    const [generatedOtp, setGeneratedOtp] = useState('');
    const { currentSociety } = useSociety();
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const steps = ['type', 'details', 'vehicle', 'confirm'] as const;
    const currentStepIndex = steps.indexOf(step);
    const canGoNext = useCallback(() => {
        switch (step) {
            case 'type':
                return !!visitorType;
            case 'details':
                return visitorName.trim().length >= 2 && visitorPhone.length >= 10 && flatNumber.trim().length > 0 && purpose.trim().length > 0;
            case 'vehicle':
                return true;
            case 'confirm':
                return true;
            default:
                return false;
        }
    }, [step, visitorType, visitorName, visitorPhone, flatNumber, purpose]);
    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setStep(steps[currentStepIndex + 1]);
        }
    };
    const handleBack = () => {
        if (currentStepIndex > 0) {
            setStep(steps[currentStepIndex - 1]);
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
            const validityStart = new Date();
            const validityEnd = new Date(Date.now() + validityMinutes * 60 * 1000);
            const visitor = {
                id: `vis-${Date.now()}`,
                name: visitorName,
                phone: visitorPhone,
                email: visitorEmail || undefined,
                type: visitorType,
                category: visitorCategory,
                status: 'APPROVED' as any,
                expectedDate: new Date().toISOString().split('T')[0],
                expectedTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
                expectedEntryAtIso: new Date().toISOString(),
                expectedExitAtIso: new Date(Date.now() + validityMinutes * 60 * 1000).toISOString(),
                actualEntryAtIso: undefined,
                actualExitAtIso: undefined,
                flatNumber: flatNumber,
                societyName: currentSociety?.name || '',
                purpose: purpose,
                vehicleNumber: vehicleRegistration || undefined,
                otp: Math.floor(100000 + Math.random() * 900000).toString(),
                qrCode: `qr-${Date.now()}`,
                qrCodeData: JSON.stringify({ v: `vis-${Date.now()}`, o: Math.floor(100000 + Math.random() * 900000).toString(), t: Date.now() }),
                qrCodeExpiryAtIso: new Date(Date.now() + validityMinutes * 60 * 1000).toISOString(),
                createdAt: new Date().toISOString(),
                createdByUserId: 'guard-id',
                createdByDisplayName: 'Guard',
                visitorCategory: visitorCategory,
                exitTracking: undefined,
                cancellationReason: undefined,
                cancellationNotes: undefined,
                cancelledAt: undefined,
                cancelledBy: undefined,
                approvalSource: 'GUARD' as any,
                approvalStatus: 'APPROVED' as any,
                validityWindowMinutes: 240,
                validityStartAtIso: new Date().toISOString(),
                validityEndAtIso: new Date(Date.now() + validityMinutes * 60 * 1000).toISOString(),
                description: specialInstructions,
                invitedByResidentId: undefined,
                invitedByResidentName: undefined,
                preApprovalId: undefined,
                deliveryBrand: deliveryBrand || undefined,
                deliveryTrackingId: deliveryTrackingId || undefined,
                cabCompany: cabCompany || undefined,
                cabDriverName: cabDriverName || undefined,
                vendorCompany: vendorCompany || undefined,
                vendorContactPerson: vendorContactPerson || undefined,
                vendorServiceType: vendorServiceType || undefined,
                materialDescription: undefined,
                materialQuantity: undefined,
                materialWeightKg: undefined,
                emergencyType: emergencyType as any,
                emergencyDescription: emergencyDescription || undefined,
                emergencyContactName: emergencyContactName || undefined,
                emergencyContactPhone: emergencyContactPhone || undefined,
                gateId: undefined,
                gateName: undefined,
                checkInAtIso: undefined,
                checkInGateId: undefined,
                checkInGateName: undefined,
                checkOutAtIso: undefined,
                checkOutGateId: undefined,
                checkOutGateName: undefined,
                deniedAtIso: undefined,
                deniedBy: undefined,
                deniedReason: undefined,
                escalatedAtIso: undefined,
                escalatedBy: undefined,
                escalationReason: undefined,
                escalationStatus: undefined,
                revokedAtIso: undefined,
                revokedBy: undefined,
                revocationReason: undefined,
                watchlistWarning: false,
                watchlistId: undefined,
                watchlistReason: undefined,
                previousVisitCount: 0,
                lastVisitAtIso: undefined,
                tags: ['walk-in'],
                metadata: {
                    deliveryBrand,
                    deliveryTrackingId,
                    cabCompany,
                    cabDriverName,
                    vendorCompany,
                    vendorContactPerson,
                    vendorServiceType,
                    specialInstructions,
                    validityMinutes,
                },
                societyId: currentSociety?.id || 'society-001',
            };
            const mockStore = require('../../../core/mockStore/mockStore').mockStore;
            mockStore.getState().visitors?.push(visitor);
            const gateEvent = {
                id: `gate-event-${Date.now()}`,
                eventType: 'WALK_IN_REGISTRATION' as any,
                gateId: 'gate-1',
                gateName: 'Main Gate',
                gateCode: 'G1',
                visitorId: `vis-${Date.now()}`,
                visitorName: visitorName,
                visitorPhone: visitorPhone,
                visitorType: visitorType,
                visitorPassId: `vis-${Date.now()}`,
                visitorPassCode: Math.floor(100000 + Math.random() * 900000).toString(),
                unitId: '',
                unitNumber: '',
                flatNumber: flatNumber,
                eventTimestamp: new Date().toISOString(),
                deviceTimestamp: new Date().toISOString(),
                guardId: 'guard-id',
                guardName: 'Guard',
                guardRole: 'GUARD',
                entrySource: 'MANUAL' as any,
                approvalSource: 'GUARD' as any,
                vehicleId: vehicleRegistration || undefined,
                vehicleRegistration: vehicleRegistration || undefined,
                vehicleType: vehicleType,
                vehicleColor: vehicleColor || undefined,
                eventStatus: 'SUCCESS',
                approvalSource: 'GUARD' as any,
                approvalStatus: 'APPROVED' as any,
                denialReason: undefined,
                escalationTriggered: false,
                escalationType: undefined,
                watchlistMatch: false,
                watchlistId: undefined,
                watchlistReason: undefined,
                emergencyBypassUsed: false,
                emergencyType: undefined,
                emergencyDescription: undefined,
                emergencyContactName: undefined,
                emergencyContactPhone: undefined,
                idempotencyKey: `walkin-${Date.now()}`,
                deviceId: undefined,
                deviceInfo: undefined,
                appVersion: undefined,
                networkType: undefined,
                syncStatus: 'SYNCED',
                createdAt: new Date().toISOString(),
                createdBy: 'guard-id',
                metadata: {},
                societyId: currentSociety?.id || 'society-001',
            };
            const mockStore = require('../../../core/mockStore/mockStore').mockStore;
            mockStore.getState().visitors?.push(visitor);
            mockStore.getState().gateEvents?.push(gateEvent);
            mockStore.notify();
            navigation.navigate('WalkInConfirmation', {
                visitor,
                gateEvent,
                otp: Math.floor(100000 + Math.random() * 900000).toString()
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
                return (<View style={styles.stepContent}>
            <SafeText variant="h3" style={styles.stepTitle}>{localizedUiText.m_select_visitor_type}</SafeText>
            <SafeText variant="body" style={styles.stepSubtitle}>{localizedUiText.m_what_type_of_visitor}</SafeText>
            <View style={styles.typeGrid}>
              {VISITOR_TYPES.map((type) => (<TouchableOpacity key={type.value} style={[
                            styles.typeCard,
                            visitorType === type.value && styles.typeCardSelected,
                        ]} onPress={() => { setVisitorType(type.value); setVisitorCategory(type.value); }}>
                  <AppIcon name={type.value === 'GUEST' ? 'person-outline' : type.value === 'DELIVERY' ? 'package-outline' : type.value === 'CAB' ? 'car-outline' : type.value === 'VENDOR' ? 'construct-outline' : type.value === 'SERVICE_PROVIDER' ? 'build-outline' : type.value === 'DOMESTIC_HELP' ? 'home-outline' : type.value === 'STAFF' ? 'person-circle-outline' : type.value === 'COURIER' ? 'package-outline' : type.value === 'MATERIAL_MOVEMENT' ? 'truck-outline' : type.value === 'EMERGENCY' ? 'alert-circle-outline' : 'help-circle-outline'} size={28} color={visitorType === type.value ? colors.primary : colors.textMuted}/>
                  <SafeText variant="caption" style={[
                            styles.typeCardText,
                            visitorType === type.value && styles.typeCardTextSelected,
                        ]}>
                    {type.label}
                  </SafeText>
                </TouchableOpacity>))}
            </View>
          </View>);
            case 'details':
                return (<View style={styles.stepContent}>
            <SafeText variant="h3" style={styles.stepTitle}>{localizedUiText.m_visitor_details}</SafeText>
            <SafeText variant="body" style={styles.stepSubtitle}>{localizedUiText.m_enter_visitor_information}</SafeText>
            <View style={styles.formFields}>
              <FormField label={localizedUiText.m_visitor_name} value={visitorName} onChangeText={setVisitorName} placeholder={localizedUiText.m_enter_name} required error={!visitorName.trim() ? localizedUiText.m_required : undefined}/>
              <FormField label={localizedUiText.m_phone_number} value={visitorPhone} onChangeText={setVisitorPhone} placeholder={localizedUiText.m_enter_phone} keyboardType="phone-pad" required error={visitorPhone.length < 10 ? localizedUiText.m_valid_phone_required : undefined}/>
              <FormField label={localizedUiText.m_email_optional} value={visitorEmail} onChangeText={setVisitorEmail} placeholder={localizedUiText.m_enter_email} keyboardType="email-address"/>
              <FormField label={localizedUiText.m_flat_number} value={flatNumber} onChangeText={setFlatNumber} placeholder={localizedUiText.m_enter_flat} required error={!flatNumber.trim() ? localizedUiText.m_required : undefined}/>
              <FormField label={localizedUiText.m_purpose} value={purpose} onChangeText={setPurpose} placeholder={localizedUiText.m_enter_purpose} multiline numberOfLines={3} required error={!purpose.trim() ? localizedUiText.m_required : undefined}/>
              <AppSelectField label={localizedUiText.m_validity_minutes} value={validityMinutes.toString()} onChange={(val) => setValidityMinutes(parseInt(val))} options={[
                        { label: '2 Hours (120 min)', value: '120' },
                        { label: '4 Hours (240 min)', value: '240' },
                        { label: '8 Hours (480 min)', value: '480' },
                        { label: '12 Hours (720 min)', value: '720' },
                        { label: '24 Hours (1440 min)', value: '1440' },
                    ]}/>
            </View>
            
            {visitorType === 'DELIVERY' && (<View style={styles.conditionalSection}>
                <SafeText variant="bodyStrong" style={styles.sectionTitle}>{localizedUiText.m_delivery_details}</SafeText>
                <View style={styles.formFields}>
                  <FormField label={localizedUiText.m_delivery_brand} value={deliveryBrand} onChangeText={setDeliveryBrand} placeholder={localizedUiText.m_enter_brand}/>
                  <FormField label={localizedUiText.m_tracking_id} value={deliveryTrackingId} onChangeText={setDeliveryTrackingId} placeholder={localizedUiText.m_enter_tracking_id}/>
                </View>
              </View>)}
            
            {visitorType === 'CAB' && (<View style={styles.conditionalSection}>
                <SafeText variant="bodyStrong" style={styles.sectionTitle}>{localizedUiText.m_cab_details}</SafeText>
                <View style={styles.formFields}>
                  <FormField label={localizedUiText.m_cab_company} value={cabCompany} onChangeText={setCabCompany} placeholder={localizedUiText.m_enter_company}/>
                  <FormField label={localizedUiText.m_driver_name} value={cabDriverName} onChangeText={setCabDriverName} placeholder={localizedUiText.m_enter_driver_name}/>
                </View>
              </View>)}
            
            {visitorType === 'VENDOR' && (<View style={styles.conditionalSection}>
                <SafeText variant="bodyStrong" style={styles.sectionTitle}>{localizedUiText.m_vendor_details}</SafeText>
                <View style={styles.formFields}>
                  <FormField label={localizedUiText.m_vendor_company} value={vendorCompany} onChangeText={setVendorCompany} placeholder={localizedUiText.m_enter_company}/>
                  <FormField label={localizedUiText.m_contact_person} value={vendorContactPerson} onChangeText={setVendorContactPerson} placeholder={localizedUiText.m_enter_contact_person}/>
                  <FormField label={localizedUiText.m_service_type} value={vendorServiceType} onChangeText={setVendorServiceType} placeholder={localizedUiText.m_enter_service_type}/>
                </View>
              </View>)}
            
            {visitorType === 'EMERGENCY' && (<View style={styles.conditionalSection}>
                <SafeText variant="bodyStrong" style={styles.sectionTitle}>{localizedUiText.m_emergency_details}</SafeText>
                <View style={styles.formFields}>
                  <AppSelectField label={localizedUiText.m_emergency_type} value={emergencyType} onChange={setEmergencyType} options={EMERGENCY_TYPES.map(e => ({ label: e.label, value: e.value }))} placeholder={localizedUiText.m_select_emergency_type} required/>
                  <FormField label={localizedUiText.m_description} value={emergencyDescription} onChangeText={setEmergencyDescription} placeholder={localizedUiText.m_enter_description} multiline numberOfLines={3}/>
                  <FormField label={localizedUiText.m_emergency_contact_name} value={emergencyContactName} onChangeText={setEmergencyContactName} placeholder={localizedUiText.m_enter_contact_name}/>
                  <FormField label={localizedUiText.m_emergency_contact_phone} value={emergencyContactPhone} onChangeText={setEmergencyContactPhone} placeholder={localizedUiText.m_enter_contact_phone} keyboardType="phone-pad"/>
                </View>
              </View>)}
          </View>);
            case 'vehicle':
                return (<View style={styles.stepContent}>
            <SafeText variant="h3" style={styles.stepTitle}>{localizedUiText.m_vehicle_details}</SafeText>
            <SafeText variant="body" style={styles.stepSubtitle}>{localizedUiText.m_optional_vehicle_info}</SafeText>
            <View style={styles.formFields}>
              <FormField label={localizedUiText.m_vehicle_registration} value={vehicleRegistration} onChangeText={setVehicleRegistration} placeholder={localizedUiText.m_enter_registration}/>
              <AppSelectField label={localizedUiText.m_vehicle_type} value={vehicleType} onChange={setVehicleType} options={VEHICLE_TYPES.map(v => ({ label: v.label, value: v.value }))} placeholder={localizedUiText.m_select_vehicle_type}/>
              <FormField label={localizedUiText.m_vehicle_color} value={vehicleColor} onChangeText={setVehicleColor} placeholder={localizedUiText.m_enter_color}/>
            </View>
            <View style={styles.infoBox}>
              <AppIcon name="information-circle-outline" size={20} color={colors.info}/>
              <SafeText variant="caption" style={styles.infoText}>
                {localizedUiText.m_vehicle_optional}
              </SafeText>
            </View>
          </View>);
            case 'confirm':
                return (<View style={styles.stepContent}>
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
              {vehicleRegistration && (<View style={styles.confirmRow}>
                  <SafeText variant="caption" style={styles.confirmLabel}>{localizedUiText.m_vehicle}</SafeText>
                  <SafeText variant="body" style={styles.confirmValue}>{vehicleRegistration} ({vehicleType})</SafeText>
                </View>)}
              <View style={styles.confirmRow}>
                <SafeText variant="caption" style={styles.confirmLabel}>{localizedUiText.m_validity}</SafeText>
                <SafeText variant="body" style={styles.confirmValue}>{validityMinutes} minutes</SafeText>
              </View>
            </View>
          </View>);
            default:
                return null;
        }
    };
    const { FlatList, TouchableOpacity } = require('react-native');
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <ResidentPageHeader title={localizedUiText.m_walk_in_registration} showBack onBack={handleBack}/>

      <View style={styles.progressContainer}>
        {steps.map((s, i) => (<View key={s} style={styles.progressStep}>
            <View style={[
                styles.progressCircle,
                i < currentStepIndex && styles.progressCircleCompleted,
                i === currentStepIndex && styles.progressCircleActive,
            ]}>
              {i < currentStepIndex && <AppIcon name="checkmark" size={12} color={colors.white}/>}
              {i === currentStepIndex && <SafeText variant="caption" style={styles.progressNumber}>{i + 1}</SafeText>}
              {i > currentStepIndex && <SafeText variant="caption" style={styles.progressNumber}>{i + 1}</SafeText>}
            </View>
            <SafeText variant="caption" style={[
                styles.progressLabel,
                i === currentStepIndex && styles.progressLabelActive,
            ]}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </SafeText>
            {i < steps.length - 1 && (<View style={[
                    styles.progressLine,
                    i < currentStepIndex && styles.progressLineCompleted,
                ]}/>)}
          </View>))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>

      <View style={styles.footer}>
        {step !== 'confirm' && (<AppButton title={currentStepIndex === steps.length - 2 ? localizedUiText.m_register : localizedUiText.m_next} variant="primary" onPress={handleNext} disabled={!canGoNext() || isSubmitting} fullWidth/>)}
        {step === 'confirm' && (<AppButton title={localizedUiText.m_register} variant="primary" onPress={handleSubmit} disabled={isSubmitting} loading={isSubmitting} fullWidth/>)}
        {step !== 'type' && (<AppButton title={localizedUiText.m_back} variant="outline" onPress={handleBack} fullWidth style={styles.backButton}/>)}
      </View>
    </SafeAreaView>);
}
const { VISITOR_TYPES } = require('../../../../shared/types/visitorPhase8.types');
const { Alert } = require('react-native');

