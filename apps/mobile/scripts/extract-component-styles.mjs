import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const filename = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(filename), '..');
const sourceRoot = path.join(projectRoot, 'src');
const configPath = ts.findConfigFile(projectRoot, ts.sys.fileExists, 'tsconfig.json');
if (!configPath) throw new Error('tsconfig.json was not found');
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
const parsedConfig = ts.parseJsonConfigFileContent(
  configFile.config,
  ts.sys,
  projectRoot,
  { noEmit: true },
  configPath,
);
const program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
const checker = program.getTypeChecker();
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed, removeComments: true });
const originals = new Map();
const createdStylePaths = [];
const skippedFiles = [];
let extractedFileCount = 0;

function isStyleSheetCreate(node) {
  return Boolean(
    node
      && ts.isCallExpression(node)
      && ts.isPropertyAccessExpression(node.expression)
      && ts.isIdentifier(node.expression.expression)
      && node.expression.expression.text === 'StyleSheet'
      && node.expression.name.text === 'create',
  );
}

function importLocalName(declaration) {
  if (ts.isImportSpecifier(declaration)) return declaration.name.text;
  if (ts.isImportClause(declaration) && declaration.name) return declaration.name.text;
  if (ts.isNamespaceImport(declaration)) return declaration.name.text;
  return undefined;
}

function importedIdentifierName(identifier) {
  const symbol = checker.getSymbolAtLocation(identifier);
  if (!symbol) return undefined;
  for (const declaration of symbol.declarations ?? []) {
    const localName = importLocalName(declaration);
    if (localName) return localName;
  }
  return undefined;
}

function featureRootFor(sourcePath) {
  const relativeParts = path.relative(sourceRoot, sourcePath).split(path.sep);
  if (relativeParts[0] === 'modules' && relativeParts[1] === 'resident') {
    return path.join(sourceRoot, ...relativeParts.slice(0, 3));
  }
  if (relativeParts[0] === 'modules' || relativeParts[0] === 'features') {
    return path.join(sourceRoot, ...relativeParts.slice(0, 2));
  }
  if (relativeParts[0] === 'shared' || relativeParts[0] === 'ui' || relativeParts[0] === 'app') {
    const rootDepth = relativeParts[1]?.endsWith('.tsx') ? 1 : 2;
    return path.join(sourceRoot, ...relativeParts.slice(0, rootDepth));
  }
  return path.dirname(sourcePath);
}

function stylePathFor(sourcePath) {
  const featureRoot = featureRootFor(sourcePath);
  const relativeDirectory = path.relative(featureRoot, path.dirname(sourcePath));
  const basename = path.basename(sourcePath, '.tsx');
  return path.join(featureRoot, 'styles', relativeDirectory, `${basename}.styles.ts`);
}

function modulePath(fromDirectory, targetPath) {
  const relativePath = path.relative(fromDirectory, targetPath)
    .replace(/\\/g, '/')
    .replace(/\.tsx?$/, '');
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

function adjustedModuleSpecifier(sourcePath, stylePath, specifier) {
  if (!specifier.startsWith('.')) return specifier;
  const resolvedTarget = path.resolve(path.dirname(sourcePath), specifier);
  return modulePath(path.dirname(stylePath), resolvedTarget);
}

function filteredImport(factory, declaration, usedNames, moduleSpecifier) {
  const clause = declaration.importClause;
  if (!clause) return undefined;
  const defaultName = clause.name && usedNames.has(clause.name.text)
    ? clause.name
    : undefined;
  let bindings;
  if (clause.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
    bindings = usedNames.has(clause.namedBindings.name.text)
      ? clause.namedBindings
      : undefined;
  } else if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
    const elements = clause.namedBindings.elements.filter((element) => usedNames.has(element.name.text));
    bindings = elements.length > 0 ? factory.updateNamedImports(clause.namedBindings, elements) : undefined;
  }
  if (!defaultName && !bindings) return undefined;
  const importClause = factory.updateImportClause(
    clause,
    clause.isTypeOnly,
    defaultName,
    bindings,
  );
  return factory.updateImportDeclaration(
    declaration,
    declaration.modifiers,
    importClause,
    factory.createStringLiteral(moduleSpecifier),
    declaration.attributes,
  );
}

