import { societyNavigation } from '../../../../shared/theme/societyTheme';
import { createDockHorizontalStyle } from '../styles/ResidentTabBar.styles';

describe('SocietyNavigationDock geometry', () => {
  it.each([360, 375, 390, 430])('keeps the dock and four equal lenses inside a %ipx phone', (screenWidth) => {
    const dock = createDockHorizontalStyle(screenWidth, societyNavigation.capsuleInset, societyNavigation.tabletMaxWidth);
    const contentWidth = dock.width - societyNavigation.internalPadding * 2;
    const lensWidth = contentWidth / 4;

    expect(dock.left).toBeGreaterThanOrEqual(societyNavigation.capsuleInset);
    expect(lensWidth).toBeGreaterThan(0);
    expect(societyNavigation.internalPadding).toBeGreaterThanOrEqual(6);
    expect(dock.left + dock.width).toBeLessThanOrEqual(screenWidth - societyNavigation.capsuleInset);
  });

  it('centers and bounds the dock on tablet', () => {
    const screenWidth = 1024;
    const dock = createDockHorizontalStyle(screenWidth, societyNavigation.capsuleInset, societyNavigation.tabletMaxWidth);
    expect(dock.width).toBe(societyNavigation.tabletMaxWidth);
    expect(dock.left).toBe((screenWidth - societyNavigation.tabletMaxWidth) / 2);
  });

  it('keeps the active lens fully inside the outer stroke', () => {
    expect(societyNavigation.capsuleHeight - societyNavigation.activeLensHeight).toBe(societyNavigation.internalPadding * 2);
  });
});
