import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const filename = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(filename), '..');
const sourceRoot = path.join(projectRoot, 'src');
const generatedMessagesPath = path.join(sourceRoot, 'messages', 'en', 'uiLiterals.generated.ts');
const englishMessagesIndexPath = path.join(sourceRoot, 'messages', 'en', 'index.ts');
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed, removeComments: true });
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
const originals = new Map();

function walk(directory, files) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(entryPath, files);
      continue;
    }
    if (
      entryPath.endsWith('.tsx')
      && !entryPath.includes('.styles.')
      && !entryPath.includes(`${path.sep}__tests__${path.sep}`)
      && !entryPath.endsWith('.test.tsx')
    ) {
      files.push(entryPath);
    }
  }
}

function modulePath(fromDirectory, targetPath) {
  const relativePath = path.relative(fromDirectory, targetPath)
    .replace(/\\/g, '/')
    .replace(/\.tsx?$/, '');
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
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

function normalizeVisibleValue(value, isJsxText) {
  const decoded = isJsxText ? decodeJsxEntities(value) : value;
  return decoded.replace(/\s+/g, ' ').trim();
}

function isVisibleValue(value) {
  return value.length > 0 && /[A-Za-z\u0900-\u097F]/.test(value);
}

function targetId(node) {
  return `${node.kind}:${node.pos}:${node.end}`;
}

function functionName(node) {
  if (ts.isFunctionDeclaration(node) && node.name) return node.name.text;
  if (ts.isFunctionExpression(node) && node.name) return node.name.text;
  if (
    (ts.isArrowFunction(node) || ts.isFunctionExpression(node))
    && ts.isVariableDeclaration(node.parent)
    && ts.isIdentifier(node.parent.name)
  ) {
    return node.parent.name.text;
  }
  return '';
}

function owningComponent(node) {
  let current = node.parent;
  while (current) {
    if (
      ts.isFunctionLike(current)
      && /^[A-Z]/.test(functionName(current))
      && current.body
    ) {
      return current;
    }
    current = current.parent;
  }
  return undefined;
}

function messageKey(value, keysByValue, valuesByKey) {
  const existingKey = keysByValue.get(value);
  if (existingKey) return existingKey;
  const digest = crypto.createHash('sha256').update(value).digest('hex');
  for (let length = 12; length <= digest.length; length += 4) {
    const candidate = `m_${digest.slice(0, length)}`;
    const collision = valuesByKey.get(candidate);
    if (!collision || collision === value) {
      keysByValue.set(value, candidate);
      valuesByKey.set(candidate, value);
      return candidate;
    }
  }
  throw new Error(`Could not create a stable localization key for ${value}`);
}

function collectTargets(sourceFile, keysByValue, valuesByKey) {
  const targets = new Map();
  const componentPositions = new Set();
  const moduleComponentPositions = new Set();
  let moduleLocalizationRequired = false;
  const addTarget = (node, rawValue, isJsxText = false) => {
    const value = normalizeVisibleValue(rawValue, isJsxText);
    if (!isVisibleValue(value)) return;
    const component = owningComponent(node);
    if (!component) {
      const location = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      throw new Error(`Visible literal has no owning component at ${sourceFile.fileName}:${location.line + 1}`);
    }
    const key = messageKey(value, keysByValue, valuesByKey);
    targets.set(targetId(node), { key, rawValue, isJsxText });
    componentPositions.add(component.pos);
  };
  const addTemplateTarget = (node) => {
    const template = [
      node.head.text,
      ...node.templateSpans.flatMap((span, index) => [
        `__SOCIETYOS_ARG_${index}__`,
        span.literal.text,
      ]),
    ].join('');
    if (!/[A-Za-z\u0900-\u097F]/.test(
      template.replace(/__SOCIETYOS_ARG_\d+__/g, ''),
    )) return;
    const component = owningComponent(node);
    if (!component) {
      const location = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      throw new Error(`Visible template has no owning component at ${sourceFile.fileName}:${location.line + 1}`);
    }
    const key = messageKey(template, keysByValue, valuesByKey);
    targets.set(targetId(node), { key, templateExpressions: node.templateSpans.map((span) => span.expression) });
    componentPositions.add(component.pos);
  };
  const collectDisplayExpression = (expression) => {
    if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
      addTarget(expression, expression.text);
      return;
    }
    if (ts.isTemplateExpression(expression)) {
      addTemplateTarget(expression);
      expression.templateSpans.forEach((span) => collectDisplayExpression(span.expression));
      return;
    }
    if (ts.isConditionalExpression(expression)) {
      collectDisplayExpression(expression.whenTrue);
      collectDisplayExpression(expression.whenFalse);
      return;
    }
    if (
      ts.isBinaryExpression(expression)
      && [
        ts.SyntaxKind.BarBarToken,
        ts.SyntaxKind.PlusToken,
        ts.SyntaxKind.QuestionQuestionToken,
      ].includes(expression.operatorToken.kind)
    ) {
      collectDisplayExpression(expression.left);
      collectDisplayExpression(expression.right);
      return;
    }
    if (
      ts.isAsExpression(expression)
      || ts.isNonNullExpression(expression)
      || ts.isParenthesizedExpression(expression)
    ) {
      collectDisplayExpression(expression.expression);
    }
  };
  const addActiveTarget = (node, rawValue) => {
    const value = normalizeVisibleValue(rawValue, false);
    if (!isVisibleValue(value)) return;
    const key = messageKey(value, keysByValue, valuesByKey);
    targets.set(targetId(node), { active: true, key });
  };
  const addActiveTemplateTarget = (node) => {
    const template = [
      node.head.text,
      ...node.templateSpans.flatMap((span, index) => [
        `__SOCIETYOS_ARG_${index}__`,
        span.literal.text,
      ]),
    ].join('');
    if (!/[A-Za-z\u0900-\u097F]/.test(
      template.replace(/__SOCIETYOS_ARG_\d+__/g, ''),
    )) return;
    const key = messageKey(template, keysByValue, valuesByKey);
    targets.set(targetId(node), {
      active: true,
      key,
      templateExpressions: node.templateSpans.map((span) => span.expression),
    });
  };
  const collectActiveExpression = (expression) => {
    if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
      addActiveTarget(expression, expression.text);
      return;
    }
    if (ts.isTemplateExpression(expression)) {
      addActiveTemplateTarget(expression);
      expression.templateSpans.forEach((span) => collectActiveExpression(span.expression));
      return;
    }
    if (ts.isConditionalExpression(expression)) {
      collectActiveExpression(expression.whenTrue);
      collectActiveExpression(expression.whenFalse);
      return;
    }
    if (
      ts.isBinaryExpression(expression)
      && [
        ts.SyntaxKind.BarBarToken,
        ts.SyntaxKind.PlusToken,
        ts.SyntaxKind.QuestionQuestionToken,
      ].includes(expression.operatorToken.kind)
    ) {
      collectActiveExpression(expression.left);
      collectActiveExpression(expression.right);
      return;
    }
    if (
      ts.isAsExpression(expression)
      || ts.isNonNullExpression(expression)
      || ts.isParenthesizedExpression(expression)
    ) {
      collectActiveExpression(expression.expression);
    }
  };
  const isGenericVisibleSentence = (node) => {
    if (!ts.isStringLiteral(node) && !ts.isNoSubstitutionTemplateLiteral(node)) return false;
    const value = node.text.replace(/\s+/g, ' ').trim();
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
  };
  const addGenericActiveTarget = (node) => {
    if (targets.has(targetId(node)) || !isGenericVisibleSentence(node)) return;
    addActiveTarget(node, node.text);
    const component = owningComponent(node);
    if (component) {
      moduleComponentPositions.add(component.pos);
    } else {
      moduleLocalizationRequired = true;
    }
  };
  const visit = (node) => {
    if (
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
      const component = owningComponent(node);
      if (component) {
        collectDisplayExpression(node.initializer);
      } else {
        const targetCount = targets.size;
        collectActiveExpression(node.initializer);
        if (targets.size > targetCount) {
          moduleLocalizationRequired = true;
          targets.set(targetId(node), { activeProperty: true });
        }
      }
    } else if (
      ts.isCallExpression(node)
      && ts.isPropertyAccessExpression(node.expression)
      && (node.expression.name.text === 'alert' || node.expression.name.text === 'prompt')
      && ts.isIdentifier(node.expression.expression)
      && (node.expression.expression.text === 'Alert' || node.expression.expression.text === 'AppAlert')
    ) {
      node.arguments.slice(0, 2).forEach(collectDisplayExpression);
    } else if (
      ts.isCallExpression(node)
      && ts.isIdentifier(node.expression)
      && ['renderFlagItem', 'renderOwnerCard', 'renderSectionList'].includes(node.expression.text)
    ) {
      const visibleArgumentIndexes = {
        renderFlagItem: [1, 2],
        renderOwnerCard: [1],
        renderSectionList: [0],
      };
      visibleArgumentIndexes[node.expression.text].forEach((argumentIndex) => {
        const argument = node.arguments[argumentIndex];
        if (argument) collectDisplayExpression(argument);
      });
    } else if (
      ts.isCallExpression(node)
      && ts.isPropertyAccessExpression(node.expression)
      && node.expression.name.text === 'required'
    ) {
      node.arguments.forEach(collectDisplayExpression);
    }
    if (ts.isJsxText(node)) {
      addTarget(node, node.text, true);
    } else if (
      ts.isJsxExpression(node)
      && !ts.isJsxAttribute(node.parent)
      && node.expression
    ) {
      collectDisplayExpression(node.expression);
    } else if (
      ts.isJsxAttribute(node)
      && ts.isIdentifier(node.name)
      && visibleAttributes.has(node.name.text)
      && node.initializer
    ) {
      if (ts.isStringLiteral(node.initializer)) {
        addTarget(node, node.initializer.text);
      } else if (
        ts.isJsxExpression(node.initializer)
        && node.initializer.expression
      ) {
        collectDisplayExpression(node.initializer.expression);
      }
    }
    addGenericActiveTarget(node);
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  if (moduleLocalizationRequired) {
    const collectComponents = (node) => {
      if (
        (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node))
        && /^[A-Z]/.test(functionName(node))
        && node.body
      ) {
        moduleComponentPositions.add(node.pos);
      }
      ts.forEachChild(node, collectComponents);
    };
    collectComponents(sourceFile);
  }
  return { targets, componentPositions, moduleComponentPositions, moduleLocalizationRequired };
}

