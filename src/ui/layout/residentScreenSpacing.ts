export type BottomSpacingInput = {
  safeAreaBottom: number;
  hasBottomTabs: boolean;
  hasStickyFooter: boolean;
  stickyFooterHeight?: number;
  hasFloatingAction?: boolean;
};

const CONTENT_GAP = 16;
const DEFAULT_STICKY_FOOTER_HEIGHT = 64;

export function getResidentScreenBottomPadding(input: BottomSpacingInput): number {
  const safeArea = Math.max(0, input.safeAreaBottom);
  if (input.hasStickyFooter) {
    return Math.max(input.stickyFooterHeight ?? DEFAULT_STICKY_FOOTER_HEIGHT, 0) + safeArea + CONTENT_GAP;
  }
  if (input.hasBottomTabs) {
    const tabObstruction = 64 + 8 + safeArea;
    const actionOffset = input.hasFloatingAction ? 56 + CONTENT_GAP : 0;
    return tabObstruction + actionOffset + CONTENT_GAP;
  }
  return safeArea + CONTENT_GAP;
}
