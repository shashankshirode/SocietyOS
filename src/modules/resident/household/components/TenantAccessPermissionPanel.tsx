import { View } from "react-native";
import { AppCheckbox } from "../../../../shared/forms/AppCheckbox";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import type { TenantAccessPermissionsInput } from "../data/residentHousehold.types";
import { t } from "./householdComponentUtils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle } from "../styles/components/TenantAccessPermissionPanel.styles";
type TenantAccessPermissionPanelProps = {
    value: TenantAccessPermissionsInput;
    onChange?: (value: TenantAccessPermissionsInput) => void;
    readOnly?: boolean;
};
const permissionKeys: (keyof TenantAccessPermissionsInput)[] = [
    'visitorApprovalAllowed',
    'complaintCreationAllowed',
    'facilityBookingAllowed',
    'residentConnectAllowed',
    'noticeViewAllowed',
    'billingViewAllowed',
    'documentUploadAllowed',
    'emergencyAllowed',
    'parkingRequestAllowed',
    'moveOutNocRequestAllowed',
];
export function TenantAccessPermissionPanel({ value, onChange, readOnly = false }: TenantAccessPermissionPanelProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const update = (key: keyof TenantAccessPermissionsInput) => onChange?.({ ...value, [key]: !value[key] });
    return (<View style={[styles.panel, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
      <SafeText variant="bodyStrong" color="primary">{t(messages, 'resident.tenant.permissions.title')}</SafeText>
      <SafeText variant="caption" color="muted" style={styles.safeTextMarginBottom}>
        {t(messages, 'resident.tenant.permissions.ownerSensitiveDocumentNote')}
      </SafeText>
      {permissionKeys.map((key) => {
            if (readOnly) {
                return (<View key={key} style={styles.readOnlyRow}>
              <Ionicons name={value[key] ? 'checkmark-circle' : 'close-circle'} size={16} color={value[key] ? colors.success : colors.textMuted}/>
              <SafeText variant="caption" style={createSafeTextColorStyle(colors.textPrimary)}>
                {t(messages, `resident.tenant.permissions.${key}`)}
              </SafeText>
            </View>);
            }
            return (<AppCheckbox key={key} checked={value[key]} onPress={() => update(key)} label={t(messages, `resident.tenant.permissions.${key}`)}/>);
        })}
    </View>);
}