function localizedTextExpression(key) {
  return ts.factory.createCallExpression(
    ts.factory.createIdentifier('String'),
    undefined,
    [ts.factory.createPropertyAccessExpression(
      ts.factory.createIdentifier('localizedUiText'),
      ts.factory.createIdentifier(key),
    )],
  );
}

function activeLocalizedTextExpression(key) {
  return ts.factory.createCallExpression(
    ts.factory.createIdentifier('getActiveUiLiteral'),
    undefined,
    [ts.factory.createStringLiteral(key)],
  );
}

function jsxTextExpression(target) {
  let expression = localizedTextExpression(target.key);
  if (!target.rawValue.includes('\n') && /^\s/.test(target.rawValue)) {
    expression = ts.factory.createBinaryExpression(
      ts.factory.createStringLiteral(' '),
      ts.SyntaxKind.PlusToken,
      expression,
    );
  }
  if (!target.rawValue.includes('\n') && /\s$/.test(target.rawValue)) {
    expression = ts.factory.createBinaryExpression(
      expression,
      ts.SyntaxKind.PlusToken,
      ts.factory.createStringLiteral(' '),
    );
  }
  return ts.factory.createJsxExpression(undefined, expression);
}

function hookDeclaration(hookIdentifier) {
  return ts.factory.createVariableStatement(
    undefined,
    ts.factory.createVariableDeclarationList([
      ts.factory.createVariableDeclaration(
        'localizedUiText',
        undefined,
        undefined,
        ts.factory.createPropertyAccessExpression(
          ts.factory.createCallExpression(ts.factory.createIdentifier(hookIdentifier), undefined, []),
          ts.factory.createIdentifier('uiLiterals'),
        ),
      ),
    ], ts.NodeFlags.Const),
  );
}

