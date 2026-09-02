import { resolveEmergencyLensLayout } from '../emergencyLensLayout';

function intersects(first: { left: number; top: number; width: number; height: number }, second: { left: number; top: number; width: number; height: number }): boolean {
  return first.left < second.left + second.width && first.left + first.width > second.left && first.top < second.top + second.height && first.top + first.height > second.top;
}

describe('emergency lens geometry', () => {
  it.each([
    [320, 568], [360, 640], [360, 800], [375, 667], [390, 844], [412, 915], [430, 932],
  ])('keeps every phone territory inside the lens at %dx%d', (width, height) => {
    const layout = resolveEmergencyLensLayout({ containerWidth: width - 32, containerHeight: height * 0.48, fontScale: 1 });
    const bounds = { left: 0, top: 0, width: layout.lensSize, height: layout.lensSize };
    for (const territory of Object.values(layout.territories)) {
      expect(territory.left).toBeGreaterThanOrEqual(bounds.left);
      expect(territory.top).toBeGreaterThanOrEqual(bounds.top);
      expect(territory.left + territory.width).toBeLessThanOrEqual(bounds.width);
      expect(territory.top + territory.height).toBeLessThanOrEqual(bounds.height);
      expect(intersects(territory, layout.core)).toBe(false);
    }
  });

  it('switches to compact labels for accessibility font scaling', () => {
    expect(resolveEmergencyLensLayout({ containerWidth: 375, containerHeight: 390, fontScale: 1.8 }).showDescriptions).toBe(false);
  });
});