import { resolveResidentDashboardLayout } from '../layout/residentDashboardLayout';

describe('Resident dashboard compact phone composition', () => {
  it.each([[320, 568], [360, 800], [375, 812], [390, 844], [412, 915], [430, 932]] as const)(
    'keeps %d x %d in a deliberate single flow',
    (width, height) => {
      const layout = resolveResidentDashboardLayout(width, height);
      expect(layout.usesTwoPane).toBe(false);
      expect(layout.usesWidePhonePairs).toBe(false);
      expect(layout.contentMaxWidth).toBe(width);
    },
  );
});
