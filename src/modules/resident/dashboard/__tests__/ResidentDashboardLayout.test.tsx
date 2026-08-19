import { resolveResidentDashboardLayout } from '../layout/residentDashboardLayout';

describe('Resident dashboard responsive layout', () => {
  it.each([
    [320, 568, 'compactPhone', false],
    [360, 800, 'phone', false],
    [480, 960, 'largePhone', false],
    [768, 1024, 'tablet', true],
    [1024, 1366, 'largeTablet', true],
  ] as const)('resolves %d x %d to %s', (width, height, mode, usesTwoPane) => {
    const layout = resolveResidentDashboardLayout(width, height);
    expect(layout.mode).toBe(mode);
    expect(layout.usesTwoPane).toBe(usesTwoPane);
    expect(layout.contentMaxWidth).toBeGreaterThanOrEqual(width);
    expect(layout.bottomContentInset).toBeGreaterThanOrEqual(112);
  });
});
