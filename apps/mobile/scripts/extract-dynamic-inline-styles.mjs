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

function symbolForIdentifier(identifier) {
  return ts.isShorthandPropertyAssignment(identifier.parent)
    ? checker.getShorthandAssignmentValueSymbol(identifier.parent)
    : checker.getSymbolAtLocation(identifier);
}

function importLocalName(declaration) {
  if (ts.isImportSpecifier(declaration)) return declaration.name.text;
  if (ts.isImportClause(declaration) && declaration.name) return declaration.name.text;
  if (ts.isNamespaceImport(declaration)) return declaration.name.text;
  return undefined;
}

function importedIdentifierName(identifier) {
  const symbol = symbolForIdentifier(identifier);
  if (!symbol) return undefined;
  for (const declaration of symbol.declarations ?? []) {
    const localName = importLocalName(declaration);
    if (localName) return localName;
  }
  return undefined;
}

function localDependencies(sourceFile, node) {
  const dependencies = new Set();
  const visit = (current) => {
    if (ts.isIdentifier(current)) {
      const symbol = symbolForIdentifier(current);
      for (const declaration of symbol?.declarations ?? []) {
        if (
          declaration.getSourceFile() === sourceFile
          && !(declaration.pos >= node.pos && declaration.end <= node.end)
          && !importLocalName(declaration)
        ) {
          dependencies.add(current.text);
        }
      }
    }
    ts.forEachChild(current, visit);
  };
  visit(node);
  return dependencies;
}

function primitiveStyleType(type) {
  const types = type.isUnion() ? type.types : [type];
  return types.every((part) => (
    part.flags & (
      ts.TypeFlags.StringLike
      | ts.TypeFlags.NumberLike
      | ts.TypeFlags.BooleanLike
      | ts.TypeFlags.Null
    )
  ) !== 0);
}

function normalizeGeneratedTypeNode(typeNode, requirements) {
  const transformed = ts.transform(typeNode, [
    (context) => {
      const visit = (node) => {
        if (node.kind === ts.SyntaxKind.UndefinedKeyword) {
          requirements.usesAbsent = true;
          return context.factory.createTypeReferenceNode('Absent');
        }
        if (
          ts.isTypeReferenceNode(node)
          && ts.isIdentifier(node.typeName)
          && (node.typeName.text === 'AnimatedInterpolation' || node.typeName.text === 'Value')
        ) {
          requirements.reactNativeImports.add('Animated');
          return context.factory.updateTypeReferenceNode(
            node,
            context.factory.createQualifiedName(
              context.factory.createIdentifier('Animated'),
              context.factory.createIdentifier(node.typeName.text),
            ),
            node.typeArguments,
          );
        }
        if (
          ts.isTypeReferenceNode(node)
          && ts.isIdentifier(node.typeName)
          && ['DimensionValue', 'StyleProp', 'TextStyle', 'ViewStyle'].includes(node.typeName.text)
        ) {
          requirements.reactNativeImports.add(node.typeName.text);
        }
        return ts.visitEachChild(node, visit, context);
      };
      return (rootNode) => ts.visitNode(rootNode, visit);
    },
  ]).transformed[0];
  return transformed;
}

