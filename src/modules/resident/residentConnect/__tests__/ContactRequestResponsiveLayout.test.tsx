import { resolveResidentTabBarObstruction } from '../../navigation/useResidentTabBarLayout';
import { resolveResponsiveLayout } from '../../../../ui/layout/useResponsiveLayout';
import { Layout } from '../../../../shared/theme/layout';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('contact request responsive layout', () => {
  it('uses 16 point small-phone padding and a bounded tablet content width', () => {
    expect(resolveResponsiveLayout(320, 640).screenPadding).toBe(16);
    expect(resolveResponsiveLayout(1024, 768).isTablet).toBe(true);
    expect(Layout.maxTabletContentWidth).toBe(680);
    expect(resolveResidentTabBarObstruction(1024, 24, 'ios')).toBe(96);
  });

  it('does not use negative margins or absolute form text positioning', () => {
    const formFiles = [
      'src/ui/forms/FormField.tsx',
      'src/ui/forms/AppTextInput.tsx',
      'src/ui/forms/AppTextArea.tsx',
      'src/modules/resident/residentConnect/screens/NewResidentContactRequestScreen.tsx',
    ];
    const source = formFiles.map((file) => readFileSync(join(process.cwd(), file), 'utf8')).join('\n');

    expect(source).not.toMatch(/margin(?:Top|Bottom|Left|Right)?\s*:\s*-/);
    expect(source).not.toMatch(/position\s*:\s*['"]absolute['"]/);
  });
});
