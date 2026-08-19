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
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
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
  const commentRanges = new Map();

  function addRanges(ranges) {
    for (const range of ranges ?? []) {
      commentRanges.set(range.pos, range);
    }
  }

  function visit(node) {
    addRanges(ts.getLeadingCommentRanges(sourceText, node.getFullStart()));
    addRanges(ts.getTrailingCommentRanges(sourceText, node.end));
    ts.forEachChild(node, visit);
  }

  addRanges(ts.getLeadingCommentRanges(sourceText, 0));
  visit(sourceFile);

  const violations = [...commentRanges.values()].map((range) => ({
    line: sourceFile.getLineAndCharacterOfPosition(range.pos).line + 1,
    text: sourceText.slice(range.pos, range.end).trim(),
  }));
  
  if (violations.length > 0) {
    console.error(`Comments found in ${path.relative(projectRoot, filePath)}:`);
    for (const v of violations) {
      console.error(`  Line ${v.line}: "${v.text}"`);
    }
    hasViolations = true;
  }
}

if (hasViolations) {
  process.exit(1);
} else {
  console.log('All checked source files are clean of comments (0 comments).');
  process.exit(0);
}
