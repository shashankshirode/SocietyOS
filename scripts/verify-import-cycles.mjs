import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(projectRoot, 'src');
const extensions = ['.ts', '.tsx', '.ios.ts', '.ios.tsx', '.android.ts', '.android.tsx'];

function walk(directory, files) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(entryPath, files);
    } else if (
      (entryPath.endsWith('.ts') || entryPath.endsWith('.tsx'))
      && !entryPath.endsWith('.d.ts')
      && !entryPath.includes(`${path.sep}__tests__${path.sep}`)
      && !entryPath.endsWith('.test.ts')
      && !entryPath.endsWith('.test.tsx')
    ) {
      files.push(path.normalize(entryPath));
    }
  }
}

function resolveImport(importer, specifier) {
  if (!specifier.startsWith('.')) return null;
  const base = path.resolve(path.dirname(importer), specifier);
  const candidates = [
    ...extensions.map((extension) => `${base}${extension}`),
    ...extensions.map((extension) => path.join(base, `index${extension}`)),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

const files = [];
walk(sourceRoot, files);
const fileSet = new Set(files);
const graph = new Map(files.map((filePath) => [filePath, new Set()]));

for (const filePath of files) {
  const sourceFile = ts.createSourceFile(
    filePath,
    fs.readFileSync(filePath, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const visit = (node) => {
    let specifier = null;
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node))
      && node.moduleSpecifier
      && ts.isStringLiteral(node.moduleSpecifier)
    ) {
      specifier = node.moduleSpecifier.text;
    } else if (
      ts.isCallExpression(node)
      && node.expression.kind === ts.SyntaxKind.ImportKeyword
      && node.arguments[0]
      && ts.isStringLiteral(node.arguments[0])
    ) {
      specifier = node.arguments[0].text;
    }
    if (specifier) {
      const dependency = resolveImport(filePath, specifier);
      if (dependency && fileSet.has(dependency)) graph.get(filePath).add(dependency);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
}

const state = new Map();
const stack = [];
const stackIndexes = new Map();
const cyclesBySignature = new Map();

function canonicalCycle(cycle) {
  const relative = cycle.slice(0, -1).map((filePath) => path.relative(projectRoot, filePath));
  const rotations = relative.map((_item, index) => [
    ...relative.slice(index),
    ...relative.slice(0, index),
  ]);
  rotations.sort((left, right) => left.join('|').localeCompare(right.join('|')));
  return rotations[0];
}

function visit(filePath) {
  state.set(filePath, 1);
  stackIndexes.set(filePath, stack.length);
  stack.push(filePath);
  for (const dependency of graph.get(filePath)) {
    if (!state.has(dependency)) {
      visit(dependency);
    } else if (state.get(dependency) === 1) {
      const startIndex = stackIndexes.get(dependency);
      const canonical = canonicalCycle([...stack.slice(startIndex), dependency]);
      cyclesBySignature.set(canonical.join('|'), canonical);
    }
  }
  stack.pop();
  stackIndexes.delete(filePath);
  state.set(filePath, 2);
}

for (const filePath of files) {
  if (!state.has(filePath)) visit(filePath);
}

const cycles = [...cyclesBySignature.values()].sort((left, right) => left.join('|').localeCompare(right.join('|')));
if (cycles.length > 0) {
  for (const cycle of cycles) console.error(`${cycle.join(' -> ')} -> ${cycle[0]}`);
  console.error(`Found ${cycles.length} circular import chain${cycles.length === 1 ? '' : 's'}.`);
  process.exitCode = 1;
} else {
  const dependencyCount = [...graph.values()].reduce((count, dependencies) => count + dependencies.size, 0);
  console.info(`Verified ${files.length} source files and ${dependencyCount} relative imports (0 circular dependencies).`);
}
