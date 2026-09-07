import React from 'react';
import { View, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import type { Vehicle } from '../../../../shared/types/vehicle.types';
import type { ParkingSlot, VisitorParkingPass, ParkingIncident, SocietyParkingAllocationPolicy } from '../../../../shared/types/parking.types';
import { styles, createBgStyle, createColorStyle, } from '../styles/MobilityField.styles';
import type { Absent } from "../../../../shared/types/absence.types";
export type MobilityState = 'PARKED' | 'AWAY' | 'ENTERING' | 'VISITOR_ACTIVE' | 'WRONG_VEHICLE' | 'BLOCKED' | 'RFID_ISSUE' | 'ZERO_VEHICLES' | 'COMMON_POOL' | 'MECHANICAL_STACK' | 'NO_ALLOTMENT';
export type MobilityFieldProps = {
    policy?: SocietyParkingAllocationPolicy | Absent;
    primaryVehicle?: Vehicle | Absent;
    assignedSlot?: ParkingSlot | Absent;
    activePass?: VisitorParkingPass | Absent;
    activeVisitorPass?: VisitorParkingPass | Absent;
    activeIncident?: ParkingIncident | Absent;
    onVehiclePress?: ((vehicle?: Vehicle) => void) | Absent;
    onSlotPress?: ((slot?: ParkingSlot) => void) | Absent;
    onVisitorSlotPress?: ((pass?: VisitorParkingPass) => void) | Absent;
    onReportIssuePress?: (() => void) | Absent;
    onRequestAllotmentPress?: (() => void) | Absent;
};
export function MobilityField({ policy = 'FIXED_ALLOTMENT', primaryVehicle, assignedSlot, activeVisitorPass, activeIncident, onVehiclePress, onSlotPress, onVisitorSlotPress, onReportIssuePress, onRequestAllotmentPress, }: MobilityFieldProps) {
    const theme = useAppTheme();
    const isBlocked = (activeIncident?.issueType === 'BLOCKING_EXIT' || activeIncident?.issueType === 'BLOCKING_DRIVEWAY') && activeIncident?.status !== 'RESOLVED';
    const isWrongVehicle = (activeIncident?.issueType === 'PARKED_IN_MY_SLOT' || activeIncident?.issueType === 'UNKNOWN_VEHICLE') && activeIncident?.status !== 'RESOLVED';
    const isAway = primaryVehicle?.lastGateEntry?.toLowerCase().includes('exit') || false;
    const isParked = Boolean(primaryVehicle) && !isAway;
    const isOpenPool = policy === 'OPEN_COMMON_POOL';
    const isMechanical = policy === 'MECHANICAL_STACK';
    const isNoParkingSociety = policy === 'NO_PARKING_SOCIETY';
    const hasNoVehicle = !primaryVehicle;
    const hasNoSlot = !assignedSlot && !isOpenPool && !isMechanical;
    const slotLabel = isOpenPool
        ? 'Common Resident Pool'
        : isMechanical
            ? 'Stack Bay · Level 2'
            : assignedSlot?.slotNumber || 'B2 · P118';
    const vehicleName = primaryVehicle?.makeModel || 'Your Vehicle';
    const vehicleNumber = primaryVehicle?.vehicleNumber || 'MH15 AB 1234';
    const accessibilitySummary = isNoParkingSociety || (hasNoSlot && hasNoVehicle)
        ? 'No dedicated parking allotted for this unit.'
        : isOpenPool
            ? `${vehicleName} (${vehicleNumber}) in common parking pool. ${isParked ? 'Parked inside.' : 'Away.'}`
            : primaryVehicle
                ? `${vehicleName} (${vehicleNumber}) ${isParked ? 'currently parked in' : 'away from'} ${slotLabel}. RFID active.`
                : `Parking space ${slotLabel} is ready. No vehicle registered.`;
    return (<View style={[
            styles.fieldContainer,
            createBgStyle(theme.semantic.surface.raised, isBlocked || isWrongVehicle ? theme.semantic.status.warning : theme.semantic.border.subtle),
        ]} accessible={true} accessibilityRole="summary" accessibilityLabel={accessibilitySummary}>
      
      <View style={[
            styles.gateNode,
            createBgStyle(theme.semantic.surface.soft, theme.semantic.border.subtle),
        ]}>
        <View style={styles.gateBadge}>
          <View style={[
            styles.gateDot,
            createBgStyle(primaryVehicle?.rfidStatus === 'ACTIVE' ? theme.semantic.status.success : theme.semantic.accent.moss),
        ]}/>
          <SafeText variant="caption" color="primary" style={{ fontWeight: '700', fontSize: 12 }}>
            {isOpenPool ? 'SOCIETY GATE · OPEN PARKING' : isMechanical ? 'MECHANICAL STACK · GATE 2' : 'GATE 2 · RFID ACCESS'}
          </SafeText>
        </View>
        <View style={[styles.bayBadge, createBgStyle(theme.semantic.surface.raised)]}>
          <SafeText variant="tiny" color="secondary" style={{ fontSize: 10 }}>
            {isOpenPool ? 'COMMON' : isMechanical ? 'STACK' : 'CONFIGURED'}
          </SafeText>
        </View>
      </View>

      
      <View style={styles.transitLane}>
        <View style={[
            styles.transitLine,
            createBgStyle(theme.semantic.border.strong),
        ]}/>
      </View>

      
      <View style={styles.spatialBaysContainer}>
        
        {isNoParkingSociety || (hasNoSlot && hasNoVehicle) ? (<Pressable onPress={onRequestAllotmentPress} accessibilityRole="button" accessibilityLabel="No parking space allotted. Request parking allotment." style={({ pressed }) => [
                styles.baySlot,
                styles.baySlotEmpty,
                createBgStyle(pressed ? theme.semantic.surface.soft : theme.semantic.surface.raised, theme.semantic.border.subtle),
                { minHeight: 120 },
            ]}>
            <View style={styles.bayHeader}>
              <SafeText variant="tiny" style={[styles.eyebrow, createColorStyle(theme.semantic.text.secondary)]}>
                UNALLOTTED UNIT
              </SafeText>
              <View style={[styles.bayBadge, createBgStyle(theme.semantic.surface.soft)]}>
                <SafeText variant="tiny" color="secondary">
                  NO SPACE ALLOTTED
                </SafeText>
              </View>
            </View>
            <View style={styles.vehicleGlyphContainer}>
              <Ionicons name="information-circle-outline" size={28} color={theme.semantic.text.secondary}/>
              <SafeText variant="caption" color="secondary" style={{ textAlign: 'center' }}>
                {isNoParkingSociety ? 'Society has no resident vehicle bays' : 'No dedicated bay allotted to your flat'}
              </SafeText>
            </View>
            <SafeText variant="tiny" color="primary" style={{ fontWeight: '700' }}>
              Request Allotment →
            </SafeText>
          </Pressable>) : (<Pressable onPress={() => {
                if (primaryVehicle && onVehiclePress) {
                    onVehiclePress(primaryVehicle);
                }
                else if (assignedSlot && onSlotPress) {
                    onSlotPress(assignedSlot);
                }
            }} accessibilityRole="button" accessibilityLabel={`Parking space ${slotLabel}. ${isParked ? `${vehicleName} parked.` : 'Empty.'}`} style={({ pressed }) => [
                styles.baySlot,
                isParked ? styles.baySlotOccupied : styles.baySlotEmpty,
                (isBlocked || isWrongVehicle) && styles.baySlotCaution,
                createBgStyle(pressed
                    ? theme.semantic.surface.soft
                    : isBlocked || isWrongVehicle
                        ? theme.semantic.surface.soft
                        : theme.semantic.surface.raised, isBlocked || isWrongVehicle ? theme.semantic.status.warning : theme.semantic.accent.moss),
            ]}>
            
            <View style={styles.bayHeader}>
              <SafeText variant="tiny" style={[styles.eyebrow, createColorStyle(theme.semantic.accent.moss)]}>
                {isOpenPool ? 'COMMON BAY' : isMechanical ? 'STACK BAY' : 'HOME BAY'}
              </SafeText>
              <View style={[styles.bayBadge, createBgStyle(theme.semantic.surface.soft)]}>
                <SafeText variant="caption" color="primary" style={{ fontWeight: '700' }}>
                  {slotLabel}
                </SafeText>
              </View>
            </View>

            
            {isParked ? (<View style={styles.vehicleGlyphContainer}>
                <Ionicons name={primaryVehicle?.vehicleType === 'TWO_WHEELER' ? 'bicycle' : 'car'} size={34} color={theme.semantic.text.primary}/>
                <View style={[styles.vehiclePlateBadge, createBgStyle(theme.semantic.surface.soft, theme.semantic.border.subtle)]}>
                  <SafeText variant="tiny" color="primary" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
                    {vehicleNumber}
                  </SafeText>
                </View>
                <SafeText variant="caption" color="secondary" style={{ fontSize: 12 }}>
                  {vehicleName}
                </SafeText>
              </View>) : (<View style={styles.vehicleGlyphContainer}>
                <Ionicons name="arrow-down-outline" size={26} color={theme.semantic.text.tertiary}/>
                <SafeText variant="caption" color="secondary">
                  {isOpenPool ? 'Vehicle is away' : 'Space is waiting'}
                </SafeText>
              </View>)}

            
            <View style={styles.bayHeader}>
              <SafeText variant="tiny" color="secondary">
                {isBlocked ? '⚠️ Exit Blocked' : isWrongVehicle ? '⚠️ Unauthorized' : isParked ? '● Inside' : '○ Away'}
              </SafeText>
              <Ionicons name="chevron-forward" size={14} color={theme.semantic.text.tertiary}/>
            </View>
          </Pressable>)}

        
        {activeVisitorPass ? (<Pressable onPress={() => onVisitorSlotPress?.(activeVisitorPass)} accessibilityRole="button" accessibilityLabel={`Visitor parking space ${activeVisitorPass.approvedParkingZone} for ${activeVisitorPass.visitorName}`} style={({ pressed }) => [
                styles.baySlot,
                styles.baySlotOccupied,
                createBgStyle(pressed ? theme.semantic.surface.soft : theme.semantic.surface.raised, theme.semantic.border.subtle),
            ]}>
            <View style={styles.bayHeader}>
              <SafeText variant="tiny" style={[styles.eyebrow, createColorStyle(theme.semantic.accent.sage)]}>
                VISITOR
              </SafeText>
              <View style={[styles.bayBadge, createBgStyle(theme.semantic.surface.soft)]}>
                <SafeText variant="caption" color="primary" style={{ fontWeight: '700' }}>
                  {activeVisitorPass.approvedParkingZone || 'P-V12'}
                </SafeText>
              </View>
            </View>

            <View style={styles.vehicleGlyphContainer}>
              <Ionicons name="car-outline" size={28} color={theme.semantic.accent.sage}/>
              <View style={[styles.vehiclePlateBadge, createBgStyle(theme.semantic.surface.soft, theme.semantic.border.subtle)]}>
                <SafeText variant="tiny" color="primary" style={{ fontWeight: '700' }}>
                  {activeVisitorPass.vehicleNumber || 'VISITOR'}
                </SafeText>
              </View>
              <SafeText variant="caption" color="secondary" style={{ fontSize: 12 }}>
                {activeVisitorPass.visitorName}
              </SafeText>
            </View>

            <View style={styles.bayHeader}>
              <SafeText variant="tiny" color="secondary">
                Until {activeVisitorPass.validUntil ? '8:30 PM' : 'Evening'}
              </SafeText>
              <Ionicons name="chevron-forward" size={14} color={theme.semantic.text.tertiary}/>
            </View>
          </Pressable>) : null}
      </View>
    </View>);
}

