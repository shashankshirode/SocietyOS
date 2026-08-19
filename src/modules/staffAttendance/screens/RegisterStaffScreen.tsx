import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useRegisterStaff } from "../data/useRegisterStaff";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import type { StaffCategory, StaffVerificationStatus } from "../../../shared/types/staff.types";
import { useMessages } from "../../../shared/constants/useMessages";
import { chatRepository } from "../../chat/data/chat.repository";
import type { ChatChannelDefinition, RequestedChannelAssignment } from "../../chat/domain/chat.types";
import { getRecommendedChannelAssignments } from "../../chat/domain/chatChannelPolicy";
import { ChannelMembershipSelector } from "../../staffManagement/components/ChannelMembershipSelector";
import { mapStaffCategoryToChatRole } from "../../staffManagement/channelRoleMapper";
import { ChannelAssignmentSummary } from "../../staffManagement/components/ChannelAssignmentSummary";
import { getRequiredItem } from "../../../shared/utils/requiredItem";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/RegisterStaffScreen.styles";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'RegisterStaff'>;
const categoryOptions: StaffCategory[] = [
    'SECURITY_GUARD', 'SECURITY_SUPERVISOR', 'FACILITY_STAFF', 'OFFICE_STAFF', 'ACCOUNTS_STAFF',
    'TREASURER', 'COMMITTEE_MEMBER', 'SECRETARY', 'CHAIRPERSON', 'SOCIETY_MANAGER', 'HOUSEKEEPING',
    'GARDENER', 'PLUMBER', 'ELECTRICIAN', 'LIFT_OPERATOR', 'CLUBHOUSE_STAFF', 'VENDOR_WORKER', 'OTHER',
];
export function RegisterStaffScreen({ navigation }: Props) {
    const { register, isSubmitting } = useRegisterStaff();
    const messages = useMessages();
    const [name, setName] = useState('');
    const [category, setCategory] = useState<StaffCategory>('SECURITY_GUARD');
    const [staffCode, setStaffCode] = useState('');
    const [vendorId, setVendorId] = useState('');
    const [mobile, setMobile] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');
    const [assignedLocation, setAssignedLocation] = useState('');
    const [shiftId] = useState('shift-001');
    const [notes, setNotes] = useState('');
    const [chatChannels, setChatChannels] = useState<ChatChannelDefinition[]>([]);
    const [channelAssignments, setChannelAssignments] = useState<RequestedChannelAssignment[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const chatRole = mapStaffCategoryToChatRole(category);
    useEffect(() => {
        let cancelled = false;
        async function loadChannels() {
            if (!chatRole) {
                setChatChannels([]);
                setChannelAssignments([]);
                return;
            }
            const available = await chatRepository.getAssignableChannels('society-gv', chatRole);
            if (cancelled)
                return;
            setChatChannels(available);
            const nowIso = new Date().toISOString();
            setChannelAssignments(getRecommendedChannelAssignments(chatRole).map((recommendation) => {
                const channel = available.find((item) => item.code === recommendation.channelCode);
                return channel ? { channelId: channel.channelId, accessLevel: recommendation.recommendedAccessLevel, validFromIso: nowIso } : null;
            }).filter((item): item is RequestedChannelAssignment => item !== null));
        }
        void loadChannels();
        return () => { cancelled = true; };
    }, [chatRole]);
    const validate = () => {
        const tempErrors: Record<string, string> = {};
        if (!name.trim())
            tempErrors.name = messages.staff.registration.validation.nameRequired;
        if (!category)
            tempErrors.category = messages.staff.registration.validation.categoryRequired;
        if (!staffCode.trim())
            tempErrors.staffCode = messages.staff.registration.validation.codeRequired;
        if (!mobile.trim() || mobile.length !== 10)
            tempErrors.mobile = messages.staff.registration.validation.mobileInvalid;
        if (!assignedLocation.trim())
            tempErrors.assignedLocation = messages.staff.registration.validation.locationRequired;
        if (chatRole && channelAssignments.length === 0)
            tempErrors.chatChannels = messages.chat.membership.validation.channelRequired;
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
    const handleSubmit = async () => {
        if (!validate())
            return;
        try {
            const result = await register({
                name,
                category,
                staffCode,
                ...includeWhenPresent("vendorId", vendorId || undefined),
                mobile,
                ...includeWhenPresent("emergencyContact", emergencyContact || undefined),
                assignedLocation,
                shiftId,
                joiningDate: getRequiredItem(new Date().toISOString().split('T'), 0, "RegisterStaffScreen.tsx"),
                verificationStatus: 'PENDING' as StaffVerificationStatus,
                notes
            });
            if (chatRole && channelAssignments.length > 0) {
                await chatRepository.assignUserChannels({
                    societyId: 'society-gv',
                    userId: result.id,
                    staffProfileId: result.id,
                    roleCode: chatRole,
                    assignments: channelAssignments,
                    assignedByUserId: 'admin-001',
                    hasGateOperationalAssignment: Boolean(assignedLocation.trim() && shiftId)
                });
            }
            AppAlert.alert(messages.staff.registration.successTitle, messages.staff.registration.successDescription, [
                {
                    text: messages.common.ok,
                    onPress: () => navigation.replace('StaffDetail', { staffId: result.id })
                },
            ]);
        }
        catch {
            AppAlert.alert(messages.staff.registration.failureTitle, messages.staff.registration.failureDescription);
        }
    };
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{messages.staff.registration.title}</Text>
        <Text style={styles.subtitle}>{messages.staff.registration.subtitle}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{messages.staff.registration.labels.fullName}</Text>
          <TextInput style={[styles.input, errors.name && styles.inputError]} placeholder={messages.staff.registration.placeholders.fullName} value={name} onChangeText={setName}/>
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{messages.staff.registration.labels.category}</Text>
          <View style={styles.categoryOptions}>
            {categoryOptions.map((option) => {
            const selected = category === option;
            return (<Pressable key={option} accessibilityRole="radio" accessibilityState={{ selected }} onPress={() => setCategory(option)} style={[styles.categoryOption, selected && styles.categoryOptionSelected]}>
                  <Text style={[styles.categoryOptionText, selected && styles.categoryOptionTextSelected]}>
                    {messages.staff.registration.categories[option]}
                  </Text>
                </Pressable>);
        })}
          </View>
        </View>

        {chatRole ? (<View style={styles.inputGroup}>
            <ChannelMembershipSelector channels={chatChannels} roleCode={chatRole} assignments={channelAssignments} onChange={setChannelAssignments}/>
            {errors.chatChannels ? <Text style={styles.errorText}>{errors.chatChannels}</Text> : null}
          </View>) : null}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{messages.staff.registration.labels.staffCode}</Text>
          <TextInput style={[styles.input, errors.staffCode && styles.inputError]} placeholder={messages.staff.registration.placeholders.staffCode} value={staffCode} onChangeText={setStaffCode}/>
          {errors.staffCode && <Text style={styles.errorText}>{errors.staffCode}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{messages.staff.registration.labels.mobile}</Text>
          <TextInput style={[styles.input, errors.mobile && styles.inputError]} placeholder={messages.staff.registration.placeholders.mobile} keyboardType="phone-pad" maxLength={10} value={mobile} onChangeText={setMobile}/>
          {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{messages.staff.registration.labels.emergencyContact}</Text>
          <TextInput style={styles.input} placeholder={messages.staff.registration.placeholders.emergencyContact} keyboardType="phone-pad" value={emergencyContact} onChangeText={setEmergencyContact}/>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{messages.staff.registration.labels.assignedLocation}</Text>
          <TextInput style={[styles.input, errors.assignedLocation && styles.inputError]} placeholder={messages.staff.registration.placeholders.assignedLocation} value={assignedLocation} onChangeText={setAssignedLocation}/>
          {errors.assignedLocation && <Text style={styles.errorText}>{errors.assignedLocation}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{messages.staff.registration.labels.vendorId}</Text>
          <TextInput style={styles.input} placeholder={messages.staff.registration.placeholders.vendorId} value={vendorId} onChangeText={setVendorId}/>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{messages.staff.registration.labels.notes}</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder={messages.staff.registration.placeholders.notes} multiline numberOfLines={4} value={notes} onChangeText={setNotes}/>
        </View>

        {chatRole && channelAssignments.length > 0 ? (<ChannelAssignmentSummary personName={name} roleLabel={messages.chat.membership.roleLabels[chatRole]} channels={chatChannels} assignments={channelAssignments}/>) : null}

        <Pressable style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed]} onPress={handleSubmit} disabled={isSubmitting}>
          <Text style={styles.submitText}>{isSubmitting ? messages.staff.registration.submitting : messages.staff.registration.submit}</Text>
        </Pressable>
      </View>
    </ScreenContainer>);
}

