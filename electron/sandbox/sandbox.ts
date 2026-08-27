import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

export interface SandboxRun { workspace: string; command: string; stdout: string; stderr: string; exitCode: number | null; durationMs: number; timedOut: boolean; isolation: 'temporary-workspace-process-boundary'; }

export class Sandbox {
  private workspaces = new Set<string>();
  private stopped = false;
  stop() { this.stopped = true; }
  resume() { this.stopped = false; }
  async create() { const workspace = await fs.mkdtemp(path.join(os.tmpdir(), 'tars-sandbox-')); this.workspaces.add(workspace); await fs.writeFile(path.join(workspace, 'SANDBOX-README.txt'), 'TARS SANDBOX\nThis is a temporary workspace and process boundary, not a VM or container.\nDo not place secrets here.\n'); return { workspace, isolation: 'temporary-workspace-process-boundary' as const }; }
  async write(workspace: string, relativePath: string, content: string) { const target = this.safe(workspace, relativePath); await fs.mkdir(path.dirname(target), { recursive: true }); await fs.writeFile(target, content, 'utf8'); return { path: target, size: Buffer.byteLength(content) }; }
  async list(workspace: string) { const root = this.safeWorkspace(workspace); return fs.readdir(root, { withFileTypes: true }).then((entries) => entries.map((e) => ({ name: e.name, type: e.isDirectory() ? 'directory' : 'file' }))); }
  async execute(workspace: string, command: string, shell: 'powershell' | 'cmd' | 'python' = 'python', timeoutMs = 30000): Promise<SandboxRun> {
    if (this.stopped) throw new Error('Sandbox stopped by emergency stop.');
    const root = this.safeWorkspace(workspace); const started = Date.now(); const executable = shell === 'python' ? (process.platform === 'win32' ? 'python' : 'python3') : shell === 'powershell' ? (process.platform === 'win32' ? 'powershell.exe' : 'pwsh') : (process.platform === 'win32' ? 'cmd.exe' : 'sh'); const args = shell === 'python' ? ['-c', command] : shell === 'powershell' ? ['-NoProfile', '-NonInteractive', '-Command', command] : process.platform === 'win32' ? ['/d', '/s', '/c', command] : ['-lc', command];
    return new Promise((resolve, reject) => { const child = spawn(executable, args, { cwd: root, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] }); let stdout = ''; let stderr = ''; let timedOut = false; const timer = setTimeout(() => { timedOut = true; child.kill('SIGTERM'); }, timeoutMs); child.stdout.on('data', (d) => { stdout += String(d); stdout = stdout.slice(-100000); }); child.stderr.on('data', (d) => { stderr += String(d); stderr = stderr.slice(-100000); }); child.on('error', (e) => { clearTimeout(timer); reject(e); }); child.on('close', (exitCode) => { clearTimeout(timer); resolve({ workspace: root, command, stdout, stderr, exitCode, durationMs: Date.now() - started, timedOut, isolation: 'temporary-workspace-process-boundary' }); }); });
  }
  async reset(workspace?: string) { const targets = workspace ? [this.safeWorkspace(workspace)] : [...this.workspaces]; for (const target of targets) { await fs.rm(target, { recursive: true, force: true }); this.workspaces.delete(target); } return { removed: targets.length }; }
  private safeWorkspace(workspace: string) { const target = path.resolve(workspace); if (!this.workspaces.has(target) && !target.startsWith(path.join(os.tmpdir(), 'tars-sandbox-'))) throw new Error('Sandbox workspace is not owned by TARS.'); if (!fsSync.existsSync(target)) throw new Error('Sandbox workspace does not exist.'); return target; }
  private safe(workspace: string, relativePath: string) { const root = this.safeWorkspace(workspace); const target = path.resolve(root, relativePath); if (target !== root && !target.startsWith(`${root}${path.sep}`)) throw new Error('Sandbox path traversal blocked.'); return target; }
}
