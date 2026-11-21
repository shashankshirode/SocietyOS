import { useState, useCallback, useMemo } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
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
import { FilterModal } from '../components/FilterModal';
import type { DocumentInfo, DocumentCategory, DocumentStatus } from '../../../../shared/types/document.types';
import type { DocumentCategory as DashboardDocCategory, DocumentStatus as DashboardDocStatus } from '../../dashboard/data/dashboard.types';

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

function mapToDashboardCategory(cat: string): DashboardDocCategory {
  const lower = cat.toLowerCase();
  if (lower.includes('rent')) return 'rentAgreement';
  if (lower.includes('police')) return 'policeVerification';
  if (lower.includes('noc')) return 'noc';
  if (lower.includes('cert') || lower.includes('deed')) return 'certificate';
  if (lower.includes('vehicle') || lower.includes('parking')) return 'vehicle';
  return 'kyc';
}

function mapToDashboardStatus(status: string): DashboardDocStatus {
  const upper = status.toUpperCase();
  if (upper === 'VERIFIED') return 'verified';
  if (upper === 'PENDING_VERIFICATION' || upper === 'UPLOADED') return 'pending';
  if (upper === 'EXPIRED') return 'expired';
  if (upper === 'REQUIRED') return 'missing';
  return 'pending';
}

