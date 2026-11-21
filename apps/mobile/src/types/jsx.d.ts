import type { ScreenProps } from '../design-system/layouts/Screen';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      Screen: ScreenProps;
    }
  }
}
