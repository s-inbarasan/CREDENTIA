# 🌌 Credentia — Advanced Cybersecurity Academy & Security Protocols

<p align="center">
  <img src="./public/logo.png" alt="Credentia Logo" width="120" height="120" onerror="this.src='https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-alert.svg'" />
</p>

<p align="center">
  <strong>An Elite Cybersecurity Learning Sandbox and Defensive Protocol Suite.</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-installation--setup">Setup</a> •
  <a href="#-security-protocols">Security Suite</a> •
  <a href="#-mit-license">License</a>
</p>

---

## 💎 Introduction

**Credentia** is a comprehensive, production-ready full-stack cybersecurity hub designed for professionals, researchers, and security students. It features an interactive learning academy, dynamic security evaluation protocols, cryptographic suites, and passive analysis tools, framed by a high-fidelity **Cosmic Slate Theme** with fluid layout animations.

Our goal is to build secure, robust applications utilizing modern development patterns. This repository enforces safe code practices, secure session handling, strict input sanitation, and zero-trust principles.

---

## 🚀 Features

### 1. 🎓 Dynamic Academy & Learning Progress
- **The Complete Cybersecurity Bootcamp**: From zero knowledge to advanced defensive capabilities.
- **Progress Tracking Engine**: Track your active course progression, module mastery, and quiz performance (resets to actual completed modules count out of 4 modules).
- **Interactive Quizzes**: Reinforce learnings through scenario-based defensive security questionnaires.
- **Account-Enforced Enrollment**: Strict session controls ensuring guest accounts must sign up or sign in before starting any learning pathways to preserve progress securely.

### 2. 🛡️ Advanced Defensive Utility Suite
- **Interactive Security Suite**: A modular, collapsible grid of defensive utilities:
  - **Password Strength Analyzer**: Complete character analysis with real-time feedback and clear-state confirmation safety protocols.
  - **Phishing Detector**: Scans potential phishing vectors and email patterns with robust local heuristics.
  - **File Integrity Verifier**: Client-side secure hash generators supporting standard `SHA-256` and `SHA-512` protocols.
  - **Base64/Hex/URL Transcoder**: Low-overhead utility to cleanly encode or decode string matrices securely.

### 3. ☄️ Immersive Visual Environment
- **ThreeJS Cybernetic Starfield Background**: Beautiful high-performance procedural space starfield background with smooth interactive warping controls on page entries.
- **Seamless Universal Overlay Menu**: Premium minimalist "More" drawer with fluid, high-performance entrance transitions via Framer Motion.

---

## 🛠️ System Architecture

- **Frontend**: React (18+), Vite, Tailwind CSS (v4), Framer Motion (`motion/react`)
- **Backend / API**: Express.js server bundled with `esbuild` for enterprise compatibility (CommonJS target output bypassing Node’s ES Module paths checks)
- **Database / Auth**: Supabase (PostgreSQL with RLS) for persistent user profiles, module completion logs, and security tracking data.
- **Build / Target Platforms**: Fully optimized and configured for Vercel Serverless and standard Cloud Run container engines.

---

## 📦 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)

### Step 1: Clone the Project & Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to create your local variables:
```bash
cp .env.example .env
```
Populate `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

### Step 3: Run Development Server
```bash
npm run dev
```
The server will start on port `3000` (externally routed).

### Step 4: Production Compilation
```bash
npm run build
```

---

## 🔒 Security Protocols

We implement a zero-trust architecture across all components:
1. **No Sensitive Browser Storage**: User metadata and course progress are bound directly to active JWT structures verified server-side.
2. **Autofill Hardening**: Explicit custom CSS overrides guarding against browser auto-fill leaks (with proper dark-mode theme preservation).
3. **Collapsible Safe Sandboxes**: Each tool resides in isolated state closures. Clear action prompts are dual-verified (`Clear? [Yes] [No]`) to avoid unintended leakage or accidental deletion of scanned telemetry.
4. **Row-Level Security**: Standard PostgreSQL tables enforce `auth.uid() = user_id` rules preventing lateral cross-tenant operations.

---

## 🤝 Code of Conduct

Participation in this project is subject to the provisions of the [Code of Conduct](CODE_OF_CONDUCT.md). We expect all contributors to adhere to polite, constructive, and highly professional community interactions.

---

## 📄 MIT License

This project is open-source software licensed under the terms of the [MIT License](LICENSE.md).

*Copyright © 2026 CREDENTIA Team. All rights reserved.*
