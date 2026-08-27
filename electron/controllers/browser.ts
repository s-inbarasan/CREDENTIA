import path from 'node:path';
import fs from 'node:fs';
import { app } from 'electron';
import type { Browser, BrowserContext, Page } from 'playwright';

export class BrowserController {
  private browser?: Browser;
  private context?: BrowserContext;
  private page?: Page;
  private stopped = false;
  stop() { this.stopped = true; void this.close(); }
  resume() { this.stopped = false; }
  private assertReady() { if (this.stopped) throw new Error('Browser automation stopped by emergency stop.'); if (!this.page) throw new Error('Browser is not open.'); return this.page; }
  private async ensure() {
    if (this.browser && this.page) return this.page;
    const { chromium } = await import('playwright');
    this.browser = await chromium.launch({ headless: false, channel: process.platform === 'win32' ? 'chrome' : undefined });
    this.context = await this.browser.newContext({ acceptDownloads: true });
    this.page = await this.context.newPage();
    return this.page;
  }
  async open(url?: string) { const page = await this.ensure(); if (url) await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }); return this.state(); }
  async navigate(url: string) { const page = this.page ?? await this.ensure(); await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }); return this.state(); }
  async search(query: string, engine = 'https://www.google.com/search?q=') { return this.navigate(`${engine}${encodeURIComponent(query)}`); }
  async click(selector: string) { const page = this.assertReady(); const locator = selector.startsWith('text=') ? page.getByText(selector.slice(5), { exact: false }).first() : page.locator(selector).first(); await locator.click({ timeout: 15000 }); return this.state(); }
  async type(selector: string, text: string) { const page = this.assertReady(); const locator = selector.startsWith('label=') ? page.getByLabel(selector.slice(6)).first() : page.locator(selector).first(); await locator.fill(text, { timeout: 15000 }); return this.state(); }
  async press(selector: string, key: string) { const page = this.assertReady(); await page.locator(selector).first().press(key); return this.state(); }
  async scroll(amount = 700) { const page = this.assertReady(); await page.mouse.wheel(0, amount); return this.state(); }
  async tabs() { if (!this.context) return []; return this.context.pages().map((page, index) => ({ index, url: page.url(), title: '' })); }
  async switchTab(index: number) { if (!this.context) throw new Error('Browser is not open.'); const pages = this.context.pages(); if (!pages[index]) throw new Error(`Tab ${index} does not exist.`); this.page = pages[index]; return this.state(); }
  async newTab(url?: string) { if (!this.context) await this.ensure(); const page = await this.context!.newPage(); this.page = page; if (url) await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }); return this.state(); }
  async extract(selector?: string) { const page = this.assertReady(); const locator = selector ? page.locator(selector) : page.locator('body'); const text = await locator.innerText({ timeout: 15000 }); return { url: page.url(), title: await page.title(), text: text.slice(0, 50000) }; }
  async snapshot() { const page = this.assertReady(); const elements = await page.locator('button, a, input, textarea, select, [role="button"], [role="textbox"]').evaluateAll((nodes) => nodes.slice(0, 200).map((node: any) => ({ tag: node.tagName, text: (node.innerText || node.getAttribute('aria-label') || node.getAttribute('placeholder') || '').trim().slice(0, 160), role: node.getAttribute('role'), type: node.getAttribute('type'), href: node.getAttribute('href') }))); return { url: page.url(), title: await page.title(), elements }; }
  async download(selector: string) { const page = this.assertReady(); const dir = path.join(app.getPath('userData'), 'downloads'); fs.mkdirSync(dir, { recursive: true }); const [download] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), page.locator(selector).first().click()]); const filePath = path.join(dir, download.suggestedFilename()); await download.saveAs(filePath); return { path: filePath, filename: download.suggestedFilename() }; }
  async state() { const page = this.assertReady(); return { url: page.url(), title: await page.title(), tabs: await this.tabs() }; }
  async close() { await this.browser?.close(); this.browser = undefined; this.context = undefined; this.page = undefined; return { closed: true }; }
}
