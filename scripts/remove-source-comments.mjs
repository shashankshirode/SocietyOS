import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const filename = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(filename), '..');
const sourceRoot = path.join(projectRoot, 'src');
const printer = ts.createPrinter({
  newLine: ts.NewLineKind.LineFeed,
  removeComments: true,
});

function sourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(absolutePath);
    return /\.tsx?$/.test(entry.name) ? [absolutePath] : [];
  });
}

let changedFileCount = 0;
for (const sourcePath of sourceFiles(sourceRoot)) {
  const sourceText = fs.readFileSync(sourcePath, 'utf8');
  const scriptKind = sourcePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(
    sourcePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    scriptKind,
  );
  let hasComments = false;
  const visit = (node) => {
    if (hasComments) return;
    const leading = ts.getLeadingCommentRanges(sourceText, node.getFullStart()) ?? [];
    const trailing = ts.getTrailingCommentRanges(sourceText, node.end) ?? [];
    hasComments = leading.length > 0 || trailing.length > 0;
    if (!hasComments) ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  if (!hasComments) continue;
  const printedSource = `${printer.printFile(sourceFile)}\n`;
  if (printedSource !== sourceText) {
    fs.writeFileSync(sourcePath, printedSource);
    changedFileCount += 1;
  }
}

process.stdout.write(`Removed source comments from ${changedFileCount} files.\n`);
