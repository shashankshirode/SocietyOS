import React, { useState, useCallback } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ResidentPageHeader } from '../../../ui/patterns/ResidentPageHeader';
import { AppButton } from '../../../shared/components/AppButton';
import { AppIcon } from '../../../shared/icons/AppIcon';
import { SafeText } from '../../../shared/components/SafeText';
import { FormField } from '../../../shared/forms/FormField';
import { AppTextArea } from '../../../shared/forms/AppTextArea';
import { AppSelectField, type SelectOption } from '../../../ui/forms/AppSelectField';
import { useAuth } from '../../../core/auth/AuthProvider';
import { useSociety } from '../../../core/auth/SocietyProvider';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';
import { visitorPassService } from '../services/visitorPassService';
import { styles } from '../styles/screens/EmergencyBypassScreen.styles';
import type { EmergencyType, VehicleType } from '../../../shared/types/visitorPhase8.types';

const EMERGENCY_TYPES: SelectOption<EmergencyType>[] = [
    { value: 'AMBULANCE', label: 'Ambulance' },
    { value: 'FIRE', label: 'Fire' },
    { value: 'POLICE', label: 'Police' },
    { value: 'EMERGENCY_MAINTENANCE', label: 'Emergency Maintenance' },
    { value: 'OTHER', label: 'Other' },
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

export function EmergencyBypassScreen({ navigation }: {
    navigation: {
        goBack: () => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useAppTheme();
    const { colors } = theme;
    const { currentSociety } = useSociety();
    const [step, setStep] = useState<'details' | 'vehicle' | 'confirm'>('details');
    const [emergencyType, setEmergencyType] = useState<EmergencyType>('OTHER');
    const [emergencyDescription, setEmergencyDescription] = useState('');
    const [visitorName, setVisitorName] = useState('');
    const [visitorPhone, setVisitorPhone] = useState('');
    const [flatNumber, setFlatNumber] = useState('');
    const [vehicleRegistration, setVehicleRegistration] = useState('');
    const [vehicleType, setVehicleType] = useState<VehicleType>('CAR');
    const [vehicleColor, setVehicleColor] = useState('');
    const [emergencyContactName, setEmergencyContactName] = useState('');
    const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [createdVisitor, setCreatedVisitor] = useState<any>(null);

    const steps = ['details', 'vehicle', 'confirm'] as const;
    const currentStepIndex = steps.indexOf(step);

    const canGoNext = useCallback(() => {
        switch (step) {
            case 'details':
                return emergencyType && emergencyDescription.trim().length >= 10 && visitorName.trim().length >= 2 && flatNumber.trim().length > 0;
            case 'vehicle':
            case 'confirm':
                return true;
            default:
                return false;
        }
    }, [step, emergencyType, emergencyDescription, visitorName, flatNumber]);

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            const next = steps[currentStepIndex + 1];
            if (next) setStep(next);
        }
    };

    const handleBack = () => {
        if (step === 'vehicle') {
            setStep('details');
        }
        else if (step === 'confirm') {
            setStep('vehicle');
        }
        else {
            navigation.goBack();
        }
    };

    const handleSubmit = useCallback(async () => {
        if (!currentSociety)
            return;
        setIsSubmitting(true);
        try {
            const result = await visitorPassService.createEmergencyBypass({
                gateId: 'gate-1',
                emergencyType,
                emergencyDescription,
                visitorName,
                visitorPhone,
                visitorType: 'EMERGENCY',
                flatNumber,
                ...(vehicleRegistration ? { vehicleRegistration, vehicleType } : {}),
                ...(emergencyContactName ? { emergencyContactName } : {}),
                ...(emergencyContactPhone ? { emergencyContactPhone } : {}),
            }, 'guard-id', 'Guard', currentSociety?.id || 'society-001');
            if (result) {
                setCreatedVisitor(result.visitor);
                setShowConfirmation(true);
            }
        }
        catch (e) {
            Alert.alert('Error', e instanceof Error ? e.message : 'Failed to create emergency bypass');
        }
        finally {
            setIsSubmitting(false);
        }
    }, [emergencyType, emergencyDescription, visitorName, visitorPhone, vehicleRegistration, vehicleType, emergencyContactName, emergencyContactPhone, flatNumber, currentSociety]);

    if (showConfirmation) {
        return (
          <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ResidentPageHeader title={localizedUiText.m_emergency_bypass} showBackButton onBackPress={navigation.goBack}/>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.confirmCard}>
                <AppIcon name="checkmark-circle" size={64} color={theme.colors.success}/>
                <SafeText variant="h2" align="center">
                  {localizedUiText.m_emergency_bypass_created}
                </SafeText>
                <SafeText variant="body" align="center">
                  {localizedUiText.m_emergency_bypass_created_desc}
                </SafeText>
                <View style={styles.confirmRow}>
                  <SafeText variant="caption" style={styles.confirmLabel}>{localizedUiText.m_visitor}</SafeText>
                  <SafeText variant="body" style={styles.confirmValue}>{createdVisitor?.name}</SafeText>
                </View>
                <View style={styles.confirmRow}>
                  <SafeText variant="caption" style={styles.confirmLabel}>{localizedUiText.m_emergency_type}</SafeText>
                  <SafeText variant="body" style={styles.confirmValue}>{EMERGENCY_TYPES.find(t => t.value === createdVisitor?.emergencyType)?.label || 'Other'}</SafeText>
                </View>
                <View style={styles.confirmRow}>
                  <SafeText variant="caption" style={styles.confirmLabel}>{localizedUiText.m_flat}</SafeText>
                  <SafeText variant="body" style={styles.confirmValue}>{createdVisitor?.flatNumber}</SafeText>
                </View>
                <View style={styles.confirmRow}>
                  <SafeText variant="caption" style={styles.confirmLabel}>{localizedUiText.m_time}</SafeText>
                  <SafeText variant="body" style={styles.confirmValue}>{new Date().toLocaleString()}</SafeText>
                </View>
              </View>
              <View style={styles.footer}>
                <AppButton title={localizedUiText.m_done} variant="primary" onPress={() => navigation.goBack()} fullWidth/>
              </View>
            </ScrollView>
          </SafeAreaView>
        );
    }

    const renderStepContent = () => {
        switch (step) {
            case 'details':
                return (<View style={styles.stepContent}>
            <SafeText variant="h3" style={styles.stepTitle}>{localizedUiText.m_emergency_details}</SafeText>
            <SafeText variant="body" style={styles.stepSubtitle}>{localizedUiText.m_enter_emergency_info}</SafeText>
            <View style={styles.formFields}>
              <AppSelectField label={localizedUiText.m_emergency_type} value={emergencyType} onChange={setEmergencyType} options={EMERGENCY_TYPES} required/>
              {emergencyDescription.trim().length > 0 && emergencyDescription.trim().length < 10 ? (
                <AppTextArea label={localizedUiText.m_description} value={emergencyDescription} onChangeText={setEmergencyDescription} placeholder={localizedUiText.m_enter_description} required error={localizedUiText.m_min_10_chars}/>
              ) : (
                <AppTextArea label={localizedUiText.m_description} value={emergencyDescription} onChangeText={setEmergencyDescription} placeholder={localizedUiText.m_enter_description} required/>
              )}
              {visitorName.trim().length === 0 ? (
                <FormField label={localizedUiText.m_visitor_name} value={visitorName} onChangeText={setVisitorName} placeholder={localizedUiText.m_enter_name} required error={localizedUiText.m_required}/>
              ) : (
                <FormField label={localizedUiText.m_visitor_name} value={visitorName} onChangeText={setVisitorName} placeholder={localizedUiText.m_enter_name} required/>
              )}
              <FormField label={localizedUiText.m_phone_number} value={visitorPhone} onChangeText={setVisitorPhone} placeholder={localizedUiText.m_enter_phone} keyboardType="phone-pad"/>
              {flatNumber.trim().length === 0 ? (
                <FormField label={localizedUiText.m_flat_number} value={flatNumber} onChangeText={setFlatNumber} placeholder={localizedUiText.m_enter_flat} required error={localizedUiText.m_required}/>
              ) : (
                <FormField label={localizedUiText.m_flat_number} value={flatNumber} onChangeText={setFlatNumber} placeholder={localizedUiText.m_enter_flat} required/>
              )}
            </View>
          </View>);
            case 'vehicle':
                return (<View style={styles.stepContent}>
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
          </View>);
            case 'confirm':
                return (<View style={styles.stepContent}>
            <SafeText variant="h3" style={styles.stepTitle}>{localizedUiText.m_review_and_confirm}</SafeText>
            <SafeText variant="body" style={styles.stepSubtitle}>{localizedUiText.m_verify_emergency_info}</SafeText>
            <View style={styles.confirmCard}>
              <View style={styles.confirmRow}>
                <SafeText variant="caption" style={styles.confirmLabel}>{localizedUiText.m_emergency_type}</SafeText>
                <SafeText variant="body" style={styles.confirmValue}>
                  {EMERGENCY_TYPES.find(t => t.value === emergencyType)?.label || emergencyType}
                </SafeText>
              </View>
              <View style={styles.confirmRow}>
                <SafeText variant="caption" style={styles.confirmLabel}>{localizedUiText.m_description}</SafeText>
                <SafeText variant="body" style={styles.confirmValue}>{emergencyDescription}</SafeText>
              </View>
              <View style={styles.confirmRow}>
                <SafeText variant="caption" style={styles.confirmLabel}>{localizedUiText.m_visitor_name}</SafeText>
                <SafeText variant="body" style={styles.confirmValue}>{visitorName}</SafeText>
              </View>
              <View style={styles.confirmRow}>
                <SafeText variant="caption" style={styles.confirmLabel}>{localizedUiText.m_flat}</SafeText>
                <SafeText variant="body" style={styles.confirmValue}>{flatNumber}</SafeText>
              </View>
              {vehicleRegistration && (<View style={styles.confirmRow}>
                  <SafeText variant="caption" style={styles.confirmLabel}>{localizedUiText.m_vehicle}</SafeText>
                  <SafeText variant="body" style={styles.confirmValue}>{vehicleRegistration} ({vehicleType})</SafeText>
                </View>)}
            </View>
          </View>);
            default:
                return null;
        }
    };

    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <ResidentPageHeader title={localizedUiText.m_emergency_bypass} showBackButton onBackPress={handleBack}/>

      <View style={styles.progressContainer}>
        {steps.map((s, i) => (<View key={s} style={styles.progressStep}>
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
              {['Details', 'Vehicle', 'Confirm'][i]}
            </SafeText>
            {i < 2 && (<View style={[
                    styles.progressLine,
                    i < currentStepIndex && styles.progressLineCompleted,
                ]}/>)}
          </View>))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>

      <View style={styles.footer}>
        {step !== 'confirm' && (<AppButton title={currentStepIndex === 1 ? localizedUiText.m_create_bypass : localizedUiText.m_next} variant="primary" onPress={handleNext} disabled={!canGoNext() || isSubmitting} fullWidth/>)}
        {step === 'confirm' && (<AppButton title={localizedUiText.m_create_emergency_bypass} variant="danger" onPress={handleSubmit} disabled={isSubmitting} loading={isSubmitting} fullWidth/>)}
        {step !== 'details' && (<AppButton title={localizedUiText.m_back} variant="outline" onPress={handleBack} fullWidth style={styles.backButton}/>)}
      </View>
    </SafeAreaView>);
}
