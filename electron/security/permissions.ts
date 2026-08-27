import os from 'node:os';
import path from 'node:path';
import type { OperationClass, PermissionRequest, RiskLevel, TarsSettings } from '../agent/contracts.js';

const sensitiveNames = new Set(['.env', '.env.local', 'id_rsa', 'id_ed25519', 'credentials.json', 'token.json', 'cookies.sqlite', 'secrets.json']);
const protectedWindowsRoots = [process.env.SystemRoot || 'C:\\Windows', process.env.ProgramFiles || 'C:\\Program Files', process.env.ProgramFilesW6432 || 'C:\\Program Files', process.env.ProgramData || 'C:\\ProgramData'];

export function normalizePath(input: string, baseDir = process.cwd()) {
  return path.resolve(baseDir, input);
}

export function isSensitivePath(input: string) {
  const lower = input.toLowerCase();
  return sensitiveNames.has(path.basename(lower)) || lower.includes('\\.ssh\\') || lower.includes('/.ssh/') || lower.includes('appdata\\roaming\\microsoft\\credentials');
}

export function isProtectedPath(input: string, settings: TarsSettings) {
  const target = normalizePath(input).toLowerCase();
  const roots = [...protectedWindowsRoots, ...settings.protectedRoots, os.homedir() + path.sep + 'AppData'];
  return roots.some((root) => target === normalizePath(root).toLowerCase() || target.startsWith(`${normalizePath(root).toLowerCase()}${path.sep}`));
}

export function assertSafePath(input: string, settings: TarsSettings, operation: OperationClass) {
  const target = normalizePath(input);
  if (target.includes('\0')) throw new Error('Path contains an invalid null byte.');
  if (isSensitivePath(target) && operation !== 'READ') throw new Error('Sensitive credential paths cannot be modified, uploaded, moved, or deleted by TARS.');
  if (isProtectedPath(target, settings) && operation !== 'READ') throw new Error('Protected system paths cannot be modified by TARS.');
  return target;
}

export function classify(operation: OperationClass, target = ''): RiskLevel {
  if (operation === 'DELETE' || operation === 'CREDENTIAL' || operation === 'UPLOAD' || operation === 'SYSTEM') return 'HIGH';
  if (operation === 'WRITE' || operation === 'EXECUTE' || operation === 'DOWNLOAD' || (operation === 'NETWORK' && /submit|send|purchase|account|password/i.test(target))) return 'MEDIUM';
  return 'LOW';
}

export function requiresConfirmation(risk: RiskLevel, settings: TarsSettings) {
  if (risk === 'HIGH') return true;
  if (risk === 'MEDIUM') return !settings.allowMediumRisk;
  return !settings.autoApproveLowRisk;
}

export function permissionRequest(taskId: string, action: string, target: string, reason: string, operation: OperationClass): PermissionRequest {
  return { id: crypto.randomUUID(), taskId, action, target, reason, risk: classify(operation, target), operation, createdAt: new Date().toISOString() };
}

import crypto from 'node:crypto';
