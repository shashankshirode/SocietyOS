import type { BottomSheetConfig } from './bottomSheet.types';


export function resolveBottomSheetDragEnd(
  dy: number,
  vy: number,
  config: BottomSheetConfig
): 'dismiss' | 'snapBack' {
  if (dy >= config.dismissDragDistance) {
    return 'dismiss';
  }
  if (vy >= config.dismissVelocityY) {
    return 'dismiss';
  }
  return 'snapBack';
}
