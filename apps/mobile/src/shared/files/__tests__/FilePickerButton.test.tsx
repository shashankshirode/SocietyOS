import React from 'react';
import { renderWithProviders } from '../../../test/testUtils';
import { FilePickerButton } from '../FilePickerButton';

describe('FilePickerButton Component', () => {
  it('renders standard file select prompt button text', async () => {
    const screen = await renderWithProviders(<FilePickerButton onFilePicked={jest.fn()} />);
    expect(screen.getByText('Add Document')).toBeOnTheScreen();
  });
});
