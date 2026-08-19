import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(projectRoot, 'src');
const visibleAttributes = new Set([
  'accessibilityHint',
  'accessibilityLabel',
  'actionLabel',
  'buttonText',
  'cancelText',
  'characterCountText',
  'confirmText',
  'description',
  'detail',
  'deadline',
  'emptyText',
  'errorText',
  'headerTitle',
  'helperText',
  'label',
  'message',
  'note',
  'notResidentScope',
  'placeholder',
  'primaryActionLabel',
  'secondaryActionLabel',
  'statusLabel',
  'tabBarLabel',
  'accessLabel',
  'relationship',
  'verificationLabel',
  'residenceContext',
  'visitPurpose',
  'purpose',
  'formattedPublishedTime',
  'frontendReadyBackendRequired',
  'frontendReadyIntegrationRequired',
  'subtitle',
  'text',
  'title',
  'valueLabel',
]);

function walk(directory, files) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(entryPath, files);
    } else if (
      entryPath.endsWith('.tsx')
      && !entryPath.includes('.styles.')
      && !entryPath.includes(`${path.sep}__tests__${path.sep}`)
      && !entryPath.endsWith('.test.tsx')
    ) {
      files.push(entryPath);
    }
  }
}

function decodeJsxEntities(value) {
  return value
    .replaceAll('&apos;', "'")
    .replaceAll('&quot;', '"')
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function normalizedValue(value, isJsxText = false) {
  const decoded = isJsxText ? decodeJsxEntities(value) : value;
  return decoded.replace(/\s+/g, ' ').trim();
}

function isVisibleValue(value) {
  return value.length > 0 && /[A-Za-z\u0900-\u097F]/.test(value);
}

function isGenericVisibleSentence(node) {
  if (!ts.isStringLiteral(node) && !ts.isNoSubstitutionTemplateLiteral(node)) return false;
  const value = normalizedValue(node.text);
  if (!/[A-Za-z]/.test(value) || !/\s/.test(value)) return false;
  if (/^(?:rgba?\(|hsla?\(|#)/i.test(value)) return false;
  if (/^(?:https?:\/\/|mailto:|tel:)/i.test(value)) return false;
  if (/\b(?:KB|MB|GB|AM|PM)\b/.test(value) && /\d/.test(value)) return false;
  if (/^(?:A|B|C|D|E|F) Wing$/i.test(value)) return false;
  if (/^(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d/i.test(value)) return false;
  const parent = node.parent;
  if (
    ts.isImportDeclaration(parent)
    || ts.isExportDeclaration(parent)
    || ts.isLiteralTypeNode(parent)
    || ts.isCaseClause(parent)
    || ts.isEnumMember(parent)
    || ts.isJsxAttribute(parent)
    || ts.isNewExpression(parent)
  ) return false;
  if (
    ts.isBinaryExpression(parent)
    && [
      ts.SyntaxKind.EqualsEqualsEqualsToken,
      ts.SyntaxKind.EqualsEqualsToken,
      ts.SyntaxKind.ExclamationEqualsEqualsToken,
      ts.SyntaxKind.ExclamationEqualsToken,
    ].includes(parent.operatorToken.kind)
  ) return false;
  if (ts.isPropertyAssignment(parent) && parent.initializer === node && ts.isIdentifier(parent.name)) {
    if (/^(?:address|bank|buildingName|code|date|email|fileName|flat|id|location|mobile|name|ownerName|phone|reference|residentName|societyName|status|tenantName|time|unitNumber|vendorName|wing)$/i.test(parent.name.text)) {
      return false;
    }
  }
  const words = value.match(/[A-Za-z]+/g) ?? [];
  if (
    ts.isBindingElement(parent)
    || ts.isReturnStatement(parent)
    || ts.isConditionalExpression(parent)
  ) return true;
  const looksLikeProperName = words.length > 1
    && words.length <= 4
    && words.every((word) => /^[A-Z][a-z]*$/.test(word))
    && !/[.!?]/.test(value);
  if (looksLikeProperName) return false;
  return words.length >= 3
    || /[.!?]/.test(value)
    || (
      ts.isBinaryExpression(parent)
      && [ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken].includes(parent.operatorToken.kind)
    );
}

const files = [];
walk(sourceRoot, files);
const violations = [];

for (const filePath of files) {
  const sourceText = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const seen = new Set();
  const report = (node, value, context, isJsxText = false) => {
    const normalized = normalizedValue(value, isJsxText);
    if (!isVisibleValue(normalized)) return;
    const identity = `${node.pos}:${node.end}`;
    if (seen.has(identity)) return;
    seen.add(identity);
    const location = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    violations.push({
      filePath,
      line: location.line + 1,
      column: location.character + 1,
      context,
      value: normalized,
    });
  };
  const inspectExpression = (expression, context) => {
    if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
      report(expression, expression.text, context);
    } else if (ts.isTemplateExpression(expression)) {
      const value = [expression.head.text, ...expression.templateSpans.map((span) => span.literal.text)].join(' ');
      report(expression, value, context);
    } else if (ts.isConditionalExpression(expression)) {
      inspectExpression(expression.whenTrue, context);
      inspectExpression(expression.whenFalse, context);
    } else if (
      ts.isBinaryExpression(expression)
      && [ts.SyntaxKind.BarBarToken, ts.SyntaxKind.PlusToken, ts.SyntaxKind.QuestionQuestionToken].includes(expression.operatorToken.kind)
    ) {
      inspectExpression(expression.left, context);
      inspectExpression(expression.right, context);
    } else if (
      ts.isAsExpression(expression)
      || ts.isNonNullExpression(expression)
      || ts.isParenthesizedExpression(expression)
    ) {
      inspectExpression(expression.expression, context);
    }
  };
  const visit = (node) => {
    if (ts.isJsxText(node)) {
      report(node, node.text, 'JSX text', true);
    } else if (ts.isJsxExpression(node) && !ts.isJsxAttribute(node.parent) && node.expression) {
      inspectExpression(node.expression, 'JSX expression');
    } else if (
      ts.isJsxAttribute(node)
      && ts.isIdentifier(node.name)
      && visibleAttributes.has(node.name.text)
      && node.initializer
    ) {
      if (ts.isStringLiteral(node.initializer)) {
        report(node.initializer, node.initializer.text, `JSX ${node.name.text}`);
      } else if (ts.isJsxExpression(node.initializer) && node.initializer.expression) {
        inspectExpression(node.initializer.expression, `JSX ${node.name.text}`);
      }
    } else if (
      ts.isPropertyAssignment(node)
      && ts.isIdentifier(node.name)
      && (
        visibleAttributes.has(node.name.text)
        || (
          node.name.text === 'name'
          && (ts.isStringLiteral(node.initializer) || ts.isNoSubstitutionTemplateLiteral(node.initializer))
          && ts.isObjectLiteralExpression(node.parent)
          && (
            node.parent.properties.some((property) => (
              ts.isPropertyAssignment(property)
              && ts.isIdentifier(property.name)
              && property.name.text === 'onPress'
            ))
            || (
              /\s/.test(node.initializer.text)
              && node.parent.properties.some((property) => (
                ts.isPropertyAssignment(property)
                && ts.isIdentifier(property.name)
                && ['icon', 'route'].includes(property.name.text)
              ))
            )
          )
        )
      )
    ) {
      inspectExpression(node.initializer, `property ${node.name.text}`);
    } else if (
      ts.isCallExpression(node)
      && ts.isPropertyAccessExpression(node.expression)
      && ['alert', 'prompt'].includes(node.expression.name.text)
      && ts.isIdentifier(node.expression.expression)
      && ['Alert', 'AppAlert'].includes(node.expression.expression.text)
    ) {
      node.arguments.slice(0, 2).forEach((argument) => inspectExpression(argument, `${node.expression.expression.text}.${node.expression.name.text}`));
    } else if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const visibleArgumentIndexes = {
        renderFlagItem: [1, 2],
        renderOwnerCard: [1],
        renderSectionList: [0],
      };
      visibleArgumentIndexes[node.expression.text]?.forEach((argumentIndex) => {
        const argument = node.arguments[argumentIndex];
        if (argument) inspectExpression(argument, `${node.expression.text} argument ${argumentIndex + 1}`);
      });
    } else if (
      ts.isCallExpression(node)
      && ts.isPropertyAccessExpression(node.expression)
      && node.expression.name.text === 'required'
    ) {
      node.arguments.forEach((argument) => inspectExpression(argument, 'required validation message'));
    }
    if (isGenericVisibleSentence(node)) report(node, node.text, 'visible sentence');
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
}

if (violations.length > 0) {
  for (const violation of violations) {
    const relativePath = path.relative(projectRoot, violation.filePath);
    console.error(`${relativePath}:${violation.line}:${violation.column} ${violation.context}: ${JSON.stringify(violation.value)}`);
  }
  console.error(`Found ${violations.length} hardcoded visible UI literal${violations.length === 1 ? '' : 's'}.`);
  process.exitCode = 1;
} else {
  console.info(`All ${files.length} checked UI source files use localized visible copy (0 violations).`);
}
