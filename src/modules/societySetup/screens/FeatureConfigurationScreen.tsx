import { useState, useEffect } from "react";
import { ScrollView, View, Text, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { AppButton } from "../../../shared/components/AppButton";
import { AppCard } from "../../../shared/cards/AppCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
import { SocietyService } from "../services/societyService";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../app/navigation/navigation.types";

type Props = NativeStackScreenProps<SuperAdminStackParamList, 'FEATURE_CONFIGURATION'>;

const FEATURE_MODULES = [
    {
        group: 'Core Operations',
        features: [
            { key: 'visitorManagement', label: 'Visitor Management', description: 'Pre-approval, gate check-in, visitor passes', dependencies: [], risk: 'LOW' },
            { key: 'complaints', label: 'Complaints & Helpdesk', description: 'Complaint lifecycle, SLA, assignment', dependencies: [], risk: 'LOW' },
            { key: 'notices', label: 'Notices & Broadcasts', description: 'Society notices, emergency announcements', dependencies: [], risk: 'LOW' },
            { key: 'documents', label: 'Document Vault', description: 'Document upload, verification, access control', dependencies: [], risk: 'MEDIUM' },
            { key: 'noc', label: 'NOC & Certificates', description: 'No Objection Certificates, residency certificates', dependencies: ['documents'], risk: 'MEDIUM' },
        ],
    },
    {
        group: 'Resident Lifecycle',
        features: [
            { key: 'moveInMoveOut', label: 'Move In/Out', description: 'Move-in requests, clearance, handover', dependencies: ['documents', 'noc'], risk: 'MEDIUM' },
            { key: 'residentDirectory', label: 'Resident Directory', description: 'Resident profiles, contact, privacy controls', dependencies: [], risk: 'LOW' },
            { key: 'residentConnect', label: 'Resident Connect', description: 'Messaging, contact requests, groups', dependencies: ['residentDirectory'], risk: 'LOW' },
            { key: 'household', label: 'Household Management', description: 'Family members, tenants, occupancy', dependencies: ['residentDirectory'], risk: 'MEDIUM' },
        ],
    },
    {
        group: 'Facilities & Infrastructure',
        features: [
            { key: 'facilityBooking', label: 'Facility Booking', description: 'Amenity reservations, conflict prevention', dependencies: [], risk: 'LOW' },
            { key: 'parking', label: 'Parking Management', description: 'Slot allocation, vehicle registration, violations', dependencies: [], risk: 'MEDIUM' },
            { key: 'facilityOps', label: 'Facility Operations', description: 'Vendor onboarding, AMC, asset register, inventory, procurement', dependencies: [], risk: 'MEDIUM' },
            { key: 'preventiveMaintenance', label: 'Preventive Maintenance', description: 'Scheduled maintenance, compliance tracking', dependencies: ['facilityOps'], risk: 'HIGH' },
        ],
    },
    {
        group: 'Security & Safety',
        features: [
            { key: 'guardApp', label: 'Guard App', description: 'Gate operations, visitor verification, patrols', dependencies: ['visitorManagement'], risk: 'MEDIUM' },
            { key: 'emergency', label: 'Emergency & SOS', description: 'SOS alerts, emergency contacts, volunteers', dependencies: [], risk: 'HIGH' },
            { key: 'interFlat', label: 'Inter-Flat Issues', description: 'Noise, leakage, disputes, mediation', dependencies: ['complaints', 'residentDirectory'], risk: 'MEDIUM' },
            { key: 'compliance', label: 'Compliance Operations', description: 'Fire safety, lift safety, waste, housekeeping', dependencies: [], risk: 'HIGH' },
        ],
    },
    {
        group: 'Governance & Finance',
        features: [
            { key: 'governance', label: 'Governance', description: 'Meetings, polls, elections, resolutions', dependencies: ['residentDirectory'], risk: 'MEDIUM' },
            { key: 'billing', label: 'Billing & Accounting', description: 'Charge heads, bill generation, payments', dependencies: [], risk: 'HIGH' },
            { key: 'defaulters', label: 'Defaulter Management', description: 'Outstanding tracking, ageing, collections', dependencies: ['billing'], risk: 'HIGH' },
            { key: 'financialReports', label: 'Financial Reports', description: 'Balance sheet, P&L, cash flow, audit', dependencies: ['billing'], risk: 'HIGH' },
        ],
    },
    {
        group: 'Community & Lifestyle',
        features: [
            { key: 'communityMarketplace', label: 'Community Marketplace', description: 'Listings, services, borrow/lend, lost & found', dependencies: ['residentDirectory'], risk: 'LOW' },
            { key: 'seniorCare', label: 'Senior Citizen Care', description: 'Daily check-in, emergency contacts', dependencies: ['emergency', 'residentDirectory'], risk: 'MEDIUM' },
            { key: 'domesticHelp', label: 'Domestic Help Management', description: 'Staff directory, attendance, verification', dependencies: [], risk: 'LOW' },
        ],
    },
    {
        group: 'Advanced & Integrations',
        features: [
            { key: 'biometricAttendance', label: 'Biometric Attendance', description: 'Device integration, punch sync, corrections', dependencies: [], risk: 'HIGH' },
            { key: 'hardwareIntegration', label: 'Hardware Integration', description: 'RFID, ANPR, boom barrier, CCTV, smart meters', dependencies: [], risk: 'HIGH' },
            { key: 'smartAutomation', label: 'Smart Automation', description: 'AI complaint routing, notice drafting, risk alerts', dependencies: ['complaints', 'notices'], risk: 'HIGH' },
            { key: 'analytics', label: 'Advanced Analytics', description: 'Society health, adoption, usage reports', dependencies: [], risk: 'LOW' },
        ],
    },
];

export function FeatureConfigurationScreen({ route, navigation }: Props) {
    const { societyId } = route.params;
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const [features, setFeatures] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (societyId) loadFeatures();
    }, [societyId]);

    const loadFeatures = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const society = await SocietyService.getSociety(societyId!);
            if (society?.featureConfig) {
                setFeatures(society.featureConfig);
            } else {
                const defaults: Record<string, boolean> = {};
                FEATURE_MODULES.forEach(group => {
                    group.features.forEach(f => {
                        defaults[f.key] = f.risk === 'LOW';
                    });
                });
                setFeatures(defaults);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load feature config');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await SocietyService.updateSociety({ id: societyId!, featureConfig: features });
            Alert.alert('Success', 'Feature configuration saved');
        } catch (err) {
            Alert.alert('Error', err instanceof Error ? err.message : 'Failed to save configuration');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleFeature = (key: string) => {
        const newValue = !features[key];
        const feature = FEATURE_MODULES.flatMap(g => g.features).find(f => f.key === key);

        if (newValue && feature) {
            const missingDeps = feature.dependencies.filter(dep => !features[dep]);
            if (missingDeps.length > 0) {
                Alert.alert(
                    'Dependencies Required',
                    `This feature requires: ${missingDeps.map(d => FEATURE_MODULES.flatMap(g => g.features).find(f => f.key === d)?.label || d).join(', ')}. Enable them first.`
                );
                return;
            }
        }

        if (!newValue) {
            const dependents = FEATURE_MODULES.flatMap(g => g.features)
                .filter(f => f.dependencies.includes(key) && features[f.key]);
            if (dependents.length > 0) {
                Alert.alert(
                    'Dependent Features Active',
                    `Disabling this will affect: ${dependents.map(d => d.label).join(', ')}. They will also be disabled.`,
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Disable Anyway',
                            onPress: () => {
                                const updated = { ...features, [key]: false };
                                dependents.forEach(d => { updated[d.key] = false; });
                                setFeatures(updated);
                            },
                        },
                    ]
                );
                return;
            }
        }

        setFeatures(prev => ({ ...prev, [key]: newValue }));
    };

    const getEnabledCount = () => Object.values(features).filter(v => v).length;
    const getTotalCount = () => FEATURE_MODULES.flatMap(g => g.features).length;

    if (isLoading) {
        return (
            <ScreenContainer>
                <SafeAreaView style={{ flex: 1 }}>
                    <ResponsivePageHeader title={getActiveUiLiteral("m_c60c04dc77f9")} onBack={() => navigation.goBack()}/>
                    <LoadingState message={getActiveUiLiteral("m_23b87850823d")} />
                </SafeAreaView>
            </ScreenContainer>
        );
    }

    if (error) {
        return (
            <ScreenContainer>
                <SafeAreaView style={{ flex: 1 }}>
                    <ResponsivePageHeader title={getActiveUiLiteral("m_c60c04dc77f9")} onBack={() => navigation.goBack()}/>
                    <ErrorState message={error} onRetry={loadFeatures} />
                </SafeAreaView>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <SafeAreaView style={{ flex: 1 }}>
                <ResponsivePageHeader title={getActiveUiLiteral("m_c60c04dc77f9")} subtitle={`${getEnabledCount()} / ${getTotalCount()} enabled`} onBack={() => navigation.goBack()}/>
                <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                    <AppCard style={{ marginBottom: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary }}>
                                {getEnabledCount()} of {getTotalCount()} features enabled
                            </Text>
                            <StatusBadge status={getEnabledCount() === getTotalCount() ? 'COMPLETE' : 'PARTIAL'} label={getEnabledCount() === getTotalCount() ? 'All Enabled' : 'Partial'} />
                        </View>
                        <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                            Configure which modules are available for this society. Disabled features are hidden from residents and staff.
                        </Text>
                    </AppCard>

                    {FEATURE_MODULES.map((group) => {
                        const groupFeatures = group.features;
                        const groupEnabled = groupFeatures.filter(f => features[f.key]).length;
                        const isExpanded = expandedGroups[group.group] ?? true;

                        return (
                            <AppCard key={group.group} style={{ marginBottom: 16 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary }}>{group.group}</Text>
                                        <StatusBadge status={groupEnabled === groupFeatures.length ? 'COMPLETE' : groupEnabled > 0 ? 'PARTIAL' : 'DISABLED'} label={`${groupEnabled}/${groupFeatures.length}`} />
                                    </View>
                                    <TouchableOpacity onPress={() => setExpandedGroups(prev => ({ ...prev, [group.group]: !isExpanded }))}>
                                        <Text style={{ color: colors.primary, fontSize: 14 }}>
                                            {isExpanded ? 'Collapse' : 'Expand'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {isExpanded && (
                                    <View style={{ gap: 8 }}>
                                        {groupFeatures.map((feature) => {
                                            const isEnabled = features[feature.key] ?? false;
                                            const depsMet = feature.dependencies.every(dep => features[dep] ?? false);
                                            const hasActiveDependents = FEATURE_MODULES.flatMap(g => g.features).some(f => f.dependencies.includes(feature.key) && features[f.key]);

                                            return (
                                                <View key={feature.key} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                                        <Switch
                                                            value={isEnabled}
                                                            onValueChange={() => toggleFeature(feature.key)}
                                                            disabled={!depsMet && !isEnabled}
                                                            trackColor={{ false: colors.border, true: isEnabled ? colors.primary : colors.warning }}
                                                            thumbColor={isEnabled ? colors.primary : !depsMet ? colors.warning : colors.textMuted}
                                                        />
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ fontSize: 14, fontWeight: '500', color: isEnabled ? colors.textPrimary : !depsMet ? colors.warning : colors.textMuted }}>
                                                                {feature.label}
                                                            </Text>
                                                            <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>{feature.description}</Text>
                                                            {!depsMet && !isEnabled && (
                                                                <Text style={{ fontSize: 10, color: colors.warning, marginTop: 2 }}>
                                                                    Requires: {feature.dependencies.map(d => FEATURE_MODULES.flatMap(g => g.features).find(f => f.key === d)?.label || d).join(', ')}
                                                                </Text>
                                                            )}
                                                            {hasActiveDependents && (
                                                                <Text style={{ fontSize: 10, color: colors.danger, marginTop: 2 }}>
                                                                    Required by: {FEATURE_MODULES.flatMap(g => g.features).filter(f => f.dependencies.includes(feature.key) && features[f.key]).map(d => d.label).join(', ')}
                                                                </Text>
                                                            )}
                                                        </View>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}
                            </AppCard>
                        );
                    })}
                    <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                        <AppButton title="Cancel" variant="outline" onPress={() => navigation.goBack()} style={{ flex: 1 }} />
                        <AppButton title="Save Configuration" onPress={handleSave} loading={isSaving} style={{ flex: 1 }} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ScreenContainer>
    );
}