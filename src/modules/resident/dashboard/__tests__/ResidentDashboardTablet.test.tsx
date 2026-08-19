import { resolveResidentDashboardLayout } from '../layout/residentDashboardLayout';

describe('Resident dashboard tablet composition', () => {
  it.each([[768, 1024], [820, 1180], [1024, 1366]] as const)(
    'uses an intentional two-pane layout at %d x %d',
    (width, height) => {
      const layout = resolveResidentDashboardLayout(width, height);
      expect(layout.usesTwoPane).toBe(true);
      expect(layout.horizontalGap).toBeGreaterThanOrEqual(20);
      expect(layout.contentMaxWidth).toBeLessThanOrEqual(1240);
    },
  );
});
