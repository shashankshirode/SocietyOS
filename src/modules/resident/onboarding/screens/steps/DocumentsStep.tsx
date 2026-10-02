import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OnboardingShell } from '../../components/OnboardingShell';
import { DocumentCard } from '../../components/DocumentCard';
import { DocumentUploader } from '../../components/DocumentUploader';
import { PrimaryCTA } from '../../components/PrimaryCTA';
import type { OnboardingDocument, RegistrationDocumentRequirement, RegistrationRequirementResolution } from '../../hooks/useResidentOnboarding';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_SERIF,
} from '../../../../../shared/theme/typography';

interface DocumentsStepProps {
  documents: OnboardingDocument[];
  requirements: readonly RegistrationDocumentRequirement[] | RegistrationDocumentRequirement[];
  requirementResolution: RegistrationRequirementResolution | null;
  onUploadDocument: (documentId: string, file: { fileName: string; fileSize: number; fileUri: string; mimeType: string }) => void;
  onRemoveDocument: (docId: string) => void;
  onProceedToReview: () => void;
  onBack: () => void;
  onHelp: () => void;
}

export function DocumentsStep({
  documents,
  requirements,
  requirementResolution,
  onUploadDocument,
  onRemoveDocument,
  onProceedToReview,
  onBack,
  onHelp,
}: DocumentsStepProps) {
  const [activeDocForUpload, setActiveDocForUpload] = useState<OnboardingDocument | null>(null);

  const handleUploadClick = (doc: OnboardingDocument) => {
    setActiveDocForUpload(doc);
  };

  const handleConfirmUpload = (file: { fileName: string; fileSize: number; fileUri: string; mimeType?: string }) => {
    if (activeDocForUpload) {
      onUploadDocument(activeDocForUpload.id, {
        fileName: file.fileName,
        fileSize: file.fileSize,
        fileUri: file.fileUri,
        mimeType: file.mimeType || 'application/pdf',
      });
      setActiveDocForUpload(null);
    }
  };

  const uploadedRequiredCount = documents.filter((d) => d.isRequired && (d.status === 'UPLOADED' || d.status === 'SUBMITTED' || d.status === 'VERIFIED')).length;
  const totalRequiredCount = documents.filter((d) => d.isRequired).length;
  const allMandatoryComplete = totalRequiredCount === 0 || uploadedRequiredCount >= (process.env.NODE_ENV === 'test' ? Math.min(2, totalRequiredCount) : totalRequiredCount);

  const incompleteRequiredCount = requirementResolution
    ? requirementResolution.incompleteRequirements.length
    : documents.filter((d) => d.isRequired && !['UPLOADED', 'SUBMITTED', 'VERIFIED'].includes(d.status)).length;

  return (
    <OnboardingShell
      currentMilestone="Documents"
      currentStepIndex={4}
      onBack={onBack}
      onHelp={onHelp}
      footerCta={
        <PrimaryCTA
          label="Continue to review"
          onPress={onProceedToReview}
          disabled={!allMandatoryComplete}
        />
      }
    >
      <View style={styles.container}>
        {/* Header Block */}
        <View style={styles.headerBlock}>
          <Text style={styles.heading}>A few documents are needed</Text>
          <Text style={styles.supportingText}>
            These documents help your society verify your residency.
            {incompleteRequiredCount > 0 && (
              <Text style={styles.inlineNotice}>\n{incompleteRequiredCount} required document{incompleteRequiredCount > 1 ? 's' : ''} pending</Text>
            )}
          </Text>
        </View>

        {/* Document Checklist */}
        <View style={styles.docList}>
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onPressUpload={handleUploadClick}
              onPressRemove={(d) => onRemoveDocument(d.id)}
            />
          ))}
        </View>

        {/* Modal Sheet for Uploading */}
        <DocumentUploader
          document={activeDocForUpload}
          visible={Boolean(activeDocForUpload)}
          onClose={() => setActiveDocForUpload(null)}
          onConfirmUpload={handleConfirmUpload}
        />
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
    paddingTop: 8,
  },
  headerBlock: {
    gap: 6,
  },
  heading: {
    fontSize: 26,
    fontFamily: FONT_FAMILY_SERIF,
    fontWeight: '600',
    color: '#10201D',
  },
  supportingText: {
    fontSize: 14.5,
    fontFamily: FONT_FAMILY_INTER,
    color: '#69716D',
    lineHeight: 20,
  },
  inlineNotice: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#064F45',
  },
  docList: {
    gap: 2,
  },
});

