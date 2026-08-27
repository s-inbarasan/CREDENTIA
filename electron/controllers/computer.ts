import fs from 'node:fs';
import path from 'node:path';
import { app } from 'electron';
import type { ScreenObservation } from '../agent/contracts.js';

export class ComputerController {
  private stopped = false;
  private lastImageHash = '';

  stop() { this.stopped = true; }
  resume() { this.stopped = false; }
  private assertRunning() { if (this.stopped) throw new Error('Computer control stopped by emergency stop.'); }

  async getScreenSize() {
    const { screen } = await import('@nut-tree-fork/nut-js');
    return { width: await screen.width(), height: await screen.height() };
  }

  async mousePosition() {
    const { mouse } = await import('@nut-tree-fork/nut-js');
    return await mouse.getPosition();
  }

  async move(x: number, y: number) { this.assertRunning(); const { mouse, Point } = await import('@nut-tree-fork/nut-js'); await mouse.move([new Point(x, y)]); return { x, y }; }
  async click(x: number, y: number, button: 'left' | 'right' = 'left') { this.assertRunning(); const { mouse, Point, Button } = await import('@nut-tree-fork/nut-js'); await mouse.move([new Point(x, y)]); await mouse.click(button === 'right' ? Button.RIGHT : Button.LEFT); return { x, y, button }; }
  async doubleClick(x: number, y: number) { this.assertRunning(); const { mouse, Point, Button } = await import('@nut-tree-fork/nut-js'); await mouse.move([new Point(x, y)]); await mouse.doubleClick(Button.LEFT); return { x, y }; }
  async drag(fromX: number, fromY: number, toX: number, toY: number) { this.assertRunning(); const { mouse, Point, Button } = await import('@nut-tree-fork/nut-js'); await mouse.move([new Point(fromX, fromY)]); await mouse.pressButton(Button.LEFT); await mouse.move([new Point(toX, toY)]); await mouse.releaseButton(Button.LEFT); return { fromX, fromY, toX, toY }; }
  async scroll(amount: number) { this.assertRunning(); const { mouse } = await import('@nut-tree-fork/nut-js'); if (amount >= 0) await mouse.scrollDown(amount); else await mouse.scrollUp(Math.abs(amount)); return { amount }; }
  async type(text: string) { this.assertRunning(); if (text.length > 100000) throw new Error('Text input exceeds the safe limit.'); const { keyboard } = await import('@nut-tree-fork/nut-js'); await keyboard.type(text); return { characters: text.length }; }
  async keyPress(key: string) { this.assertRunning(); const { keyboard, Key } = await import('@nut-tree-fork/nut-js'); const normalized = key.toUpperCase().replace('CTRL', 'CONTROL'); const mapped = (Key as Record<string, unknown>)[normalized]; if (!mapped) throw new Error(`Unsupported key: ${key}`); await keyboard.pressKey(mapped as never); return { key }; }
  async hotkey(keys: string[]) { this.assertRunning(); const { keyboard, Key } = await import('@nut-tree-fork/nut-js'); const mapped = keys.map((key) => (Key as Record<string, unknown>)[key.toUpperCase().replace('CTRL', 'CONTROL')]).filter(Boolean); if (mapped.length !== keys.length) throw new Error(`Unsupported hotkey: ${keys.join('+')}`); await keyboard.pressKey(...mapped as never[]); return { keys }; }

  async screenshot(region?: { x: number; y: number; width: number; height: number }): Promise<ScreenObservation> {
    try {
      const screenshot = (await import('screenshot-desktop')).default;
      const buffer = await screenshot({ format: 'png' });
      const imageHash = buffer.toString('base64', 0, Math.min(buffer.length, 4096));
      const changed = imageHash !== this.lastImageHash;
      this.lastImageHash = imageHash;
      const dir = path.join(app.getPath('userData'), 'screenshots'); fs.mkdirSync(dir, { recursive: true });
      const filePath = path.join(dir, `screen-${Date.now()}.png`);
      fs.writeFileSync(filePath, buffer, { mode: 0o600 });
      return { success: true, imageDataUrl: `data:image/png;base64,${buffer.toString('base64')}`, path: filePath, changed };
    } catch (error) { return { success: false, error: error instanceof Error ? error.message : String(error) }; }
  }

  async inspect(region?: { x: number; y: number; width: number; height: number }) {
    const screen = await this.screenshot(region);
    let activeWindow: ScreenObservation['activeWindow'];
    if (process.platform === 'win32') {
      try {
        const { execFile } = await import('node:child_process');
        const output = await new Promise<string>((resolve, reject) => execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', '(Get-Process | Where-Object {$_.MainWindowHandle -ne 0} | Sort-Object CPU -Descending | Select-Object -First 1 | Select-Object ProcessName,Id,MainWindowTitle | ConvertTo-Json -Compress)'], { timeout: 5000 }, (err, stdout) => err ? reject(err) : resolve(stdout)));
        const parsed = JSON.parse(output); activeWindow = { title: parsed.MainWindowTitle || 'Unknown', process: parsed.ProcessName, pid: parsed.Id };
      } catch { activeWindow = { title: 'Unknown' }; }
    }
    return { ...screen, activeWindow };
  }
}
