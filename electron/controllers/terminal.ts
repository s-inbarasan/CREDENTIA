import { spawn, type ChildProcess } from 'node:child_process';
import type { TarsSettings } from '../agent/contracts.js';

const denied = [/format(-volume)?/i, /remove-item\s+.*-recurse/i, /del\s+\/s/i, /rmdir\s+\/s/i, /diskpart/i, /reg\s+delete/i, /shutdown/i, /restart-computer/i, /stop-computer/i, /cipher\s+\/w/i, /disable-netfirewall/i, /set-executionpolicy\s+unrestricted/i];

export interface CommandResult { command: string; cwd: string; stdout: string; stderr: string; exitCode: number | null; durationMs: number; timedOut: boolean; cancelled: boolean; }

export class TerminalController {
  private active = new Set<ChildProcess>();
  constructor(private readonly settings: () => TarsSettings, private readonly isStopped: () => boolean) {}
  stopAll() { for (const child of this.active) child.kill('SIGTERM'); this.active.clear(); }
  async run(shell: 'powershell' | 'cmd' | 'python' | 'git', command: string, cwd = process.cwd(), timeoutMs = this.settings().toolTimeoutMs): Promise<CommandResult> {
    if (!command.trim()) throw new Error('Command is required.');
    if (denied.some((pattern) => pattern.test(command))) throw new Error('This command is blocked by TARS safety policy. Request an explicit host-side action outside the agent if necessary.');
    const started = Date.now();
    const executable = shell === 'powershell' ? (process.platform === 'win32' ? 'powershell.exe' : 'pwsh') : shell === 'cmd' ? (process.platform === 'win32' ? 'cmd.exe' : 'sh') : shell === 'python' ? (process.platform === 'win32' ? 'python' : 'python3') : 'git';
    const args = shell === 'powershell' ? ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', command] : shell === 'cmd' ? (process.platform === 'win32' ? ['/d', '/s', '/c', command] : ['-lc', command]) : shell === 'python' ? ['-c', command] : command.split(/\s+/).slice(1);
    const actualCommand = shell === 'git' ? `git ${command.replace(/^git\s+/i, '')}` : command;
    return new Promise((resolve, reject) => {
      const child = spawn(executable, args, { cwd, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] }); this.active.add(child); let stdout = ''; let stderr = ''; let timedOut = false; let cancelled = false;
      child.stdout.on('data', (chunk) => { stdout += String(chunk); stdout = stdout.slice(-200000); }); child.stderr.on('data', (chunk) => { stderr += String(chunk); stderr = stderr.slice(-200000); });
      const timer = setTimeout(() => { timedOut = true; child.kill('SIGTERM'); }, timeoutMs);
      const stopTimer = setInterval(() => { if (this.isStopped()) { cancelled = true; child.kill('SIGTERM'); } }, 100);
      child.on('error', (error) => { clearTimeout(timer); clearInterval(stopTimer); this.active.delete(child); reject(error); });
      child.on('close', (exitCode) => { clearTimeout(timer); clearInterval(stopTimer); this.active.delete(child); resolve({ command: actualCommand, cwd, stdout, stderr, exitCode, durationMs: Date.now() - started, timedOut, cancelled }); });
    });
  }
}
