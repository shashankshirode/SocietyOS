import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { ThemeProvider } from '../../../core/theme/ThemeProvider';
import {
  SocietySkeleton,
  SocietyShimmerProvider,
  SocietySkeletonText,
  SocietySkeletonAvatar,
  SocietySkeletonSurface,
  SocietySkeletonList,
  SocietySkeletonTimeline,
  SocietyLoadingIndicator,
  SocietyInlineLoader,
  SocietyRefreshIndicator,
  SocietyActionProgress,
  RouteTransitionState,
} from '../index';
import { LoadingIntent } from '../../../core/async/AsyncState';
import { SafeText } from '../../../shared/components/SafeText';

describe('Society OS Global Loading System', () => {
  it('renders SocietySkeleton with testID and custom dimensions', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <SocietySkeleton testID="test-skeleton" width={100} height={24} borderRadius={12} />
      </ThemeProvider>
    );
    expect(screen.getByTestId('test-skeleton', { includeHiddenElements: true })).toBeTruthy();
  });

  it('renders synchronized skeletons inside SocietyShimmerProvider', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <SocietyShimmerProvider>
          <SocietySkeleton testID="child-skeleton-1" width="50%" height={16} />
          <SocietySkeleton testID="child-skeleton-2" width="80%" height={16} />
        </SocietyShimmerProvider>
      </ThemeProvider>
    );
    expect(screen.getByTestId('child-skeleton-1', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByTestId('child-skeleton-2', { includeHiddenElements: true })).toBeTruthy();
  });

  it('renders SocietySkeletonText with expected lines', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <SocietySkeletonText testID="test-skeleton-text" lines={3} lineHeight={16} />
      </ThemeProvider>
    );
    expect(screen.getByTestId('test-skeleton-text', { includeHiddenElements: true })).toBeTruthy();
  });

  it('renders SocietySkeletonAvatar with circle dimensions', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <SocietySkeletonAvatar testID="test-skeleton-avatar" size={48} />
      </ThemeProvider>
    );
    expect(screen.getByTestId('test-skeleton-avatar', { includeHiddenElements: true })).toBeTruthy();
  });

  it('renders SocietySkeletonSurface with children', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <SocietySkeletonSurface testID="test-skeleton-surface">
          <SafeText>Inner Content</SafeText>
        </SocietySkeletonSurface>
      </ThemeProvider>
    );
    expect(screen.getByTestId('test-skeleton-surface')).toBeTruthy();
    expect(screen.getByText('Inner Content')).toBeTruthy();
  });

  it('renders SocietySkeletonList with multiple items', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <SocietySkeletonList testID="test-skeleton-list" count={4} />
      </ThemeProvider>
    );
    expect(screen.getByTestId('test-skeleton-list')).toBeTruthy();
  });

  it('renders SocietySkeletonTimeline with step count', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <SocietySkeletonTimeline testID="test-skeleton-timeline" steps={3} />
      </ThemeProvider>
    );
    expect(screen.getByTestId('test-skeleton-timeline')).toBeTruthy();
  });

  it('renders SocietyLoadingIndicator with semantic intent and message', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <SocietyLoadingIndicator
          testID="test-loading-indicator"
          intent={LoadingIntent.INITIAL_PAGE}
          size="lg"
          message="Loading Society OS..."
        />
      </ThemeProvider>
    );
    expect(screen.getByTestId('test-loading-indicator')).toBeTruthy();
    expect(screen.getByText('Loading Society OS...')).toBeTruthy();
  });

  it('renders SocietyInlineLoader with label', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <SocietyInlineLoader testID="test-inline-loader" label="Checking availability..." />
      </ThemeProvider>
    );
    expect(screen.getByTestId('test-inline-loader')).toBeTruthy();
    expect(screen.getByText('Checking availability...')).toBeTruthy();
  });

  it('renders SocietyRefreshIndicator when refreshing is true and hides when false', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <SocietyRefreshIndicator
          testID="active-refresh-indicator"
          refreshing={true}
          label="Syncing..."
        />
        <SocietyRefreshIndicator
          testID="inactive-refresh-indicator"
          refreshing={false}
          label="Syncing..."
        />
      </ThemeProvider>
    );
    expect(screen.getByTestId('active-refresh-indicator')).toBeTruthy();
    expect(screen.queryByTestId('inactive-refresh-indicator')).toBeNull();
  });

  it('renders SocietyActionProgress indicator', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <SocietyActionProgress testID="test-action-progress" size="small" />
      </ThemeProvider>
    );
    expect(screen.getByTestId('test-action-progress')).toBeTruthy();
  });

  it('renders RouteTransitionState wrapper', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <RouteTransitionState testID="test-route-transition" message="Preparing experience..." />
      </ThemeProvider>
    );
    expect(screen.getByTestId('test-route-transition')).toBeTruthy();
    expect(screen.getByText('Preparing experience...')).toBeTruthy();
  });
});
