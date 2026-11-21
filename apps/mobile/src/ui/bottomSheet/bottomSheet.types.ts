export type BottomSheetVisibilityState = 'closed' | 'opening' | 'open' | 'closing';

export interface BottomSheetConfig {
  dismissDragDistance: number;
  dismissVelocityY: number;
  maxUpwardDrag: number;
}

export const BOTTOM_SHEET_DEFAULT_CONFIG: BottomSheetConfig = {
  dismissDragDistance: 120,
  dismissVelocityY: 900,
  maxUpwardDrag: 0,
};
