import type { JsonObject } from '../../core/api/api.types';

export type AIModelType = 'TEXT_CLASSIFIER' | 'IMAGE_CLASSIFIER' | 'MULTIMODAL';

export type ClassificationCategory =
  | 'PLUMBING'
  | 'ELECTRICAL'
  | 'HVAC'
  | 'STRUCTURAL'
  | 'SECURITY'
  | 'HOUSEKEEPING'
  | 'PEST_CONTROL'
  | 'WATER_SUPPLY'
  | 'POWER_BACKUP'
  | 'LIFT'
  | 'FIRE_SAFETY'
  | 'WASTE_MANAGEMENT'
  | 'NOISE'
  | 'PARKING'
  | 'OTHER';

export type AIClassification = {
  category: ClassificationCategory;
  subCategory?: string;
  confidence: number;
  reasoning: string;
  suggestedPriority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL' | 'EMERGENCY';
  suggestedSlaHours: number;
  tags: string[];
};

export type AIAnalysisRequest = {
  complaintId: string;
  text: string;
  mediaUrls?: string[];
  metadata?: JsonObject;
};

export type AIAnalysisResponse = {
  requestId: string;
  complaintId: string;
  modelVersion: string;
  modelType: AIModelType;
  classifications: AIClassification[];
  primaryClassification: AIClassification;
  processingTimeMs: number;
  timestamp: string;
  warnings: string[];
};

export type HumanReview = {
  id: string;
  analysisId: string;
  complaintId: string;
  reviewerId: string;
  reviewedAt: string;
  acceptedClassification: AIClassification | null;
  correctedClassification?: AIClassification;
  correctionReason?: string;
  feedback: 'ACCEPTED' | 'CORRECTED' | 'REJECTED';
  modelVersion: string;
};

export type AIModelConfig = {
  id: string;
  name: string;
  version: string;
  type: AIModelType;
  endpoint: string;
  apiKey?: string;
  confidenceThreshold: number;
  enabled: boolean;
  categories: ClassificationCategory[];
  createdAt: string;
  updatedAt: string;
};

export type AIAnalysisJob = {
  id: string;
  request: AIAnalysisRequest;
  response?: AIAnalysisResponse;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REQUIRES_REVIEW';
  error?: string;
  createdAt: string;
  completedAt?: string;
};

export const DEFAULT_AI_MODELS: AIModelConfig[] = [
  {
    id: 'model-complaint-text-v1',
    name: 'Complaint Text Classifier v1',
    version: '1.0.0',
    type: 'TEXT_CLASSIFIER',
    endpoint: '/api/ai/classify/text',
    confidenceThreshold: 0.7,
    enabled: true,
    categories: [
      'PLUMBING', 'ELECTRICAL', 'HVAC', 'STRUCTURAL', 'SECURITY',
      'HOUSEKEEPING', 'PEST_CONTROL', 'WATER_SUPPLY', 'POWER_BACKUP',
      'LIFT', 'FIRE_SAFETY', 'WASTE_MANAGEMENT', 'NOISE', 'PARKING', 'OTHER'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'model-complaint-multimodal-v1',
    name: 'Complaint Multimodal Classifier v1',
    version: '1.0.0',
    type: 'MULTIMODAL',
    endpoint: '/api/ai/classify/multimodal',
    confidenceThreshold: 0.65,
    enabled: true,
    categories: [
      'PLUMBING', 'ELECTRICAL', 'HVAC', 'STRUCTURAL', 'SECURITY',
      'HOUSEKEEPING', 'PEST_CONTROL', 'WATER_SUPPLY', 'POWER_BACKUP',
      'LIFT', 'FIRE_SAFETY', 'WASTE_MANAGEMENT', 'NOISE', 'PARKING', 'OTHER'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const CATEGORY_KEYWORDS: Record<ClassificationCategory, string[]> = {
  PLUMBING: ['leak', 'pipe', 'water', 'tap', 'faucet', 'drain', 'toilet', 'flush', 'clog', 'blockage', 'sewer', 'drainage'],
  ELECTRICAL: ['power', 'electric', 'light', 'switch', 'socket', 'wire', 'circuit', 'breaker', 'outage', 'voltage', 'spark', 'shock'],
  HVAC: ['ac', 'air condition', 'cooling', 'heating', 'ventilation', 'thermostat', 'compressor', 'refrigerant', 'filter'],
  STRUCTURAL: ['crack', 'wall', 'ceiling', 'floor', 'beam', 'column', 'foundation', 'settlement', 'damp', 'mold', 'water damage'],
  SECURITY: ['theft', 'break', 'intruder', 'unauthorized', 'suspicious', 'trespass', 'vandalism', 'camera', 'alarm', 'gate'],
  HOUSEKEEPING: ['clean', 'dirt', 'garbage', 'trash', 'sweep', 'mop', 'dust', 'lobby', 'corridor', 'common area'],
  PEST_CONTROL: ['rat', 'mouse', 'cockroach', 'ant', 'termite', 'mosquito', 'bedbug', 'pest', 'infestation', 'fumigation'],
  WATER_SUPPLY: ['water supply', 'no water', 'low pressure', 'tank', 'pump', 'municipal', 'borewell', 'shortage'],
  POWER_BACKUP: ['generator', 'dg', 'ups', 'inverter', 'battery', 'backup power', 'load shedding'],
  LIFT: ['lift', 'elevator', 'stuck', 'door', 'floor', 'button', 'alarm', 'maintenance', 'service'],
  FIRE_SAFETY: ['fire', 'smoke', 'extinguisher', 'hydrant', 'sprinkler', 'alarm', 'evacuation', 'drill', 'noc'],
  WASTE_MANAGEMENT: ['garbage', 'waste', 'segregation', 'recycle', 'compost', 'pickup', 'collection', 'bin', 'dump'],
  NOISE: ['noise', 'loud', 'music', 'party', 'construction', 'drilling', 'hammer', 'disturbance'],
  PARKING: ['parking', 'slot', 'vehicle', 'car', 'bike', 'unauthorized', 'blocked', 'rfid', 'sticker'],
  OTHER: [],
};

export const PRIORITY_RULES: Record<ClassificationCategory, 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL' | 'EMERGENCY'> = {
  PLUMBING: 'HIGH',
  ELECTRICAL: 'HIGH',
  HVAC: 'NORMAL',
  STRUCTURAL: 'CRITICAL',
  SECURITY: 'EMERGENCY',
  HOUSEKEEPING: 'LOW',
  PEST_CONTROL: 'NORMAL',
  WATER_SUPPLY: 'CRITICAL',
  POWER_BACKUP: 'HIGH',
  LIFT: 'HIGH',
  FIRE_SAFETY: 'EMERGENCY',
  WASTE_MANAGEMENT: 'NORMAL',
  NOISE: 'LOW',
  PARKING: 'LOW',
  OTHER: 'NORMAL',
};

export const SLA_HOURS: Record<ClassificationCategory, number> = {
  PLUMBING: 4,
  ELECTRICAL: 4,
  HVAC: 24,
  STRUCTURAL: 2,
  SECURITY: 1,
  HOUSEKEEPING: 24,
  PEST_CONTROL: 48,
  WATER_SUPPLY: 2,
  POWER_BACKUP: 4,
  LIFT: 2,
  FIRE_SAFETY: 1,
  WASTE_MANAGEMENT: 24,
  NOISE: 24,
  PARKING: 24,
  OTHER: 24,
};