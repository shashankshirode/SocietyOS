/**
 * Temporal Source Audit Script
 * 
 * Detects unauthorized direct date formatting in production code.
 * Run as part of CI to enforce temporal architecture.
 * 
 * Usage: npx ts-node scripts/verify-temporal-source.ts
 */

import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

// Patterns that are NOT allowed in production code (outside temporal module)
const FORBIDDEN_PATTERNS = [
  // Direct Intl.DateTimeFormat usage
  { pattern: /new Intl\.DateTimeFormat\(/, message: 'Direct Intl.DateTimeFormat usage - use temporal service' },
  { pattern: /\.toLocaleDateString\(/, message: 'Direct .toLocaleDateString() - use temporal service' },
  { pattern: /\.toLocaleTimeString\(/, message: 'Direct .toLocaleTimeString() - use temporal service' },
  { pattern: /\.toLocaleString\(/, message: 'Direct .toLocaleString() - use temporal service' },
  
  // Hardcoded timezones
  { pattern: /['"]Asia\/Kolkata['"]/, message: 'Hardcoded Asia/Kolkata - use society context timezone' },
  { pattern: /['"]en-IN['"]/, message: 'Hardcoded en-IN locale - use context locale' },
  { pattern: /['"]en-US['"]/, message: 'Hardcoded en-US locale - use context locale' },
  { pattern: /['"]IST['"]/, message: 'Hardcoded IST - use IANA timezone' },
  
  // Ambiguous date constructions
  { pattern: /new Date\(\)\.toISOString\(\).slice\(0, 10\)/, message: 'Date slicing for date-only - use formatDateOnly' },
  { pattern: /T00:00:00\.000Z/, message: 'Midnight UTC construction - use formatDateOnly' },
  { pattern: /T23:59:59\.999Z/, message: 'End-of-day UTC construction - use formatDateOnly' },
  
  // Direct date formatting in formatters.ts (legacy)
  { pattern: /from ['"]..\/..\/shared\/utils\/formatters['"]/, message: 'Legacy formatters import - use temporal service' },
];

// Allowed files (temporal module, tests, fixtures)
const ALLOWED_PATHS = [
  'src/core/temporal/',
  'src/core/localization/dateTimeFormatters.ts', // Legacy - will be migrated
  'src/core/localization/localization.config.ts',
  'src/core/localization/timezoneResolver.ts',
  '__tests__/',
  '__mocks__/',
  '.mock.',
  '.fixtures.',
  '.stories.',
  '.screenScenarios.',
  'mockData',
  'mockSource',
];

// Files that are explicitly allowed to use forbidden patterns (with comments)
const EXPLICIT_ALLOWLIST = new Set<string>([
  // Temporal service implementation files
  'src/core/temporal/temporal.service.ts',
  'src/core/temporal/useTemporalContext.ts',
  'src/core/temporal/temporal.types.ts',
  
  // Legacy formatters (to be migrated)
  'src/core/localization/dateTimeFormatters.ts',
  'src/core/localization/localization.config.ts',
  'src/core/localization/timezoneResolver.ts',
  'src/core/localization/greetingResolver.ts',
  'src/core/localization/countryDefaults.ts',
  
  // Shared formatters (legacy - to be migrated)
  'src/shared/formatters/dateFormatter.ts',
  'src/shared/formatters/dateRangeFormatter.ts',
  'src/shared/utils/formatters.ts',
  'src/shared/data/safeData.ts',
  'src/shared/dataDisplay/dataDisplay.utils.ts',
  
  // Mock data generators
  'src/shared/mock/visitors.mock.ts',
  
  // Notification engine (uses UTC for internal comparison)
  'src/core/notifications/notificationEngine.ts',
]);

interface Violation {
  file: string;
  line: number;
  pattern: string;
  message: string;
  code: string;
}

function shouldSkipFile(filePath: string): boolean {
  const relativePath = path.relative(PROJECT_ROOT, filePath);
  
  // Check explicit allowlist
  if (EXPLICIT_ALLOWLIST.has(relativePath)) {
    return true;
  }
  
  // Check allowed path prefixes
  for (const allowed of ALLOWED_PATHS) {
    if (relativePath.startsWith(allowed) || relativePath.includes(allowed)) {
      return true;
    }
  }
  
  return false;
}

function scanFile(filePath: string): Violation[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const violations: Violation[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === undefined) continue;
    const trimmed = line.trim();
    
    // Skip comments
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      continue;
    }
    
    for (const { pattern, message } of FORBIDDEN_PATTERNS) {
      if (pattern.test(line)) {
        violations.push({
          file: path.relative(PROJECT_ROOT, filePath),
          line: i + 1,
          pattern: pattern.toString(),
          message,
          code: line.trim(),
        });
      }
    }
  }
  
  return violations;
}

function scanDirectory(dir: string): Violation[] {
  const violations: Violation[] = [];
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules, .git, coverage, etc.
      if (['node_modules', '.git', 'coverage', 'dist', 'build', '.expo', 'android', 'ios'].includes(entry.name)) {
        continue;
      }
      violations.push(...scanDirectory(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      if (!shouldSkipFile(fullPath)) {
        violations.push(...scanFile(fullPath));
      }
    }
  }
  
  return violations;
}

function main() {
  console.log('🔍 Scanning for temporal architecture violations...\n');
  
  const violations = scanDirectory(SRC_DIR);
  
  if (violations.length === 0) {
    console.log('✅ No temporal architecture violations found!');
    process.exit(0);
  }
  
  console.log(`❌ Found ${violations.length} temporal architecture violation(s):\n`);
  
  // Group by file
  const byFile = new Map<string, Violation[]>();
  for (const v of violations) {
    if (!byFile.has(v.file)) byFile.set(v.file, []);
    byFile.get(v.file)!.push(v);
  }
  
  for (const [file, fileViolations] of byFile) {
    console.log(`📄 ${file} (${fileViolations.length} violations)`);
    for (const v of fileViolations) {
      console.log(`  Line ${v.line}: ${v.message}`);
      console.log(`    ${v.code}`);
    }
    console.log();
  }
  
  console.log('\n📋 Summary:');
  console.log(`  Files with violations: ${byFile.size}`);
  console.log(`  Total violations: ${violations.length}`);
  
  // Exit with error code for CI
  process.exit(1);
}

main();
