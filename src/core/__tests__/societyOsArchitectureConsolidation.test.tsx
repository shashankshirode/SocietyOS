import React from 'react';
import { fireEvent, act } from '@testing-library/react-native';
import { SocietyButton } from '../../shared/components/SocietyButton';
import { AsyncActionButton } from '../../shared/components/AsyncActionButton';
import { SelectionGroup } from '../../shared/components/SelectionGroup';
import { StatusIndicator } from '../../shared/components/StatusIndicator';
import { ActionRow } from '../../shared/components/ActionRow';
import { EmptyState } from '../../shared/components/EmptyState';
import { ErrorState } from '../../shared/components/ErrorState';
import { ResidenceContextGuard } from '../../modules/resident/experience/ResidenceContextGuard';
import { AdaptiveFlowComposer } from '../../modules/resident/experience/AdaptiveFlowComposer';
import { SocietyPageShell } from '../../modules/resident/experience/SocietyPageShell';
import { formatDomainError } from '../errors/errorPresenter';
import { renderWithProviders } from '../../test/testUtils';
import { SafeText } from '../../shared/components/SafeText';

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(() => ({ width: 390, height: 844, scale: 1, fontScale: 1 })),
}));

describe('Society OS Consolidated Architecture & Shared Primitives', () => {
  describe('1. SocietyButton & AsyncActionButton', () => {
    it('renders and triggers action on press', async () => {
      const onPress = jest.fn();
      const screen = await renderWithProviders(
        <SocietyButton title="Save Entry" onPress={onPress} variant="primary" testID="society-btn" />
      );

      const btn = screen.getByTestId('society-btn');
      expect(btn).toBeTruthy();
      expect(screen.getByText('Save Entry')).toBeTruthy();
      fireEvent.press(btn);
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('AsyncActionButton prevents double tap during asynchronous execution', async () => {
      let resolvePromise: () => void = () => undefined;
      const onAction = jest.fn(
        () =>
          new Promise<void>((resolve) => {
            resolvePromise = resolve;
          })
      );

      const screen = await renderWithProviders(
        <AsyncActionButton title="Submit Pass" onAction={onAction} testID="async-btn" />
      );

      const btn = screen.getByTestId('async-btn');
      await act(async () => {
        fireEvent.press(btn);
        fireEvent.press(btn); // Second press during in-flight should be ignored
      });
      expect(onAction).toHaveBeenCalledTimes(1);

      resolvePromise();
    });
  });

  describe('2. SelectionGroup & Primitives', () => {
    it('renders options and selects key on tap', async () => {
      const onSelect = jest.fn();
      const screen = await renderWithProviders(
        <SelectionGroup
          label="Category"
          options={[
            { key: 'GUEST', label: 'Guest Pass' },
            { key: 'DELIVERY', label: 'Delivery' },
          ]}
          selected="GUEST"
          onSelect={onSelect}
        />
      );

      expect(screen.getByText('Guest Pass')).toBeTruthy();
      expect(screen.getByText('Delivery')).toBeTruthy();
      fireEvent.press(screen.getByText('Delivery'));
      expect(onSelect).toHaveBeenCalledWith('DELIVERY');
    });
  });

  describe('3. StatusIndicator', () => {
    it('renders with correct semantic status label', async () => {
      const screen = await renderWithProviders(
        <StatusIndicator label="Active" tone="active" testID="status-ind" />
      );
      expect(screen.getByTestId('status-ind')).toBeTruthy();
      expect(screen.getByText('Active')).toBeTruthy();
    });
  });

  describe('4. ActionRow', () => {
    it('renders title, subtitle, and fires onPress', async () => {
      const onPress = jest.fn();
      const screen = await renderWithProviders(
        <ActionRow
          title="Notification Settings"
          subtitle="Configure alerts and SOS"
          onPress={onPress}
          testID="action-row"
        />
      );

      expect(screen.getByText('Notification Settings')).toBeTruthy();
      expect(screen.getByText('Configure alerts and SOS')).toBeTruthy();
      fireEvent.press(screen.getByTestId('action-row'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('5. EmptyState & ErrorState', () => {
    it('renders empty state with call to action', async () => {
      const onAction = jest.fn();
      const screen = await renderWithProviders(
        <EmptyState
          title="No passes issued"
          description="Create your first visitor access pass"
          actionTitle="Create Pass"
          onAction={onAction}
          testID="empty-state"
        />
      );

      expect(screen.getByText('No passes issued')).toBeTruthy();
      expect(screen.getByText('Create your first visitor access pass')).toBeTruthy();
      fireEvent.press(screen.getByText('Create Pass'));
      expect(onAction).toHaveBeenCalledTimes(1);
    });

    it('renders error state with retry action', async () => {
      const onRetry = jest.fn();
      const screen = await renderWithProviders(
        <ErrorState
          title="Network Connection Failed"
          message="Unable to reach society server."
          onRetry={onRetry}
          testID="error-state"
        />
      );

      expect(screen.getByText('Network Connection Failed')).toBeTruthy();
      expect(screen.getByText('Unable to reach society server.')).toBeTruthy();
      fireEvent.press(screen.getByText('Try again'));
      expect(onRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('6. ResidenceContextGuard', () => {
    it('blocks interactions and renders recovery warning when stale', async () => {
      const onRestart = jest.fn();
      const screen = await renderWithProviders(
        <ResidenceContextGuard
          isStale={true}
          onRestart={onRestart}
          message="Active flat changed. Please restart booking."
        >
          <SafeText variant="body">Booking Form Content</SafeText>
        </ResidenceContextGuard>
      );

      expect(screen.getByText('Active flat changed. Please restart booking.')).toBeTruthy();
      fireEvent.press(screen.getByText('Restart Flow'));
      expect(onRestart).toHaveBeenCalledTimes(1);
    });

    it('renders children directly when context is not stale', async () => {
      const screen = await renderWithProviders(
        <ResidenceContextGuard isStale={false}>
          <SafeText variant="body">Valid Draft Content</SafeText>
        </ResidenceContextGuard>
      );

      expect(screen.getByText('Valid Draft Content')).toBeTruthy();
    });
  });

  describe('7. AdaptiveFlowComposer & SocietyPageShell', () => {
    it('renders flow title, content and sticky command in AdaptiveFlowComposer', async () => {
      const screen = await renderWithProviders(
        <AdaptiveFlowComposer
          title="Open your home"
          subtitle="Who are you opening your home to?"
          command={<SocietyButton title="Create Access" onPress={() => undefined} />}
        >
          <SafeText variant="body">Form Fields</SafeText>
        </AdaptiveFlowComposer>
      );

      expect(screen.getByText('Open your home')).toBeTruthy();
      expect(screen.getByText('Who are you opening your home to?')).toBeTruthy();
      expect(screen.getByText('Form Fields')).toBeTruthy();
      expect(screen.getByText('Create Access')).toBeTruthy();
    });

    it('renders SocietyPageShell with bounded content and sticky action', async () => {
      const screen = await renderWithProviders(
        <SocietyPageShell
          showHeader={false}
          stickyAction={<SocietyButton title="Save Changes" onPress={() => undefined} />}
          testID="test-page-shell"
        >
          <SafeText variant="body">Page Shell Content</SafeText>
        </SocietyPageShell>
      );

      expect(screen.getByTestId('test-page-shell')).toBeTruthy();
      expect(screen.getByText('Page Shell Content')).toBeTruthy();
      expect(screen.getByText('Save Changes')).toBeTruthy();
    });
  });

  describe('8. Structured Error Presenter', () => {
    it('translates domain error codes into human messages', () => {
      expect(formatDomainError({ code: 'PERMISSION_DENIED', message: '' })).toBe(
        'You do not have permission to perform this action.'
      );
      expect(formatDomainError({ code: 'SLOT_UNAVAILABLE', message: '' })).toBe(
        'The requested slot or resource is no longer available. Please select another.'
      );
      expect(formatDomainError({ code: 'PASS_CANCELLED', message: '' })).toBe(
        'This pass has been cancelled and cannot be used.'
      );
      expect(formatDomainError({ code: 'STALE_STATE', message: '' })).toBe(
        'Your active context has changed. Please refresh and try again.'
      );
    });
  });
});
