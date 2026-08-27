import type { PermissionRequest, ProviderStatus, TarsSettings, TarsTask, ActionEvent } from '../electron/agent/contracts';

declare global {
  interface Window {
    tars: {
      snapshot: () => Promise<any>;
      createTask: (objective: string) => Promise<TarsTask>;
      cancelTask: (taskId: string) => Promise<boolean>;
      stop: () => Promise<boolean>;
      resume: () => Promise<boolean>;
      permissionDecision: (id: string, decision: 'allow-once' | 'allow-task' | 'deny') => Promise<boolean>;
      settings: (patch: Partial<TarsSettings>) => Promise<TarsSettings>;
      providers: () => Promise<ProviderStatus[]>;
      saveProvider: (config: Record<string, unknown>) => Promise<ProviderStatus | undefined>;
      removeProvider: (id: string) => Promise<ProviderStatus[]>;
      testProvider: (id: string) => Promise<{ ok: boolean; providerId: string; latencyMs: number }>;
      screen: () => Promise<any>;
      health: () => Promise<any>;
      paths: () => Promise<any>;
      onEvent: (callback: (event: ActionEvent) => void) => () => void;
      onTask: (callback: (task: TarsTask) => void) => () => void;
      onPermission: (callback: (request: PermissionRequest) => void) => () => void;
      onStopState: (callback: (stopped: boolean) => void) => () => void;
    };
  }
}
export {};
