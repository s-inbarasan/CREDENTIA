import { EventEmitter } from 'node:events';
import type { OperationClass, PermissionRequest } from './contracts.js';
import { permissionRequest } from '../security/permissions.js';
import type { PermissionGate } from './tools.js';

export class PermissionBroker extends EventEmitter implements PermissionGate {
  private pending = new Map<string, { request: PermissionRequest; resolve: (value: 'allow-once' | 'allow-task' | 'deny') => void }>();
  private taskApprovals = new Set<string>();
  async request(taskId: string, action: string, target: string, reason: string, operation: OperationClass) {
    const key = `${taskId}:${action}:${operation}`;
    if (this.taskApprovals.has(key)) return 'allow-task' as const;
    const request = permissionRequest(taskId, action, target, reason, operation);
    return new Promise<'allow-once' | 'allow-task' | 'deny'>((resolve) => { this.pending.set(request.id, { request, resolve }); this.emit('request', request); });
  }
  decide(id: string, decision: 'allow-once' | 'allow-task' | 'deny') { const pending = this.pending.get(id); if (!pending) return false; if (decision === 'allow-task') this.taskApprovals.add(`${pending.request.taskId}:${pending.request.action}:${pending.request.operation}`); pending.resolve(decision); this.pending.delete(id); this.emit('resolved', { id, decision }); return true; }
  all() { return [...this.pending.values()].map((v) => v.request); }
  cancelTask(taskId: string) { for (const [id, pending] of this.pending) { if (pending.request.taskId === taskId) { pending.resolve('deny'); this.pending.delete(id); } } }
}
