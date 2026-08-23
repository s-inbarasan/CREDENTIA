import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import crypto from 'node:crypto';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyVault = new Map<string, { iv: string; tag: string; data: string }>();
const encryptionKey = crypto.createHash('sha256').update(process.env.FORGEAI_CREDENTIAL_SECRET || 'forgeai-development-secret-change-me').digest();
const NVIDIA_BASE = 'https://ai.api.nvidia.com/v1/genai/black-forest-labs/';

app.use(express.json({ limit: '14mb' }));

const models: Record<string, { endpoint: string; kind: 'klein' | 'dev' | 'kontext' }> = {
  'black-forest-labs/flux.2-klein-4b': { endpoint: `${NVIDIA_BASE}flux.2-klein-4b`, kind: 'klein' },
  'black-forest-labs/flux.1-dev': { endpoint: `${NVIDIA_BASE}flux.1-dev`, kind: 'dev' },
  'black-forest-labs/flux.1-kontext-dev': { endpoint: `${NVIDIA_BASE}flux.1-kontext-dev`, kind: 'kontext' },
};

function requestSessionId(value: unknown) {
  return typeof value === 'string' && value.length >= 12 && value.length <= 100 ? value : '';
}

function encryptSecret(value: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);
  const data = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return { iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), data: data.toString('base64') };
}

function decryptSecret(value?: { iv: string; tag: string; data: string }) {
  if (!value) return '';
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey, Buffer.from(value.iv, 'base64'));
    decipher.setAuthTag(Buffer.from(value.tag, 'base64'));
    return Buffer.concat([decipher.update(Buffer.from(value.data, 'base64')), decipher.final()]).toString('utf8');
  } catch { return ''; }
}

function getApiKey(sessionId: string, requestKey?: unknown) {
  if (typeof requestKey === 'string' && requestKey.trim()) return requestKey.trim();
  return decryptSecret(keyVault.get(sessionId)) || process.env.NVIDIA_API_KEY || '';
}

function maskKey(value: string) {
  if (value.length < 10) return '••••••••';
  return `${value.slice(0, 6)}••••••••${value.slice(-4)}`;
}

function publicMessage(status: number, body: string) {
  if (status === 401 || status === 403) return 'Your NVIDIA API key could not be authenticated.';
  if (status === 404) return 'This model is currently unavailable.';
  if (status === 429) return 'NVIDIA rate limit reached. Try again later.';
  if (status === 422) return 'NVIDIA rejected the generation settings. Check the selected model options.';
  if (status >= 500) return 'NVIDIA is temporarily unavailable. Try again later.';
  if (body.toLowerCase().includes('content')) return 'The request was blocked by the provider content filter.';
  return 'Unable to reach the generation service.';
}

function dimensions(resolution: unknown) {
  const match = String(resolution || '1024 × 1024').match(/(\d+)\s*[×x]\s*(\d+)/i);
  return { width: Number(match?.[1] || 1024), height: Number(match?.[2] || 1024) };
}

function buildPayload(modelId: string, input: any) {
  const model = models[modelId];
  if (!model) throw new Error('This model is currently unavailable.');
  const { width, height } = dimensions(input.settings?.resolution);
  const prompt = String(input.prompt || '').trim().slice(0, 10000);
  const seed = Math.max(0, Math.min(4294967295, Number(input.settings?.seed || 0)));
  const steps = Number(input.settings?.steps || (model.kind === 'klein' ? 4 : 30));
  if (model.kind === 'klein') return { prompt, width, height, seed, steps: Math.max(1, Math.min(4, steps)), ...(input.referenceImage ? { mode: 'Image Editing', image: [input.referenceImage] } : {}) };
  if (model.kind === 'dev') return { prompt, mode: 'base', width, height, seed, steps: Math.max(5, Math.min(50, steps)), cfg_scale: Math.max(1, Math.min(9, Number(input.settings?.cfgScale || 3.5))), samples: 1 };
  return { prompt, image: input.referenceImage || null, aspect_ratio: input.settings?.ratio || '1:1', width, height, seed, steps: Math.max(20, Math.min(50, steps)), cfg_scale: Math.max(1, Math.min(9, Number(input.settings?.cfgScale || 3.5))) };
}

