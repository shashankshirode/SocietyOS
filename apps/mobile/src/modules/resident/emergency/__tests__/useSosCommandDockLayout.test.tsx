import { useSosCommandDockLayout } from '../hooks/useSosCommandDockLayout';

let mockWidth = 375;
let mockHeight = 812;

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: () => ({
    width: mockWidth,
    height: mockHeight,
    scale: 1,
    fontScale: 1,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 20, left: 0, right: 10 }),
}));

describe('useSosCommandDockLayout', () => {
  it('resolves anchoredDock mode on standard phone screen sizes', () => {
    mockWidth = 375;
    mockHeight = 812;
    const layout = useSosCommandDockLayout();
    expect(layout.mode).toBe('anchoredDock');
    expect(layout.rightOffset).toBe(26);
  });

  it('resolves compactTray mode on short height screen configurations', () => {
    mockWidth = 360;
    mockHeight = 600;
    const layout = useSosCommandDockLayout();
    expect(layout.mode).toBe('compactTray');
  });

  it('resolves tabletDock mode on wide width screen dimensions', () => {
    mockWidth = 768;
    mockHeight = 1024;
    const layout = useSosCommandDockLayout();
    expect(layout.mode).toBe('tabletDock');
  });
});
