import { View } from "react-native";
import { AppCheckbox } from "../../../../shared/forms/AppCheckbox";
import { AppSelect } from "../../../../shared/forms/AppSelect";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import type { FamilyAccessPermissions, FamilyDocumentAccessPermission, ProfileVisibility } from "../data/residentHousehold.types";
import { t } from "./householdComponentUtils";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle } from "../styles/components/FamilyAccessPermissionPanel.styles";
type FamilyAccessPermissionPanelProps = {
    value: FamilyAccessPermissions;
    onChange: (value: FamilyAccessPermissions) => void;
    disabledDocumentAccess?: boolean;
};
export function FamilyAccessPermissionPanel({ value, onChange, disabledDocumentAccess }: FamilyAccessPermissionPanelProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const update = (patch: Partial<FamilyAccessPermissions>) => onChange({ ...value, ...patch });
    return (<View style={[styles.panel, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
      <SafeText variant="bodyStrong" color="primary">{t(messages, 'resident.family.permissions.title')}</SafeText>
      <AppCheckbox checked={value.visitorApprovalPermission} onPress={() => update({ visitorApprovalPermission: !value.visitorApprovalPermission })} label={t(messages, 'resident.family.permissions.visitorApproval')}/>
      <AppCheckbox checked={value.noticeViewPermission} onPress={() => update({ noticeViewPermission: !value.noticeViewPermission })} label={t(messages, 'resident.family.permissions.noticeView')}/>
      <AppCheckbox checked={value.emergencyAccessPermission} onPress={() => update({ emergencyAccessPermission: !value.emergencyAccessPermission })} label={t(messages, 'resident.family.permissions.emergencyAccess')}/>
      <AppCheckbox checked={value.facilityBookingPermission} onPress={() => update({ facilityBookingPermission: !value.facilityBookingPermission })} label={t(messages, 'resident.family.permissions.facilityBooking')}/>
      <AppSelect<FamilyDocumentAccessPermission> label={t(messages, 'resident.family.permissions.documentAccess')} value={disabledDocumentAccess ? 'NONE' : value.documentAccessPermission} options={[
            { label: t(messages, 'resident.family.documentAccess.LIMITED'), value: 'LIMITED' },
            { label: t(messages, 'resident.family.documentAccess.NONE'), value: 'NONE' },
        ]} onChange={(documentAccessPermission) => update({ documentAccessPermission })} {...includeWhenPresent("disabled", disabledDocumentAccess)}/>
      {disabledDocumentAccess ? (<SafeText variant="tiny" style={createSafeTextColorStyle(colors.danger)}>
          {t(messages, 'resident.family.permissions.minorDocumentWarning')}
        </SafeText>) : null}
      <AppSelect<ProfileVisibility> label={t(messages, 'resident.family.permissions.profileVisibility')} value={value.profileVisibility} options={[
            { label: t(messages, 'resident.family.profileVisibility.HOUSEHOLD_ONLY'), value: 'HOUSEHOLD_ONLY' },
            { label: t(messages, 'resident.family.profileVisibility.SOCIETY_DIRECTORY'), value: 'SOCIETY_DIRECTORY' },
            { label: t(messages, 'resident.family.profileVisibility.HIDDEN'), value: 'HIDDEN' },
        ]} onChange={(profileVisibility) => update({ profileVisibility })}/>
    </View>);
}

