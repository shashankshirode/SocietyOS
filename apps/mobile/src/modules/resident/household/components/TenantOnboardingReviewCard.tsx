import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import type { TenantOnboardingRequest } from "../data/residentHousehold.types";
import { t } from "./householdComponentUtils";
import { ResidentDisplayName } from "../../../../ui/typography/ResidentDisplayName";
import { safeDateFormat } from "../../../../shared/utils/formatters";
import { styles, createViewBackgroundColorBorderColorStyle } from "../styles/components/TenantOnboardingReviewCard.styles";
type TenantOnboardingReviewCardProps = {
    request: TenantOnboardingRequest;
};
export function TenantOnboardingReviewCard({ request }: TenantOnboardingReviewCardProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const rows = [
        { key: 'tenant', label: t(messages, 'resident.tenant.review.tenantName'), value: request.personalInfo?.fullName ?? t(messages, 'resident.tenant.review.notProvided') },
        { key: 'phone', label: t(messages, 'resident.tenant.review.phone'), value: request.personalInfo?.phoneNumber ?? t(messages, 'resident.tenant.review.notProvided') },
        { key: 'moveIn', label: t(messages, 'resident.tenant.review.moveIn'), value: request.agreement?.tenantMoveInDate ? safeDateFormat(request.agreement.tenantMoveInDate) : t(messages, 'resident.tenant.review.notProvided') },
        { key: 'occupants', label: t(messages, 'resident.tenant.review.occupants'), value: request.agreement ? String(request.agreement.numberOfOccupants) : t(messages, 'resident.tenant.review.notProvided') },
    ];
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
      <SafeText variant="bodyStrong" color="primary">{t(messages, 'resident.tenant.review.title')}</SafeText>
      {rows.map((row) => (<View key={row.key} style={styles.row}>
          <SafeText variant="caption" color="muted">{row.label}</SafeText>
          {row.key === 'tenant' ? (<ResidentDisplayName displayName={row.value} variant="caption" color="primary"/>) : (<SafeText variant="caption" color="primary">{row.value}</SafeText>)}
        </View>))}
    </View>);
}

