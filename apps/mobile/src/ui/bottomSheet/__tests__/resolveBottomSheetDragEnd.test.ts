import { resolveBottomSheetDragEnd } from '../resolveBottomSheetDragEnd';
import { BOTTOM_SHEET_DEFAULT_CONFIG } from '../bottomSheet.types';

describe('resolveBottomSheetDragEnd', () => {
  it('should resolve to dismiss if vertical drag exceeds threshold distance', () => {
    const decision = resolveBottomSheetDragEnd(150, 0, BOTTOM_SHEET_DEFAULT_CONFIG);
    expect(decision).toBe('dismiss');
  });

  it('should resolve to dismiss if downward velocity exceeds velocity threshold', () => {
    const decision = resolveBottomSheetDragEnd(50, 1000, BOTTOM_SHEET_DEFAULT_CONFIG);
    expect(decision).toBe('dismiss');
  });

  it('should resolve to snapBack if drag and velocity are below threshold', () => {
    const decision = resolveBottomSheetDragEnd(50, 200, BOTTOM_SHEET_DEFAULT_CONFIG);
    expect(decision).toBe('snapBack');
  });
});
