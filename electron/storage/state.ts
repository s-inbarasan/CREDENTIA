import { app, safeStorage } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { ActionEvent, PermissionRequest, ProviderConfig, TarsSettings, TarsTask } from '../agent/contracts.js';

const defaultSettings: TarsSettings = {
  primaryProviderId: 'openai',
  fallbackProviderId: 'anthropic',
  primaryModel: 'gpt-5-mini',
  visionModel: 'gemini-3-flash-preview',
  temperature: 0.2,
  maxTokens: 6000,
  maxSteps: 40,
  toolTimeoutMs: 30000,
  screenshotAfterActions: true,
  persistentMemoryEnabled: true,
  browserEnabled: true,
  sandboxEnabled: true,
  autoApproveLowRisk: true,
  allowMediumRisk: false,
  keyboardShortcut: 'Control+Shift+Escape',
  protectedRoots: [],
};

export class StateStore {
  private readonly root: string;
  private readonly statePath: string;
  private readonly logPath: string;
  private state: { settings: TarsSettings; providers: ProviderConfig[]; tasks: TarsTask[]; memory: string[] };

  constructor() {
    this.root = path.join(app.getPath('userData'), 'state');
    this.statePath = path.join(this.root, 'tars-state.json');
    this.logPath = path.join(app.getPath('userData'), 'logs', 'tars.jsonl');
    fs.mkdirSync(this.root, { recursive: true });
    fs.mkdirSync(path.dirname(this.logPath), { recursive: true });
    this.state = this.load();
  }

  private load() {
    try {
      const parsed = JSON.parse(fs.readFileSync(this.statePath, 'utf8'));
      return {
        settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
        providers: Array.isArray(parsed.providers) ? parsed.providers : [],
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
        memory: Array.isArray(parsed.memory) ? parsed.memory : [],
      };
    } catch {
      return { settings: defaultSettings, providers: [], tasks: [], memory: [] };
    }
  }

  private save() {
    const tmp = `${this.statePath}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(this.state, null, 2), { encoding: 'utf8', mode: 0o600 });
    fs.renameSync(tmp, this.statePath);
  }

  getSettings(): TarsSettings { return { ...this.state.settings, protectedRoots: [...this.state.settings.protectedRoots] }; }
  setSettings(patch: Partial<TarsSettings>) { this.state.settings = { ...this.state.settings, ...patch }; this.save(); return this.getSettings(); }
  getProviders(): ProviderConfig[] { return this.state.providers.map((p) => ({ ...p })); }
  setProviders(providers: ProviderConfig[]) { this.state.providers = providers.map((p) => ({ ...p })); this.save(); }
  upsertProvider(provider: ProviderConfig) { this.state.providers = [...this.state.providers.filter((p) => p.id !== provider.id), provider]; this.save(); }
  removeProvider(id: string) { this.state.providers = this.state.providers.filter((p) => p.id !== id); this.save(); }
  getTasks(): TarsTask[] { return this.state.tasks.map((t) => structuredClone(t)); }
  saveTask(task: TarsTask) { this.state.tasks = [...this.state.tasks.filter((t) => t.id !== task.id), structuredClone(task)].slice(-50); this.save(); }
  getMemory() { return [...this.state.memory]; }
  addMemory(value: string) { if (!this.state.settings.persistentMemoryEnabled) return; this.state.memory = [...this.state.memory, value].slice(-100); this.save(); }

  log(event: ActionEvent) {
    const safe = redact(event);
    fs.appendFileSync(this.logPath, `${JSON.stringify(safe)}\n`, { encoding: 'utf8', mode: 0o600 });
  }

  readRecentEvents(limit = 200): ActionEvent[] {
    try {
      return fs.readFileSync(this.logPath, 'utf8').trim().split('\n').filter(Boolean).slice(-limit).map((line) => JSON.parse(line));
    } catch { return []; }
  }

  getPaths() { return { root: this.root, logPath: this.logPath, statePath: this.statePath }; }
}

export function createEvent(kind: ActionEvent['kind'], message: string, patch: Partial<ActionEvent> = {}): ActionEvent {
  return { id: crypto.randomUUID(), timestamp: new Date().toISOString(), kind, message, status: 'info', ...patch };
}

function redact(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.replace(/(sk-[A-Za-z0-9_-]{12,}|nvapi-[A-Za-z0-9_-]{8,}|AIza[A-Za-z0-9_-]{12,}|Bearer\s+[A-Za-z0-9._-]+)/gi, '[REDACTED]');
  }
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k.toLowerCase().includes('key') || k.toLowerCase().includes('secret') || k.toLowerCase().includes('token') ? '[REDACTED_FIELD]' : k, redact(v)]));
  return value;
}

export function maskSecret(secret?: string) {
  if (!secret) return undefined;
  return secret.length <= 8 ? '••••••••' : `${secret.slice(0, 4)}••••••••${secret.slice(-4)}`;
}

export function encryptSecret(value: string): string {
  if (safeStorage.isEncryptionAvailable()) return `electron:${safeStorage.encryptString(value).toString('base64')}`;
  const key = crypto.createHash('sha256').update(`${app.getPath('userData')}:${process.env.TARS_SECRET_SALT ?? 'tars-local-salt'}`).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return `${iv.toString('base64')}.${cipher.getAuthTag().toString('base64')}.${encrypted.toString('base64')}`;
}

export function decryptSecret(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    if (value.startsWith('electron:') && safeStorage.isEncryptionAvailable()) return safeStorage.decryptString(Buffer.from(value.slice(8), 'base64'));
    const [ivRaw, tagRaw, dataRaw] = value.split('.');
    const key = crypto.createHash('sha256').update(`${app.getPath('userData')}:${process.env.TARS_SECRET_SALT ?? 'tars-local-salt'}`).digest();
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivRaw, 'base64'));
    decipher.setAuthTag(Buffer.from(tagRaw, 'base64'));
    return Buffer.concat([decipher.update(Buffer.from(dataRaw, 'base64')), decipher.final()]).toString('utf8');
  } catch { return undefined; }
}

export type StoredPermission = PermissionRequest;
