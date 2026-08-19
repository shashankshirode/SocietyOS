import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '../../../..');
const SCAN_ROOTS = ['src/modules/resident', 'src/shared', 'src/ui', 'src/core'];
const NATIVE_MODAL_ALLOWLIST = new Set([
  'src/ui/modal/AppModal.tsx',
  'src/ui/bottomSheet/AppBottomSheet.tsx',
]);

function collectSourceFiles(relativeDirectory: string): string[] {
  const directory = path.join(ROOT, relativeDirectory);
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      return entry.name === '__tests__' ? [] : collectSourceFiles(relativePath);
    }
    return /\.(ts|tsx)$/.test(entry.name) ? [relativePath] : [];
  });
}

describe('resident modal architecture', () => {
  const sourceFiles = SCAN_ROOTS.flatMap(collectSourceFiles);

  it('does not use the native Alert API', () => {
    const violations = sourceFiles.filter((file) => {
      const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
      return /(^|[^A-Za-z])Alert\.(alert|prompt)/m.test(source);
    });
    expect(violations).toEqual([]);
  });

  it('keeps native Modal imports inside the two shared renderers', () => {
    const violations = sourceFiles.filter((file) => {
      if (NATIVE_MODAL_ALLOWLIST.has(file)) return false;
      const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
      return /import\s*\{[^}]*\bModal\b[^}]*\}\s*from\s*['"]react-native['"]/s.test(source);
    });
    expect(violations).toEqual([]);
  });

  it('keeps the central modal implementation free of forbidden escape-hatch types', () => {
    const modalFiles = collectSourceFiles('src/ui/modal').filter((file) => !file.includes('__tests__'));
    const violations = modalFiles.filter((file) => {
      const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
      return /\b(any|unknown)\b/.test(source);
    });
    expect(violations).toEqual([]);
  });

  it('migrates named resident surfaces to shared modal primitives', () => {
    const expectedUsage: Readonly<Record<string, RegExp>> = {
      'src/modules/resident/dashboard/components/insights/DailyInsightsBottomSheet.tsx': /AppBottomSheet/,
      'src/modules/resident/contextualInsights/components/ContextualInsightSheet.tsx': /AppBottomSheet/,
      'src/modules/resident/emergency/components/EmergencyQuickActionMenu.tsx': /AppBottomSheet/,
      'src/modules/resident/household/components/FamilyDateOfBirthField.tsx': /AppDateField/,
      'src/ui/forms/AppDateField.tsx': /AppBottomSheet/,
      'src/modules/resident/profile/screens/ResidentProfileScreen.tsx': /ConfirmModal/,
      'src/modules/resident/billing/screens/MockPaymentConfirmationScreen.tsx': /StatusModal/,
    };

    const violations = Object.entries(expectedUsage).filter(([file, pattern]) => {
      const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
      return !pattern.test(source);
    });
    expect(violations).toEqual([]);
  });
});
