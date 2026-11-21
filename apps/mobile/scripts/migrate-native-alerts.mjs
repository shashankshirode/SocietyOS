import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(projectRoot, 'src');
const appAlertPath = path.join(sourceRoot, 'ui', 'modal', 'AppAlert');
const files = [];
const originals = new Map();

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(entryPath);
    } else if (
      entryPath.endsWith('.tsx')
      && !entryPath.includes(`${path.sep}__tests__${path.sep}`)
      && !entryPath.endsWith('.test.tsx')
    ) {
      files.push(entryPath);
    }
  }
}

function modulePath(fromDirectory, targetPath) {
  const relativePath = path.relative(fromDirectory, targetPath).replace(/\\/g, '/');
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

walk(sourceRoot);
let modifiedCount = 0;

for (const filePath of files) {
  const source = fs.readFileSync(filePath, 'utf8');
  if (!/\bAlert\.(?:alert|prompt)\b/.test(source)) continue;
  const reactNativeImport = /import\s*\{([\s\S]*?)\}\s*from\s*(['"])react-native\2;/;
  const match = source.match(reactNativeImport);
  if (!match || !match[1]) {
    throw new Error(`Could not find the React Native Alert import in ${path.relative(projectRoot, filePath)}`);
  }
  const bindings = match[1]
    .split(',')
    .map((binding) => binding.trim())
    .filter(Boolean)
    .filter((binding) => !/^Alert(?:\s+as\s+\w+)?$/.test(binding));
  const replacementImport = bindings.length > 0
    ? `import { ${bindings.join(', ')} } from ${match[2]}react-native${match[2]};`
    : '';
  let nextSource = source.replace(reactNativeImport, replacementImport);
  nextSource = nextSource.replace(/\bAlert\.(alert|prompt)\b/g, 'AppAlert.$1');
  if (!/import\s*\{\s*AppAlert\s*\}/.test(nextSource)) {
    const importStatement = `import { AppAlert } from "${modulePath(path.dirname(filePath), appAlertPath)}";`;
    const insertionIndex = replacementImport
      ? nextSource.indexOf(replacementImport) + replacementImport.length
      : 0;
    nextSource = `${nextSource.slice(0, insertionIndex)}\n${importStatement}${nextSource.slice(insertionIndex)}`;
  }
  originals.set(filePath, source);
  fs.writeFileSync(filePath, nextSource);
  modifiedCount += 1;
}

const typecheck = spawnSync('npm', ['run', 'typecheck'], {
  cwd: projectRoot,
  encoding: 'utf8',
  stdio: 'pipe',
});

if (typecheck.status !== 0) {
  for (const [filePath, source] of originals) fs.writeFileSync(filePath, source);
  process.stderr.write(typecheck.stdout);
  process.stderr.write(typecheck.stderr);
  throw new Error('Native alert migration failed typechecking and was rolled back.');
}

console.info(`Migrated ${modifiedCount} files from native alerts to the shared application modal host.`);
