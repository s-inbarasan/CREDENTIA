import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);

export class ApplicationController {
  async launch(application: string, args: string[] = []) {
    if (!application.trim()) throw new Error('Application name is required.');
    const child = process.platform === 'win32' ? spawn('cmd.exe', ['/c', 'start', '', application, ...args], { detached: true, stdio: 'ignore', windowsHide: true }) : spawn(application, args, { detached: true, stdio: 'ignore' });
    child.unref();
    return { application, pid: child.pid };
  }

  async find(application: string) {
    if (process.platform !== 'win32') return { matches: [] as string[], platform: process.platform };
    const script = `Get-Command '${application.replace(/'/g, "''")}' -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source`;
    const { stdout } = await execFileAsync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script], { timeout: 8000 });
    return { matches: stdout.split(/\r?\n/).map((v) => v.trim()).filter(Boolean) };
  }

  async windows() {
    if (process.platform !== 'win32') return [];
    const script = 'Get-Process | Where-Object {$_.MainWindowHandle -ne 0} | Select-Object ProcessName,Id,MainWindowTitle | ConvertTo-Json -Compress';
    const { stdout } = await execFileAsync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script], { timeout: 8000 });
    if (!stdout.trim()) return [];
    const data = JSON.parse(stdout); return (Array.isArray(data) ? data : [data]).map((w: any) => ({ process: w.ProcessName, pid: w.Id, title: w.MainWindowTitle }));
  }

  async focus(titleOrProcess: string) { return this.windowCommand('focus', titleOrProcess); }
  async minimize(titleOrProcess: string) { return this.windowCommand('minimize', titleOrProcess); }
  async maximize(titleOrProcess: string) { return this.windowCommand('maximize', titleOrProcess); }
  async restore(titleOrProcess: string) { return this.windowCommand('restore', titleOrProcess); }
  async close(titleOrProcess: string) { return this.windowCommand('close', titleOrProcess); }

  private async windowCommand(action: string, target: string) {
    if (process.platform !== 'win32') throw new Error('Window management is available on Windows only.');
    const safeTarget = target.replace(/'/g, "''");
    const script = `$p = Get-Process | Where-Object { $_.ProcessName -like '*${safeTarget}*' -or $_.MainWindowTitle -like '*${safeTarget}*' } | Select-Object -First 1; if (-not $p) { throw 'Window or process not found' }; Add-Type @'\nusing System; using System.Runtime.InteropServices; public class Win32 { [DllImport(\"user32.dll\")] public static extern bool ShowWindowAsync(IntPtr hWnd, int nCmdShow); [DllImport(\"user32.dll\")] public static extern bool SetForegroundWindow(IntPtr hWnd); }\n'@; $code = @{ minimize=6; maximize=3; restore=9; close=0; focus=9 }['${action}']; if ('${action}' -eq 'close') { $p.CloseMainWindow() | Out-Null } else { [Win32]::ShowWindowAsync($p.MainWindowHandle, $code) | Out-Null; [Win32]::SetForegroundWindow($p.MainWindowHandle) | Out-Null }; [PSCustomObject]@{process=$p.ProcessName; pid=$p.Id; title=$p.MainWindowTitle; action='${action}'} | ConvertTo-Json -Compress`;
    const { stdout } = await execFileAsync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script], { timeout: 10000 });
    return JSON.parse(stdout);
  }
}
