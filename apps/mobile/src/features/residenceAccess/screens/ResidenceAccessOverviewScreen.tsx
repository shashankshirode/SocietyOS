import { View } from "react-native";
import { ScreenScaffold } from "../../../shared/layout/ScreenScaffold";
import { AppText } from "../../../shared/components/AppText";
import { AppButton } from "../../../shared/components/AppButton";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { residenceAccessMessages, residenceAccessStatusLabels, residenceRoleLabels, restrictedFeatureLabels } from "../../../messages/en/residenceAccess.messages";
import type { ResidenceAccessDetail, ResidenceAccessRepositoryError } from "../models/residenceAccess.types";
import { presentResidenceDate, presentResidenceDateOnly } from "../services/residenceAccessDateTime";
import { ResidenceAccessPageHeader } from "../components/ResidenceAccessPageHeader";
import { ResidenceAccessErrorBanner } from "../components/ResidenceAccessErrorBanner";
import { ResidenceStatusBadge } from "../components/ResidenceStatusBadge";
import { ResidenceAccessTimeline } from "../components/ResidenceAccessTimeline";
import { StatusExplanationPanel } from "../components/StatusExplanationPanel";
import { styles, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2 } from "../styles/screens/ResidenceAccessOverviewScreen.styles";
interface ResidenceAccessOverviewScreenProps {
    readonly detail: ResidenceAccessDetail;
    readonly error: ResidenceAccessRepositoryError | null;
    readonly onBack: () => void;
    readonly onShowStatus: () => void;
    readonly onEnter: () => void;
    readonly onReactivate: () => void;
    readonly onContact: () => void;
    readonly onRefresh: () => void;
    readonly onDismissError: () => void;
}
export function ResidenceAccessOverviewScreen({ detail, error, onBack, onShowStatus, onEnter, onReactivate, onContact, onRefresh, onDismissError, }: ResidenceAccessOverviewScreenProps) {
    const { colors } = useAppTheme();
    const record = detail.accessRecord;
    const starts = presentResidenceDate(record.effectiveFrom);
    const ended = presentResidenceDateOnly(record.effectiveUntil ?? record.statusUpdatedAt);
    const isFuture = record.status === 'APPROVED' && Boolean(record.effectiveFrom && new Date(record.effectiveFrom).getTime() > Date.now());
    const isInactive = record.status === 'INACTIVE' || record.status === 'ARCHIVED';
    const isRevoked = record.status === 'ACCESS_REVOKED';
    return (<ScreenScaffold scroll contentStyle={styles.content}>
      <ResidenceAccessPageHeader title={residenceAccessMessages.overview.title} subtitle={`${detail.residence.societyName} · ${detail.residence.unitNumber}`} onBack={onBack}/>
      {error ? <ResidenceAccessErrorBanner error={error} onRetry={onRefresh} onDismiss={onDismissError}/> : null}
      <ResidenceStatusBadge status={record.status}/>
      <StatusExplanationPanel title={isFuture
            ? residenceAccessMessages.overview.futureTitle
            : isRevoked
                ? residenceAccessMessages.overview.revokedTitle
                : record.status === 'APPROVED'
                    ? residenceAccessMessages.overview.approvedTitle
                    : residenceAccessStatusLabels[record.status]} body={isFuture
            ? residenceAccessMessages.overview.futureStarts(starts.absolute)
            : isRevoked
                ? record.statusReason
                : record.status === 'APPROVED'
                    ? residenceAccessMessages.overview.approvedBody
                    : record.statusReason} tone={record.status === 'ACTIVE' ? 'success' : isRevoked ? 'danger' : 'info'}/>
      {isRevoked ? (<StatusExplanationPanel title={residenceAccessMessages.overview.revokedTitle} body={residenceAccessMessages.overview.revokedBody} tone="danger"/>) : null}
      <View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
        <AppText variant="caption" tone="secondary">{residenceAccessMessages.inactive.previousRole}</AppText>
        <AppText variant="bodySmall" weight="800">{residenceRoleLabels[record.role]}</AppText>
        {isInactive ? (<>
            <AppText variant="caption" tone="secondary">{residenceAccessMessages.inactive.deactivatedAt}</AppText>
            <AppText variant="bodySmall">{ended}</AppText>
            <AppText variant="caption" tone="secondary">{residenceAccessMessages.inactive.reactivationEligibility}</AppText>
            <AppText variant="bodySmall">{record.reactivationAllowed ? residenceAccessMessages.inactive.eligible : residenceAccessMessages.inactive.unavailable}</AppText>
          </>) : null}
      </View>
      {record.featureRestrictions.length > 0 ? (<View style={[styles.card, createViewBackgroundColorBorderColorStyle2(colors.warningSoft, colors.warning)]}>
          <AppText variant="sectionTitle" weight="800">{residenceAccessMessages.overview.restrictionsTitle}</AppText>
          <AppText variant="bodySmall">{residenceAccessMessages.restriction.body}</AppText>
          {record.featureRestrictions.map((restriction) => (<View key={`${restriction.feature}-${restriction.restrictedAt}`} style={styles.restriction}>
              <AppText variant="bodySmall" weight="700">{restrictedFeatureLabels[restriction.feature]}</AppText>
              <AppText variant="caption" tone="secondary">{restriction.reason}</AppText>
            </View>))}
        </View>) : null}
      <View style={styles.actions}>
        {detail.eligibility.canEnterResidence ? <AppButton title={detail.primaryAction.label} onPress={onEnter} fullWidth/> : null}
        {detail.eligibility.canRequestReactivation ? <AppButton title={residenceAccessMessages.expiry.submit} onPress={onReactivate} fullWidth/> : null}
        <AppButton title={residenceAccessMessages.overview.statusDetails} onPress={onShowStatus} variant="outline" fullWidth/>
        <AppButton title={residenceAccessMessages.common.contact} onPress={onContact} variant="ghost" fullWidth/>
      </View>
      <View style={styles.section}>
        <AppText variant="sectionTitle" weight="800">{residenceAccessMessages.overview.inactiveHistory}</AppText>
        <ResidenceAccessTimeline events={detail.timeline} initiallyExpanded/>
      </View>
    </ScreenScaffold>);
}