for (const configuredPath of parsedConfig.fileNames) {
  const sourcePath = path.resolve(configuredPath);
  if (!sourcePath.startsWith(sourceRoot) || !sourcePath.endsWith('.tsx') || sourcePath.includes('.styles.')) {
    continue;
  }
  const sourceFile = program.getSourceFile(configuredPath) ?? program.getSourceFile(sourcePath);
  if (!sourceFile) continue;

  const styleCandidates = [];
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement) || statement.declarationList.declarations.length !== 1) continue;
    const declaration = statement.declarationList.declarations[0];
    if (ts.isIdentifier(declaration.name) && isStyleSheetCreate(declaration.initializer)) {
      styleCandidates.push({ statement, declaration });
    }
  }
  if (styleCandidates.length === 0) continue;
  if (styleCandidates.length !== 1) {
    skippedFiles.push(`${path.relative(projectRoot, sourcePath)}: multiple style declarations`);
    continue;
  }

  const { statement: styleStatement, declaration: styleDeclaration } = styleCandidates[0];
  const styleInitializer = styleDeclaration.initializer;
  const styleImportNames = new Set();
  const localDependencies = new Set();
  const collectStyleDependencies = (node) => {
    if (ts.isIdentifier(node)) {
      const importedName = importedIdentifierName(node);
      if (importedName) {
        styleImportNames.add(importedName);
      } else {
        const symbol = checker.getSymbolAtLocation(node);
        for (const declaration of symbol?.declarations ?? []) {
          if (
            declaration.getSourceFile() === sourceFile
            && !(declaration.pos >= styleInitializer.pos && declaration.end <= styleInitializer.end)
            && !ts.isImportDeclaration(declaration)
          ) {
            localDependencies.add(node.text);
          }
        }
      }
    }
    ts.forEachChild(node, collectStyleDependencies);
  };
  collectStyleDependencies(styleInitializer);
  if (localDependencies.size > 0) {
    skippedFiles.push(
      `${path.relative(projectRoot, sourcePath)}: local dependencies ${[...localDependencies].join(', ')}`,
    );
    continue;
  }

  const logicImportNames = new Set();
  const collectLogicDependencies = (node) => {
    if (node === styleStatement || ts.isImportDeclaration(node)) return;
    if (ts.isIdentifier(node)) {
      const importedName = importedIdentifierName(node);
      if (importedName) logicImportNames.add(importedName);
    }
    ts.forEachChild(node, collectLogicDependencies);
  };
  collectLogicDependencies(sourceFile);

  const stylePath = stylePathFor(sourcePath);
  if (fs.existsSync(stylePath)) {
    skippedFiles.push(`${path.relative(projectRoot, sourcePath)}: style destination already exists`);
    continue;
  }
  const styleImports = [];
  const logicStatements = [];
  for (const currentStatement of sourceFile.statements) {
    if (currentStatement === styleStatement) continue;
    if (!ts.isImportDeclaration(currentStatement)) {
      logicStatements.push(currentStatement);
      continue;
    }
    const specifier = ts.isStringLiteral(currentStatement.moduleSpecifier)
      ? currentStatement.moduleSpecifier.text
      : '';
    const styleImport = filteredImport(
      ts.factory,
      currentStatement,
      styleImportNames,
      adjustedModuleSpecifier(sourcePath, stylePath, specifier),
    );
    if (styleImport) styleImports.push(styleImport);
    if (!currentStatement.importClause) {
      logicStatements.push(currentStatement);
      continue;
    }
    const logicImport = filteredImport(
      ts.factory,
      currentStatement,
      logicImportNames,
      specifier,
    );
    if (logicImport) logicStatements.push(logicImport);
  }

  const styleName = styleDeclaration.name.text;
  const styleModuleImport = ts.factory.createImportDeclaration(
    undefined,
    ts.factory.createImportClause(
      false,
      undefined,
      ts.factory.createNamedImports([
        ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier(styleName)),
      ]),
    ),
    ts.factory.createStringLiteral(modulePath(path.dirname(sourcePath), stylePath)),
  );
  const lastImportIndex = logicStatements.findLastIndex(ts.isImportDeclaration);
  logicStatements.splice(lastImportIndex + 1, 0, styleModuleImport);

  const exportedStyleStatement = ts.factory.updateVariableStatement(
    styleStatement,
    ts.factory.createNodeArray([
      ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
    ]),
    styleStatement.declarationList,
  );
  const styleText = [
    ...styleImports.map((styleImport) => printer.printNode(ts.EmitHint.Unspecified, styleImport, sourceFile)),
    printer.printNode(ts.EmitHint.Unspecified, exportedStyleStatement, sourceFile),
  ].join('\n');
  const updatedSourceFile = ts.factory.updateSourceFile(sourceFile, logicStatements);
  const sourceText = fs.readFileSync(sourcePath, 'utf8');
  originals.set(sourcePath, sourceText);
  fs.mkdirSync(path.dirname(stylePath), { recursive: true });
  fs.writeFileSync(stylePath, `${styleText}\n`);
  fs.writeFileSync(sourcePath, `${printer.printFile(updatedSourceFile)}\n`);
  createdStylePaths.push(stylePath);
  extractedFileCount += 1;
}

const validation = spawnSync('npm', ['run', 'typecheck'], {
  cwd: projectRoot,
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
});
if (validation.status !== 0) {
  originals.forEach((source, sourcePath) => fs.writeFileSync(sourcePath, source));
  createdStylePaths.forEach((stylePath) => fs.rmSync(stylePath, { force: true }));
  process.stderr.write(`${validation.stdout}${validation.stderr}`);
  throw new Error('Style extraction was rolled back because typecheck failed');
}

process.stdout.write(`Extracted styles from ${extractedFileCount} component files.\n`);
if (skippedFiles.length > 0) {
  process.stdout.write(`Skipped ${skippedFiles.length} files:\n${skippedFiles.join('\n')}\n`);
}
