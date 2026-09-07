import React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { CreateVisitorPassScreen } from '../screens/CreateVisitorPassScreen';
import { SocietyExperienceProvider } from '../../experience/SocietyExperienceContext';
import { ResidentHomeContextProvider } from '../../homeContext';
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
    __esModule: true,
    default: jest.fn(() => ({ width: 390, height: 844, scale: 1, fontScale: 1 })),
}));
jest.mock('../../../../core/mockStore/useMockStore', () => ({
    useMockStore: () => ({
        state: {
            visitors: [
                {
                    id: 'v-1',
                    name: 'Rajesh Kumar',
                    phone: '9876543210',
                    type: 'GUEST',
                    status: 'APPROVED',
                    expectedDate: 'Today',
                    expectedTime: '12:00 PM',
                    flatNumber: 'A-1204',
                    societyName: 'Green Valley Heights',
                },
            ],
        },
        updateVisitor: jest.fn(),
    }),
}));
const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    canGoBack: jest.fn(() => true),
};
const mockRoute = {
    key: 'create-visitor-pass',
    name: 'CreateVisitorPass',
    params: undefined,
};
describe('CreateVisitorPassScreen Header Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('renders the centralized Society OS header with ResidenceBeacon, IdentityOrb, and EdgeReturn', async () => {
        await renderWithProviders(<ResidentHomeContextProvider>
        <SocietyExperienceProvider>
          <CreateVisitorPassScreen navigation={mockNavigation as any} route={mockRoute as any}/>
        </SocietyExperienceProvider>
      </ResidentHomeContextProvider>);
        expect(screen.getByTestId('resident-header-container')).toBeTruthy();
        expect(screen.getByText(/Green Valley Heights/i)).toBeTruthy();
        expect(screen.getByTestId('resident-identity-orb')).toBeTruthy();
        expect(screen.getByText(/Open your home/i)).toBeTruthy();
        expect(screen.getByText(/Who are you opening your home to\?/i)).toBeTruthy();
    });
    it('back button triggers navigation.goBack()', async () => {
        mockNavigation.canGoBack.mockReturnValue(true);
        await renderWithProviders(<ResidentHomeContextProvider>
        <SocietyExperienceProvider>
          <CreateVisitorPassScreen navigation={mockNavigation as any} route={mockRoute as any}/>
        </SocietyExperienceProvider>
      </ResidentHomeContextProvider>);
        const backButton = screen.getByRole('button', { name: 'Go back' });
        expect(backButton).toBeTruthy();
        fireEvent.press(backButton);
        expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    });
    it('back button falls back to VisitorList when canGoBack is false', async () => {
        mockNavigation.canGoBack.mockReturnValue(false);
        await renderWithProviders(<ResidentHomeContextProvider>
        <SocietyExperienceProvider>
          <CreateVisitorPassScreen navigation={mockNavigation as any} route={mockRoute as any}/>
        </SocietyExperienceProvider>
      </ResidentHomeContextProvider>);
        const backButton = screen.getByRole('button', { name: 'Go back' });
        fireEvent.press(backButton);
        expect(mockNavigation.navigate).toHaveBeenCalledWith('VisitorList');
    });
});

