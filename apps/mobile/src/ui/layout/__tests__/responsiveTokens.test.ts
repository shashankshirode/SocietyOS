import { resolveContainerLayout } from '../useContainerLayout';
import { resolveResponsiveClass, responsiveLayoutTokens } from '../responsiveTokens';
import { resolveResponsiveLayout } from '../useResponsiveLayout';

describe('Society OS responsive architecture', () => {
  it.each([
    [320, 'compact'],
    [360, 'phone'],
    [400, 'largePhone'],
    [480, 'fold'],
    [720, 'tablet'],
    [1024, 'wide'],
  ] as const)('classifies %ipx as %s', (width, expected) => {
    expect(resolveResponsiveClass(width)).toBe(expected);
  });

  it('keeps fold layouts distinct from stretched phones and tablets', () => {
    const layout = resolveResponsiveLayout(600, 820);
    expect(layout.isFold).toBe(true);
    expect(layout.isTablet).toBe(false);
    expect(layout.screenPadding).toBe(responsiveLayoutTokens.gutter.fold);
    expect(layout.contentMaxWidth).toBe(600);
  });

  it('resolves component composition from measured container width', () => {
    expect(resolveContainerLayout(340).isCompact).toBe(true);
    expect(resolveContainerLayout(560).isFold).toBe(true);
    expect(resolveContainerLayout(760).isTablet).toBe(true);
  });
});