async function invokeNvidia(apiKey: string, modelId: string, payload: unknown) {
  const model = models[modelId];
  const response = await fetch(model.endpoint, { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const raw = await response.text();
  let body: any = {};
  try { body = JSON.parse(raw); } catch { /* provider returned non-json */ }
  if (!response.ok) throw Object.assign(new Error(publicMessage(response.status, raw)), { status: response.status });
  const artifact = body?.artifacts?.[0];
  if (!artifact?.base64) throw Object.assign(new Error('NVIDIA returned no image artifact.'), { status: 502 });
  if (artifact.finishReason === 'CONTENT_FILTERED') throw Object.assign(new Error('The request was blocked by the provider content filter.'), { status: 422 });
  return { image: artifact.base64, seed: artifact.seed, finishReason: artifact.finishReason };
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'forgeai' }));

app.get('/api/providers/nvidia/credentials', (req, res) => {
  const sessionId = requestSessionId(req.query.sessionId);
  const configured = Boolean(sessionId && keyVault.has(sessionId) && decryptSecret(keyVault.get(sessionId)));
  const savedKey = configured ? decryptSecret(keyVault.get(sessionId)) : '';
  res.json({ connected: configured || Boolean(process.env.NVIDIA_API_KEY), masked: savedKey ? maskKey(savedKey) : undefined });
});

app.put('/api/providers/nvidia/credentials', (req, res) => {
  const sessionId = requestSessionId(req.body?.sessionId);
  const apiKey = typeof req.body?.apiKey === 'string' ? req.body.apiKey.trim() : '';
  if (!sessionId) return res.status(400).json({ message: 'A valid workspace session is required.' });
  if (!apiKey || apiKey.length < 12) return res.status(400).json({ message: 'Enter a valid NVIDIA API key.' });
  keyVault.set(sessionId, encryptSecret(apiKey));
  return res.json({ connected: true, masked: maskKey(apiKey), message: 'Key stored server-side for this workspace session.' });
});

app.delete('/api/providers/nvidia/credentials', (req, res) => {
  const sessionId = requestSessionId(req.query.sessionId);
  if (sessionId) keyVault.delete(sessionId);
  res.json({ connected: false, message: 'Stored key removed.' });
});

app.post('/api/providers/nvidia/test', async (req, res) => {
  const sessionId = requestSessionId(req.body?.sessionId);
  const apiKey = getApiKey(sessionId, req.body?.apiKey);
  if (!apiKey) return res.status(409).json({ message: 'Add an NVIDIA API key before testing the connection.' });
  try {
    await invokeNvidia(apiKey, 'black-forest-labs/flux.2-klein-4b', { prompt: 'a single white dot on a black background', width: 1024, height: 1024, steps: 1, seed: 0 });
    return res.json({ connected: true, message: 'Connection verified with NVIDIA NIM.' });
  } catch (error: any) {
    return res.status(error?.status || 502).json({ message: error?.message || 'Connection test failed.' });
  }
});

app.post('/api/generate', async (req, res) => {
  const sessionId = requestSessionId(req.body?.sessionId);
  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
  const modelId = typeof req.body?.settings?.model === 'string' ? req.body.settings.model : '';
  if (!sessionId) return res.status(400).json({ message: 'A valid workspace session is required.' });
  if (!prompt) return res.status(400).json({ message: 'Describe what you want to create first.' });
  if (prompt.length > 10000) return res.status(400).json({ message: 'Prompt must be 10,000 characters or fewer.' });
  const apiKey = getApiKey(sessionId);
  if (!apiKey) return res.status(409).json({ message: 'Connect your NVIDIA API key in API keys before generating.' });
  try {
    const payload = buildPayload(modelId, req.body);
    const result = await invokeNvidia(apiKey, modelId, payload);
    return res.json(result);
  } catch (error: any) {
    return res.status(error?.status || 502).json({ message: error?.message || 'Unable to reach the generation service.' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

app.listen(PORT, '0.0.0.0', () => console.log(`ForgeAI running on http://localhost:${PORT}`));
