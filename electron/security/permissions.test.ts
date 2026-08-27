import { describe, expect, it } from 'vitest';
import { assertSafePath, classify, isSensitivePath, isProtectedPath, requiresConfirmation } from './permissions.js';
import type { TarsSettings } from '../agent/contracts.js';

const settings: TarsSettings = { primaryProviderId: 'openai', primaryModel: 'gpt-5-mini', temperature: .2, maxTokens: 1000, maxSteps: 5, toolTimeoutMs: 1000, screenshotAfterActions: true, persistentMemoryEnabled: true, browserEnabled: true, sandboxEnabled: true, autoApproveLowRisk: true, allowMediumRisk: false, keyboardShortcut: 'Control+Shift+Escape', protectedRoots: [] };

describe('TARS permission policy', () => {
  it('classifies destructive and write operations conservatively', () => { expect(classify('DELETE')).toBe('HIGH'); expect(classify('WRITE')).toBe('MEDIUM'); expect(classify('READ')).toBe('LOW'); });
  it('requires confirmation for medium/high actions by default', () => { expect(requiresConfirmation('LOW', settings)).toBe(false); expect(requiresConfirmation('MEDIUM', settings)).toBe(true); expect(requiresConfirmation('HIGH', settings)).toBe(true); });
  it('blocks sensitive credentials from writes', () => { expect(isSensitivePath('/tmp/.env')).toBe(true); expect(() => assertSafePath('/tmp/.env', settings, 'WRITE')).toThrow(); });
  it('blocks protected roots from writes', () => { const protectedRoot = process.env.SystemRoot || 'C:\\Windows'; expect(isProtectedPath(protectedRoot, settings)).toBe(true); expect(() => assertSafePath(protectedRoot, settings, 'DELETE')).toThrow(); });
});
