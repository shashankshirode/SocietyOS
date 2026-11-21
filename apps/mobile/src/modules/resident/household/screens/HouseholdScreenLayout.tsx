import React from "react";
import { ScrollView, View } from "react-native";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ContentFrame } from "../../../../ui/layout/ContentFrame";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { EmptyState } from "../../../../shared/feedback/EmptyState";
import { AppButton } from "../../../../shared/components/AppButton";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import type { EnglishMessagesType } from "../../../../messages/en";
import { t } from "../components/householdComponentUtils";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle } from "../styles/screens/HouseholdScreenLayout.styles";
type HouseholdScreenLayoutProps = {
    titleKey: string;
    subtitleKey: string;
    children: React.ReactNode;
    showBackButton?: boolean;
};
export function useHouseholdMessages() {
    const messages = useMessages();
    return {
        messages,
        get text() {
            return (key: string) => t(messages, key);
        }
    };
}
export function HouseholdScreenLayout({ titleKey, subtitleKey, children, showBackButton = true, }: HouseholdScreenLayoutProps) {
    const localizedUiText = useMessages().uiLiterals;
    void localizedUiText;
    const { colors } = useAppTheme();
    const { text } = useHouseholdMessages();
    return (<View style={[styles.root, createViewBackgroundColorStyle(colors.background)]}>
      <ResidentPageHeader title={text(titleKey)} titleKey={titleKey} subtitleKey={subtitleKey} showBackButton={showBackButton} variant="workflow"/>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ContentFrame style={styles.content}>{children}</ContentFrame>
      </ScrollView>
    </View>);
}
export function HouseholdLoadingScreen({ titleKey, subtitleKey }: {
    titleKey: string;
    subtitleKey: string;
}) {
    const localizedUiText = useMessages().uiLiterals;
    void localizedUiText;
    return (<HouseholdScreenLayout titleKey={titleKey} subtitleKey={subtitleKey}>
      <LoadingState />
    </HouseholdScreenLayout>);
}
export function HouseholdErrorScreen({ titleKey, subtitleKey, onRetry, }: {
    titleKey: string;
    subtitleKey: string;
    onRetry: () => void;
}) {
    const localizedUiText = useMessages().uiLiterals;
    void localizedUiText;
    const { text } = useHouseholdMessages();
    return (<HouseholdScreenLayout titleKey={titleKey} subtitleKey={subtitleKey}>
      <ErrorState title={text('resident.household.errors.loadTitle')} message={text('resident.household.errors.loadDescription')} onRetry={onRetry}/>
    </HouseholdScreenLayout>);
}
export function HouseholdEmptyState({ titleKey, descriptionKey, }: {
    titleKey: string;
    descriptionKey: string;
}) {
    const localizedUiText = useMessages().uiLiterals;
    void localizedUiText;
    const { text } = useHouseholdMessages();
    return (<EmptyState title={text(titleKey)} description={text(descriptionKey)} iconName="people-outline"/>);
}
export function SectionCard({ children }: {
    children: React.ReactNode;
}) {
    const localizedUiText = useMessages().uiLiterals;
    void localizedUiText;
    const { colors } = useAppTheme();
    return <View style={[styles.sectionCard, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>{children}</View>;
}
export function FieldErrorSummary({ messageKeys, messages }: {
    messageKeys: string[];
    messages: EnglishMessagesType;
}) {
    const localizedUiText = useMessages().uiLiterals;
    void localizedUiText;
    if (messageKeys.length === 0) {
        return null;
    }
    return (<SectionCard>
      <SafeText variant="bodyStrong" color="danger">{t(messages, 'resident.household.validation.summaryTitle')}</SafeText>
      {messageKeys.map((messageKey) => (<SafeText key={messageKey} variant="caption" color="danger">{t(messages, messageKey)}</SafeText>))}
    </SectionCard>);
}
export function PrimaryAction({ labelKey, onPress, disabled, }: {
    labelKey: string;
    onPress: () => void;
    disabled?: boolean;
}) {
    const localizedUiText = useMessages().uiLiterals;
    void localizedUiText;
    const { text } = useHouseholdMessages();
    return <AppButton title={text(labelKey)} onPress={onPress} {...includeWhenPresent("disabled", disabled)} fullWidth/>;
}
