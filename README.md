# TARS — Autonomous AI Computer Agent

TARS is a Windows desktop agent that turns a high-level objective into a bounded plan, selects structured tools, operates the real computer, observes state, recovers from failures, verifies important outcomes, and reports concise status. It uses API-based AI providers only; there is no local LLM.

## Architecture

The Electron main process is the trusted host boundary. It owns encrypted provider credentials, the provider-agnostic OpenAI-compatible API client, task state, the permission broker, the emergency-stop path, audit logging, and the real controllers. The React renderer communicates through a narrow context-isolated preload bridge and never receives API keys or Node.js access.

| Layer | Implementation |
| --- | --- |
| Agent loop | Adaptive planning, structured tool calling, bounded steps, retry/replan, observations, verification, cancellation |
| Providers | OpenAI-compatible, Anthropic-compatible, Google-compatible, custom base URLs, multi-key rotation, fallback, retry/backoff, usage and latency tracking |
| Host control | Native mouse/keyboard via `@nut-tree-fork/nut-js`, screen capture via `screenshot-desktop`, Windows process/window commands via PowerShell |
| Browser | Playwright with real Chromium/Chrome, DOM/accessibility-first selectors, tab management, downloads and extraction |
| Filesystem | Validated read/write/move/copy/delete/archive tools with protected system and credential paths |
| Terminal | PowerShell, CMD, Python, and Git with stdout/stderr/exit-code/duration, timeout, cancellation, and blocked destructive patterns |
| Sandbox | Temporary TARS-owned workspace and process boundary. It is explicitly not a VM or container. |
| Safety | Low/medium/high risk classification, explicit confirmation modal, task-scoped approvals, audit events, redaction, global emergency stop |
| State | Local JSON state and JSONL audit log under Electron `userData`; secrets use Electron OS-backed safeStorage when available |

Webpage, document, PDF, email, source-code, and terminal contents are treated as untrusted data. They are included as evidence for the user's objective and cannot override the system policy or user permissions.

## Windows setup

Install Node.js 22 or newer, clone the repository, and install dependencies:

```powershell
npm install
npx playwright install chromium
```

Set provider keys as environment variables or configure them inside **AI providers**. Supported environment variables include `TARS_OPENAI_API_KEY`, `TARS_ANTHROPIC_API_KEY`, `TARS_GOOGLE_API_KEY`, and corresponding `TARS_*_BASE_URL` and `TARS_*_MODEL` overrides. Keys entered in the UI are stored by the Electron host, not in frontend storage.

Start development mode with:

```powershell
npm run dev
```

The production Windows unpacked build can be generated with:

```powershell
npm run build:web
npx tsc -p tsconfig.electron.json
npx electron-builder --win dir
```

The NSIS installer is built on a Windows build host with:

```powershell
npm run build
```

The Linux development environment used for this repository can generate the Windows unpacked directory, but cannot execute Windows GUI input or produce a signed NSIS installer without a Windows signing environment. The implementation intentionally reports Windows-only capabilities as unavailable rather than simulating them on another OS.

## First run

Open **System check** and run the live diagnostics. Configure a primary provider and optional fallback provider in **AI providers**, then select routing and safety defaults in **Settings**. Start an objective in **Command center**. Medium- and high-risk actions pause on an explicit action card. **STOP TARS** and `Control+Shift+Escape` stop the agent loop, active terminal processes, browser automation, sandbox processes, and native computer actions independently of the model.

## Verification

The repository includes automated permission and sandbox tests:

```powershell
npm run lint
npm test
```

The UI build and Electron main/preload TypeScript compilation are both part of the validation path. Host-specific manual scenarios must be run on an actual Windows desktop because screen capture, native input, PowerShell window management, installed applications, and Chrome are OS capabilities.

## Project structure

```text
electron/
  agent/          provider layer, contracts, tool schemas, permission broker, agent loop
  controllers/    computer, applications, filesystem, terminal, browser
  sandbox/        temporary workspace and execution boundary
  security/       path validation and risk classification
  storage/        local state, safeStorage credentials, redacted audit log
  main.ts         trusted Electron host and IPC handlers
  preload.ts      context-isolated renderer bridge
src/
  App.tsx         connected TARS control center
  index.css       desktop UI design system
```
