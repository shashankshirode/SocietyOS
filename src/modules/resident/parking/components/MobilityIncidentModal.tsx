import React, { useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppModal } from '../../../../ui/modal/AppModal';
import { SafeText } from '../../../../shared/components/SafeText';
import { AppButton } from '../../../../shared/components/AppButton';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import {
  styles,
  createBgStyle,
  createColorStyle,
} from '../styles/MobilityField.styles';

type IncidentMode = 'WRONG_PARKING' | 'BLOCKED_VEHICLE';

type MobilityIncidentModalProps = {
  visible: boolean;
  mode: IncidentMode;
  slotNumber: string;
  onClose: () => void;
  onSubmit: (data: { type: IncidentMode; targetPlate: string; notes: string }) => void;
};

export function MobilityIncidentModal({
  visible,
  mode,
  slotNumber,
  onClose,
  onSubmit,
}: MobilityIncidentModalProps) {
  const theme = useAppTheme();
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [targetPlate, setTargetPlate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const title = mode === 'WRONG_PARKING'
    ? `What's happening at ${slotNumber}?`
    : `What is blocking your vehicle?`;

  const reasons = mode === 'WRONG_PARKING'
    ? [
        { id: 'another_vehicle', label: 'Another vehicle is in my space' },
        { id: 'partially_in', label: 'Someone is partly inside my bay' },
        { id: 'cannot_access', label: 'I cannot access my space' },
      ]
    : [
        { id: 'parked_behind', label: 'A car is parked behind me' },
        { id: 'gate_issue', label: 'Barrier or gate is unresponsive' },
        { id: 'obstruction', label: 'Physical construction or object' },
      ];

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      onSubmit({
        type: mode,
        targetPlate: targetPlate.trim() || 'UNKNOWN',
        notes: `${selectedReason || 'Reported via Mobility Field'}. ${notes}`.trim(),
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      testID="mobility-incident-modal"
    >
      <View style={{ gap: 20, paddingBottom: 16 }}>
        {/* Header Question */}
        <View style={{ gap: 4 }}>
          <SafeText variant="tiny" style={[styles.eyebrow, createColorStyle(theme.semantic.status.warning)]}>
            PARKING FIELD · RESOLUTION
          </SafeText>
          <SafeText variant="h1" color="primary" style={{ fontSize: 22, fontWeight: '700' }}>
            {title}
          </SafeText>
        </View>

        {/* Reason Selector */}
        <View style={{ gap: 8 }}>
          {reasons.map((r) => {
            const isSelected = selectedReason === r.label;
            return (
              <Pressable
                key={r.id}
                onPress={() => setSelectedReason(r.label)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.actionCard,
                  createBgStyle(
                    isSelected ? theme.semantic.surface.soft : theme.semantic.surface.raised,
                    isSelected ? theme.semantic.status.warning : theme.semantic.border.subtle
                  ),
                  { paddingVertical: 12 },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={18}
                    color={isSelected ? theme.semantic.status.warning : theme.semantic.text.secondary}
                  />
                  <SafeText variant="body" color="primary" style={{ fontWeight: isSelected ? '700' : '400' }}>
                    {r.label}
                  </SafeText>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Optional Vehicle Plate Input */}
        <View style={{ gap: 6 }}>
          <SafeText variant="caption" color="secondary" style={{ fontWeight: '700' }}>
            VEHICLE NUMBER (OPTIONAL)
          </SafeText>
          <View
            style={[
              styles.vehiclePlateBadge,
              createBgStyle(theme.semantic.surface.soft, theme.semantic.border.subtle),
              { paddingHorizontal: 12, paddingVertical: 8 },
            ]}
          >
            <TextInput
              placeholder="e.g. MH12 AB 5678"
              placeholderTextColor={theme.semantic.text.tertiary}
              value={targetPlate}
              onChangeText={setTargetPlate}
              style={{
                color: theme.semantic.text.primary,
                fontSize: 16,
                fontWeight: '600',
              }}
              autoCapitalize="characters"
            />
          </View>
        </View>

        {/* Submit Button */}
        <AppButton
          title={submitting ? 'Notifying Duty Guard...' : 'Report to Security →'}
          variant="primary"
          onPress={handleSubmit}
          loading={submitting}
        />
      </View>
    </AppModal>
  );
}
