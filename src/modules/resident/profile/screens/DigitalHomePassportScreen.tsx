import { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { AppModal } from '../../../../ui/modal/AppModal';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useResidentTheme } from '../../../../ui/foundation/residentTheme';
import { ResidentPageHeader } from '../../../../ui/patterns/ResidentPageHeader';
import { SafeText } from '../../../../shared/components/SafeText';
import { ContentFrame } from '../../../../ui/layout/ContentFrame';
import { useResponsiveLayout } from '../../../../ui/layout/useResponsiveLayout';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useResidentHomeContexts } from '../../homeContext/hooks/useResidentHomeContexts';
import { activeHomeStore } from '../../homeContext/data/activeHomeStore';
import { useUnitOccupancyOverview } from '../hooks/useUnitOccupancyOverview';
import { ownerTenantRepository } from '../data/ownerTenant.repository';
import { useFamilyMembers } from '../../household/hooks/useFamilyMembers';
import { useOccupancyTimeline } from '../hooks/useOccupancyTimeline';
import { mockStore } from '../../../../core/mockStore/mockStore';
import type { DigitalHomePassportScreenProps } from '../../../../app/navigation/navigation.types';
import {
  createBgBorderColorStyle,
  createBgStyle,
  createBorderColorStyle,
  createTextColorStyle,
  styles,
} from '../styles/screens/DigitalHomePassportScreen.styles';