export function DocumentVaultScreen({ navigation }: DocumentVaultScreenProps) {
  const theme = useResidentTheme();
  const messages = useMessages();
  const copy = messages.documents;
  const { isEnabled } = useFeatureFlags();
  const { data: documents = [], isLoading, error, refetch } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | 'ALL'>('ALL');
  const [selectedEntityType, setSelectedEntityType] = useState<string>('ALL');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState<'uploadedAt' | 'title' | 'category' | 'status' | 'expiryDate'>('uploadedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredDocuments = useMemo(() => {
    let filtered = documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.flatNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || doc.category === selectedCategory;
      const matchesStatus = selectedStatus === 'ALL' || doc.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
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
          comparison = new Date(b.uploadedDate || '').getTime() - new Date(a.uploadedDate || '').getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [documents, searchQuery, selectedCategory, selectedStatus, sortBy, sortOrder]);

  const handleDocumentPress = (id: string) => {
    navigation.navigate('DocumentDetail', { documentId: id });
  };

  const handleUpload = () => {
    navigation.navigate('UploadDocument');
  };

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleFilterApply = (filters: { category?: string; status?: string; entityType?: string }) => {
    if (filters.category) setSelectedCategory(filters.category as DocumentCategory);
    if (filters.status) setSelectedStatus(filters.status as DocumentStatus);
    if (filters.entityType) setSelectedEntityType(filters.entityType);
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
        <ResidentPageHeader title={copy.archiveTitle} showBackButton onBackPress={navigation.goBack} />
        <ScreenEmptyState
          title={copy.errorTitle}
          description={copy.errorDescription}
          iconName="lock-closed-outline"
        />
      </SafeAreaView>
    );
  }

  if (isLoading && documents.length === 0) {
    return (
      <SafeAreaView style={[styles.root, createRootStyle(theme.background)]}>
        <ResidentPageHeader title={copy.archiveTitle} showBackButton onBackPress={navigation.goBack} />
        <View style={styles.loadingContainer}>
          <DocumentVaultSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  if (error && documents.length === 0) {
    return (
      <SafeAreaView style={[styles.root, createRootStyle(theme.background)]}>
        <ResidentPageHeader title={copy.archiveTitle} showBackButton onBackPress={navigation.goBack} />
        <ScreenErrorState
          title={copy.errorTitle}
          message={copy.errorDescription}
          onRetry={refetch}
          canRetry={true}
        />
      </SafeAreaView>
    );
  }

  const hasActiveFilters = selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || selectedEntityType !== 'ALL' || Boolean(searchQuery);

  return (
    <SafeAreaView style={[styles.root, createRootStyle(theme.background)]}>
      <ResidentPageHeader
        title={copy.archiveTitle}
        subtitle={copy.archiveSubtitle}
        showBackButton
        onBackPress={navigation.goBack}
        rightAction={
          <TouchableOpacity onPress={() => setShowFilterModal(true)}>
            <SafeText variant="bodyStrong" style={createColorStyle(theme.accent)}>
              {hasActiveFilters ? 'Clear Filters' : 'Filter'}
            </SafeText>
          </TouchableOpacity>
        }
      />

      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <TextInput
          placeholder={copy.archiveTitle}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchBar, createBorderStyle(theme.border)]}
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
                category: mapToDashboardCategory(doc.category),
                status: mapToDashboardStatus(doc.status),
                sensitive: doc.sensitivity === 'RESTRICTED' || (doc.sensitivity as string) === 'SENSITIVE',
                ...(doc.expiryDate ? { readinessLabel: `Expires ${new Date(doc.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` } : {}),
              }))}
              onDocumentPress={handleDocumentPress}
              onAddDocumentPress={handleUpload}
              sectionTitle={copy.screenTitle}
              sectionSubtitle={copy.archiveSubtitle}
              summaryLabels={{
                verified: copy.statusVerified,
                pending: copy.statusPending,
                required: copy.statusMissing,
                expiring: copy.statusExpired,
              }}
            />

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <SafeText variant="bodyStrong" style={createColorStyle(theme.textPrimary)}>
                  {filteredDocuments.filter(d => d.status === 'VERIFIED').length}
                </SafeText>
                <SafeText variant="tiny" style={createColorStyle(theme.textMuted)}>{copy.statusVerified}</SafeText>
              </View>
              <View style={styles.statItem}>
                <SafeText variant="bodyStrong" style={createColorStyle(theme.warning)}>
                  {filteredDocuments.filter(d => d.status === 'PENDING_VERIFICATION').length}
                </SafeText>
                <SafeText variant="tiny" style={createColorStyle(theme.textMuted)}>{copy.statusPending}</SafeText>
              </View>
              <View style={styles.statItem}>
                <SafeText variant="bodyStrong" style={createColorStyle(theme.danger)}>
                  {filteredDocuments.filter(d => d.status === 'REJECTED').length}
                </SafeText>
                <SafeText variant="tiny" style={createColorStyle(theme.textMuted)}>Rejected</SafeText>
              </View>
              <View style={styles.statItem}>
                <SafeText variant="bodyStrong" style={createColorStyle(theme.warning)}>
                  {filteredDocuments.filter(d => d.expiryDate && new Date(d.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length}
                </SafeText>
                <SafeText variant="tiny" style={createColorStyle(theme.textMuted)}>{copy.statusExpired}</SafeText>
              </View>
            </View>

            <TouchableOpacity onPress={handleUpload} style={[styles.uploadButton, createSurfaceStyle(theme.accentSoft), createBorderStyle(theme.border), { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12 }]}>
              <View style={{ marginRight: 12 }}><Ionicons name="add" size={24} color={theme.accent} /></View>
              <View style={{ flex: 1 }}>
                <SafeText variant="bodyStrong" style={createColorStyle(theme.textPrimary)}>{copy.uploadCommand}</SafeText>
                <SafeText variant="caption" style={createColorStyle(theme.textSecondary)}>{copy.uploadCommandDescription}</SafeText>
              </View>
              <Ionicons name="arrow-forward" size={20} color={theme.textPrimary} />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 }}>
              <Ionicons name="shield-checkmark-outline" size={18} color={theme.textMuted} />
              <View style={{ flex: 1 }}>
                <SafeText variant="caption" style={createColorStyle(theme.textPrimary)}>{copy.protectedAccess}</SafeText>
                <SafeText variant="tiny" style={createColorStyle(theme.textMuted)}>{copy.protectedAccessDescription}</SafeText>
              </View>
            </View>
          </>
        )}
      </ScrollView>

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
