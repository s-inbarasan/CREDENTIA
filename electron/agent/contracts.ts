export type TaskStatus = 'QUEUED' | 'PLANNING' | 'RUNNING' | 'WAITING_FOR_PERMISSION' | 'PAUSED' | 'FAILED' | 'COMPLETED' | 'CANCELLED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type OperationClass = 'READ' | 'WRITE' | 'EXECUTE' | 'DELETE' | 'UPLOAD' | 'DOWNLOAD' | 'NETWORK' | 'SYSTEM' | 'CREDENTIAL';

export interface TarsSettings {
  primaryProviderId: string;
  fallbackProviderId?: string;
  primaryModel: string;
  visionModel?: string;
  temperature: number;
  maxTokens: number;
  maxSteps: number;
  toolTimeoutMs: number;
  screenshotAfterActions: boolean;
  persistentMemoryEnabled: boolean;
  browserEnabled: boolean;
  sandboxEnabled: boolean;
  autoApproveLowRisk: boolean;
  allowMediumRisk: boolean;
  keyboardShortcut: string;
  protectedRoots: string[];
}

export interface ProviderConfig {
  id: string;
  label: string;
  baseUrl: string;
  apiKey?: string;
  apiKeys?: string[];
  model: string;
  visionModel?: string;
  enabled: boolean;
}

export interface ProviderStatus {
  id: string;
  label: string;
  baseUrl: string;
  model: string;
  visionModel?: string;
  enabled: boolean;
  hasKey: boolean;
  maskedKey?: string;
  lastError?: string;
  lastLatencyMs?: number;
}

export interface ToolResult<T = unknown> {
  success: boolean;
  tool: string;
  result?: T;
  error?: string;
  recoverable?: boolean;
  observationRequired?: boolean;
  durationMs: number;
  risk: RiskLevel;
  operation: OperationClass;
}

export interface ActionEvent {
  id: string;
  taskId?: string;
  timestamp: string;
  kind: 'ACTION' | 'OBSERVATION' | 'VERIFICATION' | 'ERROR' | 'DECISION' | 'SYSTEM' | 'PERMISSION';
  message: string;
  tool?: string;
  status?: 'success' | 'failed' | 'pending' | 'info';
  durationMs?: number;
  risk?: RiskLevel;
  metadata?: Record<string, unknown>;
  screenshotPath?: string;
}

export interface PermissionRequest {
  id: string;
  taskId: string;
  action: string;
  target: string;
  reason: string;
  risk: RiskLevel;
  operation: OperationClass;
  createdAt: string;
}

export interface TarsTask {
  id: string;
  objective: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  currentStep: string;
  progress: number;
  steps: Array<{ id: string; title: string; status: 'pending' | 'running' | 'completed' | 'failed'; detail?: string }>;
  logs: ActionEvent[];
  artifacts: string[];
  cancellationRequested: boolean;
  error?: string;
  stats: { actions: number; failures: number; retries: number; durationMs: number; tokens?: number };
}

export interface HealthCheck {
  name: string;
  status: 'pass' | 'warn' | 'fail' | 'unavailable';
  detail: string;
  durationMs?: number;
}

export interface ScreenObservation {
  success: boolean;
  imageDataUrl?: string;
  path?: string;
  width?: number;
  height?: number;
  activeWindow?: { title: string; process?: string; pid?: number };
  ocrText?: string;
  changed?: boolean;
  error?: string;
}

export interface AgentSnapshot {
  tasks: TarsTask[];
  activeTaskId?: string;
  pendingPermissions: PermissionRequest[];
  events: ActionEvent[];
  stopActive: boolean;
  providerStatuses: ProviderStatus[];
  settings: TarsSettings;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface ModelResponse {
  content: string;
  toolCalls: ToolCall[];
  usage?: { promptTokens?: number; completionTokens?: number; totalTokens?: number };
  providerId: string;
  model: string;
  latencyMs: number;
}
