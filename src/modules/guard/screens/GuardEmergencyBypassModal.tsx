import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../../shared/constants/colors';
import { visitorLifecycleStore } from '../../resident/visitors/data/visitorLifecycle.store';
interface GuardEmergencyBypassModalProps {
    visible: boolean;
    onClose: () => void;
    gateName?: string;
    operatorName?: string;
    onSuccess?: () => void;
}
const EMERGENCY_TYPES = [
    { id: 'MEDICAL', label: 'Ambulance / Medical', icon: 'medkit' },
    { id: 'FIRE', label: 'Fire Brigade', icon: 'flame' },
    { id: 'POLICE', label: 'Police / Law Enforcement', icon: 'shield' },
    { id: 'MAINTENANCE', label: 'Emergency Gas / Electrical', icon: 'flash' },
    { id: 'OTHER', label: 'Other Urgent Bypass', icon: 'alert-circle' },
];
export function GuardEmergencyBypassModal({ visible, onClose, gateName = 'Gate 01', operatorName = 'Ramesh Shinde (GRD-102)', onSuccess, }: GuardEmergencyBypassModalProps) {
    const [selectedType, setSelectedType] = useState('MEDICAL');
    const [reason, setReason] = useState('Medical emergency / Ambulance for Tower A');
    const [targetUnit, setTargetUnit] = useState('A-1204');
    const [vehicleNumber, setVehicleNumber] = useState('MH 12 EM 108');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completedEvent, setCompletedEvent] = useState<any>(null);
    const handleAllowEmergencyAccess = () => {
        if (!reason.trim())
            return;
        setIsSubmitting(true);
        const event = visitorLifecycleStore.emergencyBypass({
            emergencyType: selectedType,
            reason: reason.trim(),
            gateName,
            operatorName,
            targetUnit: targetUnit.trim() || undefined,
            vehicleNumber: vehicleNumber.trim() || undefined,
        });
        setIsSubmitting(false);
        setCompletedEvent(event);
        if (onSuccess)
            onSuccess();
    };
    const handleDone = () => {
        setCompletedEvent(null);
        onClose();
    };
    return (<Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardAvoid}>
          <View style={styles.sheetContainer}>
            
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.emergencyPill}>
                  <Ionicons name="warning" size={14} color="#FFF"/>
                  <Text style={styles.emergencyPillText}>EMERGENCY ACCESS</Text>
                </View>
                <Text style={styles.title}>Emergency Gate Bypass</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <Ionicons name="close" size={22} color={Colors.textMuted}/>
              </TouchableOpacity>
            </View>

            {completedEvent ? (<View style={styles.confirmationBody}>
                <View style={styles.successIconBadge}>
                  <Ionicons name="shield-checkmark" size={40} color="#059669"/>
                </View>

                <Text style={styles.successTitle}>Emergency Access Granted</Text>
                <Text style={styles.successSubtitle}>
                  Authoritative incident event logged. Committee and security control desk notified.
                </Text>

                <View style={styles.auditCard}>
                  <View style={styles.auditRow}>
                    <Text style={styles.auditLabel}>INCIDENT ID</Text>
                    <Text style={styles.auditValueBold}>{completedEvent.id}</Text>
                  </View>
                  <View style={styles.auditRow}>
                    <Text style={styles.auditLabel}>TYPE</Text>
                    <Text style={styles.auditValue}>{completedEvent.emergencyType}</Text>
                  </View>
                  <View style={styles.auditRow}>
                    <Text style={styles.auditLabel}>GATE & TIME</Text>
                    <Text style={styles.auditValue}>
                      {completedEvent.gateName} · {completedEvent.timestamp}
                    </Text>
                  </View>
                  <View style={styles.auditRow}>
                    <Text style={styles.auditLabel}>OPERATOR</Text>
                    <Text style={styles.auditValue}>{completedEvent.operatorName}</Text>
                  </View>
                  {completedEvent.targetUnit ? (<View style={styles.auditRow}>
                      <Text style={styles.auditLabel}>DESTINATION</Text>
                      <Text style={styles.auditValue}>{completedEvent.targetUnit}</Text>
                    </View>) : null}
                  {completedEvent.vehicleNumber ? (<View style={styles.auditRow}>
                      <Text style={styles.auditLabel}>VEHICLE</Text>
                      <Text style={styles.auditValue}>{completedEvent.vehicleNumber}</Text>
                    </View>) : null}
                  <View style={[styles.auditRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.auditLabel}>REASON</Text>
                    <Text style={[styles.auditValue, { flex: 1, textAlign: 'right' }]}>
                      {completedEvent.reason}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.doneButton} onPress={handleDone} activeOpacity={0.88}>
                  <Text style={styles.doneButtonText}>Return to Gate Home</Text>
                </TouchableOpacity>
              </View>) : (<ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.policyCallout}>
                  <Ionicons name="information-circle-outline" size={18} color="#B91C1C"/>
                  <Text style={styles.policyText}>
                    Emergency access immediately unlocks the barrier and bypasses standard resident pre-approval.
                    All inputs are bound to your guard operator credentials for audit compliance.
                  </Text>
                </View>

                
                <Text style={styles.inputLabel}>SELECT EMERGENCY SERVICE</Text>
                <View style={styles.typesGrid}>
                  {EMERGENCY_TYPES.map((t) => {
                const isSelected = selectedType === t.id;
                return (<TouchableOpacity key={t.id} style={[styles.typeButton, isSelected && styles.typeButtonSelected]} onPress={() => setSelectedType(t.id)} activeOpacity={0.8}>
                        <Ionicons name={t.icon as any} size={18} color={isSelected ? '#FFF' : '#10201D'}/>
                        <Text style={[
                        styles.typeButtonText,
                        isSelected && styles.typeButtonTextSelected,
                    ]}>
                          {t.label}
                        </Text>
                      </TouchableOpacity>);
            })}
                </View>

                
                <Text style={styles.inputLabel}>REASON & DETAILS *</Text>
                <TextInput value={reason} onChangeText={setReason} placeholder="e.g. Ambulance attending cardiac patient in Tower A" placeholderTextColor={Colors.textMuted} multiline numberOfLines={2} style={styles.textInputArea}/>

                
                <View style={styles.twoColumnRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.inputLabel}>DESTINATION UNIT</Text>
                    <TextInput value={targetUnit} onChangeText={setTargetUnit} placeholder="e.g. A-1204" placeholderTextColor={Colors.textMuted} style={styles.textInput}/>
                  </View>

                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.inputLabel}>VEHICLE NO.</Text>
                    <TextInput value={vehicleNumber} onChangeText={setVehicleNumber} placeholder="e.g. MH 12 EM 108" placeholderTextColor={Colors.textMuted} autoCapitalize="characters" style={styles.textInput}/>
                  </View>
                </View>

                
                <View style={styles.metaBox}>
                  <Text style={styles.metaText}>
                    Logging Gate: <Text style={styles.metaBold}>{gateName}</Text>
                  </Text>
                  <Text style={styles.metaText}>
                    Authorized Operator: <Text style={styles.metaBold}>{operatorName}</Text>
                  </Text>
                </View>

                
                <TouchableOpacity testID="allow-emergency-access-btn" style={[
                styles.primaryEmergencyButton,
                (!reason.trim() || isSubmitting) && styles.primaryButtonDisabled,
            ]} onPress={handleAllowEmergencyAccess} disabled={!reason.trim() || isSubmitting} activeOpacity={0.88}>
                  <Ionicons name="flash" size={20} color="#FFF" style={{ marginRight: 8 }}/>
                  <Text style={styles.primaryEmergencyButtonText}>
                    {isSubmitting ? 'Recording Bypass…' : 'ALLOW EMERGENCY ACCESS →'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.7}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </ScrollView>)}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>);
}
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(16, 32, 29, 0.72)',
        justifyContent: 'flex-end',
    },
    keyboardAvoid: {
        width: '100%',
    },
    sheetContainer: {
        backgroundColor: '#FAF8F1',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        paddingBottom: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#E6E2D8',
    },
    headerLeft: {
        flex: 1,
    },
    emergencyPill: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#DC2626',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        marginBottom: 6,
        gap: 4,
    },
    emergencyPillText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.6,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#10201D',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    },
    closeButton: {
        padding: 4,
    },
    scrollArea: {
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingTop: 16,
        paddingBottom: 20,
    },
    policyCallout: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#F87171',
        borderRadius: 12,
        padding: 12,
        gap: 10,
        marginBottom: 16,
    },
    policyText: {
        flex: 1,
        fontSize: 13,
        color: '#991B1B',
        lineHeight: 18,
    },
    inputLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#69716D',
        letterSpacing: 0.8,
        marginBottom: 8,
        marginTop: 10,
    },
    typesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    typeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D4CFC4',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
    },
    typeButtonSelected: {
        backgroundColor: '#DC2626',
        borderColor: '#DC2626',
    },
    typeButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#10201D',
    },
    typeButtonTextSelected: {
        color: '#FFFFFF',
    },
    textInputArea: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D4CFC4',
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        color: '#10201D',
        textAlignVertical: 'top',
    },
    twoColumnRow: {
        flexDirection: 'row',
        marginTop: 4,
    },
    textInput: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D4CFC4',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: '#10201D',
    },
    metaBox: {
        backgroundColor: '#EDE8DE',
        borderRadius: 10,
        padding: 12,
        marginVertical: 16,
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#69716D',
    },
    metaBold: {
        color: '#10201D',
        fontWeight: '600',
    },
    primaryEmergencyButton: {
        backgroundColor: '#DC2626',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        paddingVertical: 15,
        shadowColor: '#DC2626',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        marginTop: 4,
    },
    primaryButtonDisabled: {
        backgroundColor: '#9CA3AF',
        shadowOpacity: 0,
    },
    primaryEmergencyButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    cancelButton: {
        alignItems: 'center',
        paddingVertical: 14,
        marginTop: 6,
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#69716D',
    },
    confirmationBody: {
        padding: 24,
        alignItems: 'center',
    },
    successIconBadge: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    successTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#10201D',
        marginBottom: 8,
    },
    successSubtitle: {
        fontSize: 13,
        color: '#69716D',
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 20,
    },
    auditCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E6E2D8',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 24,
    },
    auditRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3EFE6',
    },
    auditLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#69716D',
        letterSpacing: 0.6,
    },
    auditValue: {
        fontSize: 13,
        color: '#10201D',
    },
    auditValueBold: {
        fontSize: 13,
        fontWeight: '700',
        color: '#064F45',
    },
    doneButton: {
        width: '100%',
        backgroundColor: '#064F45',
        borderRadius: 14,
        paddingVertical: 15,
        alignItems: 'center',
    },
    doneButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
});

