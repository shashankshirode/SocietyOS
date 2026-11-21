import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const filename = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(filename), '..');
const helperPath = path.join(projectRoot, 'src', 'shared', 'utils', 'presentProperty.ts');
const compilerResult = spawnSync(
  'npx',
  ['tsc', '--noEmit', '--exactOptionalPropertyTypes', '--pretty', 'false'],
  { cwd: projectRoot, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
);
const compilerOutput = `${compilerResult.stdout}${compilerResult.stderr}`;
const affectedFiles = new Set();
const diagnosticPropertiesByFile = new Map();
let currentDiagnosticFile;
for (const line of compilerOutput.split('\n')) {
  const diagnosticMatch = line.match(/^(src\/[^(:]+)\(\d+,\d+\): error TS/);
  if (diagnosticMatch) {
    currentDiagnosticFile = path.join(projectRoot, diagnosticMatch[1]);
    affectedFiles.add(currentDiagnosticFile);
    if (!diagnosticPropertiesByFile.has(currentDiagnosticFile)) {
      diagnosticPropertiesByFile.set(currentDiagnosticFile, new Set());
    }
    continue;
  }
  const propertyMatch = line.match(/Types of property '([^']+)'/);
  if (currentDiagnosticFile && propertyMatch) {
    diagnosticPropertiesByFile.get(currentDiagnosticFile)?.add(propertyMatch[1]);
  }
}

const configPath = ts.findConfigFile(projectRoot, ts.sys.fileExists, 'tsconfig.json');
if (!configPath) throw new Error('tsconfig.json was not found');
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
const parsedConfig = ts.parseJsonConfigFileContent(
  configFile.config,
  ts.sys,
  projectRoot,
  { noEmit: true, exactOptionalPropertyTypes: true },
  configPath,
);
const program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
const checker = program.getTypeChecker();
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed, removeComments: true });
const originals = new Map();
let changedFileCount = 0;
let hardenedPropertyCount = 0;

function includesUndefined(type) {
  return type.isUnion()
    ? type.types.some((part) => (part.flags & ts.TypeFlags.Undefined) !== 0)
    : (type.flags & ts.TypeFlags.Undefined) !== 0;
}

function propertyNameText(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }
  return undefined;
}

function optionalContextProperty(contextualType, name) {
  if (!contextualType) return undefined;
  const candidates = contextualType.isUnionOrIntersection()
    ? contextualType.types
    : [contextualType];
  return candidates
    .map((candidate) => candidate.getProperty(name))
    .find((property) => property && (property.flags & ts.SymbolFlags.Optional) !== 0);
}

