import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(projectRoot, 'src');
const nativeModalHosts = new Set([
  path.join(sourceRoot, 'ui', 'modal', 'AppModal.tsx'),
  path.join(sourceRoot, 'ui', 'bottomSheet', 'AppBottomSheet.tsx'),
]);
const styleAttributes = new Set(['style', 'contentContainerStyle', 'columnWrapperStyle', 'ListFooterComponentStyle']);
const files = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(entryPath);
    } else if (
      (entryPath.endsWith('.ts') || entryPath.endsWith('.tsx'))
      && !entryPath.includes('.styles.')
      && !entryPath.includes(`${path.sep}__tests__${path.sep}`)
      && !entryPath.endsWith('.test.ts')
      && !entryPath.endsWith('.test.tsx')
      && !entryPath.endsWith('.generated.ts')
    ) {
      files.push(entryPath);
    }
  }
}

function containsObjectLiteral(expression) {
  if (ts.isObjectLiteralExpression(expression)) return true;
  if (ts.isArrayLiteralExpression(expression)) return expression.elements.some(containsObjectLiteral);
  if (ts.isParenthesizedExpression(expression) || ts.isAsExpression(expression)) {
    return containsObjectLiteral(expression.expression);
  }
  return false;
}

walk(sourceRoot);
const violations = [];

for (const filePath of files) {
  const sourceText = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const report = (node, rule) => {
    const location = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    violations.push({ filePath, line: location.line + 1, column: location.character + 1, rule });
  };
  const visit = (node) => {
    if (
      ts.isCallExpression(node)
      && ts.isPropertyAccessExpression(node.expression)
      && ts.isIdentifier(node.expression.expression)
    ) {
      const owner = node.expression.expression.text;
      const method = node.expression.name.text;
      if (owner === 'StyleSheet' && method === 'create') report(node, 'StyleSheet.create in logic file');
      if (owner === 'Dimensions' && method === 'get') report(node, 'static Dimensions.get usage');
      if (owner === 'Alert' && (method === 'alert' || method === 'prompt')) report(node, 'native Alert workflow');
      if (owner === 'console' && ['log', 'warn', 'debug'].includes(method)) report(node, `console.${method}`);
    }
    if (
      ts.isJsxAttribute(node)
      && ts.isIdentifier(node.name)
      && styleAttributes.has(node.name.text)
      && node.initializer
      && ts.isJsxExpression(node.initializer)
      && node.initializer.expression
      && containsObjectLiteral(node.initializer.expression)
    ) {
      report(node, `inline ${node.name.text} object`);
    }
    if (
      ts.isImportDeclaration(node)
      && node.moduleSpecifier
      && ts.isStringLiteral(node.moduleSpecifier)
      && node.moduleSpecifier.text === 'react-native'
      && node.importClause?.namedBindings
      && ts.isNamedImports(node.importClause.namedBindings)
    ) {
      const names = node.importClause.namedBindings.elements.map((element) => element.propertyName?.text ?? element.name.text);
      if (names.includes('Alert')) report(node, 'native Alert import');
      if (names.includes('Modal') && !nativeModalHosts.has(filePath)) report(node, 'native Modal outside shared host');
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
}

if (violations.length > 0) {
  for (const violation of violations) {
    console.error(`${path.relative(projectRoot, violation.filePath)}:${violation.line}:${violation.column} ${violation.rule}`);
  }
  console.error(`Found ${violations.length} UI structure violation${violations.length === 1 ? '' : 's'}.`);
  process.exitCode = 1;
} else {
  console.info(`Verified ${files.length} active source files for external styles, responsive dimensions, shared modals, and diagnostics (0 violations).`);
}
