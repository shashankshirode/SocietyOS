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
const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, projectRoot, { noEmit: true }, configPath);
const program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
const checker = program.getTypeChecker();
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed, removeComments: true });
const originals = new Map();
const createdStylePaths = new Set();
let changedFileCount = 0;
let extractedStyleCount = 0;

function synthesizedClone(node) {
  const clone = ts.getSynthesizedDeepClone(node);
  const clearTextRange = (current) => {
    ts.setTextRange(current, { pos: -1, end: -1 });
    ts.forEachChild(current, clearTextRange);
  };
  clearTextRange(clone);
  return clone;
}

function importLocalName(declaration) {
  if (ts.isImportSpecifier(declaration)) return declaration.name.text;
  if (ts.isImportClause(declaration) && declaration.name) return declaration.name.text;
  if (ts.isNamespaceImport(declaration)) return declaration.name.text;
  return undefined;
}

function importedIdentifierName(identifier) {
  const symbol = ts.isShorthandPropertyAssignment(identifier.parent)
    ? checker.getShorthandAssignmentValueSymbol(identifier.parent)
    : checker.getSymbolAtLocation(identifier);
  if (!symbol) return undefined;
  for (const declaration of symbol.declarations ?? []) {
    const localName = importLocalName(declaration);
    if (localName) return localName;
  }
  return undefined;
}

function modulePath(fromDirectory, targetPath) {
  const relativePath = path.relative(fromDirectory, targetPath)
    .replace(/\\/g, '/')
    .replace(/\.tsx?$/, '');
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

function adjustedModuleSpecifier(sourcePath, stylePath, specifier) {
  if (!specifier.startsWith('.')) return specifier;
  return modulePath(path.dirname(stylePath), path.resolve(path.dirname(sourcePath), specifier));
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

function newStylePathFor(sourcePath) {
  const featureRoot = featureRootFor(sourcePath);
  const relativeDirectory = path.relative(featureRoot, path.dirname(sourcePath));
  return path.join(
    featureRoot,
    'styles',
    relativeDirectory,
    `${path.basename(sourcePath, '.tsx')}.styles.ts`,
  );
}

function filteredImport(factory, declaration, usedNames, moduleSpecifier) {
  const clause = declaration.importClause;
  if (!clause) return undefined;
  const defaultName = clause.name && usedNames.has(clause.name.text) ? clause.name : undefined;
  let bindings;
  if (clause.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
    bindings = usedNames.has(clause.namedBindings.name.text) ? clause.namedBindings : undefined;
  } else if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
    const elements = clause.namedBindings.elements.filter((element) => usedNames.has(element.name.text));
    bindings = elements.length > 0 ? factory.updateNamedImports(clause.namedBindings, elements) : undefined;
  }
  if (!defaultName && !bindings) return undefined;
  return factory.updateImportDeclaration(
    declaration,
    declaration.modifiers,
    factory.updateImportClause(clause, clause.isTypeOnly, defaultName, bindings),
    factory.createStringLiteral(moduleSpecifier),
    declaration.attributes,
  );
}

function localNamesInImport(declaration) {
  const names = new Set();
  const clause = declaration.importClause;
  if (!clause) return names;
  if (clause.name) names.add(clause.name.text);
  if (clause.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
    names.add(clause.namedBindings.name.text);
  }
  if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
    clause.namedBindings.elements.forEach((element) => names.add(element.name.text));
  }
  return names;
}

function pascalCase(value) {
  return value
    .replace(/[^A-Za-z0-9]+(.)/g, (_match, character) => character.toUpperCase())
    .replace(/[^A-Za-z0-9]+$/g, '')
    .replace(/^[A-Z]/, (character) => character.toLowerCase());
}

