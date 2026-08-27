import { describe, expect, it } from 'vitest';
import { Sandbox } from './sandbox.js';

describe('TARS sandbox', () => {
  it('creates, writes, executes, and resets a temporary workspace', async () => {
    const sandbox = new Sandbox(); const created = await sandbox.create();
    const file = await sandbox.write(created.workspace, 'hello.py', 'print("hello from sandbox")');
    expect(file.path).toContain(created.workspace);
    const result = await sandbox.execute(created.workspace, 'print("hello from sandbox")', 'python', 5000);
    expect(result.exitCode).toBe(0); expect(result.stdout).toContain('hello from sandbox'); expect(result.isolation).toBe('temporary-workspace-process-boundary');
    const reset = await sandbox.reset(created.workspace); expect(reset.removed).toBe(1);
  });
  it('blocks traversal outside the owned workspace', async () => { const sandbox = new Sandbox(); const created = await sandbox.create(); await expect(sandbox.write(created.workspace, '../escape.txt', 'nope')).rejects.toThrow('traversal'); await sandbox.reset(created.workspace); });
});
