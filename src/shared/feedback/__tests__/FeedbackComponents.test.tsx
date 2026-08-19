import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { AccessRestrictedState } from '../AccessRestrictedState';
import { EmptyState } from '../EmptyState';
import { ErrorState } from '../ErrorState';
import { LoadingState } from '../LoadingState';
import { NoDataState } from '../NoDataState';
import { SkeletonCard } from '../SkeletonCard';
import { SuccessState } from '../SuccessState';
import { WarningBanner } from '../WarningBanner';
import { ThemeProvider } from '../../../core/theme/ThemeProvider';

describe('Feedback Components', () => {
  it('renders AccessRestrictedState permission block message', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <AccessRestrictedState requiredPermission="BILL_GENERATE" />
      </ThemeProvider>
    );

    expect(screen.getByText(/Access restricted/i)).toBeOnTheScreen();
  });

  it('renders EmptyState default configurations', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <EmptyState title="No Records" description="Try creating one." />
      </ThemeProvider>
    );

    expect(screen.getByText('No Records')).toBeOnTheScreen();
    expect(screen.getByText('Try creating one.')).toBeOnTheScreen();
  });

  it('renders ErrorState with messaging text', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <ErrorState message="Server unreachable" />
      </ThemeProvider>
    );

    expect(screen.getByText('Server unreachable')).toBeOnTheScreen();
  });

  it('renders LoadingState spinner loader text', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <LoadingState message="Processing request..." />
      </ThemeProvider>
    );

    expect(screen.getByText('Processing request...')).toBeOnTheScreen();
  });

  it('renders NoDataState messages', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <NoDataState title="Empty List" description="Reset filters" />
      </ThemeProvider>
    );

    expect(screen.getByText('Empty List')).toBeOnTheScreen();
  });

  it('renders SkeletonCard placeholders', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <SkeletonCard />
      </ThemeProvider>
    );

    
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders SuccessState summary details', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <SuccessState title="Payment Received" message="Reference #TXN123" />
      </ThemeProvider>
    );

    expect(screen.getByText('Payment Received')).toBeOnTheScreen();
    expect(screen.getByText('Reference #TXN123')).toBeOnTheScreen();
  });

  it('renders WarningBanner warning messages', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <WarningBanner message="Service interruption alert" />
      </ThemeProvider>
    );

    expect(screen.getByText('Service interruption alert')).toBeOnTheScreen();
  });
});
