import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');

const excludedDirs = ['node_modules', 'dist', '.expo', 'build', 'coverage'];

function getSourceFiles(dir) {
  const results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    if (excludedDirs.includes(entry.name)) continue;
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getSourceFiles(absolutePath));
    } else if (/\.tsx?$/.test(entry.name)) {
      results.push(absolutePath);
    }
  }
  return results;
}

const files = getSourceFiles(srcDir);
let hasViolations = false;

for (const filePath of files) {
  const sourceText = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
  
  const violations = [];
  
  function visit(node) {
    if (node.kind === ts.SyntaxKind.AnyKeyword) {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      violations.push({ line: line + 1, col: character + 1, type: 'explicit any', text: 'any' });
    } else if (node.kind === ts.SyntaxKind.UnknownKeyword) {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      violations.push({ line: line + 1, col: character + 1, type: 'explicit unknown', text: 'unknown' });
    } else if (node.kind === ts.SyntaxKind.UndefinedKeyword) {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      violations.push({ line: line + 1, col: character + 1, type: 'explicit undefined type', text: 'undefined' });
    } else if (
      node.kind === ts.SyntaxKind.ObjectKeyword
      && !ts.isTypeParameterDeclaration(node.parent)
    ) {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      violations.push({ line: line + 1, col: character + 1, type: 'generic object type', text: 'object' });
    } else if (
      ts.isTypeReferenceNode(node)
      && ts.isIdentifier(node.typeName)
      && node.typeName.text === 'Function'
    ) {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      violations.push({ line: line + 1, col: character + 1, type: 'generic Function type', text: node.getText() });
    } else if (ts.isTypeLiteralNode(node) && node.members.length === 0) {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      violations.push({ line: line + 1, col: character + 1, type: 'empty object type', text: node.getText() });
    } else if (node.kind === ts.SyntaxKind.AsExpression) {
      const typeNode = node.type;
      const exprNode = node.expression;
      
      if (typeNode.kind === ts.SyntaxKind.AnyKeyword || typeNode.kind === ts.SyntaxKind.UnknownKeyword) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        violations.push({
          line: line + 1,
          col: character + 1,
          type: typeNode.kind === ts.SyntaxKind.AnyKeyword ? 'as any' : 'as unknown',
          text: node.getText(),
        });
      }
      
      if (
        exprNode.kind === ts.SyntaxKind.AsExpression &&
        (exprNode.type.kind === ts.SyntaxKind.AnyKeyword || exprNode.type.kind === ts.SyntaxKind.UnknownKeyword)
      ) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        violations.push({ line: line + 1, col: character + 1, type: 'double assertion', text: node.getText() });
      }
    }
    
    ts.forEachChild(node, visit);
  }
  
  visit(sourceFile);
  
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.Standard, sourceText);
  while (true) {
    const token = scanner.scan();
    if (token === ts.SyntaxKind.EndOfFileToken) break;
    if (token === ts.SyntaxKind.SingleLineCommentTrivia || token === ts.SyntaxKind.MultiLineCommentTrivia) {
      const commentText = scanner.getTokenText();
      if (commentText.includes('@ts-ignore') || commentText.includes('@ts-expect-error') || commentText.includes('eslint-disable')) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(scanner.getTokenPos());
        violations.push({
          line: line + 1,
          col: character + 1,
          type: 'suppression comment',
          text: commentText.trim(),
        });
      }
    }
  }
  
  if (violations.length > 0) {
    console.error(`Violation in ${path.relative(projectRoot, filePath)}:`);
    for (const v of violations) {
      console.error(`  Line ${v.line}, Col ${v.col}: Forbidden ${v.type} ("${v.text}")`);
    }
    hasViolations = true;
  }
}

if (hasViolations) {
  process.exit(1);
} else {
  console.log('All checked files conform to type safety rules (0 violations).');
  process.exit(0);
}
