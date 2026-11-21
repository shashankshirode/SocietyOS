import fs from 'node:fs';
import path from 'node:path';

function collectFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectFiles(absolutePath);
    return entry.isFile() && /\.(ts|tsx)$/.test(entry.name) ? [absolutePath] : [];
  });
}

describe('resident screen data-source boundaries', () => {
  it('does not import mock data, fixtures, or mock sources from screens and components', () => {
    const residentRoot = path.resolve(__dirname, '../..');
    const files = collectFiles(residentRoot).filter(
      (file) => file.includes(`${path.sep}screens${path.sep}`) || file.includes(`${path.sep}components${path.sep}`)
    );
    const violations = files.flatMap((file) => {
      const source = fs.readFileSync(file, 'utf8');
      return /from ['"][^'"]*(mockData|mockSource|fixtures|screenScenarios)[^'"]*['"]/.test(source)
        ? [path.relative(residentRoot, file)]
        : [];
    });

    expect(violations).toEqual([]);
  });
});