function helperImportPath(sourcePath) {
  const relativePath = path.relative(path.dirname(sourcePath), helperPath)
    .replace(/\\/g, '/')
    .replace(/\.ts$/, '');
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

function presentPropertySpread(factory, name, expression) {
  return factory.createCallExpression(
    factory.createIdentifier('includeWhenPresent'),
    undefined,
    [factory.createStringLiteral(name), expression],
  );
}

function exactOptionalAssignmentPositions(sourceFile) {
  const positions = new Set();
  const diagnostics = program.getSemanticDiagnostics(sourceFile)
    .filter((diagnostic) => diagnostic.code === 2412 && diagnostic.start !== undefined);
  for (const diagnostic of diagnostics) {
    const visit = (node) => {
      if (
        ts.isExpressionStatement(node)
        && node.getStart(sourceFile) <= diagnostic.start
        && node.getEnd() >= diagnostic.start
      ) {
        positions.add(node.getStart(sourceFile));
        return;
      }
      if (node.getStart(sourceFile) <= diagnostic.start && node.getEnd() >= diagnostic.start) {
        ts.forEachChild(node, visit);
      }
    };
    visit(sourceFile);
  }
  return positions;
}

for (const sourcePath of affectedFiles) {
  const sourceFile = program.getSourceFile(sourcePath);
  if (!sourceFile || sourcePath === helperPath) continue;
  const diagnosticProperties = diagnosticPropertiesByFile.get(sourcePath) ?? new Set();
  const assignmentPositions = exactOptionalAssignmentPositions(sourceFile);
  let filePropertyCount = 0;
  const transformed = ts.transform(sourceFile, [
    (context) => {
      const visit = (node) => {
        if (ts.isObjectLiteralExpression(node)) {
          const contextualType = checker.getContextualType(node);
          const properties = node.properties.map((property) => {
            let name;
            let expression;
            if (ts.isPropertyAssignment(property)) {
              name = propertyNameText(property.name);
              expression = property.initializer;
            } else if (ts.isShorthandPropertyAssignment(property)) {
              name = property.name.text;
              expression = property.name;
            }
            if (
              name
              && expression
              && (
                optionalContextProperty(contextualType, name)
                || diagnosticProperties.has(name)
              )
              && includesUndefined(checker.getTypeAtLocation(expression))
            ) {
              filePropertyCount += 1;
              hardenedPropertyCount += 1;
              return context.factory.createSpreadAssignment(
                presentPropertySpread(
                  context.factory,
                  name,
                  ts.visitNode(expression, visit),
                ),
              );
            }
            return ts.visitEachChild(property, visit, context);
          });
          return context.factory.updateObjectLiteralExpression(node, properties);
        }
        if (ts.isJsxAttributes(node)) {
          const contextualType = checker.getContextualType(node);
          const properties = node.properties.map((property) => {
            if (
              ts.isJsxAttribute(property)
              && ts.isIdentifier(property.name)
              && property.initializer
              && ts.isJsxExpression(property.initializer)
              && property.initializer.expression
              && optionalContextProperty(contextualType, property.name.text)
              && includesUndefined(checker.getTypeAtLocation(property.initializer.expression))
            ) {
              filePropertyCount += 1;
              hardenedPropertyCount += 1;
              return context.factory.createJsxSpreadAttribute(
                presentPropertySpread(
                  context.factory,
                  property.name.text,
                  ts.visitNode(property.initializer.expression, visit),
                ),
              );
            }
            return ts.visitEachChild(property, visit, context);
          });
          return context.factory.updateJsxAttributes(node, properties);
        }
        if (
          ts.isExpressionStatement(node)
          && assignmentPositions.has(node.getStart(sourceFile))
          && ts.isBinaryExpression(node.expression)
          && node.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken
        ) {
          filePropertyCount += 1;
          hardenedPropertyCount += 1;
          const right = ts.visitNode(node.expression.right, visit);
          const left = ts.visitNode(node.expression.left, visit);
          return context.factory.createIfStatement(
            context.factory.createBinaryExpression(
              right,
              context.factory.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
              context.factory.createIdentifier('undefined'),
            ),
            context.factory.createBlock([
              context.factory.createExpressionStatement(
                context.factory.createAssignment(left, right),
              ),
            ], true),
          );
        }
        return ts.visitEachChild(node, visit, context);
      };
      return (rootNode) => ts.visitNode(rootNode, visit);
    },
  ]).transformed[0];

  if (filePropertyCount === 0) continue;
  let statements = transformed.statements;
  const importPath = helperImportPath(sourcePath);
  const alreadyImported = statements.some((statement) =>
    ts.isImportDeclaration(statement)
      && ts.isStringLiteral(statement.moduleSpecifier)
      && statement.moduleSpecifier.text === importPath);
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
            ts.factory.createIdentifier('includeWhenPresent'),
          ),
        ]),
      ),
      ts.factory.createStringLiteral(importPath),
    );
    const lastImportIndex = statements.findLastIndex(ts.isImportDeclaration);
    statements = ts.factory.createNodeArray([
      ...statements.slice(0, lastImportIndex + 1),
      helperImport,
      ...statements.slice(lastImportIndex + 1),
    ]);
  }
  const updatedSourceFile = ts.factory.updateSourceFile(transformed, statements);
  originals.set(sourcePath, fs.readFileSync(sourcePath, 'utf8'));
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
  throw new Error('Exact-optional hardening was rolled back because typecheck failed');
}

process.stdout.write(
  `Hardened ${hardenedPropertyCount} optional properties across ${changedFileCount} files.\n`,
);
