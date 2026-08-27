import { contextBridge, ipcRenderer } from 'electron';
import type { PermissionRequest, ProviderStatus, TarsSettings, TarsTask, ActionEvent } from './agent/contracts.js';

const api = {
  snapshot: () => ipcRenderer.invoke('tars:snapshot'),
  createTask: (objective: string) => ipcRenderer.invoke('tars:create-task', objective),
  cancelTask: (taskId: string) => ipcRenderer.invoke('tars:cancel-task', taskId),
  stop: () => ipcRenderer.invoke('tars:stop'),
  resume: () => ipcRenderer.invoke('tars:resume'),
  permissionDecision: (id: string, decision: 'allow-once' | 'allow-task' | 'deny') => ipcRenderer.invoke('tars:permission-decision', id, decision),
  settings: (patch: Partial<TarsSettings>) => ipcRenderer.invoke('tars:settings', patch),
  providers: () => ipcRenderer.invoke('tars:providers'),
  saveProvider: (config: Record<string, unknown>) => ipcRenderer.invoke('tars:save-provider', config),
  removeProvider: (id: string) => ipcRenderer.invoke('tars:remove-provider', id),
  testProvider: (id: string) => ipcRenderer.invoke('tars:test-provider', id),
  screen: () => ipcRenderer.invoke('tars:screen'),
  health: () => ipcRenderer.invoke('tars:health'),
  paths: () => ipcRenderer.invoke('tars:paths'),
  onEvent: (callback: (event: ActionEvent) => void) => { const handler = (_event: Electron.IpcRendererEvent, payload: ActionEvent) => callback(payload); ipcRenderer.on('tars:event', handler); return () => ipcRenderer.removeListener('tars:event', handler); },
  onTask: (callback: (task: TarsTask) => void) => { const handler = (_event: Electron.IpcRendererEvent, payload: TarsTask) => callback(payload); ipcRenderer.on('tars:task', handler); return () => ipcRenderer.removeListener('tars:task', handler); },
  onPermission: (callback: (request: PermissionRequest) => void) => { const handler = (_event: Electron.IpcRendererEvent, payload: PermissionRequest) => callback(payload); ipcRenderer.on('tars:permission', handler); return () => ipcRenderer.removeListener('tars:permission', handler); },
  onStopState: (callback: (stopped: boolean) => void) => { const handler = (_event: Electron.IpcRendererEvent, payload: boolean) => callback(payload); ipcRenderer.on('tars:stop-state', handler); return () => ipcRenderer.removeListener('tars:stop-state', handler); },
};
contextBridge.exposeInMainWorld('tars', api);
