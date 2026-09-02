import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppModal } from '../../../../ui/modal/AppModal';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import type { Vehicle } from '../../../../shared/types/vehicle.types';
import type { ParkingSlot } from '../../../../shared/types/parking.types';
import {
  styles,
  createBgStyle,
  createColorStyle,
} from '../styles/MobilityField.styles';

export type VehicleFocusSheetProps = {
  visible: boolean;
  vehicle?: Vehicle | undefined;
  assignedSlot?: ParkingSlot | undefined;
  allVehicles?: Vehicle[] | undefined;
  onClose: () => void;
  onSelectVehicle?: (vehicle: Vehicle) => void;
  onReportBlocked?: () => void;
  onReportWrongParking?: () => void;
  onAddNewVehicle?: () => void;
};

export function VehicleFocusSheet({
  visible,
  vehicle,
  assignedSlot,
  allVehicles = [],
  onClose,
  onSelectVehicle,
  onReportBlocked,
  onReportWrongParking,
  onAddNewVehicle,
}: VehicleFocusSheetProps) {
  const theme = useAppTheme();

  if (!vehicle) return null;

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      testID="vehicle-focus-sheet"
    >
      <ScrollView contentContainerStyle={{ gap: 20, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Vehicle Identity Header */}
        <View
          style={[
            styles.fieldContainer,
            createBgStyle(theme.semantic.surface.soft, theme.semantic.border.subtle),
          ]}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ gap: 4 }}>
              <SafeText variant="tiny" style={[styles.eyebrow, createColorStyle(theme.semantic.accent.moss)]}>
                {vehicle.vehicleType === 'TWO_WHEELER' ? 'TWO WHEELER' : 'FOUR WHEELER'} · {vehicle.fuelType || 'PETROL'}
              </SafeText>
              <SafeText variant="h1" color="primary" style={{ fontSize: 24, fontWeight: '700' }}>
                {vehicle.makeModel}
              </SafeText>
              <SafeText variant="caption" color="secondary">
                Owner: {vehicle.ownerName || 'Resident'}
              </SafeText>
            </View>
            <View
              style={[
                styles.vehiclePlateBadge,
                createBgStyle(theme.semantic.surface.raised, theme.semantic.border.strong),
                { paddingHorizontal: 12, paddingVertical: 6 },
              ]}
            >
              <SafeText variant="bodyStrong" color="primary" style={{ letterSpacing: 1 }}>
                {vehicle.vehicleNumber}
              </SafeText>
            </View>
          </View>
        </View>

        {/* Spatial Connection / Status Details */}
        <View style={{ gap: 12 }}>
          <SafeText variant="caption" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700' }}>
            SPATIAL RELATIONSHIP
          </SafeText>

          {/* Assigned Bay */}
          <View
            style={[
              styles.actionCard,
              createBgStyle(theme.semantic.surface.raised, theme.semantic.border.subtle),
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name="location-outline" size={22} color={theme.semantic.accent.moss} />
              <View>
                <SafeText variant="bodyStrong" color="primary">
                  Home Bay: {assignedSlot?.slotNumber || vehicle.parkingSlotNumber || 'B2 · P118'}
                </SafeText>
                <SafeText variant="caption" color="secondary">
                  Dedicated Resident Parking
                </SafeText>
              </View>
            </View>
            <View style={[styles.bayBadge, createBgStyle(theme.semantic.surface.soft)]}>
              <SafeText variant="tiny" color="primary" style={{ fontWeight: '700' }}>
                ASSIGNED
              </SafeText>
            </View>
          </View>

          {/* Access & RFID Tag */}
          <View
            style={[
              styles.actionCard,
              createBgStyle(theme.semantic.surface.raised, theme.semantic.border.subtle),
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name="radio-outline" size={22} color={theme.semantic.status.success} />
              <View>
                <SafeText variant="bodyStrong" color="primary">
                  RFID Tag: Active
                </SafeText>
                <SafeText variant="caption" color="secondary">
                  Gate automation simulated
                </SafeText>
              </View>
            </View>
            <View style={[styles.bayBadge, createBgStyle(theme.semantic.surface.soft)]}>
              <SafeText variant="tiny" color="primary" style={{ fontWeight: '700' }}>
                READY
              </SafeText>
            </View>
          </View>
        </View>

        {/* Quick Contextual Actions */}
        <View style={{ gap: 10 }}>
          <SafeText variant="caption" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700' }}>
            ACTIONS & REPORTS
          </SafeText>

          <Pressable
            onPress={() => {
              onClose();
              onReportBlocked?.();
            }}
            accessibilityRole="button"
            accessibilityLabel="Someone is blocking my vehicle"
            style={[
              styles.actionCard,
              createBgStyle(theme.semantic.surface.raised, theme.semantic.border.subtle),
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name="warning-outline" size={20} color={theme.semantic.status.warning} />
              <SafeText variant="bodyStrong" color="primary">
                Someone is blocking my vehicle
              </SafeText>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.semantic.text.tertiary} />
          </Pressable>

          <Pressable
            onPress={() => {
              onClose();
              onReportWrongParking?.();
            }}
            accessibilityRole="button"
            accessibilityLabel="Someone parked in my slot"
            style={[
              styles.actionCard,
              createBgStyle(theme.semantic.surface.raised, theme.semantic.border.subtle),
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name="alert-circle-outline" size={20} color={theme.semantic.status.warning} />
              <SafeText variant="bodyStrong" color="primary">
                Someone parked in my slot
              </SafeText>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.semantic.text.tertiary} />
          </Pressable>
        </View>

        {/* Fleet Switcher (If multiple vehicles) */}
        {allVehicles.length > 1 ? (
          <View style={{ gap: 10 }}>
            <SafeText variant="caption" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700' }}>
              ALL VEHICLES ({allVehicles.length})
            </SafeText>
            {allVehicles.map((v) => (
              <Pressable
                key={v.id}
                onPress={() => onSelectVehicle?.(v)}
                accessibilityRole="button"
                accessibilityLabel={`Select vehicle ${v.makeModel}`}
                style={[
                  styles.fleetRow,
                  { borderColor: theme.semantic.border.subtle },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name={v.id === vehicle.id ? 'radio-button-on' : 'radio-button-off'} size={18} color={theme.semantic.accent.moss} />
                  <SafeText variant="body" color="primary" style={{ fontWeight: v.id === vehicle.id ? '700' : '400' }}>
                    {v.makeModel} ({v.vehicleNumber})
                  </SafeText>
                </View>
                {v.id === vehicle.id ? (
                  <SafeText variant="tiny" color="secondary">Active</SafeText>
                ) : null}
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </AppModal>
  );
}
