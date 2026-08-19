import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { Box } from '../Box';
import { ContentContainer } from '../ContentContainer';
import { Inline } from '../Inline';
import { ResponsiveGrid } from '../ResponsiveGrid';
import { SafeTextRow } from '../SafeTextRow';
import { ScreenScaffold } from '../ScreenScaffold';
import { SectionBlock } from '../SectionBlock';
import { Stack } from '../Stack';
import { WrapRow } from '../WrapRow';
import { ThemeProvider } from '../../../core/theme/ThemeProvider';
import { Text } from 'react-native';

describe('Layout Components', () => {
  it('renders Box with custom padding and spacing', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <Box p="md" testID="box-id">
          <Text>Content</Text>
        </Box>
      </ThemeProvider>
    );

    expect(screen.getByTestId('box-id')).toBeOnTheScreen();
    expect(screen.getByText('Content')).toBeOnTheScreen();
  });

  it('renders ContentContainer with default and tablet sizing constraints', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <ContentContainer>
          <Text>CC</Text>
        </ContentContainer>
      </ThemeProvider>
    );

    expect(screen.getByText('CC')).toBeOnTheScreen();
  });

  it('renders Inline wrapping items horizontally', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <Inline gap="sm" testID="inline-id">
          <Text>A</Text>
          <Text>B</Text>
        </Inline>
      </ThemeProvider>
    );

    expect(screen.getByTestId('inline-id')).toBeOnTheScreen();
  });

  it('renders ResponsiveGrid responsive columns', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <ResponsiveGrid columnsPhone={2}>
          <Text>Item 1</Text>
          <Text>Item 2</Text>
        </ResponsiveGrid>
      </ThemeProvider>
    );

    expect(screen.getByText('Item 1')).toBeOnTheScreen();
    expect(screen.getByText('Item 2')).toBeOnTheScreen();
  });

  it('renders wrapping rows with long titles and right-side metadata', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <SafeTextRow
          title="Green Valley Heights Phase 2 Cooperative Housing Society"
          subtitle="A-1204 / Tower B / East Wing / Basement Parking P2-184"
          right={<Text>Frontend Ready / Integration Required</Text>}
        />
        <WrapRow testID="wrap-row-id">
          <Text>Police Verification Pending for Tenant Move-out NOC</Text>
          <Text>Biometric Device Sync Failed - Unknown Employee Code</Text>
        </WrapRow>
      </ThemeProvider>
    );

    expect(screen.getByText('Green Valley Heights Phase 2 Cooperative Housing Society')).toBeOnTheScreen();
    expect(screen.getByTestId('wrap-row-id')).toBeOnTheScreen();
  });

  it('renders ScreenScaffold standard page structure', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <ScreenScaffold>
          <Text>Scaffold Body</Text>
        </ScreenScaffold>
      </ThemeProvider>
    );

    expect(screen.getByText('Scaffold Body')).toBeOnTheScreen();
  });

  it('renders SectionBlock styled wrapper with title header', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <SectionBlock title="Rules Section" testID="sec-id">
          <Text>Subtext</Text>
        </SectionBlock>
      </ThemeProvider>
    );

    expect(screen.getByTestId('sec-id')).toBeOnTheScreen();
    expect(screen.getByText('Rules Section')).toBeOnTheScreen();
  });

  it('renders Stack layout layout wrapper vertical gaps', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <Stack gap="md" testID="stack-id">
          <Text>Row A</Text>
          <Text>Row B</Text>
        </Stack>
      </ThemeProvider>
    );

    expect(screen.getByTestId('stack-id')).toBeOnTheScreen();
  });
});
