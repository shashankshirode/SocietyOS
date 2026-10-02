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

type Props = NativeStackScreenProps<SuperAdminStackParamList, 'FACILITY_FOUNDATION'>;

const FACILITY_TYPES = [
    { value: 'CLUBHOUSE', label: 'Clubhouse' },
    { value: 'GYM', label: 'Gym/Fitness Center' },
    { value: 'POOL', label: 'Swimming Pool' },
    { value: 'HALL', label: 'Banquet/Community Hall' },
    { value: 'SPORTS', label: 'Sports Facility (Tennis, Badminton, etc.)' },
    { value: 'PARK', label: 'Park/Green Area' },
    { value: 'PLAYGROUND', label: 'Children Playground' },
    { value: 'JOGGING', label: 'Jogging/Walking Track' },
    { value: 'LIBRARY', label: 'Library/Reading Room' },
    { value: 'GUEST_ROOM', label: 'Guest Rooms' },
    { value: 'OTHER', label: 'Other' },
];

const FACILITY_STATUS = [
    { value: 'PLANNED', label: 'Planned' },
    { value: 'UNDER_CONSTRUCTION', label: 'Under Construction' },
    { value: 'OPERATIONAL', label: 'Operational' },
    { value: 'MAINTENANCE', label: 'Under Maintenance' },
];

