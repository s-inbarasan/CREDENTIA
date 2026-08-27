import { describe, expect, it } from 'vitest';
import { AgentEngine } from './engine.js';
import type { TarsSettings, TarsTask } from './contracts.js';

const settings: TarsSettings = { primaryProviderId: 'openai', primaryModel: 'gpt-5-mini', temperature: .2, maxTokens: 1000, maxSteps: 5, toolTimeoutMs: 1000, screenshotAfterActions: false, persistentMemoryEnabled: false, browserEnabled: true, sandboxEnabled: true, autoApproveLowRisk: true, allowMediumRisk: true, keyboardShortcut: 'Control+Shift+Escape', protectedRoots: [] };

describe('TARS agent loop', () => {
  it('plans, executes a tool, feeds the result back, and verifies completion', async () => {
    const saved: TarsTask[] = []; const events: any[] = []; let call = 0;
    const store: any = { getTasks: () => [], saveTask: (task: TarsTask) => { saved.push(structuredClone(task)); }, log: (event: any) => events.push(event), readRecentEvents: () => [], getSettings: () => settings };
    const providers: any = { completeWithFallback: async () => { call += 1; if (call === 1) return { content: '["Create a test artifact"]', toolCalls: [], usage: { totalTokens: 4 }, providerId: 'test', model: 'test', latencyMs: 1 }; if (call === 2) return { content: '', toolCalls: [{ id: '1', name: 'sandbox_create', arguments: {} }], usage: { totalTokens: 4 }, providerId: 'test', model: 'test', latencyMs: 1 }; return { content: 'The objective is complete and verified.', toolCalls: [], usage: { totalTokens: 4 }, providerId: 'test', model: 'test', latencyMs: 1 }; } };
    const tools: any = { execute: async (_taskId: string, toolCall: any) => ({ success: true, tool: toolCall.name, result: { workspace: 'tars-test' }, observationRequired: false, durationMs: 1, risk: 'LOW', operation: 'READ' }) };
    const engine = new AgentEngine(store, providers, tools, () => settings); const task = await engine.create('Create a test artifact'); await new Promise((resolve) => setTimeout(resolve, 60));
    const final = engine.snapshot().find((item) => item.id === task.id); expect(final?.status).toBe('COMPLETED'); expect(final?.stats.actions).toBe(1); expect(events.some((event) => event.kind === 'VERIFICATION')).toBe(true);
  });
});