function modulePath(fromDirectory, targetPath) {
  const relativePath = path.relative(fromDirectory, targetPath)
    .replace(/\\/g, '/')
    .replace(/\.tsx?$/, '');
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
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

function adjustedModuleSpecifier(sourcePath, stylePath, specifier) {
  if (!specifier.startsWith('.')) return specifier;
  return modulePath(path.dirname(stylePath), path.resolve(path.dirname(sourcePath), specifier));
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

function camelCase(value) {
  return value
    .replace(/[^A-Za-z0-9]+(.)/g, (_match, character) => character.toUpperCase())
    .replace(/^[A-Z]/, (character) => character.toLowerCase());
}

function uniqueFunctionName(attribute, dynamicNames, usedNames) {
  const openingElement = attribute.parent?.parent;
  const tagText = openingElement && (ts.isJsxOpeningElement(openingElement) || ts.isJsxSelfClosingElement(openingElement))
    ? openingElement.tagName.getText()
    : 'element';
  const descriptor = camelCase(`${tagText}-${dynamicNames.join('-')}`).slice(0, 64) || 'elementStyle';
  const baseName = `create${descriptor.charAt(0).toUpperCase()}${descriptor.slice(1)}Style`;
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
  let needsStyleImport = false;
  let createsStyleModule = false;
  if (!styleImportDeclaration || !stylePath) {
    stylePath = newStylePathFor(sourcePath);
    needsStyleImport = true;
    createsStyleModule = !fs.existsSync(stylePath);
  }

  const targets = [];
  const collectTargets = (node) => {
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
          const objectDependencies = localDependencies(sourceFile, objectLiteral);
          if (objectDependencies.size > 0) {
            const dynamicProperties = [];
            for (const property of objectLiteral.properties) {
              if (ts.isSpreadAssignment(property) && localDependencies(sourceFile, property.expression).size > 0) {
                dynamicProperties.push({ property, expression: property.expression });
              }
              if (ts.isPropertyAssignment(property) && localDependencies(sourceFile, property.initializer).size > 0) {
                dynamicProperties.push({ property, expression: property.initializer });
              }
              if (ts.isShorthandPropertyAssignment(property) && localDependencies(sourceFile, property.name).size > 0) {
                dynamicProperties.push({ property, expression: property.name });
              }
            }
            if (dynamicProperties.length > 0) {
              targets.push({ attribute: node, objectLiteral, dynamicProperties });
            }
          }
          return;
        }
        ts.forEachChild(styleNode, collectStyleObjects);
      };
      collectStyleObjects(node.initializer.expression);
    }
    ts.forEachChild(node, collectTargets);
  };
  collectTargets(sourceFile);
  if (targets.length === 0) continue;

  const styleSourceText = createsStyleModule
    ? "import { StyleSheet } from 'react-native';\nexport const styles = StyleSheet.create({});\n"
    : fs.readFileSync(stylePath, 'utf8');
  const styleSourceFile = ts.createSourceFile(stylePath, styleSourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const existingTopLevelNames = new Set();
  const existingStyleImports = new Set();
  for (const statement of styleSourceFile.statements) {
    if (ts.isImportDeclaration(statement) && statement.importClause) {
      if (statement.importClause.name) existingStyleImports.add(statement.importClause.name.text);
      const bindings = statement.importClause.namedBindings;
      if (bindings && ts.isNamespaceImport(bindings)) existingStyleImports.add(bindings.name.text);
      if (bindings && ts.isNamedImports(bindings)) bindings.elements.forEach((element) => existingStyleImports.add(element.name.text));
    }
    if (ts.isVariableStatement(statement)) {
      statement.declarationList.declarations.forEach((declaration) => {
        if (ts.isIdentifier(declaration.name)) existingTopLevelNames.add(declaration.name.text);
      });
    }
    if (ts.isFunctionDeclaration(statement) && statement.name) existingTopLevelNames.add(statement.name.text);
  }

  const targetByPosition = new Map();
  const styleDependencies = new Set();
  const functionDeclarations = [];
  const importedFunctionNames = [];
  const generatedTypeRequirements = {
    reactNativeImports: new Set(),
    usesAbsent: false,
  };
  for (const target of targets) {
    const dynamicNames = target.dynamicProperties.map(({ property }, index) => (
      property.name?.getText().replace(/["']/g, '')
      ?? (ts.isSpreadAssignment(property) ? `spread${index + 1}` : `value${index + 1}`)
    ));
    const functionName = uniqueFunctionName(target.attribute, dynamicNames, existingTopLevelNames);
    const parameters = [];
    const callArguments = [];
    const parameterByPropertyPosition = new Map();
    const usedParameterNames = new Set();
    target.dynamicProperties.forEach(({ property, expression }, index) => {
      const propertyName = property.name?.getText().replace(/["']/g, '')
        ?? (ts.isSpreadAssignment(property) ? `spread${index + 1}` : `value${index + 1}`);
      let parameterName = camelCase(`${propertyName}-value`) || `value${index + 1}`;
      let suffix = 2;
      while (usedParameterNames.has(parameterName)) {
        parameterName = `${parameterName}${suffix}`;
        suffix += 1;
      }
      usedParameterNames.add(parameterName);
      const rawTypeNode = checker.typeToTypeNode(
        checker.getTypeAtLocation(expression),
        undefined,
        ts.NodeBuilderFlags.NoTruncation,
      );
      if (!rawTypeNode) throw new Error(`Could not resolve a style parameter type in ${sourcePath}`);
      const typeNode = normalizeGeneratedTypeNode(rawTypeNode, generatedTypeRequirements);
      parameters.push(
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          parameterName,
          undefined,
          synthesizedClone(typeNode),
        ),
      );
      callArguments.push(expression);
      parameterByPropertyPosition.set(property.pos, parameterName);
    });
    const functionProperties = target.objectLiteral.properties.map((property) => {
      const parameterName = parameterByPropertyPosition.get(property.pos);
      if (!parameterName) return synthesizedClone(property);
      if (ts.isPropertyAssignment(property)) {
        return ts.factory.createPropertyAssignment(
          synthesizedClone(property.name),
          ts.factory.createIdentifier(parameterName),
        );
      }
      if (ts.isShorthandPropertyAssignment(property)) {
        return ts.factory.createPropertyAssignment(
          property.name.text,
          ts.factory.createIdentifier(parameterName),
        );
      }
      if (ts.isSpreadAssignment(property)) {
        return ts.factory.createSpreadAssignment(
          ts.factory.createIdentifier(parameterName),
        );
      }
      return synthesizedClone(property);
    });
    functionDeclarations.push(
      ts.factory.createFunctionDeclaration(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        undefined,
        functionName,
        undefined,
        parameters,
        undefined,
        ts.factory.createBlock([
          ts.factory.createReturnStatement(
            ts.factory.createAsExpression(
              ts.factory.createObjectLiteralExpression(functionProperties, true),
              ts.factory.createTypeReferenceNode('const'),
            ),
          ),
        ], true),
      ),
    );
    importedFunctionNames.push(functionName);
    targetByPosition.set(target.objectLiteral.pos, { functionName, callArguments });
    const collectStaticImports = (node) => {
      if (ts.isIdentifier(node)) {
        const importedName = importedIdentifierName(node);
        if (importedName) styleDependencies.add(importedName);
      }
      ts.forEachChild(node, collectStaticImports);
    };
    collectStaticImports(target.objectLiteral);
  }

  const transformedSource = ts.transform(sourceFile, [
    (context) => {
      const visit = (node) => {
        if (ts.isObjectLiteralExpression(node) && targetByPosition.has(node.pos)) {
          const target = targetByPosition.get(node.pos);
          return context.factory.createCallExpression(
            context.factory.createIdentifier(target.functionName),
            undefined,
            target.callArguments.map((argument) => ts.visitNode(argument, visit)),
          );
        }
        return ts.visitEachChild(node, visit, context);
      };
      return (rootNode) => ts.visitNode(rootNode, visit);
    },
  ]).transformed[0];

  const targetedPositions = new Set(targets.map((target) => target.objectLiteral.pos));
  const logicImportNames = new Set(['styles']);
  const collectLogicImports = (node) => {
    if (ts.isImportDeclaration(node)) return;
    if (ts.isObjectLiteralExpression(node) && targetedPositions.has(node.pos)) {
      const target = targetByPosition.get(node.pos);
      target.callArguments.forEach((argument) => collectLogicImports(argument));
      return;
    }
    if (ts.isIdentifier(node)) {
      const importedName = importedIdentifierName(node);
      if (importedName) logicImportNames.add(importedName);
    }
    ts.forEachChild(node, collectLogicImports);
  };
  collectLogicImports(sourceFile);

  const updatedLogicStatements = [];
  const additionalStyleImports = [];
  for (const statement of transformedSource.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) {
      updatedLogicStatements.push(statement);
      continue;
    }
    if (statement === styleImportDeclaration) {
      const clause = statement.importClause;
      const bindings = clause?.namedBindings && ts.isNamedImports(clause.namedBindings)
        ? clause.namedBindings
        : ts.factory.createNamedImports([]);
      const existingElements = bindings.elements.filter((element) => logicImportNames.has(element.name.text));
      const newElements = importedFunctionNames.map((functionName) =>
        ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier(functionName)));
      updatedLogicStatements.push(
        ts.factory.updateImportDeclaration(
          statement,
          statement.modifiers,
          ts.factory.updateImportClause(
            clause,
            clause.isTypeOnly,
            clause.name && logicImportNames.has(clause.name.text) ? clause.name : undefined,
            ts.factory.updateNamedImports(bindings, [...existingElements, ...newElements]),
          ),
          statement.moduleSpecifier,
          statement.attributes,
        ),
      );
    } else {
      const logicImport = statement.importClause
        ? filteredImport(ts.factory, statement, logicImportNames, statement.moduleSpecifier.text)
        : statement;
      if (logicImport) updatedLogicStatements.push(logicImport);
    }
    const missingDependencies = new Set(
      [...styleDependencies].filter((dependency) => (
        !existingStyleImports.has(dependency)
        && !existingTopLevelNames.has(dependency)
      )),
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
  if (needsStyleImport) {
    const styleModuleImport = ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        false,
        undefined,
        ts.factory.createNamedImports(importedFunctionNames.map((functionName) => (
          ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier(functionName))
        ))),
      ),
      ts.factory.createStringLiteral(modulePath(path.dirname(sourcePath), stylePath)),
    );
    const lastLogicImportIndex = updatedLogicStatements.findLastIndex(ts.isImportDeclaration);
    updatedLogicStatements.splice(lastLogicImportIndex + 1, 0, styleModuleImport);
  }

  const styleStatements = [...styleSourceFile.statements];
  if (generatedTypeRequirements.reactNativeImports.size > 0) {
    const reactNativeImportIndex = styleStatements.findIndex((statement) => (
      ts.isImportDeclaration(statement)
      && ts.isStringLiteral(statement.moduleSpecifier)
      && statement.moduleSpecifier.text === 'react-native'
      && statement.importClause?.namedBindings
      && ts.isNamedImports(statement.importClause.namedBindings)
    ));
    const requiredImports = [...generatedTypeRequirements.reactNativeImports];
    if (reactNativeImportIndex >= 0) {
      const declaration = styleStatements[reactNativeImportIndex];
      const clause = declaration.importClause;
      const bindings = clause.namedBindings;
      const existingNames = new Set(bindings.elements.map((element) => element.name.text));
      const additions = requiredImports
        .filter((name) => !existingNames.has(name))
        .map((name) => ts.factory.createImportSpecifier(
          name !== 'Animated',
          undefined,
          ts.factory.createIdentifier(name),
        ));
      styleStatements[reactNativeImportIndex] = ts.factory.updateImportDeclaration(
        declaration,
        declaration.modifiers,
        ts.factory.updateImportClause(
          clause,
          clause.isTypeOnly,
          clause.name,
          ts.factory.updateNamedImports(bindings, [...bindings.elements, ...additions]),
        ),
        declaration.moduleSpecifier,
        declaration.attributes,
      );
    }
  }
  if (generatedTypeRequirements.usesAbsent) {
    const absenceImport = ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        true,
        undefined,
        ts.factory.createNamedImports([
          ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier('Absent')),
        ]),
      ),
      ts.factory.createStringLiteral(
        modulePath(path.dirname(stylePath), path.join(sourceRoot, 'shared/types/absence.types')),
      ),
    );
    const lastImportIndex = styleStatements.findLastIndex(ts.isImportDeclaration);
    styleStatements.splice(lastImportIndex + 1, 0, absenceImport);
  }
  const lastImportIndex = styleStatements.findLastIndex(ts.isImportDeclaration);
  styleStatements.splice(lastImportIndex + 1, 0, ...additionalStyleImports);
  styleStatements.push(...functionDeclarations);
  const updatedStyleSource = ts.factory.updateSourceFile(styleSourceFile, styleStatements);
  const updatedSource = ts.factory.updateSourceFile(transformedSource, updatedLogicStatements);

  if (!originals.has(sourcePath)) originals.set(sourcePath, fs.readFileSync(sourcePath, 'utf8'));
  if (createsStyleModule) {
    fs.mkdirSync(path.dirname(stylePath), { recursive: true });
    createdStylePaths.add(stylePath);
  } else if (!originals.has(stylePath)) {
    originals.set(stylePath, styleSourceText);
  }
  fs.writeFileSync(sourcePath, `${printer.printFile(updatedSource)}\n`);
  fs.writeFileSync(stylePath, `${printer.printFile(updatedStyleSource)}\n`);
  changedFileCount += 1;
  extractedStyleCount += targets.length;
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
  throw new Error('Dynamic style extraction was rolled back because typecheck failed');
}

process.stdout.write(
  `Extracted ${extractedStyleCount} dynamic inline styles across ${changedFileCount} files.\n`,
);