function withHook(node, visitedBody, visitedParameters, hookIdentifier, subscriptionOnly) {
  const declaration = hookDeclaration(hookIdentifier);
  const hasLocalizedUiText = ts.isBlock(visitedBody) && visitedBody.statements.some((statement) => (
    ts.isVariableStatement(statement)
    && statement.declarationList.declarations.some((item) => (
      ts.isIdentifier(item.name) && item.name.text === 'localizedUiText'
    ))
  ));
  let body = hasLocalizedUiText
    ? visitedBody
    : ts.isBlock(visitedBody)
      ? ts.factory.updateBlock(visitedBody, [declaration, ...visitedBody.statements])
      : ts.factory.createBlock([declaration, ts.factory.createReturnStatement(visitedBody)], true);
  if (subscriptionOnly && !hasLocalizedUiText && ts.isBlock(body)) {
    body = ts.factory.updateBlock(body, [
      ...body.statements.slice(0, 1),
      ts.factory.createExpressionStatement(
        ts.factory.createVoidExpression(ts.factory.createIdentifier('localizedUiText')),
      ),
      ...body.statements.slice(1),
    ]);
  }
  if (ts.isFunctionDeclaration(node)) {
    return ts.factory.updateFunctionDeclaration(
      node,
      node.modifiers,
      node.asteriskToken,
      node.name,
      node.typeParameters,
      visitedParameters,
      node.type,
      body,
    );
  }
  if (ts.isFunctionExpression(node)) {
    return ts.factory.updateFunctionExpression(
      node,
      node.modifiers,
      node.asteriskToken,
      node.name,
      node.typeParameters,
      visitedParameters,
      node.type,
      body,
    );
  }
  if (ts.isArrowFunction(node)) {
    return ts.factory.updateArrowFunction(
      node,
      node.modifiers,
      node.typeParameters,
      visitedParameters,
      node.type,
      node.equalsGreaterThanToken,
      body,
    );
  }
  return node;
}

