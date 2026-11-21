import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const filename = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(filename), '..');
const sourceRoot = path.join(projectRoot, 'src');
const aliasPath = path.join(sourceRoot, 'shared', 'types', 'absence.types.ts');
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed, removeComments: true });
const originals = new Map();
let changedFileCount = 0;
let replacedTypeCount = 0;

function sourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(entryPath);
    return /\.tsx?$/.test(entry.name) ? [entryPath] : [];
  });
}

function aliasImportPath(sourcePath) {
  const relativePath = path.relative(path.dirname(sourcePath), aliasPath)
    .replace(/\\/g, '/')
    .replace(/\.ts$/, '');
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

for (const sourcePath of sourceFiles(sourceRoot)) {
  if (sourcePath === aliasPath) continue;
  const sourceText = fs.readFileSync(sourcePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    sourcePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    sourcePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  let fileReplacementCount = 0;
  const transformed = ts.transform(sourceFile, [
    (context) => {
      const visit = (node) => {
        if (node.kind === ts.SyntaxKind.UndefinedKeyword) {
          fileReplacementCount += 1;
          replacedTypeCount += 1;
          return context.factory.createTypeReferenceNode('Absent');
        }
        return ts.visitEachChild(node, visit, context);
      };
      return (rootNode) => ts.visitNode(rootNode, visit);
    },
  ]).transformed[0];
  if (fileReplacementCount === 0) continue;

  let statements = transformed.statements;
  const importPath = aliasImportPath(sourcePath);
  const aliasImport = ts.factory.createImportDeclaration(
    undefined,
    ts.factory.createImportClause(
      true,
      undefined,
      ts.factory.createNamedImports([
        ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier('Absent')),
      ]),
    ),
    ts.factory.createStringLiteral(importPath),
  );
  const lastImportIndex = statements.findLastIndex(ts.isImportDeclaration);
  statements = ts.factory.createNodeArray([
    ...statements.slice(0, lastImportIndex + 1),
    aliasImport,
    ...statements.slice(lastImportIndex + 1),
  ]);

  originals.set(sourcePath, sourceText);
  const updatedSourceFile = ts.factory.updateSourceFile(transformed, statements);
  fs.writeFileSync(sourcePath, `${printer.printFile(updatedSourceFile)}\n`);
  changedFileCount += 1;
}

const validation = spawnSync('npm', ['run', 'typecheck'], {
  cwd: projectRoot,
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
});
if (validation.status !== 0) {
  originals.forEach((source, sourcePath) => fs.writeFileSync(sourcePath, source));
  process.stderr.write(`${validation.stdout}${validation.stderr}`);
  throw new Error('Undefined-type replacement was rolled back because typecheck failed');
}

process.stdout.write(
  `Replaced ${replacedTypeCount} explicit undefined types across ${changedFileCount} files.\n`,
);
