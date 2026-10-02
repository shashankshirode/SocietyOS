import { useState, useEffect } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { AppButton } from "../../../shared/components/AppButton";
import { AppCard } from "../../../shared/cards/AppCard";
import { FormField } from "../../../shared/forms/FormField";
import { AppSelect } from "../../../shared/forms/AppSelect";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { EmptyState } from "../../../shared/components/EmptyState";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
import { SocietyService } from "../services/societyService";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../app/navigation/navigation.types";

type Props = NativeStackScreenProps<SuperAdminStackParamList, 'PARKING_FOUNDATION'>;

const PARKING_TYPES = [
    { value: 'COVERED', label: 'Covered' },
    { value: 'OPEN', label: 'Open' },
    { value: 'BASEMENT', label: 'Basement' },
    { value: 'STILT', label: 'Stilt' },
    { value: 'PODIUM', label: 'Podium' },
];

const VEHICLE_TYPES = [
    { value: 'CAR', label: 'Car' },
    { value: 'BIKE', label: 'Two Wheeler' },
    { value: 'CYCLE', label: 'Cycle' },
    { value: 'EV', label: 'EV Charging' },
    { value: 'VISITOR', label: 'Visitor' },
];

export function ParkingFoundationScreen({ route, navigation }: Props) {
    const { societyId } = route.params;
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const [parkingAreas, setParkingAreas] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [name, setName] = useState('');
    const [type, setType] = useState('COVERED');
    const [totalSlots, setTotalSlots] = useState(0);
    const [vehicleTypes, setVehicleTypes] = useState<string[]>(['CAR']);
    const [hasEVCharging, setHasEVCharging] = useState(false);
    const [evSlots, setEvSlots] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (societyId) loadParkingAreas();
    }, [societyId]);

    const loadParkingAreas = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const society = await SocietyService.getSociety(societyId!);
            if (society) {
                setParkingAreas(society.parkingAreas || []);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load parking areas');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateArea = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Parking area name is required');
            return;
        }
        if (totalSlots <= 0) {
            Alert.alert('Error', 'Total slots must be greater than 0');
            return;
        }

        setIsSubmitting(true);
        try {
            const society = await SocietyService.getSociety(societyId!);
            if (!society) {
                throw new Error('Society not found');
            }
            const newArea = {
                id: `parking-${Date.now()}`,
                name,
                type,
                totalSlots,
                vehicleTypes,
                hasEVCharging,
                evSlots: hasEVCharging ? evSlots : 0,
                occupiedSlots: 0,
                createdAt: new Date().toISOString(),
            };
            const updatedAreas = [...(society.parkingAreas || []), newArea];
            await SocietyService.updateSociety({ id: societyId!, parkingAreas: updatedAreas });
            setParkingAreas(updatedAreas);
            setShowCreateForm(false);
            setName('');
            setTotalSlots(0);
            setVehicleTypes(['CAR']);
            setHasEVCharging(false);
            setEvSlots(0);
            Alert.alert('Success', 'Parking area created');
        } catch (err) {
            Alert.alert('Error', err instanceof Error ? err.message : 'Failed to create parking area');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteArea = async (areaId: string) => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this parking area? This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const society = await SocietyService.getSociety(societyId!);
                            if (!society) {
                                throw new Error('Society not found');
                            }
                            const updatedAreas = (society.parkingAreas || []).filter((a: any) => a.id !== areaId);
                            await SocietyService.updateSociety({ id: societyId!, parkingAreas: updatedAreas });
                            setParkingAreas(updatedAreas);
                            Alert.alert('Success', 'Parking area deleted');
                        } catch (err) {
                            Alert.alert('Error', err instanceof Error ? err.message : 'Failed to delete parking area');
                        }
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <ScreenContainer>
                <SafeAreaView style={{ flex: 1 }}>
                    <ResponsivePageHeader title={getActiveUiLiteral("m_97d04342608b")} onBack={() => navigation.goBack()}/>
                    <LoadingState message={getActiveUiLiteral("m_23b87850823d")} />
                </SafeAreaView>
            </ScreenContainer>
        );
    }

    if (error) {
        return (
            <ScreenContainer>
                <SafeAreaView style={{ flex: 1 }}>
                    <ResponsivePageHeader title={getActiveUiLiteral("m_97d04342608b")} onBack={() => navigation.goBack()}/>
                    <ErrorState message={error} onRetry={loadParkingAreas} />
                </SafeAreaView>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <SafeAreaView style={{ flex: 1 }}>
                <ResponsivePageHeader title={getActiveUiLiteral("m_97d04342608b")} subtitle={getActiveUiLiteral("m_8cc873d5ca4c")} onBack={() => navigation.goBack()}/>
                <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                    <AppCard style={{ marginBottom: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary }}>Parking Areas ({parkingAreas.length})</Text>
                            <AppButton title="Add Area" size="sm" onPress={() => { setShowCreateForm(true); setName(''); setTotalSlots(0); setVehicleTypes(['CAR']); setHasEVCharging(false); setEvSlots(0); }} />
                        </View>
                        {parkingAreas.length === 0 ? (
                            <EmptyState
                                title="No parking areas configured"
                                description="Create parking areas to define the parking infrastructure"
                                actionTitle="Create First Area"
                                onAction={() => { setShowCreateForm(true); setName(''); setTotalSlots(0); setVehicleTypes(['CAR']); setHasEVCharging(false); setEvSlots(0); }}
                            />
                        ) : (
                            parkingAreas.map((area) => (
                                <View key={area.id} style={{ marginBottom: 12, padding: 12, backgroundColor: colors.card, borderRadius: 8 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary }}>{area.name}</Text>
                                            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                                                <StatusBadge status={area.type} moduleType="parking" label={area.type} />
                                                <StatusBadge status={area.hasEVCharging ? 'EV_READY' : 'STANDARD'} moduleType="parking" label={area.hasEVCharging ? 'EV Ready' : 'Standard'} />
                                            </View>
                                            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
                                                {area.occupiedSlots} / {area.totalSlots} slots occupied
                                            </Text>
                                            <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                                                Vehicles: {area.vehicleTypes.join(', ')} {area.hasEVCharging ? ` | EV Slots: ${area.evSlots}` : ''}
                                            </Text>
                                        </View>
                                        <AppButton title="Delete" size="sm" variant="outline" onPress={() => handleDeleteArea(area.id)} style={{ borderColor: colors.danger }} />
                                    </View>
                                </View>
                            ))
                        )}
                    </AppCard>

                    {showCreateForm && (
                        <AppCard style={{ marginBottom: 16 }}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>Create Parking Area</Text>
                            <FormField label="Area Name" value={name} onChangeText={setName} placeholder="e.g., Basement Parking, Stilt Parking" />
                            <AppSelect
                                label="Type"
                                value={type}
                                onChange={setType}
                                options={PARKING_TYPES}
                            />
                            <FormField label="Total Slots" value={String(totalSlots)} onChangeText={(v) => setTotalSlots(parseInt(v, 10) || 0)} keyboardType="numeric" placeholder="Enter total number of slots" />
                            <View style={{ marginTop: 12 }}>
                                <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 8 }}>Vehicle Types</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                    {VEHICLE_TYPES.map((vt) => (
                                        <TouchableOpacity
                                            key={vt.value}
                                            onPress={() => {
                                                if (vehicleTypes.includes(vt.value)) {
                                                    setVehicleTypes(vehicleTypes.filter((v) => v !== vt.value));
                                                } else {
                                                    setVehicleTypes([...vehicleTypes, vt.value]);
                                                }
                                            }}
                                            style={{
                                                paddingHorizontal: 12,
                                                paddingVertical: 8,
                                                borderRadius: 6,
                                                borderWidth: 1,
                                                borderColor: vehicleTypes.includes(vt.value) ? colors.primary : colors.border,
                                                backgroundColor: vehicleTypes.includes(vt.value) ? `${colors.primary}15` : colors.background,
                                            }}
                                        >
                                            <Text style={{ color: vehicleTypes.includes(vt.value) ? colors.primary : colors.textPrimary }}>{vt.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <View style={{ marginTop: 12 }}>
                                <AppButton
                                    title={hasEVCharging ? 'Disable EV Charging' : 'Enable EV Charging'}
                                    variant="outline"
                                    onPress={() => setHasEVCharging(!hasEVCharging)}
                                />
                            </View>
                            {hasEVCharging && (
                                <FormField label="EV Charging Slots" value={String(evSlots)} onChangeText={(v) => setEvSlots(parseInt(v, 10) || 0)} keyboardType="numeric" placeholder="Number of EV charging slots" />
                            )}
                            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                                <AppButton title="Cancel" variant="outline" onPress={() => setShowCreateForm(false)} style={{ flex: 1 }} />
                                <AppButton title="Create Area" onPress={handleCreateArea} loading={isSubmitting} style={{ flex: 1 }} />
                            </View>
                        </AppCard>
                    )}

                    <AppCard>
                        <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                            • Parking areas define the physical parking infrastructure
                        </Text>
                        <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
                            • Slot allocation to residents is handled in the Parking Allocation module (later phase)
                        </Text>
                        <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
                            • EV charging slots are a subset of total slots
                        </Text>
                    </AppCard>
                </ScrollView>
            </SafeAreaView>
        </ScreenContainer>
    );
}

import { TouchableOpacity } from "react-native";