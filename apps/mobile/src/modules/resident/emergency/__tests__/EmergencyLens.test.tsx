import React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { EmergencyLens } from '../components/EmergencyLens';
import type { ResponseTerritoryDefinition } from '../components/ResponseTerritory';
import { emergencyTheme } from '../theme/emergencyTheme';

const mockDefinitions: ResponseTerritoryDefinition[] = [
  { type: 'medical', label: 'MEDICAL', shortDesc: 'Medical help', requestLabel: 'REQUEST MEDICAL HELP', icon: 'medical', accentColor: emergencyTheme.medical },
  { type: 'fire', label: 'FIRE', shortDesc: 'Fire or smoke', requestLabel: 'REQUEST FIRE HELP', icon: 'flame', accentColor: emergencyTheme.fire },
  { type: 'securityThreat', label: 'SECURITY', shortDesc: 'Security now', requestLabel: 'REQUEST SECURITY HELP', icon: 'shield', accentColor: emergencyTheme.security },
  { type: 'liftStuck', label: 'LIFT', shortDesc: 'Someone is stuck', requestLabel: 'REQUEST LIFT HELP', icon: 'swap-vertical', accentColor: emergencyTheme.lift },
  { type: 'seniorHelp', label: 'CARE', shortDesc: 'Senior or caregiver help', requestLabel: 'REQUEST CARE HELP', icon: 'heart', accentColor: emergencyTheme.care },
];

describe('EmergencyLens & Spatial Components', () => {
  it('renders all spatial response territories and central SOS core in EmergencyLens', async () => {
    const onSelectType = jest.fn();
    const onSelectGenericSos = jest.fn();

    await renderWithProviders(
      <EmergencyLens
        state="CHOOSING"
        selectedType="medical"
        definitions={mockDefinitions}
        unitName="B-804"
        activeEvent={null}
        onSelectType={onSelectType}
        onSelectGenericSos={onSelectGenericSos}
      />
    );

    expect(screen.getByText('MEDICAL')).toBeTruthy();
    expect(screen.getByText('FIRE')).toBeTruthy();
    expect(screen.getByText('SECURITY')).toBeTruthy();
    expect(screen.getByText('LIFT')).toBeTruthy();
    expect(screen.getByText('CARE')).toBeTruthy();
    expect(screen.getByText('SOS')).toBeTruthy();

    fireEvent.press(screen.getByText('MEDICAL'));
    expect(onSelectType).toHaveBeenCalledWith('medical');

    fireEvent.press(screen.getByText('SOS'));
    expect(onSelectGenericSos).toHaveBeenCalled();
  });
});
