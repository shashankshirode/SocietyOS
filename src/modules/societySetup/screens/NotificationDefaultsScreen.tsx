import { useState, useEffect } from "react";
import { ScrollView, View, Text, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { AppButton } from "../../../shared/components/AppButton";
import { AppCard } from "../../../shared/cards/AppCard";
import { FormField } from "../../../shared/forms/FormField";
import { AppSelect } from "../../../shared/forms/AppSelect";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
import { SocietyService } from "../services/societyService";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../app/navigation/navigation.types";

type Props = NativeStackScreenProps<SuperAdminStackParamList, 'NOTIFICATION_DEFAULTS'>;

const NOTIFICATION_CHANNELS = [
    { key: 'push', label: 'Push Notifications', description: 'Mobile push notifications via FCM/APNs' },
    { key: 'sms', label: 'SMS', description: 'Text message notifications' },
    { key: 'email', label: 'Email', description: 'Email notifications' },
    { key: 'in_app', label: 'In-App', description: 'In-app notification center' },
];

const NOTIFICATION_CATEGORIES = [
    { key: 'visitor', label: 'Visitor Management', description: 'Visitor arrival, approval, exit notifications' },
    { key: 'complaint', label: 'Complaints', description: 'Complaint creation, assignment, resolution updates' },
    { key: 'billing', label: 'Billing & Payments', description: 'Bill generation, payment reminders, receipts' },
    { key: 'notice', label: 'Notices & Announcements', description: 'Society notices, emergency broadcasts' },
    { key: 'facility', label: 'Facility Booking', description: 'Booking confirmations, reminders, cancellations' },
    { key: 'parking', label: 'Parking', description: 'Parking allocations, violations, visitor parking' },
    { key: 'document', label: 'Documents', description: 'Document upload, verification, expiry alerts' },
    { key: 'maintenance', label: 'Maintenance', description: 'Work orders, preventive maintenance schedules' },
    { key: 'emergency', label: 'Emergency', description: 'SOS, fire, medical, security alerts' },
    { key: 'governance', label: 'Governance', description: 'Meetings, polls, elections, resolutions' },
    { key: 'community', label: 'Community', description: 'Marketplace, skills, borrow/lend, lost & found' },
];

const DEFAULT_TEMPLATES = [
    { key: 'visitor_approved', label: 'Visitor Approved', channel: 'push' },
    { key: 'visitor_arrived', label: 'Visitor Arrived', channel: 'push' },
    { key: 'complaint_created', label: 'Complaint Created', channel: 'push' },
    { key: 'complaint_resolved', label: 'Complaint Resolved', channel: 'push' },
    { key: 'bill_generated', label: 'Bill Generated', channel: 'email' },
    { key: 'payment_due', label: 'Payment Due Reminder', channel: 'push' },
    { key: 'notice_published', label: 'Notice Published', channel: 'push' },
    { key: 'facility_booked', label: 'Facility Booked', channel: 'push' },
    { key: 'emergency_sos', label: 'Emergency SOS', channel: 'push' },
];

export function NotificationDefaultsScreen({ route, navigation }: Props) {
    const { societyId } = route.params;
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const [config, setConfig] = useState<any>({
        channels: { push: true, sms: false, email: false, in_app: true },
        categories: {},
        templates: {},
        emergencyOverride: true,
        quietHours: { enabled: true, start: '22:00', end: '07:00' },
        retryPolicy: { maxRetries: 3, intervalMinutes: 15 },
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (societyId) loadConfig();
    }, [societyId]);

    const loadConfig = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const society = await SocietyService.getSociety(societyId!);
            if (society?.notificationConfig) {
                setConfig(society.notificationConfig);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load notification config');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await SocietyService.updateSociety({ id: societyId!, notificationConfig: config });
            Alert.alert('Success', 'Notification defaults saved');
        } catch (err) {
            Alert.alert('Error', err instanceof Error ? err.message : 'Failed to save configuration');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleChannel = (channel: string) => {
        setConfig(prev => ({ ...prev, channels: { ...prev.channels, [channel]: !prev.channels[channel] } }));
    };

    const toggleCategoryChannel = (category: string, channel: string) => {
        setConfig(prev => ({
            ...prev,
            categories: {
                ...prev.categories,
                [category]: {
                    ...(prev.categories[category] || { channels: [] }),
                    channels: prev.categories[category]?.channels?.includes(channel)
                        ? prev.categories[category].channels.filter((c: string) => c !== channel)
                        : [...(prev.categories[category]?.channels || []), channel],
                },
            },
        }));
    };

    const isCategoryChannelEnabled = (category: string, channel: string) => {
        return config.categories[category]?.channels?.includes(channel) ?? false;
    };

    if (isLoading) {
        return (
            <ScreenContainer>
                <SafeAreaView style={{ flex: 1 }}>
                    <ResponsivePageHeader title={getActiveUiLiteral("m_fb8fb2a2745d")} onBack={() => navigation.goBack()}/>
                    <LoadingState message={getActiveUiLiteral("m_23b87850823d")} />
                </SafeAreaView>
            </ScreenContainer>
        );
    }

    if (error) {
        return (
            <ScreenContainer>
                <SafeAreaView style={{ flex: 1 }}>
                    <ResponsivePageHeader title={getActiveUiLiteral("m_fb8fb2a2745d")} onBack={() => navigation.goBack()}/>
                    <ErrorState message={error} onRetry={loadConfig} />
                </SafeAreaView>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <SafeAreaView style={{ flex: 1 }}>
                <ResponsivePageHeader title={getActiveUiLiteral("m_fb8fb2a2745d")} subtitle={getActiveUiLiteral("m_8cc873d5ca4c")} onBack={() => navigation.goBack()}/>
                <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                    <AppCard style={{ marginBottom: 16 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>Notification Channels</Text>
                        <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 16 }}>
                            Enable/disable notification delivery channels for this society
                        </Text>
                        {NOTIFICATION_CHANNELS.map((channel) => (
                            <View key={channel.key} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary }}>{channel.label}</Text>
                                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>{channel.description}</Text>
                                </View>
                                <Switch
                                    value={config.channels[channel.key] ?? false}
                                    onValueChange={() => toggleChannel(channel.key)}
                                    trackColor={{ false: colors.border, true: colors.primary }}
                                    thumbColor={config.channels[channel.key] ? colors.primary : colors.textMuted}
                                />
                            </View>
                        ))}
                    </AppCard>

                    <AppCard style={{ marginBottom: 16 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>Category-Channel Mapping</Text>
                        <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 16 }}>
                            Configure which channels are used for each notification category
                        </Text>
                        {NOTIFICATION_CATEGORIES.map((category) => (
                            <View key={category.key} style={{ marginBottom: 16 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                    <View>
                                        <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary }}>{category.label}</Text>
                                        <Text style={{ fontSize: 11, color: colors.textMuted }}>{category.description}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                    {NOTIFICATION_CHANNELS
                                        .filter(c => config.channels[c.key])
                                        .map((channel) => (
                                            <TouchableOpacity
                                                key={channel.key}
                                                onPress={() => toggleCategoryChannel(category.key, channel.key)}
                                                style={{
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 6,
                                                    borderRadius: 6,
                                                    borderWidth: 1,
                                                    borderColor: isCategoryChannelEnabled(category.key, channel.key) ? colors.primary : colors.border,
                                                    backgroundColor: isCategoryChannelEnabled(category.key, channel.key) ? `${colors.primary}15` : colors.background,
                                                }}
                                            >
                                                <Text style={{
                                                    fontSize: 11,
                                                    color: isCategoryChannelEnabled(category.key, channel.key) ? colors.primary : colors.textSecondary,
                                                    fontWeight: isCategoryChannelEnabled(category.key, channel.key) ? '600' : '400',
                                                }}>
                                                    {channel.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                </View>
                            </View>
                        ))}
                    </AppCard>

                    <AppCard style={{ marginBottom: 16 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>Default Templates</Text>
                        <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 16 }}>
                            Configure default notification templates (channel assignments can be customized per category above)
                        </Text>
                        {DEFAULT_TEMPLATES.map((template) => (
                            <View key={template.key} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                                <Text style={{ fontSize: 14, color: colors.textPrimary }}>{template.label}</Text>
                                <AppSelect
                                    value={config.templates[template.key] || template.channel}
                                    onChange={(v) => setConfig(prev => ({ ...prev, templates: { ...prev.templates, [template.key]: v } }))}
                                    options={NOTIFICATION_CHANNELS.filter(c => config.channels[c.key]).map(c => ({ label: c.label, value: c.key }))}
                                />
                            </View>
                        ))}
                    </AppCard>

                    <AppCard style={{ marginBottom: 16 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>Global Settings</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                            <View>
                                <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary }}>Emergency Override</Text>
                                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Bypass quiet hours and preferences for emergency alerts</Text>
                            </View>
                            <Switch
                                value={config.emergencyOverride ?? true}
                                onValueChange={(v) => setConfig(prev => ({ ...prev, emergencyOverride: v }))}
                                trackColor={{ false: colors.border, true: colors.danger }}
                                thumbColor={config.emergencyOverride ? colors.danger : colors.textMuted}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary }}>Quiet Hours</Text>
                                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Suppress non-emergency notifications during specified hours</Text>
                            </View>
                            <Switch
                                value={config.quietHours?.enabled ?? true}
                                onValueChange={(v) => setConfig(prev => ({ ...prev, quietHours: { ...prev.quietHours, enabled: v } }))}
                                trackColor={{ false: colors.border, true: colors.primary }}
                            />
                        </View>
                        {config.quietHours?.enabled && (
                            <View style={{ paddingTop: 12 }}>
                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    <AppCard style={{ flex: 1, padding: 12 }}>
                                        <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Start</Text>
                                        <FormField value={config.quietHours.start} onChangeText={(v) => setConfig(prev => ({ ...prev, quietHours: { ...prev.quietHours, start: v } }))} placeholder="22:00" />
                                    </AppCard>
                                    <AppCard style={{ flex: 1, padding: 12 }}>
                                        <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>End</Text>
                                        <FormField value={config.quietHours.end} onChangeText={(v) => setConfig(prev => ({ ...prev, quietHours: { ...prev.quietHours, end: v } }))} placeholder="07:00" />
                                    </AppCard>
                                </View>
                            </View>
                        )}
                    </AppCard>

                    <AppCard style={{ marginBottom: 16 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>Retry Policy</Text>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <AppCard style={{ flex: 1, padding: 12 }}>
                                <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Max Retries</Text>
                                <FormField value={String(config.retryPolicy?.maxRetries ?? 3)} onChangeText={(v) => setConfig(prev => ({ ...prev, retryPolicy: { ...prev.retryPolicy, maxRetries: parseInt(v, 10) || 3 } }))} keyboardType="numeric" />
                            </AppCard>
                            <AppCard style={{ flex: 1, padding: 12 }}>
                                <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Retry Interval (minutes)</Text>
                                <FormField value={String(config.retryPolicy?.intervalMinutes ?? 15)} onChangeText={(v) => setConfig(prev => ({ ...prev, retryPolicy: { ...prev.retryPolicy, intervalMinutes: parseInt(v, 10) || 15 } }))} keyboardType="numeric" />
                            </AppCard>
                        </View>
                    </AppCard>

                    <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                        <AppButton title="Cancel" variant="outline" onPress={() => navigation.goBack()} style={{ flex: 1 }} />
                        <AppButton title="Save Configuration" onPress={handleSave} loading={isSaving} style={{ flex: 1 }} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ScreenContainer>
    );
}