export function FacilityFoundationScreen({ route, navigation }: Props) {
    const { societyId } = route.params;
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const [facilities, setFacilities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [name, setName] = useState('');
    const [type, setType] = useState('CLUBHOUSE');
    const [status, setStatus] = useState('PLANNED');
    const [capacity, setCapacity] = useState(0);
    const [areaSqFt, setAreaSqFt] = useState(0);
    const [description, setDescription] = useState('');
    const [hasBooking, setHasBooking] = useState(true);
    const [hasDeposit, setHasDeposit] = useState(false);
    const [depositAmount, setDepositAmount] = useState(0);
    const [operatingHoursStart, setOperatingHoursStart] = useState('06:00');
    const [operatingHoursEnd, setOperatingHoursEnd] = useState('22:00');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (societyId) loadFacilities();
    }, [societyId]);

    const loadFacilities = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const society = await SocietyService.getSociety(societyId!);
            if (society) {
                setFacilities(society.facilities || []);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load facilities');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateFacility = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Facility name is required');
            return;
        }
        if (capacity <= 0) {
            Alert.alert('Error', 'Capacity must be greater than 0');
            return;
        }

        setIsSubmitting(true);
        try {
            const society = await SocietyService.getSociety(societyId!);
            const newFacility = {
                id: `facility-${Date.now()}`,
                name,
                type,
                status,
                capacity,
                areaSqFt,
                description,
                hasBooking,
                hasDeposit,
                depositAmount: hasDeposit ? depositAmount : 0,
                operatingHours: { start: operatingHoursStart, end: operatingHoursEnd },
                createdAt: new Date().toISOString(),
            };
            const updatedFacilities = [...(society.facilities || []), newFacility];
            await SocietyService.updateSociety({ id: societyId!, facilities: updatedFacilities });
            setFacilities(updatedFacilities);
            setShowCreateForm(false);
            resetForm();
            Alert.alert('Success', 'Facility created');
        } catch (err) {
            Alert.alert('Error', err instanceof Error ? err.message : 'Failed to create facility');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setName('');
        setType('CLUBHOUSE');
        setStatus('PLANNED');
        setCapacity(0);
        setAreaSqFt(0);
        setDescription('');
        setHasBooking(true);
        setHasDeposit(false);
        setDepositAmount(0);
        setOperatingHoursStart('06:00');
        setOperatingHoursEnd('22:00');
    };

    const handleDeleteFacility = async (facilityId: string) => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this facility? This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const society = await SocietyService.getSociety(societyId!);
                            const updatedFacilities = (society.facilities || []).filter((f: any) => f.id !== facilityId);
                            await SocietyService.updateSociety({ id: societyId!, facilities: updatedFacilities });
                            setFacilities(updatedFacilities);
                            Alert.alert('Success', 'Facility deleted');
                        } catch (err) {
                            Alert.alert('Error', err instanceof Error ? err.message : 'Failed to delete facility');
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
                    <ResponsivePageHeader title={getActiveUiLiteral("m_c881461497cd")} onBack={() => navigation.goBack()}/>
                    <LoadingState message={getActiveUiLiteral("m_23b87850823d")} />
                </SafeAreaView>
            </ScreenContainer>
        );
    }

    if (error) {
        return (
            <ScreenContainer>
                <SafeAreaView style={{ flex: 1 }}>
                    <ResponsivePageHeader title={getActiveUiLiteral("m_c881461497cd")} onBack={() => navigation.goBack()}/>
                    <ErrorState message={error} onRetry={loadFacilities} />
                </SafeAreaView>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <SafeAreaView style={{ flex: 1 }}>
                <ResponsivePageHeader title={getActiveUiLiteral("m_c881461497cd")} subtitle={getActiveUiLiteral("m_8cc873d5ca4c")} onBack={() => navigation.goBack()}/>
                <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                    <AppCard style={{ marginBottom: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary }}>Facilities ({facilities.length})</Text>
                            <AppButton title="Add Facility" size="sm" onPress={() => { setShowCreateForm(true); resetForm(); }} />
                        </View>
                        {facilities.length === 0 ? (
                            <EmptyState
                                title="No facilities configured"
                                description="Create facilities to define the amenity infrastructure"
                                actionTitle="Create First Facility"
                                onAction={() => { setShowCreateForm(true); resetForm(); }}
                            />
                        ) : (
                            facilities.map((facility) => (
                                <View key={facility.id} style={{ marginBottom: 12, padding: 12, backgroundColor: colors.card, borderRadius: 8 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary }}>{facility.name}</Text>
                                            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                                                <StatusBadge status={facility.type} moduleType="facility" label={FACILITY_TYPES.find(f => f.value === facility.type)?.label || facility.type} />
                                                <StatusBadge status={facility.status} moduleType="facility" label={FACILITY_STATUS.find(f => f.value === facility.status)?.label || facility.status} />
                                            </View>
                                            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
                                                Capacity: {facility.capacity} | Area: {facility.areaSqFt} sq ft
                                            </Text>
                                            <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                                                Hours: {facility.operatingHours?.start || '06:00'} - {facility.operatingHours?.end || '22:00'} | Booking: {facility.hasBooking ? 'Enabled' : 'Disabled'}
                                            </Text>
                                        </View>
                                        <AppButton title="Delete" size="sm" variant="outline" onPress={() => handleDeleteFacility(facility.id)} style={{ borderColor: colors.danger }} />
                                    </View>
                                </View>
                            ))
                        )}
                    </AppCard>

                    {showCreateForm && (
                        <AppCard style={{ marginBottom: 16 }}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>Create Facility</Text>
                            <FormField label="Facility Name" value={name} onChangeText={setName} placeholder="e.g., Main Clubhouse, Swimming Pool" />
                            <AppSelect
                                label="Type"
                                value={type}
                                onChange={setType}
                                options={FACILITY_TYPES}
                            />
                            <AppSelect
                                label="Status"
                                value={status}
                                onChange={setStatus}
                                options={FACILITY_STATUS}
                            />
                            <FormField label="Capacity" value={String(capacity)} onChangeText={(v) => setCapacity(parseInt(v, 10) || 0)} keyboardType="numeric" placeholder="Maximum capacity" />
                            <FormField label="Area (sq ft)" value={String(areaSqFt)} onChangeText={(v) => setAreaSqFt(parseInt(v, 10) || 0)} keyboardType="numeric" placeholder="Area in square feet" />
                            <FormField label="Description" value={description} onChangeText={setDescription} placeholder="Optional description" multiline numberOfLines={3} />
                            <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                                <AppCard style={{ flex: 1, padding: 12 }}>
                                    <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Operating Hours Start</Text>
                                    <FormField value={operatingHoursStart} onChangeText={setOperatingHoursStart} placeholder="06:00" />
                                </AppCard>
                                <AppCard style={{ flex: 1, padding: 12 }}>
                                    <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Operating Hours End</Text>
                                    <FormField value={operatingHoursEnd} onChangeText={setOperatingHoursEnd} placeholder="22:00" />
                                </AppCard>
                            </View>
                            <View style={{ marginTop: 12 }}>
                                <AppButton
                                    title={hasBooking ? 'Disable Booking' : 'Enable Booking'}
                                    variant="outline"
                                    onPress={() => setHasBooking(!hasBooking)}
                                />
                            </View>
                            <View style={{ marginTop: 12 }}>
                                <AppButton
                                    title={hasDeposit ? 'Disable Deposit' : 'Enable Deposit'}
                                    variant="outline"
                                    onPress={() => setHasDeposit(!hasDeposit)}
                                />
                            </View>
                            {hasDeposit && (
                                <FormField label="Deposit Amount" value={String(depositAmount)} onChangeText={(v) => setDepositAmount(parseInt(v, 10) || 0)} keyboardType="numeric" placeholder="Security deposit amount" />
                            )}
                            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                                <AppButton title="Cancel" variant="outline" onPress={() => { setShowCreateForm(false); resetForm(); }} style={{ flex: 1 }} />
                                <AppButton title="Create Facility" onPress={handleCreateFacility} loading={isSubmitting} style={{ flex: 1 }} />
                            </View>
                        </AppCard>
                    )}

                    <AppCard>
                        <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                            • Facilities define the amenity infrastructure available to residents
                        </Text>
                        <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
                            • Booking, deposits, and scheduling are handled in the Facility Booking module (later phase)
                        </Text>
                        <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
                            • Status reflects construction/operational state
                        </Text>
                    </AppCard>
                </ScrollView>
            </SafeAreaView>
        </ScreenContainer>
    );
}