import React from 'react';
import { fireEvent, cleanup, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { lightTheme } from '../../../shared/theme/lightTheme';
import { darkTheme } from '../../../shared/theme/darkTheme';
import { SafeText } from '../../../shared/components/SafeText';
import { AppButton } from '../../../shared/components/AppButton';
import { AppTextInput } from '../../../ui/forms/AppTextInput';
import { StatusPill } from '../../../ui/components/StatusPill';
import { SectionHeader } from '../../../ui/patterns/SectionHeader';
import { AppModal } from '../../../ui/modal/AppModal';
import { resolveResponsiveLayout } from '../../../ui/layout/useResponsiveLayout';
import { formatCurrencyAmount } from '../../../shared/formatters/currencyFormatter';
import { VisitorArrivalAlertModal } from '../visitors/components/VisitorArrivalAlertModal';
import { SocietyActionHub } from '../../../shared/components/SocietyActionHub';

describe('Phase 11 Design System, Accessibility, Motion & Frontend Performance Integration', () => {
  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  describe('Semantic Tokens & Theme System', () => {
    it('defines complete and symmetrical semantic tokens across light and dark themes', () => {
      const requiredTokenKeys = [
        'background',
        'surface',
        'primary',
        'textPrimary',
        'textSecondary',
        'border',
      ] as const;

      for (const key of requiredTokenKeys) {
        expect(lightTheme.colors[key]).toBeDefined();
        expect(darkTheme.colors[key]).toBeDefined();
        expect(typeof lightTheme.colors[key]).toBe('string');
        expect(typeof darkTheme.colors[key]).toBe('string');
      }
    });

    it('maintains contrasting surfaces between light and dark modes', () => {
      expect(lightTheme.colors.surface).not.toEqual(darkTheme.colors.surface);
      expect(lightTheme.colors.textPrimary).not.toEqual(darkTheme.colors.textPrimary);
    });
  });

  describe('Accessibility & Safe Typography Controls', () => {
    it('enforces maxFontSizeMultiplier on SafeText to protect layouts from catastrophic blowups', async () => {
      const { getByText } = await renderWithProviders(<SafeText>Safe Scaled Text</SafeText>);
      const textElement = getByText('Safe Scaled Text');
      expect(textElement.props.maxFontSizeMultiplier).toBe(1.5);
    });

    it('honors custom maxFontSizeMultiplier override on SafeText', async () => {
      const { getByText } = await renderWithProviders(
        <SafeText maxFontSizeMultiplier={2.0}>Custom Scaled Text</SafeText>
      );
      const textElement = getByText('Custom Scaled Text');
      expect(textElement.props.maxFontSizeMultiplier).toBe(2.0);
    });

    it('provides accessibility attributes and states on AppButton', async () => {
      const handlePress = jest.fn();
      const { getByRole } = await renderWithProviders(
        <AppButton title="Confirm Action" onPress={handlePress} />
      );

      const button = getByRole('button');
      expect(button.props.accessibilityLabel).toBe('Confirm Action');
      expect(button.props.accessibilityState.disabled).toBe(false);

      fireEvent.press(button);
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('marks disabled state on AppButton when disabled prop is provided', async () => {
      const handlePress = jest.fn();
      const { getByRole } = await renderWithProviders(
        <AppButton title="Confirm Action" onPress={handlePress} disabled />
      );

      const button = getByRole('button');
      expect(button.props.accessibilityState.disabled).toBe(true);
    });

    it('configures accessibility and dynamic font scaling on AppTextInput', async () => {
      const handleChange = jest.fn();
      const { getByTestId } = await renderWithProviders(
        <AppTextInput
          testID="resident-name-input"
          value="Aditi Rao"
          onChangeText={handleChange}
        />
      );

      const input = getByTestId('resident-name-input');
      expect(input.props.accessibilityState).toEqual({ disabled: false });
      expect(input.props.maxFontSizeMultiplier).toBe(1.5);
    });

    it('renders StatusPill with semantic text role and formatted label', async () => {
      const { getByTestId } = await renderWithProviders(
        <StatusPill label="Approved" tone="success" testID="approved-pill" />
      );

      const pill = getByTestId('approved-pill');
      expect(pill.props.accessibilityRole).toBe('text');
      expect(pill.props.accessibilityLabel).toBe('Status: Approved');
    });

    it('renders SectionHeader with accessibilityRole header', async () => {
      const handleAction = jest.fn();
      const { getByText, getByRole } = await renderWithProviders(
        <SectionHeader
          title="Recent Activity"
          trailing="View all"
          onTrailingPress={handleAction}
        />
      );

      expect(getByText('Recent Activity').props.accessibilityRole).toBe('header');
      const actionButton = getByRole('button');
      expect(actionButton.props.accessibilityLabel).toBe('View all');
      fireEvent.press(actionButton);
      expect(handleAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('Responsive Layout Resolution Engine', () => {
    it('resolves compact phone dimensions correctly with single-column layout', () => {
      const layout = resolveResponsiveLayout(320, 640);
      expect(layout.isSmall).toBe(true);
      expect(layout.isTablet).toBe(false);
      expect(layout.columns).toBe(1);
      expect(layout.modalMode).toBe('sheet');
      expect(layout.screenPadding).toBeGreaterThan(0);
    });

    it('resolves standard phone dimensions correctly', () => {
      const layout = resolveResponsiveLayout(375, 812);
      expect(layout.isNormal).toBe(true);
      expect(layout.isTablet).toBe(false);
      expect(layout.modalMode).toBe('sheet');
    });

    it('resolves large phone dimensions correctly with dual-column layout', () => {
      const layout = resolveResponsiveLayout(428, 926);
      expect(layout.isLarge).toBe(true);
      expect(layout.isTablet).toBe(false);
      expect(layout.columns).toBe(2);
      expect(layout.modalMode).toBe('sheet');
    });

    it('resolves tablet dimensions correctly with centered modals and multi-column layout', () => {
      const layout = resolveResponsiveLayout(768, 1024);
      expect(layout.isTablet).toBe(true);
      expect(layout.columns).toBe(3);
      expect(layout.modalMode).toBe('centered');
    });

    it('resolves wide tablet dimensions with 4-column layout', () => {
      const layout = resolveResponsiveLayout(1024, 1366);
      expect(layout.isTabletWide).toBe(true);
      expect(layout.columns).toBe(4);
      expect(layout.modalMode).toBe('centered');
    });
  });

  describe('Currency & Temporal Formatting for Indian Residential Society Domain', () => {
    it('formats Indian rupee amounts with appropriate separators and currency symbol', () => {
      const formatted = formatCurrencyAmount(4047);
      expect(formatted).toContain('4,047');
      expect(formatted).toContain('₹');

      const formattedLarge = formatCurrencyAmount(124500);
      expect(formattedLarge).toContain('1,24,500');
      expect(formattedLarge).toContain('₹');
    });

    it('returns graceful fallback for invalid or non-finite numbers', () => {
      expect(formatCurrencyAmount(Number.NaN)).toBe('—');
      expect(formatCurrencyAmount(Number.POSITIVE_INFINITY)).toBe('—');
    });
  });

  describe('Shared Modal Architecture Integration', () => {
    it('renders VisitorArrivalAlertModal using shared AppModal with security actions', async () => {
      const handleAllow = jest.fn();
      const handleWait = jest.fn();
      const handleDeny = jest.fn();

      const { getByTestId, getByText } = await renderWithProviders(
        <VisitorArrivalAlertModal
          visible={true}
          visitorName="Rajesh Kumar"
          gateName="Gate 2 (North)"
          scanTime="10:30 AM"
          vehicleNumber="MH 12 AB 1234"
          onAllow={handleAllow}
          onWait={handleWait}
          onDeny={handleDeny}
        />
      );

      await waitFor(() => {
        expect(getByText('Rajesh Kumar is at Gate 2 (North)')).toBeTruthy();
        expect(getByText('MH 12 AB 1234')).toBeTruthy();
      });

      const allowBtn = getByTestId('allow-arrival-btn');
      fireEvent.press(allowBtn);
      expect(handleAllow).toHaveBeenCalledTimes(1);

      const denyBtn = getByTestId('deny-arrival-btn');
      fireEvent.press(denyBtn);
      expect(handleDeny).toHaveBeenCalledTimes(1);
    });

    it('renders SocietyActionHub using shared AppModal with responsive action items', async () => {
      const handleClose = jest.fn();
      const handleSelect = jest.fn();

      const { getByText, getByLabelText } = await renderWithProviders(
        <SocietyActionHub
          visible={true}
          onClose={handleClose}
          onActionSelect={handleSelect}
        />
      );

      await waitFor(() => {
        expect(getByText('Quick Actions')).toBeTruthy();
        expect(getByText('Select an action for your home')).toBeTruthy();
      });

      const addVisitorBtn = getByLabelText('Add Visitor');
      fireEvent.press(addVisitorBtn);
      expect(handleSelect).toHaveBeenCalledWith('add-visitor');
      expect(handleClose).toHaveBeenCalled();
    });

    it('AppModal unmounts cleanly without throwing memory leak or lifecycle exceptions', async () => {
      const handleClose = jest.fn();
      const { unmount } = await renderWithProviders(
        <AppModal visible={true} onClose={handleClose}>
          <SafeText>Modal Content</SafeText>
        </AppModal>
      );

      expect(() => unmount()).not.toThrow();
    });
  });
});
