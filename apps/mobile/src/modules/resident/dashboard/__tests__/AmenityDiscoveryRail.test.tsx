import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { AmenityDiscoveryRail } from '../components/AmenityDiscoveryRail';
import { residentAmenityImageByName } from '../../media/residentImageUsageMap';
import { RESIDENT_DASHBOARD_LIMITS } from '../hooks/useResidentDashboardPersonalization';
import { dashboardNoop, getDashboardFixture } from './dashboardTestFixtures';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
describe('AmenityDiscoveryRail', () => {
    it('limits discovery cards and resolves amenity-specific imagery', async () => {
        const dashboard = getDashboardFixture();
        const amenities = dashboard.amenities.slice(0, RESIDENT_DASHBOARD_LIMITS.amenities);
        amenities.forEach((amenity) => expect(residentAmenityImageByName[amenity.name.toLowerCase()]).toBeDefined());
        await renderWithProviders(<AmenityDiscoveryRail amenities={amenities} onAmenityPress={dashboardNoop} onBookPress={dashboardNoop} imageAssetsByAmenityName={residentAmenityImageByName}/>);
        expect(screen.getByText('Swimming Pool')).toBeTruthy();
        expect(screen.queryByText(getRequiredItem(dashboard.amenities, 3, "AmenityDiscoveryRail.test.tsx").name)).toBeNull();
    });
});

