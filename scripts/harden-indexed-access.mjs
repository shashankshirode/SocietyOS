import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const filename = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(filename), '..');
const helperPath = path.join(projectRoot, 'src', 'shared', 'utils', 'requiredItem.ts');
const compilerResult = spawnSync(
  'npx',
  ['tsc', '--noEmit', '--noUncheckedIndexedAccess', '--pretty', 'false'],
  { cwd: projectRoot, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
);
const compilerOutput = `${compilerResult.stdout}${compilerResult.stderr}`;
const affectedFiles = new Set();
for (const match of compilerOutput.matchAll(/^(src\/[^(:]+)\(\d+,\d+\): error TS/gm)) {
  affectedFiles.add(path.join(projectRoot, match[1]));
}

const configPath = ts.findConfigFile(projectRoot, ts.sys.fileExists, 'tsconfig.json');
if (!configPath) throw new Error('tsconfig.json was not found');
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
const parsedConfig = ts.parseJsonConfigFileContent(
  configFile.config,
  ts.sys,
  projectRoot,
  { noEmit: true, noUncheckedIndexedAccess: true },
  configPath,
);
const program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
const checker = program.getTypeChecker();
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed, removeComments: true });
const originals = new Map();
let changedFileCount = 0;
let hardenedAccessCount = 0;

function isDirectAssignmentTarget(node) {
  const parent = node.parent;
  if (ts.isBinaryExpression(parent) && parent.left === node) {
    return parent.operatorToken.kind >= ts.SyntaxKind.FirstAssignment
      && parent.operatorToken.kind <= ts.SyntaxKind.LastAssignment;
  }
  return (ts.isPrefixUnaryExpression(parent) || ts.isPostfixUnaryExpression(parent))
    && parent.operand === node;
}

function helperImportPath(sourcePath) {
  const relativePath = path.relative(path.dirname(sourcePath), helperPath)
    .replace(/\\/g, '/')
    .replace(/\.ts$/, '');
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

for (const sourcePath of affectedFiles) {
  const sourceFile = program.getSourceFile(sourcePath);
  if (!sourceFile || sourcePath === helperPath) continue;
  let fileAccessCount = 0;
  const transformed = ts.transform(sourceFile, [
    (context) => {
      const visit = (node) => {
        if (
          ts.isElementAccessExpression(node)
          && !node.questionDotToken
          && !isDirectAssignmentTarget(node)
          && !(
            ts.isCallExpression(node.parent)
            && ts.isIdentifier(node.parent.expression)
            && node.parent.expression.text === 'getRequiredItem'
          )
        ) {
          const collectionType = checker.getTypeAtLocation(node.expression);
          if (checker.isArrayType(collectionType) || checker.isTupleType(collectionType)) {
            fileAccessCount += 1;
            hardenedAccessCount += 1;
            return context.factory.createCallExpression(
              context.factory.createIdentifier('getRequiredItem'),
              undefined,
              [
                ts.visitNode(node.expression, visit),
                ts.visitNode(node.argumentExpression, visit),
                context.factory.createStringLiteral(path.basename(sourcePath)),
              ],
            );
          }
        }
        return ts.visitEachChild(node, visit, context);
      };
      return (rootNode) => ts.visitNode(rootNode, visit);
    },
  ]).transformed[0];

  if (fileAccessCount === 0) continue;
  let statements = transformed.statements;
  const alreadyImported = statements.some((statement) =>
    ts.isImportDeclaration(statement)
      && ts.isStringLiteral(statement.moduleSpecifier)
      && statement.moduleSpecifier.text === helperImportPath(sourcePath));
  if (!alreadyImported) {
    const helperImport = ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        false,
        undefined,
        ts.factory.createNamedImports([
          ts.factory.createImportSpecifier(
            false,
            undefined,
            ts.factory.createIdentifier('getRequiredItem'),
          ),
        ]),
      ),
      ts.factory.createStringLiteral(helperImportPath(sourcePath)),
    );
    const lastImportIndex = statements.findLastIndex(ts.isImportDeclaration);
    statements = ts.factory.createNodeArray([
      ...statements.slice(0, lastImportIndex + 1),
      helperImport,
      ...statements.slice(lastImportIndex + 1),
    ]);
  }
  const updatedSourceFile = ts.factory.updateSourceFile(transformed, statements);
  const originalSource = fs.readFileSync(sourcePath, 'utf8');
  originals.set(sourcePath, originalSource);
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
  throw new Error('Indexed-access hardening was rolled back because typecheck failed');
}

process.stdout.write(
  `Hardened ${hardenedAccessCount} array or tuple reads across ${changedFileCount} files.\n`,
);
