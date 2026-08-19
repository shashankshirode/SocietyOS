import React from 'react';
import { Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { AnimatedMetricCard } from '../AnimatedMetricCard';
import { AnimatedProgressRing } from '../AnimatedProgressRing';
import { FadeInView } from '../FadeInView';
import { PressableScale } from '../PressableScale';
import { PulseBadge } from '../PulseBadge';
import { StaggeredList } from '../StaggeredList';

describe('motion components', () => {
  it('renders animation wrappers and metric components', async () => {
    const screen = await renderWithProviders(
      <>
        <FadeInView><Text>Fade content</Text></FadeInView>
        <PulseBadge label="LIVE" />
        <AnimatedMetricCard label="Guests Today" value={3} icon="visitor" />
        <AnimatedProgressRing progress={75} label="SLA" />
        <StaggeredList data={['Alpha', 'Beta']} keyExtractor={(item) => item} renderItem={(item) => <Text>{item}</Text>} />
      </>
    );

    expect(screen.getByText('Fade content')).toBeTruthy();
    expect(screen.getByText('LIVE')).toBeTruthy();
    expect(screen.getByText('Guests Today')).toBeTruthy();
    expect(screen.getByText('75%')).toBeTruthy();
    expect(screen.getByText('Alpha')).toBeTruthy();
  });

  it('fires press callbacks through PressableScale', async () => {
    const onPress = jest.fn();
    const screen = await renderWithProviders(
      <PressableScale onPress={onPress} accessibilityRole="button">
        <Text>Press action</Text>
      </PressableScale>
    );

    fireEvent.press(screen.getByText('Press action'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
