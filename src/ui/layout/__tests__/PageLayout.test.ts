import { resolvePageLayoutMetrics } from '../PageLayout';

describe('PageLayout', () => {
  it('keeps full-mode phone canvas unbounded while retaining a safe gutter', () => {
    expect(resolvePageLayoutMetrics('full', 'phone', 390)).toEqual({ paddingHorizontal: 16, maxWidth: 390, columns: 1 });
  });

  it('bounds reading content independently from the page canvas', () => {
    expect(resolvePageLayoutMetrics('reading', 'wide', 1366)).toEqual({ paddingHorizontal: 32, maxWidth: 820, columns: 1 });
  });

  it('activates two-pane split mode only at tablet scale', () => {
    expect(resolvePageLayoutMetrics('split', 'fold', 600).columns).toBe(1);
    expect(resolvePageLayoutMetrics('split', 'tablet', 900).columns).toBe(2);
  });
});
