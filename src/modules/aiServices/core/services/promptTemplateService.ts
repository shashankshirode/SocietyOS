import { AiPromptTemplate, CreateAiPromptTemplateCommand } from '../types';

const templates: Map<string, AiPromptTemplate> = new Map();
const templateVersions: Map<string, AiPromptTemplate[]> = new Map();

function generateId(): string {
  return `tmpl_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function getNow(): string {
  return new Date().toISOString();
}

export const promptTemplateService = {
  createTemplate(command: CreateAiPromptTemplateCommand): AiPromptTemplate {
    const template: AiPromptTemplate = {
      id: generateId(),
      capability: command.capability,
      version: 1,
      name: command.name,
      description: command.description,
      systemPrompt: command.systemPrompt,
      userPromptTemplate: command.userPromptTemplate,
      outputSchema: command.outputSchema,
      requiredInputFields: command.requiredInputFields,
      optionalInputFields: command.optionalInputFields,
      modelId: command.modelId,
      effectiveFrom: command.effectiveFrom,
      effectiveTo: command.effectiveTo,
      createdBy: 'SYSTEM',
      createdAt: getNow(),
    };
    templates.set(template.id, template);

    if (!templateVersions.has(template.capability)) {
      templateVersions.set(template.capability, []);
    }
    templateVersions.get(template.capability)!.push(template);

    return template;
  },

  createVersion(
    templateId: string,
    updates: Partial<Pick<AiPromptTemplate, 'systemPrompt' | 'userPromptTemplate' | 'outputSchema' | 'requiredInputFields' | 'optionalInputFields' | 'modelId' | 'effectiveFrom' | 'effectiveTo'>>,
    createdBy: string
  ): AiPromptTemplate {
    const existing = templates.get(templateId);
    if (!existing) throw new Error('TEMPLATE_NOT_FOUND');

    const newVersion: AiPromptTemplate = {
      ...existing,
      id: generateId(),
      version: existing.version + 1,
      ...updates,
      createdBy,
      createdAt: getNow(),
    };
    templates.set(newVersion.id, newVersion);

    const versions = templateVersions.get(newVersion.capability) || [];
    versions.push(newVersion);
    templateVersions.set(newVersion.capability, versions);

    return newVersion;
  },

  getTemplate(templateId: string): AiPromptTemplate | undefined {
    return templates.get(templateId);
  },

  getTemplatesForCapability(capability: string): AiPromptTemplate[] {
    return templateVersions.get(capability) || [];
  },

  getActiveTemplateForCapability(capability: string, modelId?: string): AiPromptTemplate | undefined {
    const now = new Date().toISOString();
    const capabilityTemplates = templateVersions.get(capability) || [];
    return capabilityTemplates
      .filter(t => new Date(t.effectiveFrom) <= new Date() && (!t.effectiveTo || new Date(t.effectiveTo) >= new Date()))
      .filter(t => !modelId || t.modelId === modelId)
      .sort((a, b) => b.version - a.version)[0];
  },

  validateTemplate(template: AiPromptTemplate): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!template.systemPrompt || template.systemPrompt.trim().length === 0) {
      errors.push('System prompt is required');
    }

    if (!template.userPromptTemplate || template.userPromptTemplate.trim().length === 0) {
      errors.push('User prompt template is required');
    }

    if (!template.outputSchema || typeof template.outputSchema !== 'object') {
      errors.push('Output schema is required');
    }

    if (!template.requiredInputFields || !Array.isArray(template.requiredInputFields)) {
      errors.push('Required input fields must be an array');
    }

    if (!template.modelId) {
      errors.push('Model ID is required');
    }

    if (template.capability === 'COMPLAINT_CLASSIFICATION') {
      if (!template.outputSchema.properties?.classifications) {
        errors.push('Complaint classification template must have classifications in output schema');
      }
    }

    if (template.capability === 'NOTICE_DRAFTING') {
      if (!template.outputSchema.properties?.content) {
        errors.push('Notice drafting template must have content in output schema');
      }
    }

    return { valid: errors.length === 0, errors };
  },

  renderTemplate(template: AiPromptTemplate, input: Record<string, unknown>): {
    systemPrompt: string;
    userPrompt: string;
  } {
    let userPrompt = template.userPromptTemplate;

    for (const [key, value] of Object.entries(input)) {
      const placeholder = `{{${key}}}`;
      userPrompt = userPrompt.replace(new RegExp(placeholder, 'g'), String(value));
    }

    for (const field of template.requiredInputFields) {
      if (!(field in input)) {
        const placeholder = `{{${field}}}`;
        userPrompt = userPrompt.replace(new RegExp(placeholder, 'g'), `[MISSING: ${field}]`);
      }
    }

    return {
      systemPrompt: template.systemPrompt,
      userPrompt,
    };
  },

  getAllTemplates(): AiPromptTemplate[] {
    return Array.from(templates.values());
  },

  deleteTemplate(templateId: string): boolean {
    const template = templates.get(templateId);
    if (!template) return false;

    templates.delete(templateId);
    const versions = templateVersions.get(template.capability) || [];
    const filtered = versions.filter(t => t.id !== templateId);
    templateVersions.set(template.capability, filtered);
    return true;
  },
};