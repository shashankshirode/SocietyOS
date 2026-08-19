import fs from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const filename = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(filename), '..');
const outputDirectory = path.join(projectRoot, 'src', 'shared', 'localization', 'resources');
const separator = '__SOCIETYOS_MESSAGE_SEPARATOR_8F7A__';
const require = createRequire(import.meta.url);

const localeConfigurations = [
  {
    languageCode: 'hi',
    fileName: 'hi-IN.generated.ts',
    exportPrefix: 'hi',
    overrides: {
      'settings.language.title': 'भाषा',
      'settings.language.description': 'अपनी पसंदीदा ऐप भाषा चुनें',
      'settings.language.options.english': 'English',
      'settings.language.options.hindi': 'हिन्दी',
      'settings.language.options.marathi': 'मराठी',
      'settings.language.feedback.updatedTitle': 'भाषा बदल दी गई',
      'settings.language.feedback.updatedMessage': 'आपकी भाषा की पसंद सहेज ली गई है।',
      'settings.language.feedback.errorTitle': 'भाषा नहीं बदली जा सकी',
      'settings.language.feedback.errorMessage': 'आपकी भाषा की पसंद सहेजी नहीं जा सकी। कृपया फिर से कोशिश करें।',
    },
  },
  {
    languageCode: 'mr',
    fileName: 'mr-IN.generated.ts',
    exportPrefix: 'mr',
    overrides: {
      'settings.language.title': 'भाषा',
      'settings.language.description': 'तुमच्या पसंतीची अ‍ॅप भाषा निवडा',
      'settings.language.options.english': 'English',
      'settings.language.options.hindi': 'हिन्दी',
      'settings.language.options.marathi': 'मराठी',
      'settings.language.feedback.updatedTitle': 'भाषा बदलली',
      'settings.language.feedback.updatedMessage': 'तुमची भाषेची निवड जतन केली आहे.',
      'settings.language.feedback.errorTitle': 'भाषा बदलता आली नाही',
      'settings.language.feedback.errorMessage': 'तुमची भाषेची निवड जतन करता आली नाही. कृपया पुन्हा प्रयत्न करा.',
    },
  },
];

function compileEnglishMessages() {
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'societyos-localization-'));
  const entryPath = path.join(projectRoot, 'src', 'messages', 'en', 'index.ts');
  const program = ts.createProgram([entryPath], {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.Node10,
    outDir: temporaryDirectory,
    rootDir: projectRoot,
    esModuleInterop: true,
    skipLibCheck: true,
  });
  const emitResult = program.emit();
  const diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
  if (diagnostics.length > 0) {
    const formatted = ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (value) => value,
      getCurrentDirectory: () => projectRoot,
      getNewLine: () => '\n',
    });
    throw new Error(formatted);
  }
  const compiledEntry = path.join(temporaryDirectory, 'src', 'messages', 'en', 'index.js');
  const module = require(compiledEntry);
  fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  return module.enMessages;
}

function collectMessages(root) {
  const strings = [];
  const functions = [];
  const visit = (value, currentPath) => {
    if (typeof value === 'string') {
      strings.push({ path: currentPath, value });
      return;
    }
    if (typeof value === 'function') {
      const args = Array.from(
        { length: value.length },
        (_, index) => `__SOCIETYOS_ARG_${index}__`,
      );
      try {
        functions.push({ path: currentPath, value: value(...args) });
      } catch {
        functions.push({ path: currentPath, value: '' });
      }
      return;
    }
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      visit(child, currentPath.length > 0 ? `${currentPath}.${key}` : key);
    }
  };
  visit(root, '');
  return { strings, functions };
}

function shouldTranslate(value) {
  if (!/[A-Za-z]/.test(value)) return false;
  if (/^(?:https?:\/\/|mailto:|tel:)/i.test(value)) return false;
  if (/^[A-Z0-9_.:/-]+$/.test(value)) return false;
  if (/^[a-z][A-Za-z0-9_.:/-]*$/.test(value) && !value.includes(' ')) return false;
  return true;
}

function protectValue(value) {
  const protectedValues = [];
  const protectedText = value.replace(
    /SocietyOS|https?:\/\/\S+|\{[^}]+\}|__[A-Z0-9_]+__/g,
    (match) => {
      const token = `__SOCIETYOS_PROTECTED_${protectedValues.length}__`;
      protectedValues.push(match);
      return token;
    },
  );
  return { protectedText, protectedValues };
}

