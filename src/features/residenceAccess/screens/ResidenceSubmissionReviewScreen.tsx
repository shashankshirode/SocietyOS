import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { ScreenScaffold } from "../../../shared/layout/ScreenScaffold";
import { AppText } from "../../../shared/components/AppText";
import { AppButton } from "../../../shared/components/AppButton";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { residenceAccessMessages, residenceRoleLabels } from "../../../messages/en/residenceAccess.messages";
import type { ResidenceAccessDetail, ResidenceAccessRepositoryError } from "../models/residenceAccess.types";
import type { ResidenceAccessMutationName } from "../hooks/useResidenceAccessExperience";
import { ResidenceAccessPageHeader } from "../components/ResidenceAccessPageHeader";
import { ResidenceAccessErrorBanner } from "../components/ResidenceAccessErrorBanner";
import { styles, createPressableBorderColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2, createViewBorderColorStyle } from "../styles/screens/ResidenceSubmissionReviewScreen.styles";
interface DeclarationRowProps {
    readonly label: string;
    readonly checked: boolean;
    readonly onToggle: () => void;
}
function DeclarationRow({ label, checked, onToggle }: DeclarationRowProps) {
    const { colors } = useAppTheme();
    return (<Pressable onPress={onToggle} accessibilityRole="checkbox" accessibilityState={{ checked }} style={[styles.declaration, createPressableBorderColorStyle(checked ? colors.primary : colors.border)]}>
      <Ionicons name={checked ? 'checkbox' : 'square-outline'} size={22} color={checked ? colors.primary : colors.textMuted}/>
      <AppText variant="bodySmall" style={styles.declarationText}>
        {label}
      </AppText>
    </Pressable>);
}
interface ResidenceSubmissionReviewScreenProps {
    readonly detail: ResidenceAccessDetail;
    readonly residentName: string;
    readonly mobileNumber: string;
    readonly mode: 'INITIAL' | 'CORRECTION';
    readonly activeMutation: ResidenceAccessMutationName | null;
    readonly error: ResidenceAccessRepositoryError | null;
    readonly onBack: () => void;
    readonly onSubmitInitial: (accurate: boolean, rules: boolean, consent: boolean) => Promise<boolean>;
    readonly onSubmitCorrection: (affectedRequirementIds: readonly string[]) => Promise<boolean>;
    readonly onSubmitted: () => void;
    readonly onDismissError: () => void;
}
export function ResidenceSubmissionReviewScreen({ detail, residentName, mobileNumber, mode, activeMutation, error, onBack, onSubmitInitial, onSubmitCorrection, onSubmitted, onDismissError, }: ResidenceSubmissionReviewScreenProps) {
    const { colors } = useAppTheme();
    const [accurate, setAccurate] = useState(false);
    const [rules, setRules] = useState(false);
    const [consent, setConsent] = useState(false);
    const currentDecision = detail.decisions[0];
    const documents = detail.documents.map((document) => {
        const requirement = detail.requirements.find((entry) => entry.requirementId === document.requirementId);
        const version = document.versions.find((entry) => entry.versionId === document.currentVersionId);
        return { document, requirement, version };
    });
    const optionalMissing = detail.requirements.filter((requirement) => !requirement.mandatory && requirement.verificationStatus === 'NOT_SUBMITTED');
    const canSubmit = mode === 'CORRECTION' || (accurate && rules && consent);
    const submit = async () => {
        const didSubmit = mode === 'CORRECTION'
            ? await onSubmitCorrection(currentDecision?.affectedRequirementIds ?? [])
            : await onSubmitInitial(accurate, rules, consent);
        if (didSubmit) {
            onSubmitted();
        }
    };
    return (<ScreenScaffold scroll keyboardAvoiding contentStyle={styles.content}>
      <ResidenceAccessPageHeader title={residenceAccessMessages.review.title} subtitle={`${detail.residence.societyName} · ${detail.residence.unitNumber}`} onBack={onBack}/>
      {error ? <ResidenceAccessErrorBanner error={error} onDismiss={onDismissError}/> : null}
      <View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
        <AppText variant="sectionTitle" weight="800">
          {residenceAccessMessages.review.residentDetails}
        </AppText>
        <AppText variant="bodySmall" weight="700">{residentName}</AppText>
        <AppText variant="caption" tone="secondary">{mobileNumber}</AppText>
      </View>
      <View style={[styles.card, createViewBackgroundColorBorderColorStyle2(colors.surface, colors.border)]}>
        <AppText variant="sectionTitle" weight="800">
          {residenceAccessMessages.review.residenceDetails}
        </AppText>
        <AppText variant="bodySmall" weight="700">{detail.residence.societyName}</AppText>
        <AppText variant="caption" tone="secondary">
          {`${detail.residence.unitNumber} · ${detail.residence.buildingName} · ${residenceRoleLabels[detail.residence.role]}`}
        </AppText>
        <AppText variant="tiny" tone="muted">{detail.accessRecord.referenceNumber}</AppText>
      </View>
      <View style={styles.section}>
        <AppText variant="sectionTitle" weight="800">
          {residenceAccessMessages.review.submittedDocuments}
        </AppText>
        {documents.map(({ document, requirement, version }) => (<View key={document.documentId} style={[styles.documentRow, createViewBorderColorStyle(colors.border)]}>
            <Ionicons name="document-text-outline" size={20} color={colors.primary}/>
            <View style={styles.documentText}>
              <AppText variant="bodySmall" weight="700">
                {requirement?.title ?? residenceAccessMessages.common.notAvailable}
              </AppText>
              <AppText variant="caption" tone="secondary" numberOfLines={1}>
                {version?.fileName ?? residenceAccessMessages.common.notAvailable}
              </AppText>
            </View>
          </View>))}
      </View>
      {optionalMissing.length > 0 ? (<View style={styles.section}>
          <AppText variant="sectionTitle" weight="800">
            {residenceAccessMessages.review.optionalMissing}
          </AppText>
          {optionalMissing.map((requirement) => (<AppText key={requirement.requirementId} variant="bodySmall" tone="secondary">
              {`• ${requirement.title}`}
            </AppText>))}
        </View>) : null}
      {mode === 'INITIAL' ? (<View style={styles.section}>
          <AppText variant="sectionTitle" weight="800">
            {residenceAccessMessages.review.declarations}
          </AppText>
          <DeclarationRow label={residenceAccessMessages.review.accurateDeclaration} checked={accurate} onToggle={() => setAccurate((value) => !value)}/>
          <DeclarationRow label={residenceAccessMessages.review.rulesDeclaration} checked={rules} onToggle={() => setRules((value) => !value)}/>
          <DeclarationRow label={residenceAccessMessages.review.privacyDeclaration} checked={consent} onToggle={() => setConsent((value) => !value)}/>
        </View>) : null}
      <AppButton title={mode === 'INITIAL'
            ? residenceAccessMessages.review.submit
            : residenceAccessMessages.decision.resubmitReview} onPress={submit} disabled={!canSubmit} loading={activeMutation === 'SUBMIT_FOR_REVIEW' || activeMutation === 'RESUBMIT_CORRECTION'} fullWidth/>
    </ScreenScaffold>);
}

