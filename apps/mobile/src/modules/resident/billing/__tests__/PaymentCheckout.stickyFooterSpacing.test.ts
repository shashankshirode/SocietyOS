import { getResidentScreenBottomPadding } from '../../../../ui/layout/residentScreenSpacing';

describe('resident billing bottom spacing', () => {
  it('reserves the sticky footer and safe area without a fixed oversized margin', () => {
    expect(getResidentScreenBottomPadding({
      safeAreaBottom: 24,
      hasBottomTabs: false,
      hasStickyFooter: true,
      stickyFooterHeight: 76,
    })).toBe(116);
  });

  it('uses compact tab-aware padding on bill history screens', () => {
    expect(getResidentScreenBottomPadding({
      safeAreaBottom: 12,
      hasBottomTabs: true,
      hasStickyFooter: false,
    })).toBe(100);
  });
});
