import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { DocumentInfo } from '../../../../shared/types/document.types';
import { formatResidentDate } from '../../../../core/localization/dateTimeFormatters';
import { getDocumentCategoryLabel } from '../../../../shared/utils/formatters';
import { useFeatureFlags } from '../../../../core/featureFlags/useFeatureFlag';
import { SafeText } from '../../../../shared/components/SafeText';
import { useMessages } from '../../../../shared/constants/useMessages';
import { useResidentTheme } from '../../../../ui/foundation/residentTheme';
import { ResidentPageHeader } from '../../../../ui/patterns/ResidentPageHeader';
import { ScreenEmptyState } from '../../../../ui/states/ScreenEmptyState';
import { ScreenErrorState } from '../../../../ui/states/ScreenErrorState';
import { DocumentVaultSkeleton } from '../../../../ui/skeletons/FeatureSkeletons';
import { useDocuments } from '../data/useDocuments';
import { createAccentStyle, createBorderStyle, createColorStyle, createRootStyle, createSurfaceStyle, styles } from '../styles/screens/DocumentVaultHomeScreen.styles';

type Props = {
  navigation: {
    navigate: (screen: string, params?: JsonObject) => void;
    goBack: () => void;
  };
};

function documentTimestamp(document: DocumentInfo): number {
  return Date.parse(document.uploadedDate ?? document.verifiedDate ?? document.expiryDate ?? '') || 0;
}

function DocumentRow({ document, onPress }: { document: DocumentInfo; onPress: () => void }) {
  const theme = useResidentTheme();
  const copy = useMessages().documents;
  const dateLabel = document.expiryDate
    ? `${copy.expires} ${formatResidentDate(document.expiryDate)}`
    : document.verifiedDate
      ? `${copy.issued} ${formatResidentDate(document.verifiedDate)}`
      : document.uploadedDate
        ? `${copy.uploaded} ${formatResidentDate(document.uploadedDate)}`
        : copy.permanent;
  return (
    <Pressable onPress={onPress} style={[styles.documentRow, createBorderStyle(theme.border)]} accessibilityRole="button" accessibilityLabel={document.title}>
      <View style={styles.documentCopy}>
        <SafeText variant="tiny" style={createColorStyle(theme.textMuted)}>{getDocumentCategoryLabel(document.category)}</SafeText>
        <SafeText variant="title" style={createColorStyle(theme.textPrimary)} numberOfLines={2}>{document.title}</SafeText>
        <SafeText variant="caption" style={createColorStyle(theme.textSecondary)}>{dateLabel} · {document.status.replaceAll('_', ' ')}</SafeText>
      </View>
      <Ionicons name={document.sensitivity === 'PUBLIC' ? 'arrow-forward' : 'lock-closed-outline'} size={18} color={theme.textSecondary} />
    </Pressable>
  );
}

