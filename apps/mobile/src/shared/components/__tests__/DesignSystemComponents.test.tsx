import React from 'react';
import { Text } from 'react-native';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { FeatureActionTile, SurfaceCard, FilterChipBar, FormSectionPanel, RoleHeroHeader, EntityListItem, SearchInputBar, StatusPill, } from '../';
import { getRequiredItem } from "../../utils/requiredItem";
const longLabels = [
    'Green Valley Heights Phase 2 Cooperative Housing Society',
    'A-1204 / Tower B / East Wing / Basement Parking P2-184',
    'Maintenance Bill July 2026 with Previous Month Adjustment',
    'Police Verification Pending for Tenant Move-out NOC',
    'Biometric Device Sync Failed - Unknown Employee Code',
    'Frontend Ready / Integration Required',
];
describe('Premium shared components', () => {
    it('renders premium cards and status pills with long labels', async () => {
        await renderWithProviders(<SurfaceCard title={getRequiredItem(longLabels, 0, "DesignSystemComponents.test.tsx")} subtitle={getRequiredItem(longLabels, 1, "DesignSystemComponents.test.tsx")} body={getRequiredItem(longLabels, 2, "DesignSystemComponents.test.tsx")} icon="building" status={getRequiredItem(longLabels, 5, "DesignSystemComponents.test.tsx")} statusTone="info"/>);
        expect(await screen.findByText(getRequiredItem(longLabels, 0, "DesignSystemComponents.test.tsx"))).toBeOnTheScreen();
        expect(screen.getByText(getRequiredItem(longLabels, 1, "DesignSystemComponents.test.tsx"))).toBeOnTheScreen();
        expect(screen.getByText(getRequiredItem(longLabels, 2, "DesignSystemComponents.test.tsx"))).toBeOnTheScreen();
        expect(screen.getByText(getRequiredItem(longLabels, 5, "DesignSystemComponents.test.tsx"))).toBeOnTheScreen();
    });
    it('renders premium action and list cards without dropping long text', async () => {
        const onPress = jest.fn();
        await renderWithProviders(<>
        <FeatureActionTile title={getRequiredItem(longLabels, 3, "DesignSystemComponents.test.tsx")} description={getRequiredItem(longLabels, 4, "DesignSystemComponents.test.tsx")} icon="biometric" onPress={onPress}/>
        <EntityListItem title={getRequiredItem(longLabels, 1, "DesignSystemComponents.test.tsx")} subtitle={getRequiredItem(longLabels, 2, "DesignSystemComponents.test.tsx")} metadata={getRequiredItem(longLabels, 5, "DesignSystemComponents.test.tsx")} status="Pending review"/>
      </>);
        expect(await screen.findByText(getRequiredItem(longLabels, 3, "DesignSystemComponents.test.tsx"))).toBeOnTheScreen();
        expect(screen.getByText(getRequiredItem(longLabels, 1, "DesignSystemComponents.test.tsx"))).toBeOnTheScreen();
        expect(onPress).not.toHaveBeenCalled();
    });
    it('renders hero metrics through responsive premium layout', async () => {
        await renderWithProviders(<RoleHeroHeader title={getRequiredItem(longLabels, 0, "DesignSystemComponents.test.tsx")} subtitle={getRequiredItem(longLabels, 2, "DesignSystemComponents.test.tsx")} visual="residentHero" icon="resident" metrics={[
                { id: 'm1', label: getRequiredItem(longLabels, 3, "DesignSystemComponents.test.tsx"), value: '128', icon: 'notice' },
                { id: 'm2', label: getRequiredItem(longLabels, 4, "DesignSystemComponents.test.tsx"), value: '6', icon: 'staff' },
            ]}/>);
        expect(await screen.findByText(getRequiredItem(longLabels, 0, "DesignSystemComponents.test.tsx"))).toBeOnTheScreen();
        expect(screen.getByText(getRequiredItem(longLabels, 3, "DesignSystemComponents.test.tsx"))).toBeOnTheScreen();
        expect(screen.getByText(getRequiredItem(longLabels, 4, "DesignSystemComponents.test.tsx"))).toBeOnTheScreen();
    });
    it('renders form sections, filters, search, and status chips with wrapping-safe labels', async () => {
        const onChangeText = jest.fn();
        const onFilter = jest.fn();
        await renderWithProviders(<>
        <FormSectionPanel title={getRequiredItem(longLabels, 2, "DesignSystemComponents.test.tsx")} description={getRequiredItem(longLabels, 3, "DesignSystemComponents.test.tsx")} errorSummary={getRequiredItem(longLabels, 4, "DesignSystemComponents.test.tsx")} stepLabel="Step 2">
          <Text>Form body</Text>
        </FormSectionPanel>
        <SearchInputBar value="" onChangeText={onChangeText} placeholder={getRequiredItem(longLabels, 0, "DesignSystemComponents.test.tsx")}/>
        <FilterChipBar value="all" onChange={onFilter} options={[
                { label: getRequiredItem(longLabels, 5, "DesignSystemComponents.test.tsx"), value: 'all', count: 12 },
                { label: getRequiredItem(longLabels, 3, "DesignSystemComponents.test.tsx"), value: 'pending' },
            ]}/>
        <StatusPill label={getRequiredItem(longLabels, 4, "DesignSystemComponents.test.tsx")} tone="warning"/>
      </>);
        expect(await screen.findByText(getRequiredItem(longLabels, 2, "DesignSystemComponents.test.tsx"))).toBeOnTheScreen();
        expect(screen.getByLabelText(getRequiredItem(longLabels, 0, "DesignSystemComponents.test.tsx"))).toBeOnTheScreen();
        expect(screen.getByLabelText(`${getRequiredItem(longLabels, 3, "DesignSystemComponents.test.tsx")} filter`)).toBeOnTheScreen();
        expect(onChangeText).not.toHaveBeenCalled();
        expect(onFilter).not.toHaveBeenCalled();
    });
});