function existingMessagesHook(sourceFile) {
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || !statement.importClause) continue;
    const clause = statement.importClause;
    if (clause.name?.text === 'useMessages') return clause.name.text;
    const bindings = clause.namedBindings;
    if (!bindings || !ts.isNamedImports(bindings)) continue;
    for (const element of bindings.elements) {
      const importedName = element.propertyName?.text ?? element.name.text;
      if (importedName === 'useMessages') return element.name.text;
    }
  }
  return undefined;
}

function transformSource(
  sourceFile,
  targets,
  componentPositions,
  moduleComponentPositions,
  moduleLocalizationRequired,
) {
  const existingHook = existingMessagesHook(sourceFile);
  const hookIdentifier = existingHook ?? 'useGeneratedUiMessages';
  const transformed = ts.transform(sourceFile, [
    (context) => {
      const subtreeHasTarget = (node) => {
        if (targets.has(targetId(node))) return true;
        let found = false;
        ts.forEachChild(node, (child) => {
          if (!found && subtreeHasTarget(child)) found = true;
        });
        return found;
      };
      const visit = (node) => {
        const target = targets.get(targetId(node));
        if (target) {
          if (ts.isPropertyAssignment(node) && target.activeProperty) {
            return context.factory.createGetAccessorDeclaration(
              undefined,
              node.name,
              [],
              undefined,
              context.factory.createBlock([
                context.factory.createReturnStatement(ts.visitNode(node.initializer, visit)),
              ], true),
            );
          }
          if (ts.isJsxText(node)) return jsxTextExpression(target);
          if (ts.isTemplateExpression(node) && target.templateExpressions) {
            return context.factory.createCallExpression(
              context.factory.createIdentifier('formatUiLiteral'),
              undefined,
              [
                target.active
                  ? activeLocalizedTextExpression(target.key)
                  : localizedTextExpression(target.key),
                context.factory.createArrayLiteralExpression(
                  target.templateExpressions.map((expression) => ts.visitNode(expression, visit)),
                ),
              ],
            );
          }
          if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
            return target.active
              ? activeLocalizedTextExpression(target.key)
              : localizedTextExpression(target.key);
          }
          if (ts.isJsxExpression(node)) {
            return context.factory.updateJsxExpression(node, node.dotDotDotToken, localizedTextExpression(target.key));
          }
          if (ts.isJsxAttribute(node)) {
            return context.factory.updateJsxAttribute(
              node,
              node.name,
              context.factory.createJsxExpression(undefined, localizedTextExpression(target.key)),
            );
          }
        }
        if (
          (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node))
          && (componentPositions.has(node.pos) || moduleComponentPositions.has(node.pos))
          && node.body
        ) {
          const visitedBody = ts.visitNode(node.body, visit);
          const visitedParameters = node.parameters.map((parameter) => ts.visitNode(parameter, visit));
          return withHook(
            node,
            visitedBody,
            visitedParameters,
            hookIdentifier,
            moduleComponentPositions.has(node.pos) && !componentPositions.has(node.pos),
          );
        }
        if (
          ts.isCallExpression(node)
          && node.arguments[0]
          && node.arguments[1]
          && ts.isArrayLiteralExpression(node.arguments[1])
          && subtreeHasTarget(node.arguments[0])
          && (
            (ts.isIdentifier(node.expression) && node.expression.text === 'useMemo')
            || (
              ts.isPropertyAccessExpression(node.expression)
              && node.expression.name.text === 'useMemo'
            )
          )
        ) {
          const dependencies = node.arguments[1];
          const hasLocalizationDependency = dependencies.elements.some((element) => (
            ts.isIdentifier(element) && element.text === 'localizedUiText'
          ));
          const visitedArguments = node.arguments.map((argument) => ts.visitNode(argument, visit));
          if (!hasLocalizationDependency) {
            visitedArguments[1] = context.factory.updateArrayLiteralExpression(
              dependencies,
              [...dependencies.elements, context.factory.createIdentifier('localizedUiText')],
            );
          }
          return context.factory.updateCallExpression(
            node,
            node.expression,
            node.typeArguments,
            visitedArguments,
          );
        }
        if (
          moduleLocalizationRequired
          && (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node))
          && ['FlatList', 'SectionList'].includes(node.tagName.getText())
          && !node.attributes.properties.some((property) => (
            ts.isJsxAttribute(property)
            && ts.isIdentifier(property.name)
            && property.name.text === 'extraData'
          ))
        ) {
          return ts.isJsxOpeningElement(node)
            ? context.factory.updateJsxOpeningElement(
              node,
              node.tagName,
              node.typeArguments,
              context.factory.updateJsxAttributes(node.attributes, [
                ...node.attributes.properties,
                context.factory.createJsxAttribute(
                  context.factory.createIdentifier('extraData'),
                  context.factory.createJsxExpression(
                    undefined,
                    context.factory.createIdentifier('localizedUiText'),
                  ),
                ),
              ]),
            )
            : context.factory.updateJsxSelfClosingElement(
              node,
              node.tagName,
              node.typeArguments,
              context.factory.updateJsxAttributes(node.attributes, [
                ...node.attributes.properties,
                context.factory.createJsxAttribute(
                  context.factory.createIdentifier('extraData'),
                  context.factory.createJsxExpression(
                    undefined,
                    context.factory.createIdentifier('localizedUiText'),
                  ),
                ),
              ]),
            );
        }
        return ts.visitEachChild(node, visit, context);
      };
      return (rootNode) => ts.visitNode(rootNode, visit);
    },
  ]).transformed[0];
  const statements = [...transformed.statements];
  const additionalImports = [];
  if (!existingHook) {
    additionalImports.push(ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        false,
        undefined,
        ts.factory.createNamedImports([
          ts.factory.createImportSpecifier(
            false,
            ts.factory.createIdentifier('useMessages'),
            ts.factory.createIdentifier(hookIdentifier),
          ),
        ]),
      ),
      ts.factory.createStringLiteral(
        modulePath(path.dirname(sourceFile.fileName), path.join(sourceRoot, 'messages', 'useMessages.ts')),
      ),
    ));
  }
  const hasTemplateTargets = [...targets.values()].some((target) => target.templateExpressions);
  const hasActiveTargets = [...targets.values()].some((target) => target.active || target.activeProperty);
  const hasFormatterImport = sourceFile.statements.some((statement) => (
    ts.isImportDeclaration(statement)
    && statement.importClause?.namedBindings
    && ts.isNamedImports(statement.importClause.namedBindings)
    && statement.importClause.namedBindings.elements.some((element) => element.name.text === 'formatUiLiteral')
  ));
  if (hasTemplateTargets && !hasFormatterImport) {
    additionalImports.push(ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        false,
        undefined,
        ts.factory.createNamedImports([
          ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier('formatUiLiteral')),
        ]),
      ),
      ts.factory.createStringLiteral(
        modulePath(
          path.dirname(sourceFile.fileName),
          path.join(sourceRoot, 'shared', 'localization', 'formatUiLiteral.ts'),
        ),
      ),
    ));
  }
  const hasActiveLiteralImport = sourceFile.statements.some((statement) => (
    ts.isImportDeclaration(statement)
    && statement.importClause?.namedBindings
    && ts.isNamedImports(statement.importClause.namedBindings)
    && statement.importClause.namedBindings.elements.some((element) => element.name.text === 'getActiveUiLiteral')
  ));
  if (hasActiveTargets && !hasActiveLiteralImport) {
    additionalImports.push(ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        false,
        undefined,
        ts.factory.createNamedImports([
          ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier('getActiveUiLiteral')),
        ]),
      ),
      ts.factory.createStringLiteral(
        modulePath(
          path.dirname(sourceFile.fileName),
          path.join(sourceRoot, 'shared', 'localization', 'activeUiLiteral.ts'),
        ),
      ),
    ));
  }
  if (additionalImports.length === 0) return transformed;
  const lastImportIndex = statements.findLastIndex(ts.isImportDeclaration);
  statements.splice(lastImportIndex + 1, 0, ...additionalImports);
  return ts.factory.updateSourceFile(transformed, statements);
}

