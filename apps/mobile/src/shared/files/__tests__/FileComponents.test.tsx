import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { FilePickerButton } from '../FilePickerButton';
import { SelectedFileCard } from '../SelectedFileCard';
import { FileAttachmentList } from '../FileAttachmentList';
import { ThemeProvider } from '../../../core/theme/ThemeProvider';

jest.mock('../../../core/files/documentPickerService', () => ({
  pickDocument: jest.fn(() => Promise.resolve({
    uri: 'file://test.pdf',
    name: 'test.pdf',
    mimeType: 'application/pdf',
    size: 1024 * 1024,
  })),
}));

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  launchCameraAsync: jest.fn(() => Promise.resolve({
    canceled: false,
    assets: [{ uri: 'file://photo.jpg', fileSize: 2048576 }],
  })),
}));

describe('File UI Components', () => {
  it('renders FilePickerButton with label', async () => {
    const onFilePicked = jest.fn();
    await renderWithProviders(
      <ThemeProvider>
        <FilePickerButton onFilePicked={onFilePicked} label="Add Receipt" allowedSource="file" />
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: 'Add Receipt' });
    expect(button).toBeOnTheScreen();
    fireEvent.press(button);
    
    await waitFor(() => {
      expect(onFilePicked).toHaveBeenCalled();
    });
  });

  it('renders SelectedFileCard with file metadata name and size format', async () => {
    const onRemove = jest.fn();
    await renderWithProviders(
      <ThemeProvider>
        <SelectedFileCard
          file={{
            uri: 'file://receipt.pdf',
            name: 'receipt.pdf',
            mimeType: 'application/pdf',
            size: 2 * 1024 * 1024,
          }}
          onRemove={onRemove}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('receipt.pdf')).toBeOnTheScreen();
    expect(screen.getByText(/2.0 MB/i)).toBeOnTheScreen();
  });

  it('renders FileAttachmentList holding file selection cards', async () => {
    const files = [
      {
        uri: 'file://photo.png',
        name: 'photo.png',
        mimeType: 'image/png',
        size: 512 * 1024,
      },
    ];
    await renderWithProviders(
      <ThemeProvider>
        <FileAttachmentList files={files} onFilesChange={jest.fn()} />
      </ThemeProvider>
    );

    expect(screen.getByText('photo.png')).toBeOnTheScreen();
    expect(screen.getByText(/512.0 KB/i)).toBeOnTheScreen();
  });
});
