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

function stripComments(sourceText, fileName) {
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.Standard, sourceText);
  const tokens = [];
  while (true) {
    const token = scanner.scan();
    if (token === ts.SyntaxKind.EndOfFileToken) break;
    tokens.push({
      token,
      text: scanner.getTokenText(),
      pos: scanner.getTokenPos(),
    });
  }

  let result = '';
  for (let i = 0; i < tokens.length; i++) {
    const curr = tokens[i];
    
    if (curr.token === ts.SyntaxKind.OpenBraceToken) {
      let j = i + 1;
      let onlyCommentsAndTrivia = false;
      let hasComment = false;
      while (j < tokens.length) {
        const tok = tokens[j].token;
        if (tok === ts.SyntaxKind.WhitespaceTrivia || tok === ts.SyntaxKind.NewLineTrivia) {
          j++;
        } else if (tok === ts.SyntaxKind.MultiLineCommentTrivia || tok === ts.SyntaxKind.SingleLineCommentTrivia) {
          hasComment = true;
          j++;
        } else if (tok === ts.SyntaxKind.CloseBraceToken) {
          if (hasComment) {
            onlyCommentsAndTrivia = true;
          }
          break;
        } else {
          break;
        }
      }
      if (onlyCommentsAndTrivia) {
        i = j;
        continue;
      }
    }
    
    if (curr.token === ts.SyntaxKind.SingleLineCommentTrivia || curr.token === ts.SyntaxKind.MultiLineCommentTrivia) {
      continue;
    }
    
    result += curr.text;
  }
  
  return result;
}

function cleanTypes(sourceText) {
  let text = sourceText;
  
  text = text.replace(/\b(iconName|icon|name|glyph|iconLeft|iconRight)\s+as\s+any\b/g, '$1 as keyof typeof Ionicons.glyphMap');
  
  text = text.replace(/\bas\s+unknown\s+as\s+/g, 'as ');
  text = text.replace(/\bas\s+any\s+as\s+/g, 'as ');
  
  text = text.replace(/\bas\s+any\[\]\b/g, 'as JsonObject[]');
  text = text.replace(/\bas\s+unknown\[\]\b/g, 'as JsonObject[]');
  text = text.replace(/\bas\s+any\b/g, 'as JsonObject');
  text = text.replace(/\bas\s+unknown\b/g, 'as JsonObject');
  
  text = text.replace(/:\s*any\[\]\b/g, ': JsonValue[]');
  text = text.replace(/:\s*unknown\[\]\b/g, ': JsonValue[]');
  text = text.replace(/:\s*any\b/g, ': JsonValue');
  text = text.replace(/:\s*unknown\b/g, ': JsonValue');
  
  text = text.replace(/\bRecord<\s*string\s*,\s*any\s*>/g, 'JsonObject');
  text = text.replace(/\bRecord<\s*string\s*,\s*unknown\s*>/g, 'JsonObject');
  text = text.replace(/\bPromise<\s*any\s*>/g, 'Promise<JsonValue>');
  text = text.replace(/\bPromise<\s*unknown\s*>/g, 'Promise<JsonValue>');
  
  text = text.replace(/\buseRef<\s*any\s*>/g, 'useRef<JsonObject>');
  text = text.replace(/\buseRef<\s*unknown\s*>/g, 'useRef<JsonObject>');
  text = text.replace(/\buseState<\s*any\s*>/g, 'useState<JsonObject>');
  text = text.replace(/\buseState<\s*unknown\s*>/g, 'useState<JsonObject>');

  text = text.replace(/<\s*(any|unknown)\s*\|\s*null\s*>/g, '<JsonObject | null>');
  text = text.replace(/<\s*(any|unknown)\s*\[\s*\]\s*>/g, '<JsonObject[]>');
  text = text.replace(/<\s*(any|unknown)\s*>/g, '<JsonObject>');
  text = text.replace(/<\s*(any|unknown)\s*,/g, '<JsonObject,');
  text = text.replace(/,\s*(any|unknown)\s*>/g, ', JsonValue>');
  text = text.replace(/,\s*(any|unknown)\s*,/g, ', JsonValue,');
  
  return text;
}

const files = getSourceFiles(srcDir);
console.log(`Auditing and cleaning ${files.length} files...`);

let modifiedCount = 0;
for (const filePath of files) {
  const original = fs.readFileSync(filePath, 'utf8');
  
  let cleaned = stripComments(original, filePath);
  cleaned = cleanTypes(cleaned);
  
  if (cleaned !== original) {
    fs.writeFileSync(filePath, cleaned, 'utf8');
    modifiedCount++;
  }
}

console.log(`Rebuild cleaner completed. Modified ${modifiedCount} files.`);
