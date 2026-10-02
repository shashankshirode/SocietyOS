import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput, ActivityIndicator, Alert, } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { FONT_FAMILY_INTER, FONT_FAMILY_INTER_MEDIUM, FONT_FAMILY_INTER_BOLD, FONT_FAMILY_SERIF, } from '../../../shared/theme/typography';
import { visitorPassService } from '../services/visitorPassService';
import { visitorApprovalService } from '../services/visitorApprovalService';
import { useAuth } from '../../../core/auth/AuthProvider';
import { useSociety } from '../../../core/auth/SocietyProvider';
interface GuardWalkInModalProps {
    visible: boolean;
    onClose: () => void;
    onEntryAdmitted: (visitorName: string, flatNumber: string) => void;
}
export function GuardWalkInModal({ visible, onClose, onEntryAdmitted, }: GuardWalkInModalProps) {
    const { user } = useAuth();
    const { currentSociety } = useSociety();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [purpose, setPurpose] = useState('');
    const [flatNumber, setFlatNumber] = useState('A-1204');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [visitorType, setVisitorType] = useState<'GUEST' | 'DELIVERY' | 'CAB' | 'VENDOR' | 'SERVICE_PROVIDER' | 'DOMESTIC_HELP' | 'STAFF' | 'COURIER' | 'MATERIAL_MOVEMENT' | 'EMERGENCY' | 'OTHER'>('GUEST');
    const [state, setState] = useState<'FORM' | 'WAITING' | 'APPROVED' | 'UNREACHABLE'>('FORM');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleRequestApproval = async () => {
        if (!name.trim() || !flatNumber.trim() || !currentSociety || !user)
            return;
        setState('WAITING');
        setIsSubmitting(true);
        try {
            const approvalRequest = await visitorApprovalService.createApprovalRequest(`walkin-${Date.now()}`, name.trim(), phone.trim() || '+91 98999 00000', visitorType, flatNumber.trim(), 'unit-id', 'Gate 01', 'Gate 01', user.id, user.name || 'Guard', 'WALK_IN', currentSociety.id, 10, false, false, false);
            setTimeout(async () => {
                const updatedRequest = await visitorApprovalService.getApprovalRequest(approvalRequest.id);
                if (updatedRequest?.status === 'APPROVED') {
                    const now = new Date().toISOString();
                    const visitor = await visitorPassService.createVisitorPass({
                        name: name.trim(),
                        phone: phone.trim() || '+91 98999 00000',
                        type: visitorType,
                        expectedDate: new Date().toISOString().split('T')[0],
                        expectedTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
                        expectedEntryAtIso: now,
                        expectedExitAtIso: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
                        purpose: purpose.trim() || 'Walk-in Visit',
                        flatNumber: flatNumber.trim(),
                        visitorCategory: visitorType.toLowerCase() as any,
                        vehicleNumber: vehicleNumber.trim().toUpperCase() || undefined,
                        validityWindowMinutes: 120,
                        validityStartAtIso: now,
                        validityEndAtIso: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
                    }, user.id, currentSociety.id);
                    await visitorPassService.checkInVisitor(visitor.id, 'Gate 01', 'Gate 01', 'MANUAL', 'GUARD', user.id, user.name || 'Guard', currentSociety.id, vehicleNumber.trim().toUpperCase() || undefined);
                    setState('APPROVED');
                }
                else if (updatedRequest?.status === 'DENIED') {
                    setState('UNREACHABLE');
                }
                else {
                    setState('UNREACHABLE');
                }
            }, 2000);
        }
        catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to request approval');
            setState('FORM');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleSimulateUnreachable = () => {
        setState('UNREACHABLE');
    };
    const handleFinish = () => {
        onEntryAdmitted(name || 'Walk-in Visitor', flatNumber || 'A-1204');
        setState('FORM');
        setName('');
        setPhone('');
        setPurpose('');
        setVehicleNumber('');
        setVisitorType('GUEST');
        setFlatNumber('A-1204');
        onClose();
    };
    if (!visible)
        return null;
    return (<Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.pill}/>

          
          {state === 'FORM' && (<View style={styles.contentWrap}>
              <Text style={styles.title}>Walk-in Visitor Registration</Text>
              <Text style={styles.sub}>
                Record unannounced visitor details and request instant resident approval.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Visitor Type *</Text>
                <View style={styles.typeSelector}>
                  {(['GUEST', 'DELIVERY', 'CAB', 'VENDOR', 'SERVICE_PROVIDER', 'DOMESTIC_HELP', 'STAFF', 'COURIER', 'MATERIAL_MOVEMENT', 'EMERGENCY', 'OTHER'] as const).map((type) => (<Pressable key={type} style={[
                    styles.typeChip,
                    visitorType === type && styles.typeChipSelected,
                ]} onPress={() => setVisitorType(type)}>
                      <Text style={[
                    styles.typeChipText,
                    visitorType === type && styles.typeChipTextSelected,
                ]}>
                        {type}
                      </Text>
                    </Pressable>))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Visitor Full Name *</Text>
                <TextInput style={styles.input} placeholder="e.g. Anand Deshpande" placeholderTextColor="#9CA3AF" value={name} onChangeText={setName} testID="walkin-name-input"/>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mobile Number</Text>
                <TextInput style={styles.input} placeholder="e.g. 98200 99887" placeholderTextColor="#9CA3AF" keyboardType="phone-pad" value={phone} onChangeText={setPhone} testID="walkin-phone-input"/>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Destination Unit *</Text>
                <TextInput style={styles.input} placeholder="e.g. A-1204" placeholderTextColor="#9CA3AF" value={flatNumber} onChangeText={setFlatNumber} testID="walkin-flat-input"/>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Purpose / Notes</Text>
                <TextInput style={styles.input} placeholder="e.g. Document delivery, courier" placeholderTextColor="#9CA3AF" value={purpose} onChangeText={setPurpose}/>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Vehicle Number (optional)</Text>
                <TextInput style={styles.input} placeholder="e.g. MH 12 CD 3344" placeholderTextColor="#9CA3AF" value={vehicleNumber} onChangeText={setVehicleNumber} autoCapitalize="characters"/>
              </View>

              <View style={styles.buttonRow}>
                <Pressable style={styles.cancelBtn} onPress={onClose}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </Pressable>

                <Pressable style={[styles.submitBtn, !name.trim() && styles.btnDisabled, isSubmitting && styles.btnDisabled]} disabled={!name.trim() || isSubmitting} onPress={handleRequestApproval} testID="request-walkin-approval-btn">
                  <Text style={styles.submitBtnText}>
                    {isSubmitting ? 'Requesting...' : 'Request Approval →'}
                  </Text>
                </Pressable>
              </View>
            </View>)}

          
          {state === 'WAITING' && (<View style={styles.centerWrap}>
              <ActivityIndicator size="large" color="#064F45" style={{ marginBottom: 16 }}/>
              <Text style={styles.statusHeading}>Waiting for Resident Approval</Text>
              <Text style={styles.statusSub}>
                Sent gate arrival notification to unit {flatNumber}. Awaiting resident response...
              </Text>

              <Pressable style={styles.unreachableBtn} onPress={() => setState('UNREACHABLE')}>
                <Text style={styles.unreachableBtnText}>Resident not answering?</Text>
              </Pressable>
            </View>)}

          
          {state === 'APPROVED' && (<View style={styles.centerWrap}>
              <View style={styles.greenCheck}>
                <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                  <Path d="M20 6L9 17l-5-5" stroke="#064F45" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
                </Svg>
              </View>
              <Text style={styles.statusHeading}>Entry Approved by Resident</Text>
              <Text style={styles.statusSub}>
                {name} is permitted to enter unit {flatNumber}. Gate entry has been recorded.
              </Text>

              <Pressable style={styles.finishBtn} onPress={handleFinish} testID="walkin-finish-btn">
                <Text style={styles.finishBtnText}>Done</Text>
              </Pressable>
            </View>)}

          
          {state === 'UNREACHABLE' && (<View style={styles.centerWrap}>
              <View style={styles.warningCircle}>
                <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
                  <Path d="M12 9v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="#DC2626" strokeWidth={2} strokeLinecap="round"/>
                </Svg>
              </View>
              <Text style={styles.statusHeading}>Resident hasn't responded</Text>
              <Text style={styles.statusSub}>
                Security policy prohibits automatic entry without verified approval. Please follow society exception policy or contact security supervisor.
              </Text>

              <Pressable style={styles.finishBtn} onPress={onClose}>
                <Text style={styles.finishBtnText}>Back to Gate Home</Text>
              </Pressable>
            </View>)}
        </View>
      </View>
    </Modal>);
}
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(16, 32, 29, 0.65)',
        justifyContent: 'flex-end',
    },
    sheetContainer: {
        backgroundColor: '#FAF8F1',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 22,
        paddingTop: 12,
        paddingBottom: 36,
        maxHeight: '90%',
    },
    pill: {
        width: 44,
        height: 4,
        backgroundColor: '#D1D5DB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    contentWrap: {
        gap: 12,
    },
    title: {
        fontFamily: FONT_FAMILY_SERIF,
        fontSize: 22,
        fontWeight: '700',
        color: '#10201D',
    },
    sub: {
        fontFamily: FONT_FAMILY_INTER,
        fontSize: 13,
        color: '#69716D',
        lineHeight: 18,
        marginBottom: 4,
    },
    inputGroup: {
        gap: 4,
    },
    label: {
        fontFamily: FONT_FAMILY_INTER_MEDIUM,
        fontSize: 12.5,
        color: '#10201D',
    },
    input: {
        height: 44,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D8DDD9',
        paddingHorizontal: 14,
        fontFamily: FONT_FAMILY_INTER,
        fontSize: 14,
        color: '#10201D',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
    },
    cancelBtn: {
        flex: 1,
        height: 46,
        borderRadius: 23,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelBtnText: {
        fontFamily: FONT_FAMILY_INTER_MEDIUM,
        fontSize: 14,
        color: '#4B5563',
    },
    submitBtn: {
        flex: 1.6,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#064F45',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitBtnText: {
        fontFamily: FONT_FAMILY_INTER_BOLD,
        fontSize: 14,
        color: '#FAF8F1',
    },
    btnDisabled: {
        backgroundColor: '#9CA3AF',
    },
    centerWrap: {
        alignItems: 'center',
        paddingVertical: 32,
        gap: 10,
    },
    greenCheck: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E8F3EE',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    warningCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FEF2F2',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statusHeading: {
        fontFamily: FONT_FAMILY_SERIF,
        fontSize: 22,
        fontWeight: '700',
        color: '#10201D',
        textAlign: 'center',
    },
    statusSub: {
        fontFamily: FONT_FAMILY_INTER,
        fontSize: 13.5,
        color: '#69716D',
        textAlign: 'center',
        maxWidth: 280,
        lineHeight: 19,
    },
    unreachableBtn: {
        marginTop: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    unreachableBtnText: {
        fontFamily: FONT_FAMILY_INTER_MEDIUM,
        fontSize: 13,
        color: '#DC2626',
        textDecorationLine: 'underline',
    },
    finishBtn: {
        height: 48,
        backgroundColor: '#064F45',
        borderRadius: 24,
        paddingHorizontal: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    finishBtnText: {
        fontFamily: FONT_FAMILY_INTER_BOLD,
        fontSize: 14.5,
        color: '#FAF8F1',
    },
    typeSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 4,
    },
    typeChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
    },
    typeChipSelected: {
        borderColor: '#064F45',
        backgroundColor: '#E8F3EE',
    },
    typeChipText: {
        fontFamily: FONT_FAMILY_INTER_MEDIUM,
        fontSize: 12,
        color: '#4B5563',
    },
    typeChipTextSelected: {
        color: '#064F45',
        fontWeight: '700',
    },
});

