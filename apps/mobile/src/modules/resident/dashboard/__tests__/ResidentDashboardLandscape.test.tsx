import { resolveResidentDashboardLayout } from '../layout/residentDashboardLayout';

describe('Resident dashboard landscape layout', () => {
  it('centres a bounded two-pane canvas without enabling wide-phone pairs', () => {
    const layout = resolveResidentDashboardLayout(1366, 1024);
    expect(layout.mode).toBe('largeTablet');
    expect(layout.usesTwoPane).toBe(true);
    expect(layout.usesWidePhonePairs).toBe(false);
    expect(layout.contentMaxWidth).toBe(1240);
  });
});
