import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../../../../shared/components/SafeText';
import { AppButton } from '../../../../shared/components/AppButton';
import { StatusPill } from '../../../../ui/components/StatusPill';
import { useResidentTheme } from '../../../../ui/foundation/residentTheme';
import { useMessages } from '../../../../messages/useMessages';
import { styles, createRootStyle, createSurfaceStyle, createColorStyle, createBorderStyle } from '../styles/components/FilterModal.styles';
import { DocumentCategory, DocumentStatus, DocumentEntityType } from '../../../../shared/types/documentVault.types';
import { getDocumentCategoryLabel, getDocumentStatusLabel, getDocumentEntityTypeLabel } from '../../../utils/formatters';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: { category?: string; status?: string; entityType?: string }) => void;
  onClear: () => void;
  initialFilters?: {
    category?: string;
    status?: string;
    entityType?: string;
  };
}

const CATEGORIES = [
  'ALL', 'IDENTITY', 'ADDRESS_PROOF', 'KYC', 'OWNERSHIP_PROOF', 'RENTAL_AGREEMENT',
  'TENANCY_DOCUMENT', 'MOVE_IN_DOCUMENT', 'MOVE_OUT_DOCUMENT', 'NOC',
  'PARKING_DOCUMENT', 'VEHICLE_DOCUMENT', 'SOCIETY_DOCUMENT', 'INSURANCE',
  'MAINTENANCE_DOCUMENT', 'VENDOR_DOCUMENT', 'COMPLIANCE_DOCUMENT',
  'FINANCIAL_DOCUMENT', 'LEGAL_DOCUMENT', 'STAFF_CONTRACT', 'AMC',
  'PET_REGISTRATION', 'OTHER'
] as const;

const STATUSES = [
  'ALL', 'DRAFT', 'UPLOADING', 'UPLOADED', 'PENDING_VERIFICATION',
  'VERIFIED', 'REJECTED', 'EXPIRED', 'ARCHIVED', 'REVOKED', 'SUPERSEDED'
] as const;

const ENTITY_TYPES = [
  'ALL', 'USER', 'RESIDENT', 'OWNER', 'TENANT', 'UNIT', 'SOCIETY',
  'MOVE_IN_REQUEST', 'MOVE_OUT_REQUEST', 'NOC', 'VEHICLE', 'PARKING',
  'VENDOR', 'COMPLIANCE_RECORD', 'STAFF', 'ASSET'
] as const;

export function FilterModal({ visible, onClose, onApply, onClear, initialFilters }: FilterModalProps) {
  const theme = useResidentTheme();
  const [category, setCategory] = useState<string>(initialFilters?.category || 'ALL');
  const [status, setStatus] = useState<string>(initialFilters?.status || 'ALL');
  const [entityType, setEntityType] = useState<string>(initialFilters?.entityType || 'ALL');

  useEffect(() => {
    if (visible) {
      setCategory(initialFilters?.category || 'ALL');
      setStatus(initialFilters?.status || 'ALL');
      setEntityType(initialFilters?.entityType || 'ALL');
    }
  }, [visible, initialFilters]);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1} />
      <View style={[styles.modal, createSurfaceStyle(theme.surface)]}>
        <View style={[styles.handle, createBorderStyle(theme.border)]} />
        <SafeText variant="bodyStrong" style={createColorStyle(theme.textPrimary)}>Filters</SafeText>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <SafeText variant="tiny" style={[styles.sectionLabel, createColorStyle(theme.textMuted)]}>
              Category
            </SafeText>
            <View style={styles.chipContainer}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.chip,
                    category === cat ? styles.chipActive : styles.chipInactive,
                    createBorderStyle(theme.border)
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <SafeText variant="caption" style={[
                    styles.chipText,
                    category === cat ? styles.chipTextActive : styles.chipTextInactive
                  ]}>
                    {cat === 'ALL' ? 'All' : getDocumentCategoryLabel(cat as any)}
                  </SafeText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <SafeText variant="tiny" style={[styles.sectionLabel, createColorStyle(theme.textMuted)]}>
              Status
            </SafeText>
            <View style={styles.chipContainer}>
              {STATUSES.map(stat => (
                <TouchableOpacity
                  key={stat}
                  style={[
                    styles.chip,
                    status === stat ? styles.chipActive : styles.chipInactive,
                    createBorderStyle(theme.border)
                  ]}
                  onPress={() => setStatus(stat)}
                >
                  <SafeText variant="caption" style={[
                    styles.chipText,
                    status === stat ? styles.chipTextActive : styles.chipTextInactive
                  ]}>
                    {stat === 'ALL' ? 'All' : getDocumentStatusLabel(stat as any)}
                  </SafeText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <SafeText variant="tiny" style={[styles.sectionLabel, createColorStyle(theme.textMuted)]}>
              Entity Type
            </SafeText>
            <View style={styles.chipContainer}>
              {ENTITY_TYPES.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.chip,
                    entityType === type ? styles.chipActive : styles.chipInactive,
                    createBorderStyle(theme.border)
                  ]}
                  onPress={() => setEntityType(type)}
                >
                  <SafeText variant="caption" style={[
                    styles.chipText,
                    entityType === type ? styles.chipTextActive : styles.chipTextInactive
                  ]}>
                    {type === 'ALL' ? 'All' : getDocumentEntityTypeLabel(type as any)}
                  </SafeText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonRow}>
          <AppButton
            title="Clear Filters"
            variant="outline"
            onPress={onClear}
            fullWidth
          />
          <AppButton
            title="Apply Filters"
            variant="primary"
            onPress={() => {
              const filters: { category?: string; status?: string; entityType?: string } = {};
              if (category !== 'ALL') filters.category = category;
              if (status !== 'ALL') filters.status = status;
              if (entityType !== 'ALL') filters.entityType = entityType;
              onApply(filters);
            }}
            fullWidth
          />
        </View>
      </View>
    </Modal>
  );
}

export default FilterModal;