function updateEnglishMessagesIndex() {
  const source = fs.readFileSync(englishMessagesIndexPath, 'utf8');
  originals.set(englishMessagesIndexPath, source);
  let updated = source;
  if (!updated.includes("from './uiLiterals.generated'")) {
    updated = `import { uiLiteralMessages } from './uiLiterals.generated';\n${updated}`;
  }
  if (!updated.includes('uiLiterals: uiLiteralMessages')) {
    updated = updated.replace(
      'export const enMessages = {',
      'export const enMessages = {\n    uiLiterals: uiLiteralMessages,',
    );
  }
  fs.writeFileSync(englishMessagesIndexPath, updated);
}

function existingGeneratedMessages() {
  if (!fs.existsSync(generatedMessagesPath)) return new Map();
  const source = fs.readFileSync(generatedMessagesPath, 'utf8');
  const match = source.match(/export const uiLiteralMessages = ([\s\S]+?) as const;/);
  if (!match) throw new Error('Existing generated UI literal resource could not be parsed');
  return new Map(Object.entries(JSON.parse(match[1])));
}

const files = [];
walk(sourceRoot, files);
const keysByValue = new Map();
const valuesByKey = existingGeneratedMessages();
valuesByKey.forEach((value, key) => keysByValue.set(value, key));
const work = [];
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const collected = collectTargets(sourceFile, keysByValue, valuesByKey);
  if (collected.targets.size > 0) {
    work.push({ file, source, ...collected });
  }
}

