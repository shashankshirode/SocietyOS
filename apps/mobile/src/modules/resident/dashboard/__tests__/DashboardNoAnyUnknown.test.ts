import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(__dirname, '../../../../..');
const productionRoots = [
  'src/modules/resident/dashboard',
  'src/ui/media',
];
const productionFiles = [
  'src/ui/patterns/ResidentHomeHeader.tsx',
  'src/ui/patterns/ResidentTodayPriorityPanel.tsx',
  'src/ui/patterns/ResidencePulsePanel.tsx',
  'src/ui/patterns/ResidentCommandDock.tsx',
  'src/ui/patterns/VisitorAccessTimeline.tsx',
  'src/ui/patterns/MaintenancePaymentWallet.tsx',
  'src/ui/patterns/ComplaintProgressPanel.tsx',
  'src/ui/patterns/ResidentConnectPanel.tsx',
  'src/ui/patterns/NoticeHighlightCarousel.tsx',
  'src/ui/patterns/DocumentVaultPanel.tsx',
  'src/ui/patterns/AmenityBookingCarousel.tsx',
  'src/ui/patterns/CommunityServicesGrid.tsx',
  'src/ui/patterns/ResidentCompactActivityTimeline.tsx',
  'src/shared/theme/residentColors.ts',
  'src/modules/resident/emergency/hooks/useSosCommandDockLayout.ts',
];

function sourceFiles(root: string): string[] {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(root, entry.name);
    if (entry.isDirectory()) {
      return entry.name === '__tests__' ? [] : sourceFiles(absolute);
    }
    return /\.tsx?$/.test(entry.name) ? [absolute] : [];
  });
}

describe('Dashboard strict type boundary', () => {
  it('contains no any, JsonValue, or TypeScript suppression in rebuilt production surfaces', () => {
    const files = [
      ...productionRoots.flatMap((root) => sourceFiles(path.join(projectRoot, root))),
      ...productionFiles.map((file) => path.join(projectRoot, file)),
    ];
    const forbidden = /(?:\bas\s+(?: JsonValue|unknown)\b|:\s*(?: JsonValue|unknown)\b|[<,]\s*(?: JsonValue|unknown)\s*[,>]|@ts-ignore)/;
    const offenders = files.filter((file) => forbidden.test(fs.readFileSync(file, 'utf8')));
    expect(offenders.map((file) => path.relative(projectRoot, file))).toEqual([]);
  });
});
