import { ExperiencePerformanceTier, NavigationTransition, createExperienceRuntimeProfile, resolvePerformanceTier, resolveTransitionSpec } from '../index';

describe('experience runtime', () => {
  it('resolves conservative performance tiers', () => {
    expect(resolvePerformanceTier({ reducedMotion: true })).toBe(ExperiencePerformanceTier.REDUCED);
    expect(resolvePerformanceTier({ reducedMotion: false, lowPowerMode: true })).toBe(ExperiencePerformanceTier.REDUCED);
    expect(createExperienceRuntimeProfile({ reducedMotion: false, deviceMemoryGb: 8 }).maxInitialSkeletonItems).toBe(5);
  });

  it('uses semantic transition specs and removes movement for reduced motion', () => {
    const standard = createExperienceRuntimeProfile({ reducedMotion: false });
    const reduced = createExperienceRuntimeProfile({ reducedMotion: true });
    expect(resolveTransitionSpec(NavigationTransition.FOCUS_OPEN, standard).distance).toBeGreaterThan(0);
    expect(resolveTransitionSpec(NavigationTransition.FOCUS_OPEN, reduced).distance).toBe(0);
    expect(resolveTransitionSpec(NavigationTransition.CRITICAL_MODE_ENTER, reduced).durationMs).toBe(80);
  });
});