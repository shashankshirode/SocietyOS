import React, { useState } from "react";
import { Text, View, ScrollView, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { AppButton } from "../../../shared/components/AppButton";
import { AppCard } from "../../../shared/cards/AppCard";
import { visitorLifecycleStore } from "../../resident/visitors/data/visitorLifecycle.store";
import { styles } from "../styles/screens/CabEntryScreen.styles";

const PROVIDERS = ['Uber', 'Ola', 'Rapido', 'Auto', 'City Taxi', 'Private Cab'] as const;

export function CabEntryScreen({ navigation }: { navigation: { goBack: () => void; popToTop: () => void } }) {
    const [provider, setProvider] = useState<string>('Uber');
    const [registration, setRegistration] = useState('');
    const [driverName, setDriverName] = useState('');
    const [flatNumber, setFlatNumber] = useState('A-1204');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState<boolean>(false);

    const handleSubmit = () => {
        const nextErrors: Record<string, string> = {};
        if (!registration.trim()) nextErrors.registration = 'Vehicle registration number is required';
        if (!flatNumber.trim()) nextErrors.flatNumber = 'Destination flat number is required';
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }
        setErrors({});

        visitorLifecycleStore.recordCabEntry({
            cabRegistration: registration.trim().toUpperCase(),
            driverName: driverName.trim() || `${provider} Driver`,
            flatNumber: flatNumber.trim(),
            guardName: 'Gate 01 Guard',
            gateName: 'Gate 01',
        });

        setSubmitted(true);
    };

    if (submitted) {
        return (
            <ScreenContainer>
                <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
                    <ResponsivePageHeader title="Cab Entry Recorded" onBack={() => navigation.goBack()} />
                    <ScrollView contentContainerStyle={styles.content}>
                        <AppCard style={styles.successCard}>
                            <Ionicons name="checkmark-circle" size={64} color="#064F45" />
                            <Text style={styles.successTitle}>Cab Admitted (20 Min Window)</Text>
                            <Text style={styles.successSubtitle}>
                                {provider} ({registration.toUpperCase()}) admitted to {flatNumber.trim()}. Active in campus occupancy.
                            </Text>
                            <View style={styles.badgeBox}>
                                <Text style={styles.badgeText}>GATE 01 · 20 MIN PASS</Text>
                            </View>
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
                <ResponsivePageHeader title="Cab Operations" onBack={() => navigation.goBack()} />
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    <Text style={styles.title}>Fast Cab Entry</Text>
                    <Text style={styles.desc}>Record drop-off and pickup cabs with automatic 20-minute campus access window.</Text>

                    <AppCard style={styles.formCard}>
                        <Text style={styles.sectionTitle}>Cab Provider / Service</Text>
                        <View style={styles.providerRow}>
                            {PROVIDERS.map((p) => {
                                const active = provider === p;
                                return (
                                    <Pressable
                                        key={p}
                                        style={[styles.providerChip, active && styles.providerChipActive]}
                                        onPress={() => setProvider(p)}
                                    >
                                        <Text style={[styles.providerText, active && styles.providerTextActive]}>{p}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Vehicle Number (e.g. MH 12 AB 1234) *</Text>
                            <TextInput
                                style={[styles.input, errors.registration ? styles.inputError : undefined]}
                                value={registration}
                                onChangeText={(t) => {
                                    setRegistration(t);
                                    if (errors.registration) setErrors({});
                                }}
                                placeholder="MH 12 AB 1234"
                                autoCapitalize="characters"
                                placeholderTextColor="#9CA3AF"
                            />
                            {errors.registration ? <Text style={styles.errorText}>{errors.registration}</Text> : null}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Destination Unit / Flat *</Text>
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
                            <Text style={styles.label}>Driver Name (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                value={driverName}
                                onChangeText={setDriverName}
                                placeholder="Driver name"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        <AppButton
                            title="Admit Cab to Campus"
                            onPress={handleSubmit}
                            style={styles.submitBtn}
                        />
                    </AppCard>
                </ScrollView>
            </SafeAreaView>
        </ScreenContainer>
    );
}
