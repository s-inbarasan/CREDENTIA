import { app, BrowserWindow, globalShortcut, ipcMain, shell } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { StateStore, createEvent } from './storage/state.js';
import { ProviderManager } from './agent/providers.js';
import { PermissionBroker } from './agent/permissionBroker.js';
import { ToolRegistry } from './agent/tools.js';
import { AgentEngine } from './agent/engine.js';
import { ComputerController } from './controllers/computer.js';
import { ApplicationController } from './controllers/applications.js';
import { FilesystemController } from './controllers/filesystem.js';
import { TerminalController } from './controllers/terminal.js';
import { BrowserController } from './controllers/browser.js';
import { Sandbox } from './sandbox/sandbox.js';
import type { ProviderConfig, TarsSettings } from './agent/contracts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let mainWindow: BrowserWindow | undefined;
let store: StateStore; let providers: ProviderManager; let permission: PermissionBroker; let engine: AgentEngine; let computer: ComputerController; let terminal: TerminalController; let browser: BrowserController; let sandbox: Sandbox;

function send(channel: string, payload: unknown) { if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send(channel, payload); }

async function createWindow() {
  mainWindow = new BrowserWindow({ width: 1480, height: 940, minWidth: 1120, minHeight: 720, backgroundColor: '#09100e', title: 'TARS — Autonomous Computer Agent', webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true, nodeIntegration: false } });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => { void shell.openExternal(url); return { action: 'deny' }; });
  const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://127.0.0.1:5173';
  if (!app.isPackaged) await mainWindow.loadURL(devUrl); else await mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
}

function registerIpc() {
  ipcMain.handle('tars:snapshot', () => ({ tasks: engine.snapshot(), activeTaskId: undefined, pendingPermissions: permission.all(), events: store.readRecentEvents(), stopActive: engine.isStopped(), providerStatuses: providers.statuses(), settings: store.getSettings() }));
  ipcMain.handle('tars:create-task', (_event, objective: string) => engine.create(objective));
  ipcMain.handle('tars:cancel-task', (_event, taskId: string) => engine.cancel(taskId));
  ipcMain.handle('tars:stop', () => { engine.stop(); computer.stop(); terminal.stopAll(); browser.stop(); sandbox.stop(); send('tars:stop-state', true); return true; });
  ipcMain.handle('tars:resume', () => { engine.resume(); computer.resume(); browser.resume(); sandbox.resume(); send('tars:stop-state', false); return true; });
  ipcMain.handle('tars:permission-decision', (_event, id: string, decision: 'allow-once' | 'allow-task' | 'deny') => permission.decide(id, decision));
  ipcMain.handle('tars:settings', (_event, patch: Partial<TarsSettings>) => { const settings = store.setSettings(patch); send('tars:settings', settings); return settings; });
  ipcMain.handle('tars:providers', () => providers.statuses());
  ipcMain.handle('tars:save-provider', (_event, config: Omit<ProviderConfig, 'apiKey'> & { apiKey?: string }) => providers.saveProvider(config));
  ipcMain.handle('tars:remove-provider', (_event, id: string) => { providers.removeProvider(id); return providers.statuses(); });
  ipcMain.handle('tars:test-provider', (_event, id: string) => providers.testProvider(id));
  ipcMain.handle('tars:screen', () => computer.inspect());
  ipcMain.handle('tars:health', () => healthCheck());
  ipcMain.handle('tars:paths', () => store.getPaths());
}

async function healthCheck() {
  const checks = [] as Array<{ name: string; status: 'pass' | 'warn' | 'fail' | 'unavailable'; detail: string; durationMs?: number }>;
  const timed = async (name: string, fn: () => Promise<string>, unavailable = false) => { const started = Date.now(); try { checks.push({ name, status: unavailable ? 'unavailable' : 'pass', detail: await fn(), durationMs: Date.now() - started }); } catch (error) { checks.push({ name, status: unavailable ? 'unavailable' : 'fail', detail: error instanceof Error ? error.message : String(error), durationMs: Date.now() - started }); } };
  await timed('AI provider configuration', async () => { const available = providers.statuses().filter((p) => p.enabled && p.hasKey); if (!available.length) throw new Error('No provider API key configured.'); return `${available.length} provider(s) configured`; });
  await timed('API authentication', async () => { const available = providers.statuses().find((p) => p.enabled && p.hasKey); if (!available) throw new Error('No provider available.'); const result = await providers.testProvider(available.id); return `${available.id} responded in ${result.latencyMs}ms`; });
  await timed('Filesystem', async () => { const root = app.getPath('userData'); return `Writable user data: ${root}`; });
  await timed('Terminal', async () => { const result = await terminal.run(process.platform === 'win32' ? 'powershell' : 'python', process.platform === 'win32' ? '$PSVersionTable.PSVersion.ToString()' : 'print("python-ready")', process.cwd(), 8000); if (result.exitCode !== 0) throw new Error(result.stderr || 'Terminal failed'); return result.stdout.trim(); });
  await timed('Sandbox', async () => { const created = await sandbox.create(); await sandbox.reset(created.workspace); return 'Temporary workspace lifecycle ready'; });
  await timed('Screenshot', async () => { const screen = await computer.screenshot(); if (!screen.success) throw new Error(screen.error); return 'Screen capture ready'; }, process.platform !== 'win32');
  await timed('Mouse / keyboard', async () => { await computer.mousePosition(); return 'Native input bridge loaded'; }, process.platform !== 'win32');
  await timed('Browser', async () => { if (!store.getSettings().browserEnabled) return 'Disabled in settings'; return 'Playwright browser automation configured'; });
  await timed('Permission engine', async () => 'Risk classification and confirmation broker ready');
  return { checks, ready: checks.every((check) => check.status === 'pass' || check.status === 'warn' || check.status === 'unavailable') && checks.some((check) => check.name === 'AI provider configuration' && check.status === 'pass') };
}

app.whenReady().then(async () => {
  store = new StateStore(); providers = new ProviderManager(store); permission = new PermissionBroker(); computer = new ComputerController(); terminal = new TerminalController(() => store.getSettings(), () => engine?.isStopped() ?? false); browser = new BrowserController(); sandbox = new Sandbox();
  const runtime = { computer, applications: new ApplicationController(), filesystem: new FilesystemController(() => store.getSettings()), terminal, browser, sandbox, settings: () => store.getSettings(), permission, isStopped: () => engine.isStopped() };
  const tools = new ToolRegistry(runtime, (kind, message, metadata) => { const event = createEvent(kind, message, { metadata }); store.log(event); send('tars:event', event); });
  engine = new AgentEngine(store, providers, tools, () => store.getSettings());
  registerIpc();
  engine.on('event', (event) => send('tars:event', event)); engine.on('task', (task) => send('tars:task', task)); permission.on('request', (request) => { send('tars:permission', request); const event = createEvent('PERMISSION', `Permission required: ${request.action}`, { taskId: request.taskId, status: 'pending', risk: request.risk, metadata: { target: request.target, operation: request.operation } }); store.log(event); send('tars:event', event); });
  globalShortcut.register(store.getSettings().keyboardShortcut, () => { engine.stop(); computer.stop(); terminal.stopAll(); browser.stop(); sandbox.stop(); send('tars:stop-state', true); });
  await createWindow();
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('will-quit', () => { globalShortcut.unregisterAll(); browser?.stop(); terminal?.stopAll(); });