export function DigitalHomePassportScreen({ navigation, route }: DigitalHomePassportScreenProps) {
  const theme = useResidentTheme();
  const { isTablet } = useResponsiveLayout();
  const { activeContext } = useActiveResidentHome();
  const navigate = (screen: string, params?: any) => (navigation as any).navigate(screen, params);
  const { data: homeContexts = [] } = useResidentHomeContexts();

  const currentUnitId = route.params && 'unitId' in route.params && route.params.unitId
    ? route.params.unitId
    : activeContext.unitId;

  const { data: overview } = useUnitOccupancyOverview(currentUnitId);
  const { data: familyMembers = [] } = useFamilyMembers();
  const { data: occupancyTimeline = [] } = useOccupancyTimeline(currentUnitId);

  const [correctionModalVisible, setCorrectionModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState('Carpet Area');
  const [proposedValue, setProposedValue] = useState('');
  const [reason, setReason] = useState('');
  const [correctionSuccess, setCorrectionSuccess] = useState(false);

  const handleSwitchResidence = useCallback((contextId: string) => {
    activeHomeStore.setActiveContextId(contextId);
  }, []);

  const handleCorrectionSubmit = useCallback(async () => {
    if (!proposedValue.trim()) return;
    await ownerTenantRepository.createCorrectionRequest({
      unitId: currentUnitId,
      field: selectedField,
      currentValue: selectedField === 'Carpet Area' ? '1,450 sq ft' : 'Current Registry Record',
      proposedValue: proposedValue.trim(),
      reason: reason.trim() || 'Discrepancy reported by resident',
    });
    setCorrectionSuccess(true);
    setTimeout(() => {
      setCorrectionSuccess(false);
      setCorrectionModalVisible(false);
      setProposedValue('');
      setReason('');
    }, 1500);
  }, [currentUnitId, selectedField, proposedValue, reason]);

  const unit = overview?.unitDetails;
  const flatNumber = unit?.flatNumber || activeContext.flatNumber || 'A-1204';
  const towerName = unit?.tower || activeContext.wingName || activeContext.towerName || 'Tower A';
  const societyName = overview?.societyName || activeContext.societyName || 'Green Valley Heights';
  const carpetArea = unit?.carpetAreaSqFt ? `${unit.carpetAreaSqFt} sq ft` : '1,450 sq ft';

  const storeVehicles = mockStore.getState().vehicles;
  const filteredVehicles = useMemo(
    () => storeVehicles.filter((v) => v.unitId === currentUnitId || v.linkedFlat === flatNumber),
    [storeVehicles, currentUnitId, flatNumber]
  );

  const storeDocuments = mockStore.getState().documents;
  const verifiedDocsCount = useMemo(
    () => storeDocuments.filter((d) => d.status === 'VERIFIED').length,
    [storeDocuments]
  );
  const pendingDocsCount = useMemo(
    () => storeDocuments.filter((d) => d.status === 'PENDING_VERIFICATION').length,
    [storeDocuments]
  );

  const storeNocs = mockStore.getState().nocs;
  const residentNocs = useMemo(
    () => storeNocs.filter((n) => n.unitId === currentUnitId || n.flatNumber === flatNumber),
    [storeNocs, currentUnitId, flatNumber]
  );

  const roleLabel = activeContext.residentRole === 'owner'
    ? 'Primary Owner'
    : activeContext.residentRole === 'tenant'
    ? 'Tenant'
    : 'Family Member';

  return (
    <View style={[styles.root, createBgStyle(theme.background)]} testID="digital-home-passport-screen">
      <ResidentPageHeader
        title="Digital Home Passport"
        subtitle="Official Residential Identity & Property Records"
        showBackButton
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ContentFrame style={[styles.contentGrid, isTablet ? styles.tabletContentGrid : null]}>
          <View style={[styles.passportHeroCard, createBgBorderColorStyle(theme.surface, theme.border)]}>
            <View style={styles.passportHeaderRow}>
              <View style={styles.passportTitleCol}>
                <SafeText style={[styles.societyName, createTextColorStyle(theme.accent)]}>
                  {societyName}
                </SafeText>
                <View style={styles.unitHeadingRow}>
                  <SafeText style={[styles.flatNumberText, createTextColorStyle(theme.textPrimary)]}>
                    {flatNumber}
                  </SafeText>
                  <View style={[styles.verifiedPill, createBgStyle(theme.successSoft)]}>
                    <Ionicons name="checkmark-circle" size={14} color={theme.success} />
                    <SafeText style={[styles.verifiedPillText, createTextColorStyle(theme.success)]}>
                      Verified Unit
                    </SafeText>
                  </View>
                </View>
                <SafeText style={[styles.towerWingText, createTextColorStyle(theme.textSecondary)]}>
                  {towerName} · Floor {unit?.floor || '12'} · {activeContext.city}
                </SafeText>
              </View>
            </View>

            <View style={styles.badgesRow}>
              <View style={[styles.roleBadge, createBgStyle(theme.accentSoft)]}>
                <SafeText style={[styles.roleBadgeText, createTextColorStyle(theme.accent)]}>
                  {roleLabel}
                </SafeText>
              </View>
              <View style={[styles.roleBadge, createBgStyle(theme.surfaceRaised)]}>
                <SafeText style={[styles.roleBadgeText, createTextColorStyle(theme.textSecondary)]}>
                  {unit?.occupancyStatus || 'OWNER_OCCUPIED'}
                </SafeText>
              </View>
            </View>

            <View style={styles.architecturalSpecsGrid}>
              <View style={[styles.specChip, createBgBorderColorStyle(theme.surfaceRaised, theme.border)]}>
                <SafeText style={[styles.specLabel, createTextColorStyle(theme.textSecondary)]}>
                  Carpet Area
                </SafeText>
                <SafeText style={[styles.specValue, createTextColorStyle(theme.textPrimary)]}>
                  {carpetArea}
                </SafeText>
              </View>

              <View style={[styles.specChip, createBgBorderColorStyle(theme.surfaceRaised, theme.border)]}>
                <SafeText style={[styles.specLabel, createTextColorStyle(theme.textSecondary)]}>
                  Unit Layout
                </SafeText>
                <SafeText style={[styles.specValue, createTextColorStyle(theme.textPrimary)]}>
                  3 BHK Premium
                </SafeText>
              </View>

              <View style={[styles.specChip, createBgBorderColorStyle(theme.surfaceRaised, theme.border)]}>
                <SafeText style={[styles.specLabel, createTextColorStyle(theme.textSecondary)]}>
                  Facing
                </SafeText>
                <SafeText style={[styles.specValue, createTextColorStyle(theme.textPrimary)]}>
                  East Facing · Garden
                </SafeText>
              </View>

              <View style={[styles.specChip, createBgBorderColorStyle(theme.surfaceRaised, theme.border)]}>
                <SafeText style={[styles.specLabel, createTextColorStyle(theme.textSecondary)]}>
                  Meter EB / Gas
                </SafeText>
                <SafeText style={[styles.specValue, createTextColorStyle(theme.textPrimary)]}>
                  EB-884920 · PNG-049
                </SafeText>
              </View>
            </View>
          </View>

          {homeContexts.length > 1 ? (
            <View style={[styles.residenceSwitcherBar, createBgBorderColorStyle(theme.surface, theme.border)]}>
              <View style={styles.switcherHeader}>
                <SafeText style={[styles.switcherTitle, createTextColorStyle(theme.textPrimary)]}>
                  Linked Residences ({homeContexts.length})
                </SafeText>
                <Ionicons name="swap-horizontal" size={16} color={theme.accent} />
              </View>
              <View style={styles.residenceChipsRow}>
                {homeContexts.map((context) => {
                  const isCurrent = context.homeContextId === activeContext.homeContextId;
                  return (
                    <Pressable
                      key={context.homeContextId}
                      style={[
                        styles.residenceChip,
                        createBgBorderColorStyle(
                          isCurrent ? theme.accentSoft : theme.surfaceRaised,
                          isCurrent ? theme.accent : theme.border
                        ),
                        isCurrent ? styles.residenceChipActive : null,
                      ]}
                      onPress={() => handleSwitchResidence(context.homeContextId)}
                      accessibilityRole="button"
                      accessibilityLabel={`Switch to ${context.flatNumber} ${context.societyName}`}
                    >
                      <Ionicons
                        name={isCurrent ? 'home' : 'business-outline'}
                        size={14}
                        color={isCurrent ? theme.accent : theme.textSecondary}
                      />
                      <SafeText
                        style={[
                          styles.residenceChipText,
                          createTextColorStyle(isCurrent ? theme.accent : theme.textPrimary),
                        ]}
                      >
                        {context.flatNumber} · {context.societyName.split(' ')[0]}
                      </SafeText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          <View style={[styles.sectionCard, createBgBorderColorStyle(theme.surface, theme.border)]}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleGroup}>
                <Ionicons name="shield-checkmark-outline" size={18} color={theme.accent} />
                <SafeText style={[styles.sectionTitle, createTextColorStyle(theme.textPrimary)]}>
                  Authoritative Records
                </SafeText>
              </View>
              <View style={[styles.immutableBadge, createBgStyle(theme.surfaceRaised)]}>
                <SafeText style={[styles.immutableBadgeText, createTextColorStyle(theme.textSecondary)]}>
                  SOCIETY VERIFIED
                </SafeText>
              </View>
            </View>

            <View style={styles.recordsTable}>
              <View style={[styles.recordRow, createBorderColorStyle(theme.border)]}>
                <SafeText style={[styles.recordKey, createTextColorStyle(theme.textSecondary)]}>
                  Share Certificate Number
                </SafeText>
                <View style={styles.recordValueRow}>
                  <SafeText style={[styles.recordVal, createTextColorStyle(theme.textPrimary)]}>
                    SH-2024-0012
                  </SafeText>
                  <View style={[styles.immutableBadge, createBgStyle(theme.accentSoft)]}>
                    <SafeText style={[styles.immutableBadgeText, createTextColorStyle(theme.accent)]}>
                      IMMUTABLE
                    </SafeText>
                  </View>
                </View>
              </View>

              <View style={[styles.recordRow, createBorderColorStyle(theme.border)]}>
                <SafeText style={[styles.recordKey, createTextColorStyle(theme.textSecondary)]}>
                  Property Tax Assessment ID
                </SafeText>
                <View style={styles.recordValueRow}>
                  <SafeText style={[styles.recordVal, createTextColorStyle(theme.textPrimary)]}>
                    NMC-PT-2024-9912
                  </SafeText>
                  <View style={[styles.immutableBadge, createBgStyle(theme.accentSoft)]}>
                    <SafeText style={[styles.immutableBadgeText, createTextColorStyle(theme.accent)]}>
                      IMMUTABLE
                    </SafeText>
                  </View>
                </View>
              </View>

              <View style={[styles.recordRow, createBorderColorStyle(theme.border)]}>
                <SafeText style={[styles.recordKey, createTextColorStyle(theme.textSecondary)]}>
                  Society Registration Date
                </SafeText>
                <SafeText style={[styles.recordVal, createTextColorStyle(theme.textPrimary)]}>
                  12 Apr 2024
                </SafeText>
              </View>

              <View style={[styles.recordRow, createBorderColorStyle(theme.border)]}>
                <SafeText style={[styles.recordKey, createTextColorStyle(theme.textSecondary)]}>
                  Allocated Parking Bays
                </SafeText>
                <SafeText style={[styles.recordVal, createTextColorStyle(theme.textPrimary)]}>
                  B2-P114 (Car) · B2-P115 (Bike)
                </SafeText>
              </View>
            </View>

            <Pressable
              style={[styles.correctionBtn, createBgBorderColorStyle(theme.surfaceRaised, theme.border)]}
              onPress={() => setCorrectionModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Request property data correction"
            >
              <Ionicons name="create-outline" size={16} color={theme.accent} />
              <SafeText style={[styles.correctionBtnText, createTextColorStyle(theme.accent)]}>
                Request Property Data Correction
              </SafeText>
            </Pressable>
          </View>

          <View style={[styles.sectionCard, createBgBorderColorStyle(theme.surface, theme.border)]}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleGroup}>
                <Ionicons name="people-outline" size={18} color={theme.accent} />
                <SafeText style={[styles.sectionTitle, createTextColorStyle(theme.textPrimary)]}>
                  Household Members ({familyMembers.length + 1})
                </SafeText>
              </View>
              <Pressable
                onPress={() => navigate('HouseholdOverview')}
                accessibilityRole="button"
                accessibilityLabel="Manage household members"
              >
                <SafeText style={[styles.sectionActionText, createTextColorStyle(theme.accent)]}>
                  Manage
                </SafeText>
              </Pressable>
            </View>

            <View style={styles.householdMemberRow}>
              <View style={[styles.householdAvatar, createBgStyle(theme.accentSoft)]}>
                <SafeText style={[styles.householdAvatarText, createTextColorStyle(theme.accent)]}>
                  S
                </SafeText>
              </View>
              <View style={styles.householdDetails}>
                <SafeText style={[styles.householdName, createTextColorStyle(theme.textPrimary)]}>
                  Shashank Shirode
                </SafeText>
                <SafeText style={[styles.householdRole, createTextColorStyle(theme.textSecondary)]}>
                  Primary Owner · Full Access
                </SafeText>
              </View>
              <Ionicons name="shield-checkmark" size={16} color={theme.success} />
            </View>

            {familyMembers.map((member) => (
              <View key={member.id} style={styles.householdMemberRow}>
                <View style={[styles.householdAvatar, createBgStyle(theme.surfaceRaised)]}>
                  <SafeText style={[styles.householdAvatarText, createTextColorStyle(theme.textPrimary)]}>
                    {member.fullName.charAt(0)}
                  </SafeText>
                </View>
                <View style={styles.householdDetails}>
                  <SafeText style={[styles.householdName, createTextColorStyle(theme.textPrimary)]}>
                    {member.fullName}
                  </SafeText>
                  <SafeText style={[styles.householdRole, createTextColorStyle(theme.textSecondary)]}>
                    {member.relationToOwner} · {member.accessStatus}
                  </SafeText>
                </View>
                <Ionicons name="checkmark-circle-outline" size={16} color={theme.success} />
              </View>
            ))}
          </View>

          <View style={[styles.sectionCard, createBgBorderColorStyle(theme.surface, theme.border)]}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleGroup}>
                <Ionicons name="car-outline" size={18} color={theme.accent} />
                <SafeText style={[styles.sectionTitle, createTextColorStyle(theme.textPrimary)]}>
                  Vehicles & Parking ({filteredVehicles.length})
                </SafeText>
              </View>
              <Pressable
                onPress={() => navigate('ParkingStack', { screen: 'MyVehicles' })}
                accessibilityRole="button"
                accessibilityLabel="View all vehicles"
              >
                <SafeText style={[styles.sectionActionText, createTextColorStyle(theme.accent)]}>
                  View All
                </SafeText>
              </Pressable>
            </View>

            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <View
                  key={vehicle.id}
                  style={[styles.vehicleItemCard, createBgBorderColorStyle(theme.surfaceRaised, theme.border)]}
                >
                  <View style={styles.vehicleInfo}>
                    <SafeText style={[styles.vehiclePlate, createTextColorStyle(theme.textPrimary)]}>
                      {vehicle.vehicleNumber}
                    </SafeText>
                    <SafeText style={[styles.vehicleSub, createTextColorStyle(theme.textSecondary)]}>
                      {vehicle.makeModel} · {vehicle.vehicleType}
                    </SafeText>
                  </View>
                  <View style={[styles.vehicleSlotPill, createBgStyle(theme.accentSoft)]}>
                    <SafeText style={[styles.vehicleSlotPillText, createTextColorStyle(theme.accent)]}>
                      {vehicle.parkingSlotNumber || 'B2-P114'}
                    </SafeText>
                  </View>
                </View>
              ))
            ) : (
              <SafeText style={[styles.emptyNoticeText, createTextColorStyle(theme.textSecondary)]}>
                No vehicles registered for this residence.
              </SafeText>
            )}
          </View>

          <View style={[styles.sectionCard, createBgBorderColorStyle(theme.surface, theme.border)]}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleGroup}>
                <Ionicons name="file-tray-full-outline" size={18} color={theme.accent} />
                <SafeText style={[styles.sectionTitle, createTextColorStyle(theme.textPrimary)]}>
                  Document Vault
                </SafeText>
              </View>
              <Pressable
                onPress={() => navigate('DocumentVaultHome')}
                accessibilityRole="button"
                accessibilityLabel="Open document vault"
              >
                <SafeText style={[styles.sectionActionText, createTextColorStyle(theme.accent)]}>
                  Open Vault
                </SafeText>
              </Pressable>
            </View>

            <View style={styles.docVaultSummaryRow}>
              <View style={[styles.docVaultStat, createBgBorderColorStyle(theme.successSoft, theme.border)]}>
                <SafeText style={[styles.docVaultStatCount, createTextColorStyle(theme.success)]}>
                  {verifiedDocsCount}
                </SafeText>
                <SafeText style={[styles.docVaultStatLabel, createTextColorStyle(theme.textSecondary)]}>
                  Verified Documents
                </SafeText>
              </View>
              <View style={[styles.docVaultStat, createBgBorderColorStyle(theme.surfaceRaised, theme.border)]}>
                <SafeText style={[styles.docVaultStatCount, createTextColorStyle(theme.accent)]}>
                  {pendingDocsCount}
                </SafeText>
                <SafeText style={[styles.docVaultStatLabel, createTextColorStyle(theme.textSecondary)]}>
                  Pending Review
                </SafeText>
              </View>
            </View>
          </View>

          <View style={[styles.sectionCard, createBgBorderColorStyle(theme.surface, theme.border)]}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleGroup}>
                <Ionicons name="ribbon-outline" size={18} color={theme.accent} />
                <SafeText style={[styles.sectionTitle, createTextColorStyle(theme.textPrimary)]}>
                  Permissions & NOCs ({residentNocs.length})
                </SafeText>
              </View>
              <Pressable
                onPress={() => navigate('NocRequestList')}
                accessibilityRole="button"
                accessibilityLabel="View all NOC requests"
              >
                <SafeText style={[styles.sectionActionText, createTextColorStyle(theme.accent)]}>
                  View All
                </SafeText>
              </Pressable>
            </View>

            {residentNocs.slice(0, 3).map((noc) => (
              <View
                key={noc.id}
                style={[styles.vehicleItemCard, createBgBorderColorStyle(theme.surfaceRaised, theme.border)]}
              >
                <View style={styles.vehicleInfo}>
                  <SafeText style={[styles.vehiclePlate, createTextColorStyle(theme.textPrimary)]}>
                    {noc.nocType}
                  </SafeText>
                  <SafeText style={[styles.vehicleSub, createTextColorStyle(theme.textSecondary)]}>
                    {noc.reason || 'Resident application'}
                  </SafeText>
                </View>
                <View
                  style={[
                    styles.vehicleSlotPill,
                    createBgStyle(noc.status === 'APPROVED' ? theme.successSoft : theme.warningSoft),
                  ]}
                >
                  <SafeText
                    style={[
                      styles.vehicleSlotPillText,
                      createTextColorStyle(noc.status === 'APPROVED' ? theme.success : theme.warning),
                    ]}
                  >
                    {noc.status}
                  </SafeText>
                </View>
              </View>
            ))}
          </View>

          <View style={[styles.sectionCard, createBgBorderColorStyle(theme.surface, theme.border)]}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleGroup}>
                <Ionicons name="time-outline" size={18} color={theme.accent} />
                <SafeText style={[styles.sectionTitle, createTextColorStyle(theme.textPrimary)]}>
                  Residence History
                </SafeText>
              </View>
              <Pressable
                onPress={() => navigate('OccupancyTimeline', { unitId: currentUnitId })}
                accessibilityRole="button"
                accessibilityLabel="View full occupancy timeline"
              >
                <SafeText style={[styles.sectionActionText, createTextColorStyle(theme.accent)]}>
                  Full Timeline
                </SafeText>
              </Pressable>
            </View>

            {occupancyTimeline.slice(0, 3).map((event, idx) => (
              <View key={event.id} style={styles.timelineItem}>
                <View style={styles.timelineIconCol}>
                  <View style={[styles.timelineDot, createBgStyle(theme.accent)]} />
                  {idx < 2 ? <View style={[styles.timelineLine, createBgStyle(theme.border)]} /> : null}
                </View>
                <View style={styles.timelineContent}>
                  <SafeText style={[styles.timelineEventTitle, createTextColorStyle(theme.textPrimary)]}>
                    {event.eventTitle}
                  </SafeText>
                  <SafeText style={[styles.timelineEventDate, createTextColorStyle(theme.textSecondary)]}>
                    {event.eventDate} · {event.actorName}
                  </SafeText>
                  <SafeText style={[styles.timelineEventDesc, createTextColorStyle(theme.textSecondary)]}>
                    {event.description}
                  </SafeText>
                </View>
              </View>
            ))}
          </View>
        </ContentFrame>
      </ScrollView>

      <AppModal
        visible={correctionModalVisible}
        onClose={() => setCorrectionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, createBgStyle(theme.surface)]}>
            <View style={styles.modalHeader}>
              <SafeText style={[styles.modalTitle, createTextColorStyle(theme.textPrimary)]}>
                Property Data Correction
              </SafeText>
              <Pressable
                onPress={() => setCorrectionModalVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Close correction modal"
              >
                <Ionicons name="close" size={22} color={theme.textSecondary} />
              </Pressable>
            </View>

            {correctionSuccess ? (
              <View style={[styles.successBanner, createBgStyle(theme.successSoft)]}>
                <Ionicons name="checkmark-circle" size={18} color={theme.success} />
                <SafeText style={[styles.successBannerText, createTextColorStyle(theme.success)]}>
                  Correction request submitted for society review.
                </SafeText>
              </View>
            ) : null}

            <SafeText style={[styles.inputLabel, createTextColorStyle(theme.textSecondary)]}>
              Disputed Master Field
            </SafeText>
            <View style={styles.fieldOptionGroup}>
              {['Carpet Area', 'Share Certificate', 'Tax Assessment ID', 'Registered Owner'].map((field) => (
                <Pressable
                  key={field}
                  style={[
                    styles.fieldOptionBtn,
                    createBgBorderColorStyle(
                      selectedField === field ? theme.accentSoft : theme.surfaceRaised,
                      selectedField === field ? theme.accent : theme.border
                    ),
                  ]}
                  onPress={() => setSelectedField(field)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select field ${field}`}
                >
                  <SafeText
                    style={[
                      styles.fieldOptionText,
                      createTextColorStyle(selectedField === field ? theme.accent : theme.textPrimary),
                    ]}
                  >
                    {field}
                  </SafeText>
                </Pressable>
              ))}
            </View>

            <SafeText style={[styles.inputLabel, createTextColorStyle(theme.textSecondary)]}>
              Proposed Correct Value
            </SafeText>
            <TextInput
              style={[
                styles.textInput,
                createBgBorderColorStyle(theme.surfaceRaised, theme.border),
                createTextColorStyle(theme.textPrimary),
              ]}
              placeholder="e.g. 1,450 sq ft or Correct Share No"
              placeholderTextColor={theme.textSecondary}
              value={proposedValue}
              onChangeText={setProposedValue}
            />

            <SafeText style={[styles.inputLabel, createTextColorStyle(theme.textSecondary)]}>
              Reason / Justification
            </SafeText>
            <TextInput
              style={[
                styles.textInput,
                createBgBorderColorStyle(theme.surfaceRaised, theme.border),
                createTextColorStyle(theme.textPrimary),
              ]}
              placeholder="Provide context or document reference"
              placeholderTextColor={theme.textSecondary}
              value={reason}
              onChangeText={setReason}
            />

            <Pressable
              style={[styles.modalSubmitBtn, createBgStyle(theme.accent)]}
              onPress={handleCorrectionSubmit}
              accessibilityRole="button"
              accessibilityLabel="Submit correction request"
            >
              <SafeText style={[styles.modalSubmitText, createTextColorStyle('#FFFFFF')]}>
                Submit Request
              </SafeText>
            </Pressable>
          </View>
        </View>
      </AppModal>
    </View>
  );
}

export default DigitalHomePassportScreen;