function restoreValue(value, protectedValues) {
  return protectedValues.reduce(
    (result, protectedValue, index) => result.replaceAll(
      `__SOCIETYOS_PROTECTED_${index}__`,
      protectedValue,
    ),
    value,
  );
}

function createBatches(entries) {
  const batches = [];
  let currentBatch = [];
  let currentLength = 0;
  for (const entry of entries) {
    const nextLength = currentLength + entry.protectedText.length + separator.length + 2;
    if (currentBatch.length >= 30 || (currentBatch.length > 0 && nextLength > 3200)) {
      batches.push(currentBatch);
      currentBatch = [];
      currentLength = 0;
    }
    currentBatch.push(entry);
    currentLength += entry.protectedText.length + separator.length + 2;
  }
  if (currentBatch.length > 0) batches.push(currentBatch);
  return batches;
}

async function requestTranslation(text, languageCode) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', languageCode);
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', text);
  let lastError = new Error('Translation request failed');
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Translation request returned ${response.status}`);
      const payload = await response.json();
      return payload[0].map((segment) => segment[0]).join('');
    } catch (error) {
      lastError = error instanceof Error ? error : lastError;
      await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
    }
  }
  throw lastError;
}

async function translateBatch(batch, languageCode) {
  const joined = batch.map((entry) => entry.protectedText).join(`\n${separator}\n`);
  const translated = await requestTranslation(joined, languageCode);
  const values = translated.split(`\n${separator}\n`);
  if (values.length === batch.length) return values;
  return Promise.all(batch.map((entry) => requestTranslation(entry.protectedText, languageCode)));
}

async function translateUniqueValues(values, languageCode) {
  const uniqueValues = [...new Set(values)];
  const translations = new Map();
  const translatableEntries = uniqueValues
    .filter(shouldTranslate)
    .map((value) => ({ value, ...protectValue(value) }));
  for (const value of uniqueValues.filter((entry) => !shouldTranslate(entry))) {
    translations.set(value, value);
  }
  const batches = createBatches(translatableEntries);
  let nextBatchIndex = 0;
  const workers = Array.from({ length: Math.min(4, batches.length) }, async () => {
    while (nextBatchIndex < batches.length) {
      const batchIndex = nextBatchIndex;
      nextBatchIndex += 1;
      const batch = batches[batchIndex];
      const translatedValues = await translateBatch(batch, languageCode);
      batch.forEach((entry, index) => {
        translations.set(
          entry.value,
          restoreValue(translatedValues[index] ?? entry.protectedText, entry.protectedValues).trim(),
        );
      });
    }
  });
  await Promise.all(workers);
  return translations;
}

function serializeExport(exportName, values) {
  const sortedValues = Object.fromEntries(
    Object.entries(values).sort(([left], [right]) => left.localeCompare(right)),
  );
  return `export const ${exportName} = ${JSON.stringify(sortedValues, null, 2)} as const;\n`;
}

async function generateLocale(configuration, collectedMessages) {
  const allValues = [
    ...collectedMessages.strings.map((entry) => entry.value),
    ...collectedMessages.functions.map((entry) => entry.value),
  ];
  const translations = await translateUniqueValues(allValues, configuration.languageCode);
  const stringTranslations = Object.fromEntries(
    collectedMessages.strings.map((entry) => [
      entry.path,
      configuration.overrides[entry.path] ?? translations.get(entry.value) ?? entry.value,
    ]),
  );
  const functionTranslations = Object.fromEntries(
    collectedMessages.functions.map((entry) => [
      entry.path,
      translations.get(entry.value) ?? entry.value,
    ]),
  );
  const source = [
    serializeExport(`${configuration.exportPrefix}StringTranslations`, stringTranslations),
    serializeExport(`${configuration.exportPrefix}FunctionTranslations`, functionTranslations),
  ].join('\n');
  fs.writeFileSync(path.join(outputDirectory, configuration.fileName), source);
}

fs.mkdirSync(outputDirectory, { recursive: true });
const englishMessages = compileEnglishMessages();
const collectedMessages = collectMessages(englishMessages);
for (const configuration of localeConfigurations) {
  await generateLocale(configuration, collectedMessages);
}
process.stdout.write(
  `Generated ${collectedMessages.strings.length} string paths and ${collectedMessages.functions.length} function paths for Hindi and Marathi.\n`,
);
