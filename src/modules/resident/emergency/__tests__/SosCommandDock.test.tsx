import React from 'react';
import { Animated } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { SosCommandDock } from '../components/SosCommandDock';
import type { SosCommandDockState } from '../data/residentEmergency.types';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
jest.mock('react-native', () => {
    const rn = jest.requireActual('react-native');
    function MockModal({ children, visible }: {
        children: React.ReactNode;
        visible: boolean;
    }) {
        if (!visible)
            return null;
        return <rn.View>{children}</rn.View>;
    }
    MockModal.displayName = 'MockModal';
    rn.Modal = MockModal;
    return rn;
});
const createMockDockState = (status: SosCommandDockState['status'] = 'open', onClose = jest.fn()) => {
    const stateVal: SosCommandDockState = status === 'confirming'
        ? { status, actionId: 'MEDICAL' }
        : status === 'triggering'
            ? { status, actionId: 'MEDICAL' }
            : status === 'success'
                ? { status, actionId: 'MEDICAL', eventId: '123' }
                : status === 'failed'
                    ? { status, actionId: 'MEDICAL', errorMessageKey: 'error' }
                    : { status };
    return {
        state: stateVal,
        setState: jest.fn(),
        isOpen: status !== 'idle',
        animValue: new Animated.Value(1),
        reducedMotion: false,
        openDock: jest.fn(),
        closeDock: onClose,
        selectAction: jest.fn(),
        cancelConfirmation: jest.fn(),
    };
};
describe('SosCommandDock', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    it('renders title, subtitle, close button, and actions list', async () => {
        const onClose = jest.fn();
        const mockDockState = createMockDockState('open', onClose);
        const { getByText, getAllByLabelText } = await renderWithProviders(<SosCommandDock dockState={mockDockState} triggerAction={jest.fn()}/>);
        expect(getByText('Emergency Command Dock')).toBeTruthy();
        expect(getByText('Select emergency type to notify gate and responders immediately.')).toBeTruthy();
        expect(getByText('Medical Assistance')).toBeTruthy();
        expect(getByText('Fire Alert')).toBeTruthy();
        expect(getByText('Lift Stuck Support')).toBeTruthy();
        expect(getByText('Call Security Gate')).toBeTruthy();
        expect(getByText('Senior Citizen Care')).toBeTruthy();
        expect(getByText('Trigger SOS Alert')).toBeTruthy();
        const closeBtns = getAllByLabelText('Close emergency SOS command dock');
        fireEvent.press(getRequiredItem(closeBtns, closeBtns.length - 1, "SosCommandDock.test.tsx"));
        jest.runAllTimers();
        expect(onClose).toHaveBeenCalled();
    });
    it('triggers onClose when backdrop is tapped', async () => {
        const onClose = jest.fn();
        const mockDockState = createMockDockState('open', onClose);
        const { getAllByLabelText } = await renderWithProviders(<SosCommandDock dockState={mockDockState} triggerAction={jest.fn()}/>);
        const backdrop = getRequiredItem(getAllByLabelText('Close emergency SOS command dock'), 0, "SosCommandDock.test.tsx");
        fireEvent.press(backdrop);
        jest.runAllTimers();
        expect(onClose).toHaveBeenCalled();
    });
});