function styleNameFor(attribute, objectLiteral, usedNames) {
  const openingElement = attribute.parent?.parent;
  const tagText = openingElement && (ts.isJsxOpeningElement(openingElement) || ts.isJsxSelfClosingElement(openingElement))
    ? openingElement.tagName.getText()
    : 'element';
  const propertyNames = objectLiteral.properties
    .map((property) => property.name?.getText().replace(/["']/g, ''))
    .filter(Boolean)
    .slice(0, 4);
  const baseName = pascalCase(`${tagText}-${propertyNames.join('-')}`).slice(0, 72) || 'inlineStyle';
  let candidate = baseName;
  let suffix = 2;
  while (usedNames.has(candidate)) {
    candidate = `${baseName}${suffix}`;
    suffix += 1;
  }
  usedNames.add(candidate);
  return candidate;
}

for (const configuredPath of parsedConfig.fileNames) {
  const sourcePath = path.resolve(configuredPath);
  if (!sourcePath.startsWith(sourceRoot) || !sourcePath.endsWith('.tsx') || sourcePath.includes('.styles.')) continue;
  const sourceFile = program.getSourceFile(configuredPath) ?? program.getSourceFile(sourcePath);
  if (!sourceFile) continue;

  let styleImportDeclaration;
  let stylePath;
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || !statement.importClause || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const hasStyles = statement.importClause.namedBindings
      && ts.isNamedImports(statement.importClause.namedBindings)
      && statement.importClause.namedBindings.elements.some((element) => element.name.text === 'styles');
    if (!hasStyles || !statement.moduleSpecifier.text.includes('.styles')) continue;
    const unresolvedPath = path.resolve(path.dirname(sourcePath), statement.moduleSpecifier.text);
    const candidatePath = fs.existsSync(`${unresolvedPath}.ts`) ? `${unresolvedPath}.ts` : unresolvedPath;
    if (fs.existsSync(candidatePath)) {
      styleImportDeclaration = statement;
      stylePath = candidatePath;
      break;
    }
  }
  let createsStyleModule = false;
  if (!styleImportDeclaration || !stylePath) {
    const candidatePath = newStylePathFor(sourcePath);
    if (fs.existsSync(candidatePath)) continue;
    stylePath = candidatePath;
    createsStyleModule = true;
  }

  const targetObjects = [];
  const visitInlineStyles = (node) => {
    if (
      ts.isJsxAttribute(node)
      && ts.isIdentifier(node.name)
      && ['style', 'contentContainerStyle', 'columnWrapperStyle'].includes(node.name.text)
      && node.initializer
      && ts.isJsxExpression(node.initializer)
      && node.initializer.expression
    ) {
      const collectStyleObjects = (styleNode) => {
        if (ts.isObjectLiteralExpression(styleNode)) {
          const objectLiteral = styleNode;
          const localDependencies = new Set();
          const collectDependencies = (dependencyNode) => {
            if (ts.isIdentifier(dependencyNode)) {
              const importedName = importedIdentifierName(dependencyNode);
              if (!importedName) {
                const symbol = ts.isShorthandPropertyAssignment(dependencyNode.parent)
                  ? checker.getShorthandAssignmentValueSymbol(dependencyNode.parent)
                  : checker.getSymbolAtLocation(dependencyNode);
                for (const declaration of symbol?.declarations ?? []) {
                  if (
                    declaration.getSourceFile() === sourceFile
                    && !(declaration.pos >= objectLiteral.pos && declaration.end <= objectLiteral.end)
                    && !ts.isImportDeclaration(declaration)
                  ) {
                    localDependencies.add(dependencyNode.text);
                  }
                }
              }
            }
            ts.forEachChild(dependencyNode, collectDependencies);
          };
          collectDependencies(objectLiteral);
          if (localDependencies.size === 0) targetObjects.push({ attribute: node, objectLiteral });
          return;
        }
        ts.forEachChild(styleNode, collectStyleObjects);
      };
      collectStyleObjects(node.initializer.expression);
    }
    ts.forEachChild(node, visitInlineStyles);
  };
  visitInlineStyles(sourceFile);
  if (targetObjects.length === 0) continue;

  const styleSourceText = createsStyleModule
    ? "import { StyleSheet } from 'react-native';\nexport const styles = StyleSheet.create({});\n"
    : fs.readFileSync(stylePath, 'utf8');
  const styleSourceFile = ts.createSourceFile(stylePath, styleSourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let styleObject;
  const existingStyleNames = new Set();
  const existingStyleImports = new Set();
  for (const statement of styleSourceFile.statements) {
    if (ts.isImportDeclaration(statement) && statement.importClause) {
      if (statement.importClause.name) existingStyleImports.add(statement.importClause.name.text);
      const bindings = statement.importClause.namedBindings;
      if (bindings && ts.isNamespaceImport(bindings)) existingStyleImports.add(bindings.name.text);
      if (bindings && ts.isNamedImports(bindings)) bindings.elements.forEach((element) => existingStyleImports.add(element.name.text));
    }
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name)
        && declaration.name.text === 'styles'
        && declaration.initializer
        && ts.isCallExpression(declaration.initializer)
        && declaration.initializer.arguments[0]
        && ts.isObjectLiteralExpression(declaration.initializer.arguments[0])
      ) {
        styleObject = declaration.initializer.arguments[0];
        styleObject.properties.forEach((property) => {
          if (property.name) existingStyleNames.add(property.name.getText().replace(/["']/g, ''));
        });
      }
    }
  }
  if (!styleObject) continue;

  const nameByPosition = new Map();
  const styleDependencies = new Set();
  const propertyAssignments = [];
  for (const target of targetObjects) {
    const styleName = styleNameFor(target.attribute, target.objectLiteral, existingStyleNames);
    nameByPosition.set(target.objectLiteral.pos, styleName);
    propertyAssignments.push(
      ts.factory.createPropertyAssignment(
        styleName,
        synthesizedClone(target.objectLiteral),
      ),
    );
    const collectImports = (node) => {
      if (ts.isIdentifier(node)) {
        const importedName = importedIdentifierName(node);
        if (importedName) styleDependencies.add(importedName);
      }
      ts.forEachChild(node, collectImports);
    };
    collectImports(target.objectLiteral);
  }

  const updatedSource = ts.transform(sourceFile, [
    (context) => {
      const visit = (node) => {
        if (ts.isObjectLiteralExpression(node) && nameByPosition.has(node.pos)) {
          return context.factory.createPropertyAccessExpression(
            context.factory.createIdentifier('styles'),
            context.factory.createIdentifier(nameByPosition.get(node.pos)),
          );
        }
        return ts.visitEachChild(node, visit, context);
      };
      return (rootNode) => ts.visitNode(rootNode, visit);
    },
  ]).transformed[0];

  const logicImportNames = new Set(['styles']);
  const targetedPositions = new Set(targetObjects.map((target) => target.objectLiteral.pos));
  const collectLogicImports = (node) => {
    if (ts.isImportDeclaration(node)) return;
    if (ts.isObjectLiteralExpression(node) && targetedPositions.has(node.pos)) return;
    if (ts.isIdentifier(node)) {
      const importedName = importedIdentifierName(node);
      if (importedName) logicImportNames.add(importedName);
    }
    ts.forEachChild(node, collectLogicImports);
  };
  collectLogicImports(sourceFile);

  const updatedLogicStatements = [];
  const additionalStyleImports = [];
  for (const statement of updatedSource.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) {
      updatedLogicStatements.push(statement);
      continue;
    }
    const logicImport = statement.importClause
      ? filteredImport(ts.factory, statement, logicImportNames, statement.moduleSpecifier.text)
      : statement;
    if (logicImport) updatedLogicStatements.push(logicImport);
    const missingDependencies = new Set(
      [...styleDependencies].filter((dependency) => !existingStyleImports.has(dependency)),
    );
    const availableDependencies = new Set(
      [...localNamesInImport(statement)].filter((dependency) => missingDependencies.has(dependency)),
    );
    const styleImport = filteredImport(
      ts.factory,
      statement,
      availableDependencies,
      adjustedModuleSpecifier(sourcePath, stylePath, statement.moduleSpecifier.text),
    );
    if (styleImport) {
      additionalStyleImports.push(synthesizedClone(styleImport));
      for (const dependency of availableDependencies) existingStyleImports.add(dependency);
    }
  }

  if (createsStyleModule) {
    const styleModuleImport = ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        false,
        undefined,
        ts.factory.createNamedImports([
          ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier('styles')),
        ]),
      ),
      ts.factory.createStringLiteral(modulePath(path.dirname(sourcePath), stylePath)),
    );
    const lastImportIndex = updatedLogicStatements.findLastIndex(ts.isImportDeclaration);
    updatedLogicStatements.splice(lastImportIndex + 1, 0, styleModuleImport);
  }

  const updatedStyleSource = ts.transform(styleSourceFile, [
    (context) => {
      const visit = (node) => {
        if (node === styleObject) {
          return context.factory.updateObjectLiteralExpression(node, [
            ...node.properties,
            ...propertyAssignments,
          ]);
        }
        return ts.visitEachChild(node, visit, context);
      };
      return (rootNode) => {
        const visited = ts.visitNode(rootNode, visit);
        const statements = [...visited.statements];
        const lastImportIndex = statements.findLastIndex(ts.isImportDeclaration);
        statements.splice(lastImportIndex + 1, 0, ...additionalStyleImports);
        return context.factory.updateSourceFile(visited, statements);
      };
    },
  ]).transformed[0];

  if (!originals.has(sourcePath)) originals.set(sourcePath, fs.readFileSync(sourcePath, 'utf8'));
  if (createsStyleModule) {
    fs.mkdirSync(path.dirname(stylePath), { recursive: true });
    createdStylePaths.add(stylePath);
  } else if (!originals.has(stylePath)) {
    originals.set(stylePath, styleSourceText);
  }
  fs.writeFileSync(sourcePath, `${printer.printFile(ts.factory.updateSourceFile(updatedSource, updatedLogicStatements))}\n`);
  fs.writeFileSync(stylePath, `${printer.printFile(updatedStyleSource)}\n`);
  changedFileCount += 1;
  extractedStyleCount += targetObjects.length;
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
  throw new Error('Inline style extraction was rolled back because typecheck failed');
}

process.stdout.write(
  `Extracted ${extractedStyleCount} static inline styles across ${changedFileCount} files.\n`,
);
