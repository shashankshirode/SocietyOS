import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { AppCheckbox } from '../AppCheckbox';
import { AppSelect } from '../AppSelect';
import { AppTextArea } from '../AppTextArea';
import { FieldErrorText } from '../FieldErrorText';
import { FormActions } from '../FormActions';
import { FormSection } from '../FormSection';
import { FormField } from '../FormField';
import { ThemeProvider } from '../../../core/theme/ThemeProvider';

describe('Form Components', () => {
  it('renders AppCheckbox and toggles checks', async () => {
    const onPress = jest.fn();
    await renderWithProviders(
      <ThemeProvider>
        <AppCheckbox checked={false} onPress={onPress} label="Terms & Conditions" />
      </ThemeProvider>
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeOnTheScreen();
    fireEvent.press(checkbox);
    expect(onPress).toHaveBeenCalled();
  });

  it('renders AppSelect dropdown with selected value', async () => {
    const onChange = jest.fn();
    await renderWithProviders(
      <ThemeProvider>
        <AppSelect
          label="Category"
          value="plumbing"
          options={[{ label: 'Plumbing', value: 'plumbing' }]}
          onChange={onChange}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Plumbing')).toBeOnTheScreen();
  });

  it('renders AppTextArea wrapper', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <AppTextArea label="Description" value="Multiline desc" onChangeText={jest.fn()} />
      </ThemeProvider>
    );

    expect(screen.getByDisplayValue('Multiline desc')).toBeOnTheScreen();
  });

  it('renders FieldErrorText messages list', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <FieldErrorText error="Invalid input format" />
      </ThemeProvider>
    );

    expect(screen.getByText('Invalid input format')).toBeOnTheScreen();
  });

  it('renders FormActions layout', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <FormActions>
          <Text>Actions Content</Text>
        </FormActions>
      </ThemeProvider>
    );

    expect(screen.getByText('Actions Content')).toBeOnTheScreen();
  });

  it('renders FormSection with header title', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <FormSection title="Account Setup">
          <Text>Section child content</Text>
        </FormSection>
      </ThemeProvider>
    );

    expect(screen.getByText(/Account Setup/i)).toBeOnTheScreen();
  });

  it('renders FormField with input validations', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <FormField label="Email" value="user@mail.com" onChangeText={jest.fn()} />
      </ThemeProvider>
    );

    expect(screen.getByText('Email')).toBeOnTheScreen();
  });
});
