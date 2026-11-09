import React, { useState } from "react";
import { Text, View, ScrollView, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { AppButton } from "../../../shared/components/AppButton";
import { AppCard } from "../../../shared/cards/AppCard";
import { visitorLifecycleStore } from "../../resident/visitors/data/visitorLifecycle.store";
import { styles } from "../styles/screens/DeliveryEntryScreen.styles";

const PARTNERS = ['Swiggy', 'Zomato', 'Amazon', 'Blinkit', 'Flipkart', 'Blue Dart', 'Courier', 'Other'] as const;

export function DeliveryEntryScreen({ navigation }: { navigation: { goBack: () => void; popToTop: () => void } }) {
    const [partner, setPartner] = useState<string>('Amazon');
    const [personName, setPersonName] = useState('');
    const [phone, setPhone] = useState('');
    const [flatNumber, setFlatNumber] = useState('A-1204');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [mode, setMode] = useState<'GATE_CUSTODY' | 'ALLOW_ENTRY'>('GATE_CUSTODY');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submittedData, setSubmittedData] = useState<{
        success: boolean;
        title: string;
        subtitle: string;
        code?: string;
    } | null>(null);

    const handleSubmit = () => {
        const nextErrors: Record<string, string> = {};
        if (!flatNumber.trim()) nextErrors.flatNumber = 'Destination flat number is required';
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }
        setErrors({});

        if (mode === 'GATE_CUSTODY') {
            const parcel = visitorLifecycleStore.receiveParcel({
                flatNumber: flatNumber.trim(),
                recipientName: 'Resident',
                deliveryPartner: partner,
                trackingNumber: trackingNumber.trim() || undefined,
                guardName: 'Gate Desk Guard',
                gateName: 'Gate 01',
            });
            setSubmittedData({
                success: true,
                title: 'Parcel Received at Security Desk',
                subtitle: `Stored at Gate 01 for unit ${flatNumber.trim()}. Resident has been notified.`,
                code: parcel.id.toUpperCase(),
            });
        } else {
            const pass = visitorLifecycleStore.createPass({
                name: personName.trim() || `${partner} Delivery`,
                phone: phone.trim() || '9876543210',
                type: 'DELIVERY' as any,
                purpose: `${partner} Delivery to door`,
                expectedDate: new Date().toISOString().split('T')[0] || 'Today',
                expectedTimeFrom: 'Now',
                expectedTimeTo: new Date(Date.now() + 45 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                durationHours: 1,
                isRecurring: false,
                hasVehicle: false,
                flatNumber: flatNumber.trim(),
                tower: `Tower ${flatNumber.trim()[0] || 'A'}`,
            });
            visitorLifecycleStore.allowEntry(pass.id, {
                gateName: 'Gate 01',
                guardName: 'Gate 01 Guard',
            });
            setSubmittedData({
                success: true,
                title: 'Delivery Partner Admitted',
                subtitle: `${personName.trim() || partner} is authorized to proceed to ${flatNumber.trim()}. Active in campus occupancy.`,
                code: pass.passCode,
            });
        }
    };

    if (submittedData) {
        return (
            <ScreenContainer>
                <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
                    <ResponsivePageHeader title="Delivery Confirmed" onBack={() => navigation.goBack()} />
                    <ScrollView contentContainerStyle={styles.content}>
                        <AppCard style={styles.successCard}>
                            <Ionicons name="checkmark-circle" size={64} color="#064F45" />
                            <Text style={styles.successTitle}>{submittedData.title}</Text>
                            <Text style={styles.successSubtitle}>{submittedData.subtitle}</Text>
                            {submittedData.code ? (
                                <View style={styles.codeBox}>
                                    <Text style={styles.codeText}>{submittedData.code}</Text>
                                </View>
                            ) : null}
                            <AppButton
                                title="Back to Command Center"
                                onPress={() => navigation.popToTop()}
                                style={styles.doneBtn}
                            />
                        </AppCard>
                    </ScrollView>
                </SafeAreaView>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
                <ResponsivePageHeader title="Delivery Operations" onBack={() => navigation.goBack()} />
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    <Text style={styles.title}>Record Delivery Entry</Text>
                    <Text style={styles.desc}>Log parcels held at the security desk or authorize delivery partner campus entry.</Text>

                    <AppCard style={styles.formCard}>
                        <Text style={styles.sectionTitle}>Delivery Service</Text>
                        <View style={styles.partnerRow}>
                            {PARTNERS.map((p) => {
                                const active = partner === p;
                                return (
                                    <Pressable
                                        key={p}
                                        style={[styles.partnerChip, active && styles.partnerChipActive]}
                                        onPress={() => setPartner(p)}
                                    >
                                        <Text style={[styles.partnerText, active && styles.partnerTextActive]}>{p}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        <Text style={styles.sectionTitle}>Handoff Workflow</Text>
                        <View style={styles.modeRow}>
                            <Pressable
                                style={[styles.modeBtn, mode === 'GATE_CUSTODY' && styles.modeBtnActive]}
                                onPress={() => setMode('GATE_CUSTODY')}
                            >
                                <Text style={[styles.modeTitle, mode === 'GATE_CUSTODY' && styles.modeTitleActive]}>Hold at Security</Text>
                                <Text style={styles.modeSub}>Parcel custody desk pickup</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.modeBtn, mode === 'ALLOW_ENTRY' && styles.modeBtnActive]}
                                onPress={() => setMode('ALLOW_ENTRY')}
                            >
                                <Text style={[styles.modeTitle, mode === 'ALLOW_ENTRY' && styles.modeTitleActive]}>Allow Campus Entry</Text>
                                <Text style={styles.modeSub}>Delivery person goes to flat</Text>
                            </Pressable>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Destination Flat / Unit *</Text>
                            <TextInput
                                style={[styles.input, errors.flatNumber ? styles.inputError : undefined]}
                                value={flatNumber}
                                onChangeText={(t) => {
                                    setFlatNumber(t);
                                    if (errors.flatNumber) setErrors({});
                                }}
                                placeholder="e.g. A-1204"
                                placeholderTextColor="#9CA3AF"
                            />
                            {errors.flatNumber ? <Text style={styles.errorText}>{errors.flatNumber}</Text> : null}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Delivery Agent Name (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                value={personName}
                                onChangeText={setPersonName}
                                placeholder="e.g. Suresh Kumar"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Parcel / Order Reference (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                value={trackingNumber}
                                onChangeText={setTrackingNumber}
                                placeholder="e.g. AMZ-40291"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        <AppButton
                            title={mode === 'GATE_CUSTODY' ? "Log Parcel at Gate Desk" : "Authorize Delivery Entry"}
                            onPress={handleSubmit}
                            style={styles.submitBtn}
                        />
                    </AppCard>
                </ScrollView>
            </SafeAreaView>
        </ScreenContainer>
    );
}
