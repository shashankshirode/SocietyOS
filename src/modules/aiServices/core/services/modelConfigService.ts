import { AiModelConfig, CreateAiModelCommand } from '../types';

const models: Map<string, AiModelConfig> = new Map();
const modelVersions: Map<string, AiModelConfig[]> = new Map();

function generateId(): string {
  return `model_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function getNow(): string {
  return new Date().toISOString();
}

export const modelConfigService = {
  createModel(command: CreateAiModelCommand): AiModelConfig {
    const model: AiModelConfig = {
      id: generateId(),
      providerId: command.providerId,
      name: command.name,
      version: command.version,
      type: command.type,
      capabilities: command.capabilities,
      confidenceThreshold: command.confidenceThreshold,
      maxTokens: command.maxTokens,
      temperature: command.temperature,
      topP: command.topP,
      systemPromptTemplateId: command.systemPromptTemplateId,
      enabled: true,
      effectiveFrom: command.effectiveFrom,
      effectiveTo: command.effectiveTo,
      metadata: command.metadata,
      createdAt: getNow(),
      updatedAt: getNow(),
    };
    models.set(model.id, model);

    if (!modelVersions.has(model.providerId)) {
      modelVersions.set(model.providerId, []);
    }
    modelVersions.get(model.providerId)!.push(model);

    return model;
  },

  createVersion(
    modelId: string,
    updates: Partial<Pick<AiModelConfig, 'name' | 'version' | 'confidenceThreshold' | 'maxTokens' | 'temperature' | 'topP' | 'systemPromptTemplateId' | 'capabilities' | 'enabled' | 'effectiveFrom' | 'effectiveTo' | 'metadata'>>,
    updatedBy: string
  ): AiModelConfig {
    const existing = models.get(modelId);
    if (!existing) throw new Error('MODEL_NOT_FOUND');

    const newModel: AiModelConfig = {
      ...existing,
      id: generateId(),
      version: `${existing.version}-v${Date.now()}`,
      ...updates,
      updatedAt: getNow(),
    };
    models.set(newModel.id, newModel);

    const versions = modelVersions.get(newModel.providerId) || [];
    versions.push(newModel);
    modelVersions.set(newModel.providerId, versions);

    return newModel;
  },

  getModel(modelId: string): AiModelConfig | undefined {
    return models.get(modelId);
  },

  getModelsForProvider(providerId: string): AiModelConfig[] {
    return modelVersions.get(providerId) || [];
  },

  getActiveModelsForCapability(capability: string): AiModelConfig[] {
    const now = new Date().toISOString();
    return Array.from(models.values()).filter(m =>
      m.enabled &&
      m.capabilities.includes(capability) &&
      new Date(m.effectiveFrom) <= new Date() &&
      (!m.effectiveTo || new Date(m.effectiveTo) >= new Date())
    );
  },

  getBestModelForCapability(capability: string): AiModelConfig | undefined {
    const models = this.getActiveModelsForCapability(capability);
    return models.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  },

  updateModel(modelId: string, updates: Partial<AiModelConfig>): AiModelConfig | null {
    const model = models.get(modelId);
    if (!model) return null;

    const updated = {
      ...model,
      ...updates,
      id: model.id,
      createdAt: model.createdAt,
      updatedAt: getNow(),
    };
    models.set(modelId, updated);
    return updated;
  },

  disableModel(modelId: string): boolean {
    const model = models.get(modelId);
    if (!model) return false;
    model.enabled = false;
    model.updatedAt = getNow();
    return true;
  },

  enableModel(modelId: string): boolean {
    const model = models.get(modelId);
    if (!model) return false;
    model.enabled = true;
    model.updatedAt = getNow();
    return true;
  },

  validateModelConfig(config: Partial<AiModelConfig>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.name || config.name.trim().length === 0) {
      errors.push('Model name is required');
    }

    if (!config.providerId) {
      errors.push('Provider ID is required');
    }

    if (!config.type) {
      errors.push('Model type is required');
    }

    if (config.confidenceThreshold !== undefined) {
      if (config.confidenceThreshold < 0 || config.confidenceThreshold > 1) {
        errors.push('Confidence threshold must be between 0 and 1');
      }
    }

    if (config.maxTokens !== undefined && config.maxTokens <= 0) {
      errors.push('Max tokens must be positive');
    }

    if (config.temperature !== undefined) {
      if (config.temperature < 0 || config.temperature > 2) {
        errors.push('Temperature must be between 0 and 2');
      }
    }

    if (config.topP !== undefined) {
      if (config.topP < 0 || config.topP > 1) {
        errors.push('Top P must be between 0 and 1');
      }
    }

    if (!config.capabilities || !Array.isArray(config.capabilities) || config.capabilities.length === 0) {
      errors.push('At least one capability is required');
    }

    return { valid: errors.length === 0, errors };
  },

  getAllModels(): AiModelConfig[] {
    return Array.from(models.values());
  },

  getModelsByProvider(providerId: string): AiModelConfig[] {
    return Array.from(models.values()).filter(m => m.providerId === providerId);
  },

  getModelVersions(providerId: string): AiModelConfig[] {
    return modelVersions.get(providerId) || [];
  },

  deleteModel(modelId: string): boolean {
    const model = models.get(modelId);
    if (!model) return false;

    models.delete(modelId);
    const versions = modelVersions.get(model.providerId) || [];
    const filtered = versions.filter(m => m.id !== modelId);
    modelVersions.set(model.providerId, filtered);
    return true;
  },
};