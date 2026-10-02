import { useState, useEffect } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { AppButton } from "../../../shared/components/AppButton";
import { AppCard } from "../../../shared/cards/AppCard";
import { FormField } from "../../../shared/forms/FormField";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { EmptyState } from "../../../shared/components/EmptyState";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
import { SocietyService } from "../services/societyService";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../app/navigation/navigation.types";

type Props = NativeStackScreenProps<SuperAdminStackParamList, 'SOCIETY_ADMIN_ASSIGNMENT'>;

export function SocietyAdminAssignmentScreen({ route, navigation }: Props) {
    const { societyId } = route.params;
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const [admins, setAdmins] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteName, setInviteName] = useState('');
    const [inviteMobile, setInviteMobile] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (societyId) loadAdmins();
    }, [societyId]);

    const loadAdmins = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const society = await SocietyService.getSociety(societyId!);
            if (society) {
                const adminsList = society.admins || [];
                setAdmins(adminsList);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load admins');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInvite = async () => {
        if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
            Alert.alert('Error', 'Valid email is required');
            return;
        }
        if (!inviteName.trim()) {
            Alert.alert('Error', 'Name is required');
            return;
        }
        if (!inviteMobile.trim() || inviteMobile.length !== 10) {
            Alert.alert('Error', 'Valid 10-digit mobile number is required');
            return;
        }

        setIsSubmitting(true);
        try {
            const society = await SocietyService.getSociety(societyId!);
            const newAdmin = {
                id: `admin-${Date.now()}`,
                name: inviteName,
                email: inviteEmail,
                mobile: inviteMobile,
                role: 'SOCIETY_ADMIN',
                status: 'PENDING_INVITE',
                invitedAt: new Date().toISOString(),
            };
            const updatedAdmins = [...(society.admins || []), newAdmin];
            await SocietyService.updateSociety({ id: societyId!, admins: updatedAdmins });
            setAdmins(updatedAdmins);
            setShowInviteForm(false);
            setInviteEmail('');
            setInviteName('');
            setInviteMobile('');
            Alert.alert('Success', 'Admin invitation sent');
        } catch (err) {
            Alert.alert('Error', err instanceof Error ? err.message : 'Failed to invite admin');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveAdmin = async (adminId: string) => {
        Alert.alert(
            'Confirm Removal',
            'Are you sure you want to remove this admin?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const society = await SocietyService.getSociety(societyId!);
                            const updatedAdmins = (society.admins || []).filter((a: any) => a.id !== adminId);
                            await SocietyService.updateSociety({ id: societyId!, admins: updatedAdmins });
                            setAdmins(updatedAdmins);
                            Alert.alert('Success', 'Admin removed');
                        } catch (err) {
                            Alert.alert('Error', err instanceof Error ? err.message : 'Failed to remove admin');
                        }
                    },
                },
            ]
        );
    };

    const handleResendInvite = async (admin: any) => {
        try {
            const society = await SocietyService.getSociety(societyId!);
            const updatedAdmins = (society.admins || []).map((a: any) =>
                a.id === admin.id ? { ...a, invitedAt: new Date().toISOString() } : a
            );
            await SocietyService.updateSociety({ id: societyId!, admins: updatedAdmins });
            setAdmins(updatedAdmins);
            Alert.alert('Success', 'Invitation resent');
        } catch (err) {
            Alert.alert('Error', err instanceof Error ? err.message : 'Failed to resend invite');
        }
    };

    if (isLoading) {
        return (
            <ScreenContainer>
                <SafeAreaView style={{ flex: 1 }}>
                    <ResponsivePageHeader title={getActiveUiLiteral("m_e0fbfbc65b9e")} onBack={() => navigation.goBack()}/>
                    <LoadingState message={getActiveUiLiteral("m_23b87850823d")} />
                </SafeAreaView>
            </ScreenContainer>
        );
    }

    if (error) {
        return (
            <ScreenContainer>
                <SafeAreaView style={{ flex: 1 }}>
                    <ResponsivePageHeader title={getActiveUiLiteral("m_e0fbfbc65b9e")} onBack={() => navigation.goBack()}/>
                    <ErrorState message={error} onRetry={loadAdmins} />
                </SafeAreaView>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <SafeAreaView style={{ flex: 1 }}>
                <ResponsivePageHeader title={getActiveUiLiteral("m_e0fbfbc65b9e")} subtitle={getActiveUiLiteral("m_9bec91e1bdb3")} onBack={() => navigation.goBack()}/>
                <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                    <AppCard style={{ marginBottom: 16 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>
                            Current Society Administrators ({admins.length})
                        </Text>
                        {admins.length === 0 ? (
                            <EmptyState
                                title="No administrators assigned"
                                description="Invite the first society administrator to begin configuration"
                                actionTitle="Invite Administrator"
                                onAction={() => setShowInviteForm(true)}
                            />
                        ) : (
                            admins.map((admin) => (
                                <View key={admin.id} style={{ marginBottom: 12, padding: 12, backgroundColor: colors.card, borderRadius: 8 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary }}>{admin.name}</Text>
                                            <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 2 }}>{admin.email}</Text>
                                            <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>{admin.mobile}</Text>
                                            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                                                <Text style={{ fontSize: 11, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: admin.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: admin.status === 'ACTIVE' ? '#10B981' : '#F59E0B' }}>
                                                    {admin.status}
                                                </Text>
                                                <Text style={{ fontSize: 11, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: colors.surface, color: colors.textSecondary }}>
                                                    {admin.role}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', gap: 8 }}>
                                            {admin.status === 'PENDING_INVITE' && (
                                                <AppButton title="Resend" size="sm" variant="outline" onPress={() => handleResendInvite(admin)} />
                                            )}
                                            <AppButton title="Remove" size="sm" variant="outline" onPress={() => handleRemoveAdmin(admin.id)} style={{ borderColor: colors.danger }} />
                                        </View>
                                    </View>
                                </View>
                            ))
                        )}
                    </AppCard>

                    <AppCard style={{ marginBottom: 16 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>
                            Invite New Administrator
                        </Text>
                        {showInviteForm ? (
                            <>
                                <FormField label="Full Name" value={inviteName} onChangeText={setInviteName} placeholder="Enter full name" />
                                <FormField label="Email" value={inviteEmail} onChangeText={setInviteEmail} keyboardType="email-address" placeholder="admin@society.com" />
                                <FormField label="Mobile" value={inviteMobile} onChangeText={setInviteMobile} keyboardType="phone-pad" placeholder="10 digit mobile" />
                                <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                                    <AppButton title="Cancel" variant="outline" onPress={() => setShowInviteForm(false)} style={{ flex: 1 }} />
                                    <AppButton title="Send Invitation" onPress={handleInvite} loading={isSubmitting} style={{ flex: 1 }} />
                                </View>
                            </>
                        ) : (
                            <AppButton title="Invite Administrator" onPress={() => setShowInviteForm(true)} />
                        )}
                    </AppCard>

                    <AppCard>
                        <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                            • Only one primary Society Administrator can be active at a time
                        </Text>
                        <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
                            • Invitations expire after 7 days
                        </Text>
                        <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
                            • The invited admin will receive email/SMS with onboarding link
                        </Text>
                    </AppCard>
                </ScrollView>
            </SafeAreaView>
        </ScreenContainer>
    );
}