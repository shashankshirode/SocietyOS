import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { residentCapabilityRegistry } from '../configuration/residentCapabilityRegistry';
import { residentNavigatorReleasePolicies, residentScenarioEvidence, resolveResidentNavigatorCapability, } from '../configuration/residentRouteReleaseMatrix';
import type { ResidentRouteReleaseRecord } from '../models/ResidentRouteRelease';
import { residentRequiredScenarioMatrix } from '../models/ResidentScenario';
import { getRequiredItem } from "../../../shared/utils/requiredItem";
import type { Absent } from "../../../shared/types/absence.types";
const workspaceRoot = process.cwd();
function attributeText(element: ts.JsxSelfClosingElement, attributeName: string): string | Absent {
    const attribute = element.attributes.properties.find((property): property is ts.JsxAttribute => ts.isJsxAttribute(property) && property.name.getText() === attributeName);
    if (!attribute?.initializer)
        return undefined;
    if (ts.isStringLiteral(attribute.initializer))
        return attribute.initializer.text;
    if (ts.isJsxExpression(attribute.initializer) && attribute.initializer.expression) {
        return attribute.initializer.expression.getText();
    }
    return undefined;
}
function collectBindings(sourceFile: ts.SourceFile): {
    bindings: Set<string>;
    imports: Map<string, string>;
} {
    const bindings = new Set<string>();
    const imports = new Map<string, string>();
    sourceFile.statements.forEach((statement) => {
        if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
            const moduleName = statement.moduleSpecifier.text;
            const importClause = statement.importClause;
            if (importClause?.name) {
                bindings.add(importClause.name.text);
                imports.set(importClause.name.text, moduleName);
            }
            const namedBindings = importClause?.namedBindings;
            if (namedBindings && ts.isNamedImports(namedBindings)) {
                namedBindings.elements.forEach((element) => {
                    bindings.add(element.name.text);
                    imports.set(element.name.text, moduleName);
                });
            }
            if (namedBindings && ts.isNamespaceImport(namedBindings)) {
                bindings.add(namedBindings.name.text);
                imports.set(namedBindings.name.text, moduleName);
            }
        }
        if (ts.isFunctionDeclaration(statement) && statement.name)
            bindings.add(statement.name.text);
        if (ts.isVariableStatement(statement)) {
            statement.declarationList.declarations.forEach((declaration) => {
                if (ts.isIdentifier(declaration.name))
                    bindings.add(declaration.name.text);
            });
        }
    });
    return { bindings, imports };
}
function relativeModuleExists(sourcePath: string, moduleName: string): boolean {
    if (!moduleName.startsWith('.'))
        return true;
    const base = path.resolve(path.dirname(sourcePath), moduleName);
    return [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')]
        .some((candidate) => fs.existsSync(candidate));
}
function readRouteRecords(): ResidentRouteReleaseRecord[] {
    const records: ResidentRouteReleaseRecord[] = [];
    residentNavigatorReleasePolicies.forEach((policy) => {
        const absolutePath = path.join(workspaceRoot, policy.file);
        const sourceText = fs.readFileSync(absolutePath, 'utf8');
        const sourceFile = ts.createSourceFile(absolutePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
        const { bindings, imports } = collectBindings(sourceFile);
        function visit(node: ts.Node): void {
            if (ts.isJsxSelfClosingElement(node) && node.tagName.getText().endsWith('.Screen')) {
                const navigatorTag = getRequiredItem(node.tagName.getText().split('.'), 0, "residentRouteReleaseCoverage.test.ts");
                const routeName = attributeText(node, 'name');
                const componentName = attributeText(node, 'component');
                expect(routeName).toBeDefined();
                expect(componentName).toBeDefined();
                if (!routeName || !componentName)
                    return;
                expect(bindings.has(componentName)).toBe(true);
                const importedFrom = imports.get(componentName);
                if (importedFrom)
                    expect(relativeModuleExists(absolutePath, importedFrom)).toBe(true);
                records.push({
                    navigatorFile: policy.file,
                    navigatorTag,
                    routeName,
                    componentName,
                    capabilityId: resolveResidentNavigatorCapability(policy.file, navigatorTag, routeName, policy.defaultCapability),
                    scenarios: residentRequiredScenarioMatrix,
                });
            }
            ts.forEachChild(node, visit);
        }
        visit(sourceFile);
    });
    return records;
}
function sourceFilesWithin(directory: string): string[] {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory())
            return sourceFilesWithin(entryPath);
        return /\.(ts|tsx)$/.test(entry.name) ? [entryPath] : [];
    });
}
describe('resident route release coverage', () => {
    const records = readRouteRecords();
    it('audits every registered resident route exactly once within its navigator', () => {
        expect(records.length).toBeGreaterThan(0);
        const qualifiedNames = records.map((record) => `${record.navigatorFile}:${record.navigatorTag}:${record.routeName}`);
        expect(new Set(qualifiedNames).size).toBe(qualifiedNames.length);
    });
    it('binds every route to a registered capability and the complete release matrix', () => {
        const capabilityIds = new Set(residentCapabilityRegistry.map((capability) => capability.id));
        records.forEach((record) => {
            expect(capabilityIds.has(record.capabilityId)).toBe(true);
            expect(record.scenarios).toEqual(residentRequiredScenarioMatrix);
        });
    });
    it('keeps executable evidence for all release dimensions', () => {
        residentRequiredScenarioMatrix.forEach((scenario) => {
            const evidence = residentScenarioEvidence[scenario];
            expect(evidence.length).toBeGreaterThan(0);
            evidence.forEach((file) => expect(fs.existsSync(path.join(workspaceRoot, file))).toBe(true));
        });
    });
    it('keeps resident source compatible with scalable text and release-safe diagnostics', () => {
        const files = [
            ...sourceFilesWithin(path.join(workspaceRoot, 'src/modules/resident')),
            ...sourceFilesWithin(path.join(workspaceRoot, 'src/features/residentCapabilities')),
        ];
        const violations = files.flatMap((file) => {
            const source = fs.readFileSync(file, 'utf8');
            return /allowFontScaling=\{false\}|console\.(log|warn|error)|\bTODO\b|\bFIXME\b/.test(source)
                ? [path.relative(workspaceRoot, file)]
                : [];
        });
        expect(violations).toEqual([]);
    });
});

