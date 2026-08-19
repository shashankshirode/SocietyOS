import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(projectRoot, 'src');
const roots = [path.join(projectRoot, 'App.tsx'), path.join(projectRoot, 'index.ts')];
const extensions = ['.ts', '.tsx', '.ios.ts', '.ios.tsx', '.android.ts', '.android.tsx'];
const files = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '__tests__') walk(entryPath);
    } else if (
      (entryPath.endsWith('.ts') || entryPath.endsWith('.tsx'))
      && !entryPath.endsWith('.d.ts')
      && !entryPath.endsWith('.test.ts')
      && !entryPath.endsWith('.test.tsx')
      && !entryPath.endsWith('.generated.ts')
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

walk(sourceRoot);
const knownFiles = new Set([...files, ...roots]);
const graph = new Map([...knownFiles].map((filePath) => [filePath, new Set()]));

for (const filePath of knownFiles) {
  if (!fs.existsSync(filePath)) continue;
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
      if (dependency && knownFiles.has(dependency)) graph.get(filePath).add(dependency);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
}

const reachable = new Set();
const pending = roots.filter((root) => fs.existsSync(root));
while (pending.length > 0) {
  const filePath = pending.pop();
  if (!filePath || reachable.has(filePath)) continue;
  reachable.add(filePath);
  for (const dependency of graph.get(filePath) ?? []) pending.push(dependency);
}

const unreachable = files
  .filter((filePath) => !reachable.has(filePath))
  .map((filePath) => path.relative(projectRoot, filePath))
  .sort();
const unreachableUi = unreachable.filter((filePath) => filePath.endsWith('.tsx') && !filePath.includes('.styles.'));
console.info(`Reachable production files: ${reachable.size - roots.length}`);
console.info(`Unreachable source files: ${unreachable.length}`);
console.info(`Unreachable UI files: ${unreachableUi.length}`);
for (const filePath of unreachableUi) console.info(filePath);
