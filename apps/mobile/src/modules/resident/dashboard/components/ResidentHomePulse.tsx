import { memo } from 'react';
import { Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import type { ResidentDashboardData } from '../data/dashboard.types';
import {
  createDotStyle,
  createSectionHeadingStyle,
  createSectionLinkStyle,
  createCellValueStyle,
  createCellLabelStyle,
  createBeaconDotStyle,
  createCellStyle,
  createIconBoxStyle,
  createRowStyle,
  createCellFlexStyle,
  styles,
} from '../styles/components/ResidentHomePulse.styles';

export interface ResidentHomePulseProps {
  dashboard: ResidentDashboardData;
  canManageBills: boolean;
  onOpenVisitors: () => void;
  onOpenBills: () => void;
  onOpenComplaints: () => void;
  onOpenFacilities: () => void;
  onExpandPulse: () => void;
}

export const ResidentHomePulse = memo(function ResidentHomePulse({
  dashboard,
  canManageBills,
  onOpenVisitors,
  onOpenBills,
  onOpenComplaints,
  onOpenFacilities,
  onExpandPulse,
}: ResidentHomePulseProps) {
  const { semantic } = useAppTheme();

  const waitingVisitor = dashboard.visitorTimeline.find(
    (v) => v.status === 'waitingAtGate',
  );
  const upcomingVisitorsCount = dashboard.visitorTimeline.filter(
    (v) => v.status === 'upcoming' || v.status === 'inside',
  ).length;

  const isOverdue = dashboard.maintenancePayment.status === 'overdue';
  const isDue = dashboard.maintenancePayment.status !== 'paid';
  const totalDue =
    dashboard.maintenancePayment.totalOutstanding ??
    dashboard.maintenancePayment.billAmount;

  const activeComplaintsCount = dashboard.complaintProgress ? 1 : 0;
  const availableAmenitiesCount = dashboard.amenities.filter(
    (a) => a.availabilityStatus === 'available',
  ).length;

  const cellStyle = createCellStyle(semantic.surface.raised, semantic.border.default);
  const cellFlexStyle = createCellFlexStyle();

  return (
    <View style={styles.root}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.titleGroup}>
          <View style={createBeaconDotStyle(semantic.accent.moss)} />
          <SafeText style={createSectionHeadingStyle(semantic.text.primary)}>Home Pulse</SafeText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="See detailed pulse view"
          onPress={onExpandPulse}
        >
          <SafeText style={createSectionLinkStyle(semantic.text.secondary)}>See details ›</SafeText>
        </Pressable>
      </View>

      <View style={styles.grid}>
        <View style={createRowStyle()}>
          <Pressable
            style={[styles.cell, cellStyle, cellFlexStyle]}
            accessibilityRole="button"
            accessibilityLabel={`Gate and Visitors: ${waitingVisitor ? '1 waiting at gate' : `${upcomingVisitorsCount} expected arrivals`}`}
            onPress={onOpenVisitors}
          >
            <View style={styles.cellTopRow}>
              <View style={[styles.iconBox, createIconBoxStyle(semantic.status.successSurface)]}>
                <Ionicons name="shield-checkmark-outline" size={18} color={semantic.status.success} />
              </View>
              <View
                style={[
                  styles.statusDot,
                  createDotStyle(waitingVisitor ? semantic.status.warning : semantic.status.success),
                ]}
              />
            </View>
            <SafeText style={createCellValueStyle(semantic.text.primary)} numberOfLines={1}>
              {waitingVisitor
                ? '1 at Gate'
                : upcomingVisitorsCount > 0
                ? `${upcomingVisitorsCount} Expected`
                : 'Quiet'}
            </SafeText>
            <SafeText style={createCellLabelStyle(semantic.text.secondary)}>Gate Access</SafeText>
          </Pressable>

          <Pressable
            style={[styles.cell, cellStyle, cellFlexStyle]}
            accessibilityRole="button"
            accessibilityLabel={`Maintenance balance: ${isDue && canManageBills ? `₹${totalDue.toLocaleString('en-IN')} due` : 'Paid and settled'}`}
            onPress={onOpenBills}
          >
            <View style={styles.cellTopRow}>
              <View
                style={[
                  styles.iconBox,
                  createIconBoxStyle(isDue ? semantic.status.dangerSurface : semantic.status.infoSurface),
                ]}
              >
                <Ionicons
                  name="wallet-outline"
                  size={18}
                  color={isDue ? semantic.status.danger : semantic.status.info}
                />
              </View>
              <View
                style={[
                  styles.statusDot,
                  createDotStyle(isOverdue ? semantic.status.danger : isDue ? semantic.status.warning : semantic.status.success),
                ]}
              />
            </View>
            <SafeText style={createCellValueStyle(semantic.text.primary)} numberOfLines={1}>
              {!canManageBills
                ? 'Household'
                : isDue
                ? `₹${totalDue.toLocaleString('en-IN')}`
                : 'Settled'}
            </SafeText>
            <SafeText style={createCellLabelStyle(semantic.text.secondary)}>
              {isOverdue ? 'Overdue' : isDue && canManageBills ? 'Payment Due' : 'All Clear'}
            </SafeText>
          </Pressable>
        </View>

        <View style={createRowStyle()}>
          <Pressable
            style={[styles.cell, cellStyle, cellFlexStyle]}
            accessibilityRole="button"
            accessibilityLabel={`Complaints: ${activeComplaintsCount > 0 ? '1 active ticket' : '0 open issues'}`}
            onPress={onOpenComplaints}
          >
            <View style={styles.cellTopRow}>
              <View
                style={[
                  styles.iconBox,
                  createIconBoxStyle(
                    activeComplaintsCount > 0 ? semantic.status.warningSurface : semantic.surface.soft,
                  ),
                ]}
              >
                <Ionicons
                  name="construct-outline"
                  size={18}
                  color={activeComplaintsCount > 0 ? semantic.status.warning : semantic.text.tertiary}
                />
              </View>
              <View
                style={[
                  styles.statusDot,
                  createDotStyle(activeComplaintsCount > 0 ? semantic.status.warning : semantic.status.success),
                ]}
              />
            </View>
            <SafeText style={createCellValueStyle(semantic.text.primary)} numberOfLines={1}>
              {activeComplaintsCount > 0 ? '1 In Progress' : '0 Open'}
            </SafeText>
            <SafeText style={createCellLabelStyle(semantic.text.secondary)}>Helpdesk</SafeText>
          </Pressable>

          <Pressable
            style={[styles.cell, cellStyle, cellFlexStyle]}
            accessibilityRole="button"
            accessibilityLabel={`Amenities: ${availableAmenitiesCount > 0 ? `${availableAmenitiesCount} available facilities` : 'Explore clubhouse amenities'}`}
            onPress={onOpenFacilities}
          >
            <View style={styles.cellTopRow}>
              <View style={[styles.iconBox, createIconBoxStyle(semantic.accent.lavender + '20')]}>
                <Ionicons name="calendar-outline" size={18} color={semantic.accent.lavender} />
              </View>
              <View style={[styles.statusDot, createDotStyle(semantic.status.success)]} />
            </View>
            <SafeText style={createCellValueStyle(semantic.text.primary)} numberOfLines={1}>
              {availableAmenitiesCount > 0
                ? `${availableAmenitiesCount} Available`
                : 'Explore'}
            </SafeText>
            <SafeText style={createCellLabelStyle(semantic.text.secondary)}>Amenities</SafeText>
          </Pressable>
        </View>
      </View>
    </View>
  );
});

export default ResidentHomePulse;