const sortedMessages = Object.fromEntries(
  [...valuesByKey.entries()].sort(([left], [right]) => left.localeCompare(right)),
);
originals.set(generatedMessagesPath, fs.existsSync(generatedMessagesPath)
  ? fs.readFileSync(generatedMessagesPath, 'utf8')
  : undefined);
fs.writeFileSync(
  generatedMessagesPath,
  `export const uiLiteralMessages = ${JSON.stringify(sortedMessages, null, 2)} as const;\nexport type UiLiteralKey = keyof typeof uiLiteralMessages;\n`,
);
updateEnglishMessagesIndex();

let migratedCount = 0;
for (const item of work) {
  const sourceFile = ts.createSourceFile(item.file, item.source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const transformed = transformSource(
    sourceFile,
    item.targets,
    item.componentPositions,
    item.moduleComponentPositions,
    item.moduleLocalizationRequired,
  );
  originals.set(item.file, item.source);
  fs.writeFileSync(item.file, `${printer.printFile(transformed)}\n`);
  migratedCount += item.targets.size;
}

const validation = spawnSync('npm', ['run', 'typecheck'], {
  cwd: projectRoot,
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
});
if (validation.status !== 0) {
  originals.forEach((source, file) => {
    if (source === undefined) fs.rmSync(file, { force: true });
    else fs.writeFileSync(file, source);
  });
  process.stderr.write(`${validation.stdout}${validation.stderr}`);
  throw new Error('Visible UI literal migration was rolled back because typecheck failed');
}

process.stdout.write(
  `Migrated ${migratedCount} visible UI literals across ${work.length} files into ${valuesByKey.size} shared localization keys.\n`,
);
