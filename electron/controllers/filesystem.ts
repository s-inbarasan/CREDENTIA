import fs from 'node:fs/promises';
import path from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { TarsSettings } from '../agent/contracts.js';
import { assertSafePath } from '../security/permissions.js';
const execFileAsync = promisify(execFile);

export class FilesystemController {
  constructor(private readonly settings: () => TarsSettings) {}
  list(directory: string) { return this.withPath(directory, 'READ', async (target) => { const entries = await fs.readdir(target, { withFileTypes: true }); return entries.map((e) => ({ name: e.name, path: path.join(target, e.name), type: e.isDirectory() ? 'directory' : 'file' })); }); }
  read(file: string, maxBytes = 2_000_000) { return this.withPath(file, 'READ', async (target) => { const stat = await fs.stat(target); if (stat.size > maxBytes) throw new Error(`File is larger than the read limit (${maxBytes} bytes).`); return { path: target, content: redactSecrets(await fs.readFile(target, 'utf8')), size: stat.size, modifiedAt: stat.mtime.toISOString() }; }); }
  metadata(file: string) { return this.withPath(file, 'READ', async (target) => { const stat = await fs.stat(target); return { path: target, size: stat.size, isFile: stat.isFile(), isDirectory: stat.isDirectory(), createdAt: stat.birthtime.toISOString(), modifiedAt: stat.mtime.toISOString(), extension: path.extname(target) }; }); }
  search(directory: string, pattern: string, maxResults = 100) { return this.withPath(directory, 'READ', async (target) => { const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); const out: string[] = []; const walk = async (dir: string) => { if (out.length >= maxResults) return; for (const entry of await fs.readdir(dir, { withFileTypes: true })) { if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'AppData') continue; const full = path.join(dir, entry.name); if (regex.test(entry.name)) out.push(full); if (entry.isDirectory()) await walk(full); if (out.length >= maxResults) return; } }; await walk(target); return { matches: out, truncated: out.length >= maxResults }; }); }
  createDirectory(directory: string) { return this.withPath(directory, 'WRITE', async (target) => { await fs.mkdir(target, { recursive: true }); return { path: target, created: true }; }); }
  write(file: string, content: string) { return this.withPath(file, 'WRITE', async (target) => { await fs.mkdir(path.dirname(target), { recursive: true }); await fs.writeFile(target, content, 'utf8'); return { path: target, size: Buffer.byteLength(content) }; }); }
  append(file: string, content: string) { return this.withPath(file, 'WRITE', async (target) => { await fs.appendFile(target, content, 'utf8'); return { path: target, size: Buffer.byteLength(content) }; }); }
  rename(source: string, destination: string) { return this.withPath(source, 'WRITE', async (src) => this.withPath(destination, 'WRITE', async (dest) => { await fs.rename(src, dest); return { source: src, destination: dest }; })); }
  copy(source: string, destination: string) { return this.withPath(source, 'READ', async (src) => this.withPath(destination, 'WRITE', async (dest) => { await fs.cp(src, dest, { recursive: true }); return { source: src, destination: dest }; })); }
  move(source: string, destination: string) { return this.rename(source, destination); }
  async compress(source: string, destination: string) { const src = assertSafePath(source, this.settings(), 'READ'); const dest = assertSafePath(destination, this.settings(), 'WRITE'); if (process.platform === 'win32') await execFileAsync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', `Compress-Archive -LiteralPath '${src.replace(/'/g, "''")}' -DestinationPath '${dest.replace(/'/g, "''")}' -Force`], { timeout: 30000 }); else await execFileAsync('zip', ['-r', dest, src], { timeout: 30000 }); return { source: src, destination: dest }; }
  async extract(source: string, destination: string) { const src = assertSafePath(source, this.settings(), 'READ'); const dest = assertSafePath(destination, this.settings(), 'WRITE'); await fs.mkdir(dest, { recursive: true }); if (process.platform === 'win32') await execFileAsync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', `Expand-Archive -LiteralPath '${src.replace(/'/g, "''")}' -DestinationPath '${dest.replace(/'/g, "''")}' -Force`], { timeout: 30000 }); else await execFileAsync('unzip', ['-o', src, '-d', dest], { timeout: 30000 }); return { source: src, destination: dest }; }
  delete(file: string) { return this.withPath(file, 'DELETE', async (target) => { await fs.rm(target, { recursive: true, force: false }); return { path: target, deleted: true }; }); }
  private async withPath<T>(input: string, operation: 'READ' | 'WRITE' | 'DELETE', work: (target: string) => Promise<T>) { if (!input?.trim()) throw new Error('A path is required.'); return work(assertSafePath(input, this.settings(), operation)); }
}

function redactSecrets(value: string) { return value.replace(/(sk-[A-Za-z0-9_-]{12,}|nvapi-[A-Za-z0-9_-]{8,}|AIza[A-Za-z0-9_-]{12,}|(api[_-]?key|token|secret|password)\s*[:=]\s*)[^\s,;]+/gi, '$1[REDACTED]'); }
