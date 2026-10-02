import { useState, useCallback, useMemo } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResidentTheme } from '../../../../ui/foundation/residentTheme';
import { ResidentPageHeader } from '../../../../ui/patterns/ResidentPageHeader';
import { DocumentVaultPanel } from '../../../../ui/patterns/DocumentVaultPanel';
import { DocumentVaultSkeleton } from '../../../../ui/skeletons/FeatureSkeletons';
import { ScreenEmptyState } from '../../../../ui/states/ScreenEmptyState';
import { ScreenErrorState } from '../../../../ui/states/ScreenErrorState';
import { useDocuments } from '../data/useDocuments';
import { useFeatureFlags } from '../../../../core/featureFlags/useFeatureFlag';
import { SafeText } from '../../../../shared/components/SafeText';
import { useMessages } from '../../../../shared/constants/useMessages';
import { styles, createRootStyle, createSurfaceStyle, createColorStyle, createBorderStyle } from '../styles/screens/DocumentVaultScreen.styles';
import { DocumentDetailScreen } from './DocumentDetailScreen';
import { UploadDocumentScreen } from './UploadDocumentScreen';
import { FilterModal } from '../components/FilterModal';
import { DocumentCategory, DocumentStatus, DocumentEntityType } from '../types/documentVault.types';
import { format } from 'date-fns';

type DocumentVaultScreenProps = {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
  initialFilter?: {
    category?: string;
    status?: string;
    entityType?: string;
  };
};

