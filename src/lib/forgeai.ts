export type ProviderId = 'nvidia';
export type Capability = 'image' | 'edit' | 'text' | 'vision' | 'video';

export type ModelDefinition = {
  id: string;
  provider: ProviderId;
  name: string;
  eyebrow: string;
  category: 'Image' | 'Text';
  capabilities: Capability[];
  description: string;
  ratios: string[];
  resolutions: string[];
  supportsReference: boolean;
  steps: { min: number; max: number; default: number };
  cfgScale?: { min: number; max: number; default: number };
  endpoint: string;
  docsUrl: string;
};

export const MODEL_REGISTRY: ModelDefinition[] = [
  {
    id: 'black-forest-labs/flux.2-klein-4b',
    provider: 'nvidia',
    name: 'FLUX.2 klein 4B',
    eyebrow: 'BLACK FOREST LABS',
    category: 'Image',
    capabilities: ['image', 'edit'],
    description: 'Fast distilled image generation and editing with prompt-led controls.',
    ratios: ['1:1', '16:9', '9:16', '4:5', '5:4', '3:2', '2:3'],
    resolutions: ['1024 × 1024', '768 × 1344', '1344 × 768', '1152 × 896', '896 × 1152', '832 × 1216', '1216 × 832'],
    supportsReference: true,
    steps: { min: 1, max: 4, default: 4 },
    cfgScale: { min: 0, max: 0, default: 0 },
    endpoint: 'https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b',
    docsUrl: 'https://docs.api.nvidia.com/nim/reference/black-forest-labs-flux_2-klein-4b-infer',
  },
  {
    id: 'black-forest-labs/flux.1-dev',
    provider: 'nvidia',
    name: 'FLUX.1 dev',
    eyebrow: 'BLACK FOREST LABS',
    category: 'Image',
    capabilities: ['image'],
    description: 'High-fidelity text-to-image generation with depth and edge conditioning modes.',
    ratios: ['1:1', '16:9', '9:16', '4:5', '5:4', '3:2', '2:3'],
    resolutions: ['1024 × 1024', '768 × 1344', '1344 × 768', '1152 × 896', '896 × 1152', '832 × 1216', '1216 × 832'],
    supportsReference: false,
    steps: { min: 5, max: 50, default: 30 },
    cfgScale: { min: 1, max: 9, default: 3.5 },
    endpoint: 'https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev',
    docsUrl: 'https://docs.api.nvidia.com/nim/reference/black-forest-labs-flux_1-dev-infer',
  },
  {
    id: 'black-forest-labs/flux.1-kontext-dev',
    provider: 'nvidia',
    name: 'FLUX.1 Kontext dev',
    eyebrow: 'BLACK FOREST LABS',
    category: 'Image',
    capabilities: ['image', 'edit'],
    description: 'Instruction-based image editing for targeted changes and style transformations.',
    ratios: ['match_input_image', '1:1', '16:9', '9:16', '4:3', '3:2'],
    resolutions: ['1024 × 1024', '832 × 1216', '1216 × 832'],
    supportsReference: true,
    steps: { min: 20, max: 50, default: 30 },
    cfgScale: { min: 1, max: 9, default: 3.5 },
    endpoint: 'https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-kontext-dev',
    docsUrl: 'https://docs.api.nvidia.com/nim/reference/black-forest-labs-flux_1-kontext-dev-infer',
  },
];

export const PROVIDERS = [
  {
    id: 'nvidia' as const,
    name: 'NVIDIA NIM',
    mark: 'N',
    description: 'Hosted inference for visual foundation models.',
    status: 'Available',
    docsUrl: 'https://docs.api.nvidia.com/nim',
  },
  {
    id: 'openai' as const,
    name: 'OpenAI',
    mark: 'O',
    description: 'Provider adapter ready for future implementation.',
    status: 'Coming later',
    docsUrl: 'https://platform.openai.com/docs',
  },
  {
    id: 'google' as const,
    name: 'Google',
    mark: 'G',
    description: 'Provider adapter ready for future implementation.',
    status: 'Coming later',
    docsUrl: 'https://ai.google.dev/',
  },
] as const;

export type GenerationSettings = {
  provider: ProviderId;
  model: string;
  ratio: string;
  resolution: string;
  images: number;
  seed: number;
  steps: number;
  cfgScale?: number;
  referenceImage?: string;
};

export type GenerationRecord = {
  id: string;
  image: string;
  prompt: string;
  provider: ProviderId;
  model: string;
  resolution: string;
  ratio: string;
  seed: number;
  createdAt: string;
  durationMs: number;
};

export const getModel = (modelId: string) => MODEL_REGISTRY.find((model) => model.id === modelId) ?? MODEL_REGISTRY[0];

export const resolutionToSize = (resolution: string) => {
  const [width, height] = resolution.split('×').map((value) => Number(value.trim()));
  return { width: width || 1024, height: height || 1024 };
};

export const formatTimeAgo = (iso: string) => {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};
