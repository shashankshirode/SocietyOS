import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { emergencyTheme } from '../theme/emergencyTheme';
import type { SosType, SosEvent } from '../data/sosResponsePlan.types';
import { EmergencyCore } from './EmergencyCore';
import { ResponseTerritory, type ResponseTerritoryDefinition } from './ResponseTerritory';
import { ResponseField } from './ResponseField';
import { resolveEmergencyLensLayout } from '../layout/emergencyLensLayout';

interface EmergencyLensProps {
  state: 'CHOOSING' | 'RESPONSE_SELECTED' | 'SENDING' | 'ACTIVE' | 'ACKNOWLEDGED' | 'FAILED' | 'CANCELLED';
  selectedType: SosType;
  definitions: ResponseTerritoryDefinition[];
  unitName: string;
  activeEvent: SosEvent | null;
  onSelectType: (type: SosType) => void;
  onSelectGenericSos: () => void;
}

export function EmergencyLens({ state, selectedType, definitions, unitName, activeEvent, onSelectType, onSelectGenericSos }: EmergencyLensProps) {
  const { width, height, fontScale } = useWindowDimensions();
  const isLive = (state === 'ACTIVE' || state === 'ACKNOWLEDGED') && activeEvent;
  const isSelectedState = state === 'RESPONSE_SELECTED' || state === 'SENDING' || state === 'FAILED';
  const selectedDef = definitions.find((definition) => definition.type === selectedType) ?? definitions[0]!;
  const layout = resolveEmergencyLensLayout({ containerWidth: Math.min(width - 32, 380), containerHeight: Math.min(height * 0.48, 380), fontScale });

  if (isLive) {
    return <ResponseField event={activeEvent} unitName={unitName} categoryLabel={selectedDef.label} accentColor={selectedDef.accentColor} />;
  }

  const byType = (type: SosType, fallbackIndex: number): ResponseTerritoryDefinition => definitions.find((definition) => definition.type === type) ?? definitions[fallbackIndex]!;
  const territories = [byType('medical', 0), byType('fire', 1), byType('securityThreat', 2), byType('liftStuck', 3), byType('seniorHelp', 4)];

  return (
    <View style={[styles.lensCanvas, { width: layout.lensSize, height: layout.lensSize }]} testID="emergency-lens">
      <View style={[styles.haloOuter, { width: layout.lensSize * 0.9, height: layout.lensSize * 0.9, borderRadius: layout.lensSize * 0.45 }, isSelectedState ? styles.haloActive : null]}>
        <View style={[styles.haloInner, { width: layout.lensSize * 0.6, height: layout.lensSize * 0.6, borderRadius: layout.lensSize * 0.3 }]} />
      </View>
      {territories.map((definition) => (
        <ResponseTerritory
          key={definition.type}
          definition={definition}
          isSelected={isSelectedState && selectedType === definition.type}
          isReceded={isSelectedState && selectedType !== definition.type}
          onSelect={onSelectType}
          compact={!layout.showDescriptions}
          showDescription={layout.showDescriptions}
          {...(layout.territories[definition.type] ? { frame: layout.territories[definition.type] } : {})}
        />
      ))}
      <EmergencyCore
        onPress={onSelectGenericSos}
        isSending={state === 'SENDING'}
        frame={layout.core}
        isSelected={isSelectedState && selectedType === 'generalEmergency'}
        isReceded={isSelectedState && selectedType !== 'generalEmergency'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  lensCanvas: { position: 'relative', alignSelf: 'center' },
  haloOuter: { position: 'absolute', left: '5%', top: '5%', borderWidth: 1, borderColor: emergencyTheme.haloRing, alignItems: 'center', justifyContent: 'center' },
  haloActive: { borderColor: emergencyTheme.haloRingActive },
  haloInner: { borderWidth: 1, borderColor: emergencyTheme.haloRing },
});