export function DocumentVaultScreen({ navigation, initialFilter }: DocumentVaultScreenProps) {
  const theme = useResidentTheme();
  const messages = useMessages();
  const copy = messages.documents;
  const { isEnabled } = useFeatureFlags();
  const { data: documents = [], isLoading, error, refetch } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | 'ALL'>('ALL');
  const [selectedEntityType, setSelectedEntityType] = useState<DocumentEntityType | 'ALL'>('ALL');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showUploadScreen, setShowUploadScreen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [sortBy, setSortBy] = useState<'uploadedAt' | 'title' | 'category' | 'status' | 'expiryDate'>('uploadedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const categories = ['ALL', 'IDENTITY', 'ADDRESS_PROOF', 'KYC', 'OWNERSHIP_PROOF', 'RENTAL_AGREEMENT', 'TENANCY_DOCUMENT', 'MOVE_IN_DOCUMENT', 'MOVE_OUT_DOCUMENT', 'NOC', 'PARKING_DOCUMENT', 'VEHICLE_DOCUMENT', 'SOCIETY_DOCUMENT', 'INSURANCE', 'MAINTENANCE_DOCUMENT', 'VENDOR_DOCUMENT', 'COMPLIANCE_DOCUMENT', 'FINANCIAL_DOCUMENT', 'LEGAL_DOCUMENT', 'STAFF_CONTRACT', 'AMC', 'PET_REGISTRATION', 'OTHER'] as const;

  const statuses = ['ALL', 'DRAFT', 'UPLOADING', 'UPLOADED', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED', 'EXPIRED', 'ARCHIVED', 'REVOKED', 'SUPERSEDED'] as const;

  const entityTypes = ['ALL', 'USER', 'RESIDENT', 'OWNER', 'TENANT', 'UNIT', 'SOCIETY', 'MOVE_IN_REQUEST', 'MOVE_OUT_REQUEST', 'NOC', 'VEHICLE', 'PARKING', 'VENDOR', 'COMPLIANCE_RECORD', 'STAFF', 'ASSET'] as const;

  const filteredDocuments = useMemo(() => {
    let filtered = documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.entityId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || doc.category === selectedCategory;
      const matchesStatus = selectedStatus === 'ALL' || doc.status === selectedStatus;
      const matchesEntityType = selectedEntityType === 'ALL' || doc.entityType === selectedEntityType;
      return matchesSearch && matchesCategory && matchesStatus && matchesEntityType;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'expiryDate':
          comparison = (a.expiryDate || '').localeCompare(b.expiryDate || '');
          break;
        default:
          comparison = new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [documents, searchQuery, selectedCategory, selectedStatus, selectedEntityType, sortBy, sortOrder]);

  const handleSort = (field: typeof sortBy) => {
    if (field === sortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleDocumentPress = (doc: Document) => {
    setSelectedDocument(doc);
  };

  const handleUpload = () => {
    setShowUploadScreen(true);
  };

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleFilterApply = (filters: { category?: string; status?: string; entityType?: string }) => {
    if (filters.category) setSelectedCategory(filters.category as DocumentCategory);
    if (filters.status) setSelectedStatus(filters.status as DocumentStatus);
    if (filters.entityType) setSelectedEntityType(filters.entityType as DocumentEntityType);
    setShowFilterModal(false);
  };

  const handleFilterClear = () => {
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSelectedEntityType('ALL');
    setSearchQuery('');
  };

  if (!isEnabled('documentVault')) {
    return (
      <SafeAreaView style={[styles.root, createRootStyle(theme.background)]}>
        <ResidentPageHeader title={copy.archiveTitle} showBackButton onBack={navigation.goBack} />
        <ScreenEmptyState
          title={copy.featureDisabledTitle}
          description={copy.featureDisabledDesc}
          iconName="lock-closed-outline"
        />
      </SafeAreaView>
    );
  }

  if (isLoading && documents.length === 0) {
    return (
      <SafeAreaView style={[styles.root, createRootStyle(theme.background)]}>
        <ResidentPageHeader title={copy.archiveTitle} showBackButton onBack={navigation.goBack} />
        <View style={styles.loadingContainer}>
          <DocumentVaultSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  if (error && documents.length === 0) {
    return (
      <SafeAreaView style={[styles.root, createRootStyle(theme.background)]}>
        <ResidentPageHeader title={copy.archiveTitle} showBackButton onBack={navigation.goBack} />
        <ScreenErrorState
          title={copy.errorTitle}
          message={copy.errorDescription}
          onRetry={refetch}
          canRetry={error.retryable !== false}
        />
      </SafeAreaView>
    );
  }

  const hasActiveFilters = selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || selectedEntityType !== 'ALL' || searchQuery;

  return (
    <SafeAreaView style={[styles.root, createRootStyle(theme.background)]}>
      <ResidentPageHeader
        title={copy.archiveTitle}
        subtitle={copy.archiveSubtitle}
        showBackButton
        onBack={navigation.goBack}
        action={{
          label: hasActiveFilters ? 'Clear Filters' : 'Filter',
          onPress: () => setShowFilterModal(true),
        }}
      />

      <View style={[styles.searchBar, createBorderStyle(theme.border)]}>
        <TextInput
          placeholder={copy.searchPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          placeholderTextColor={theme.textMuted}
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {documents.length === 0 ? (
          <ScreenEmptyState
            title={copy.emptyTitle}
            description={copy.emptyDescription}
            iconName="folder-open-outline"
            primaryAction={{ label: copy.uploadCommand, onPress: handleUpload }}
          />
        ) : (
          <>
            <DocumentVaultPanel
              documents={filteredDocuments.map(doc => ({
                id: doc.id,
                title: doc.title,
                category: doc.category,
                status: doc.status,
                sensitive: doc.sensitivity === 'SENSITIVE' || doc.sensitivity === 'HIGHLY_SENSITIVE' || doc.sensitivity === 'RESTRICTED',
                readinessLabel: doc.expiryDate ? `Expires ${format(new Date(doc.expiryDate), 'MMM d, yyyy')}` : undefined,
              }))}
              onDocumentPress={handleDocumentPress}
              onAddDocumentPress={handleUpload}
              sectionTitle={copy.sectionTitle}
              sectionSubtitle={copy.sectionSubtitle}
              summaryLabels={{
                verified: copy.verifiedCount,
                pending: copy.pendingCount,
                required: copy.requiredCount,
                expiring: copy.expiringCount,
              }}
            />

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <SafeText variant="bodyStrong" style={createColorStyle(theme.textPrimary)}>
                  {filteredDocuments.filter(d => d.status === 'VERIFIED').length}
                </SafeText>
                <SafeText variant="tiny" style={createColorStyle(theme.textMuted)}>{copy.verifiedLabel}</SafeText>
              </View>
              <View style={styles.statItem}>
                <SafeText variant="bodyStrong" style={createColorStyle(theme.warning)}>
                  {filteredDocuments.filter(d => d.status === 'PENDING_VERIFICATION').length}
                </SafeText>
                <SafeText variant="tiny" style={createColorStyle(theme.textMuted)}>{copy.pendingLabel}</SafeText>
              </View>
              <View style={styles.statItem}>
                <SafeText variant="bodyStrong" style={createColorStyle(theme.danger)}>
                  {filteredDocuments.filter(d => d.status === 'REJECTED').length}
                </SafeText>
                <SafeText variant="tiny" style={createColorStyle(theme.textMuted)}>{copy.rejectedLabel}</SafeText>
              </View>
              <View style={styles.statItem}>
                <SafeText variant="bodyStrong" style={createColorStyle(theme.warning)}>
                  {filteredDocuments.filter(d => d.expiryDate && new Date(d.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length}
                </SafeText>
                <SafeText variant="tiny" style={createColorStyle(theme.textMuted)}>{copy.expiringLabel}</SafeText>
              </View>
            </View>

            <TouchableOpacity onPress={handleUpload} style={[styles.uploadButton, createSurfaceStyle(theme.accentSoft), createBorderStyle(theme.border)]}>
              <View style={styles.uploadButtonIcon}><Ionicons name="add" size={24} color={theme.accent} /></View>
              <View style={styles.uploadButtonText}>
                <SafeText variant="bodyStrong" style={createColorStyle(theme.textPrimary)}>{copy.uploadCommand}</SafeText>
                <SafeText variant="caption" style={createColorStyle(theme.textSecondary)}>{copy.uploadCommandDescription}</SafeText>
              </View>
              <Ionicons name="arrow-forward" size={20} color={theme.textPrimary} />
            </TouchableOpacity>

            <View style={styles.securityNote}>
              <Ionicons name="shield-checkmark-outline" size={18} color={theme.textMuted} />
              <View style={styles.securityCopy}>
                <SafeText variant="caption" style={createColorStyle(theme.textPrimary)}>{copy.protectedAccess}</SafeText>
                <SafeText variant="tiny" style={createColorStyle(theme.textMuted)}>{copy.protectedAccessDescription}</SafeText>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {selectedDocument && (
        <DocumentDetailScreen
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onUploadNewVersion={() => {
            setSelectedDocument(null);
            setShowUploadScreen(true);
          }}
        />
      )}

      {showUploadScreen && (
        <UploadDocumentScreen
          onClose={() => setShowUploadScreen(false)}
          onSuccess={() => {
            setShowUploadScreen(false);
            refetch();
          }}
        />
      )}

      {showFilterModal && (
        <FilterModal
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApply={handleFilterApply}
          onClear={handleFilterClear}
          initialFilters={{
            category: selectedCategory,
            status: selectedStatus,
            entityType: selectedEntityType,
          }}
        />
      )}
    </SafeAreaView>
  );
}

export default DocumentVaultScreen;