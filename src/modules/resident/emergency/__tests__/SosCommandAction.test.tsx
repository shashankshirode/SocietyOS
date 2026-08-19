import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { SosCommandAction } from '../components/SosCommandAction';
import { SOS_COMMAND_ACTIONS } from '../data/sosCommandActions';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
describe('SosCommandAction', () => {
    it('renders action item tile with icon and text', async () => {
        const config = getRequiredItem(SOS_COMMAND_ACTIONS, 0, "SosCommandAction.test.tsx");
        const onPress = jest.fn();
        const { getByText, getByLabelText } = await renderWithProviders(<SosCommandAction config={config} labelText="Medical assistance" accessibilityLabel="medical-test" onPress={onPress}/>);
        expect(getByText('Medical assistance')).toBeTruthy();
        const btn = getByLabelText('medical-test');
        fireEvent.press(btn);
        expect(onPress).toHaveBeenCalled();
    });
});