export function DocumentVaultHomeScreen({ navigation }: Props) {
  const theme = useResidentTheme();
  const messages = useMessages();
  const copy = messages.documents;
  const { isEnabled } = useFeatureFlags();
  const { data: documents = [], isLoading, error, refetch } = useDocuments();
  const ordered = useMemo(() => [...documents].sort((left, right) => documentTimestamp(right) - documentTimestamp(left)), [documents]);
  const residenceDocuments = ordered.filter((document) => !document.isSocietyDoc);
  const societyDocuments = ordered.filter((document) => document.isSocietyDoc);
  const openDocument = (document: DocumentInfo) => navigation.navigate('DocumentDetail', { documentId: document.id });
  const header = <ResidentPageHeader title={copy.archiveTitle} subtitle={copy.archiveSubtitle} showBackButton />;

  if (!isEnabled('documentVault')) return <View style={[styles.root, createRootStyle(theme.background)]}>{header}<ScreenEmptyState title={copy.featureDisabledTitle} description={copy.featureDisabledDesc} iconName="lock-closed-outline" /></View>;
  if (isLoading) return <View style={[styles.root, createRootStyle(theme.background)]}>{header}<View style={styles.loading}><DocumentVaultSkeleton /></View></View>;
  if (error) return <View style={[styles.root, createRootStyle(theme.background)]}>{header}<ScreenErrorState title={copy.errorTitle} message={copy.errorDescription} onRetry={refetch} canRetry={error.retryable !== false} /></View>;

  return (
    <View style={[styles.root, createRootStyle(theme.background)]}>
      {header}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, createSurfaceStyle(theme.accentSoft)]}>
          <SafeText variant="h1" style={createColorStyle(theme.textPrimary)}>{copy.archiveSubtitle}</SafeText>
          <SafeText variant="body" style={createColorStyle(theme.textSecondary)}>{copy.archiveDescription}</SafeText>
          <View style={styles.archiveMark} accessible={false}>
            <View style={[styles.archiveLine, createAccentStyle(theme.accent)]} />
            <View style={[styles.archiveLineShort, createAccentStyle(theme.accent)]} />
          </View>
        </View>

        {ordered.length === 0 ? (
          <ScreenEmptyState title={copy.emptyTitle} description={copy.emptyDescription} iconName="folder-open-outline" primaryAction={{ label: copy.uploadCommand, onPress: () => navigation.navigate('UploadDocument') }} />
        ) : (
          <>
            <View style={styles.section}>
              <SafeText variant="tiny" style={[styles.sectionLabel, createColorStyle(theme.textMuted)]}>{copy.recent}</SafeText>
              {ordered.slice(0, 3).map((document) => <DocumentRow key={document.id} document={document} onPress={() => openDocument(document)} />)}
            </View>
            <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <SafeText variant="tiny" style={[styles.sectionLabel, createColorStyle(theme.textMuted)]}>{copy.yourHome}</SafeText>
                <Pressable onPress={() => navigation.navigate('MyDocuments')} accessibilityRole="button"><SafeText variant="caption" style={createColorStyle(theme.accent)}>{copy.viewAll} →</SafeText></Pressable>
              </View>
              {residenceDocuments.slice(0, 4).map((document) => <DocumentRow key={document.id} document={document} onPress={() => openDocument(document)} />)}
            </View>
            {societyDocuments.length > 0 ? <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <SafeText variant="tiny" style={[styles.sectionLabel, createColorStyle(theme.textMuted)]}>{copy.society}</SafeText>
                <Pressable onPress={() => navigation.navigate('SocietyDocuments')} accessibilityRole="button"><SafeText variant="caption" style={createColorStyle(theme.accent)}>{copy.viewAll} →</SafeText></Pressable>
              </View>
              {societyDocuments.slice(0, 3).map((document) => <DocumentRow key={document.id} document={document} onPress={() => openDocument(document)} />)}
            </View> : null}
          </>
        )}

        <Pressable onPress={() => navigation.navigate('UploadDocument')} style={[styles.command, createSurfaceStyle(theme.surfaceRaised), createBorderStyle(theme.border)]} accessibilityRole="button">
          <View style={[styles.commandIcon, createSurfaceStyle(theme.accentSoft)]}><Ionicons name="add" size={24} color={theme.accent} /></View>
          <View style={styles.commandCopy}><SafeText variant="bodyStrong" style={createColorStyle(theme.textPrimary)}>{copy.uploadCommand}</SafeText><SafeText variant="caption" style={createColorStyle(theme.textSecondary)}>{copy.uploadCommandDescription}</SafeText></View>
          <Ionicons name="arrow-forward" size={20} color={theme.textPrimary} />
        </Pressable>

        <View style={styles.securityNote}>
          <Ionicons name="shield-checkmark-outline" size={18} color={theme.textMuted} />
          <View style={styles.securityCopy}><SafeText variant="caption" style={createColorStyle(theme.textPrimary)}>{copy.protectedAccess}</SafeText><SafeText variant="tiny" style={createColorStyle(theme.textMuted)}>{copy.protectedAccessDescription}</SafeText></View>
        </View>
      </ScrollView>
    </View>
  );
}

export default DocumentVaultHomeScreen;
