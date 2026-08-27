<div align="center">

# 🌌 Credentia
**Advanced Cybersecurity Academy & Defensive Protocol Suite**

[![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.x-0055FF?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

An elite, production-ready cybersecurity sandbox designed to bridge the gap between theoretical knowledge and practical defensive skills. 

[Explore Features](#-key-features) • [View Curriculum](#-comprehensive-curriculum) • [Local Setup](#-installation--setup) • [Tech Stack](#%EF%B8%8F-tech-stack)

</div>

---

## 💎 Introduction

**Credentia** is a comprehensive, full-stack cybersecurity hub tailored for security professionals, researchers, and students. It merges an immersive **10-module interactive academy** with a suite of dynamic defensive tools, all wrapped in a high-fidelity **Cosmic Slate Theme** with fluid layout animations.

This repository enforces safe coding practices, secure session handling, strict input sanitation, and zero-trust principles, making it both a learning tool and a reference architecture for secure modern web applications.

---

## 🚀 Key Features

### 🎓 The Learning Hub (Academy)
A fully structured, interactive curriculum taking learners from zero-knowledge to defensive competence.
- **Progress Tracking Engine**: Track course progression, module mastery, and quiz performance.
- **Interactive Quizzes**: Reinforce learnings through scenario-based defensive security questionnaires at the end of every section.
- **Skill Tree Visualization**: A dynamic, node-based visual roadmap of the learner's journey.

### 🛡️ Advanced Defensive Utility Suite
A modular grid of isolated, client-side security utilities:
- **Password Strength Analyzer**: Advanced character analysis, entropy scoring, and real-time cracking-time estimations.
- **Phishing Detector**: Scans potential phishing vectors, URLs, and email patterns with robust local heuristics.
- **File Integrity Verifier**: Client-side secure hash generators supporting `SHA-256` and `SHA-512` protocols for file validation.
- **String Transcoder**: Low-overhead utility to securely encode or decode Base64, Hex, and URL matrices.

### ☄️ Immersive Visual Environment
- **Cosmic Slate UI**: A premium dark-mode interface designed for extended reading without eye fatigue.
- **Fluid Layout Animations**: Powered by Framer Motion, featuring seamless page transitions, interactive hover states, and dynamic dialog overlays.

---

## 📚 Comprehensive Curriculum

The platform includes a professionally designed 10-module beginner-to-advanced curriculum:

1. **The Cybersecurity Landscape**: CIA Triad & Security Mindset
2. **The Digital Battlefield**: Threat Vectors, Vulnerabilities & APTs
3. **The Human Element**: Social Engineering & Phishing Tactics
4. **Networking Fundamentals**: OSI Model, TCP/IP & Secure Connectivity
5. **Identity & Access Management**: Authentication, MFA & Access Controls
6. **Defensive Tools & Hardening**: Firewalls, EPP, Encryption & Patching
7. **Data Privacy & Protection**: GDPR, CCPA & Data Classification
8. **Incident Response & Resilience**: Disaster Recovery & Business Continuity
9. **Web & Application Security**: OWASP Top 10 & Cloud Security
10. **The Future & Practical Awareness**: IoT, AI Threats & Quantum Security

---

## 🛠️ Tech Stack

### Frontend Architecture
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (v4)
- **Animation**: Framer Motion (`motion/react`)
- **Icons**: Lucide React
- **Typography**: Space Grotesk (Headings) / Inter (Body) / JetBrains Mono (Code/Telemetry)

### Backend & Persistence
- **Runtime**: Node.js / Express
- **Database / Auth**: Supabase (PostgreSQL with Row-Level Security)
- **Routing**: React Router DOM (Browser-side)

---

## 📦 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)
- A Supabase Project (for Authentication & Database)

### 1. Clone & Install
```bash
git clone https://github.com/your-org/credentia.git
cd credentia
npm install
```

### 2. Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```
Populate `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

### 3. Run Development Server
```bash
npm run dev
```
The server will start on port `3000`. Open `http://localhost:3000` in your browser.

### 4. Production Build
```bash
npm run build
npm run start
```

---

## 🔒 Security Protocols

Credentia implements strict security boundaries:
1. **No Sensitive Browser Storage**: User metadata and course progress are bound directly to active JWT structures verified via Supabase.
2. **Autofill Hardening**: Custom CSS overrides guard against browser auto-fill leaks while preserving the dark-mode aesthetic.
3. **Ephemeral Local Closures**: Defensive tools reside in isolated state closures. Action prompts are dual-verified (`Clear? [Yes] [No]`) to avoid accidental leakage.
4. **Row-Level Security (RLS)**: PostgreSQL tables enforce `auth.uid() = user_id` rules preventing lateral cross-tenant operations.

---

## 📂 Project Structure

```text
credentia/
├── src/
│   ├── components/      # React functional components (LearningHub, SecuritySuite, etc.)
│   ├── data/            # Local JSON data & curriculum definitions
│   ├── lib/             # Utility functions, Supabase client initialization
│   ├── App.tsx          # Main application routing and state management
│   ├── index.css        # Tailwind global directives
│   └── main.tsx         # React DOM entry point
├── public/              # Static assets (logos, raw JSON files)
├── package.json         # Project dependencies and scripts
├── tailwind.config.js   # Tailwind configuration
├── vite.config.ts       # Vite bundler configuration
└── README.md            # You are here!
```

---

## 🤝 Contributing

We welcome contributions to expand the academy's curriculum or enhance the defensive tools. 
Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before submitting pull requests.

## 📄 License

This project is open-source software licensed under the terms of the [MIT License](LICENSE.md).

*Copyright © 2026 CREDENTIA Team. All rights reserved.*
