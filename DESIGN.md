# 🎨 Credentia — System & Visual Design Specification

This document details the visual identity, architectural hierarchy, typography pairing, and user experience paradigms applied in the **Credentia** application.

---

## 🌌 Visual Identity: The "Cosmic Slate" Theme

Credentia is styled with a highly polished, futuristic, and professional interface tailored for security professionals.

### 1. Color Palette Matrix
- **Canvas Base**: `#020408` (Pitch Dark) to `#0a0f1d` (Deep Slate Space).
- **Core Card Backgrounds**: `rgba(6, 11, 17, 0.6)` with a premium `backdrop-blur-md` overlay, bordered by a subtle `rgba(255, 255, 255, 0.05)` or `0.1` vector line.
- **Defensive Accents**:
  - 🌐 **Cyber Blue** (`#00f2ff` / `rgb(0, 242, 255)`): Represents intelligence, decryption status, and primary active controls.
  - ⚡ **Cyber Purple** (`#bc00ff` / `rgb(188, 0, 255)`): Used for learning pathways, structural modules, and user level metrics.
  - 🟢 **Cyber Green** (`#39ff14`): Denotes safe systems, verified integrity, and passed quizzes.
  - 🔴 **Cyber Red** (`#ff073a`): Flags vulnerabilities, critical strength indicators, and clear-state confirmation alerts.

### 2. Micro-Animations & Motion Principles
We use `Framer Motion` (imported from `motion/react`) to drive spatial context:
- **Warping Starfields**: An interactive ThreeJS particle canvas that warps into a high-speed star-tunnel upon entering active dashboard routes.
- **Universal Overlay Menu**: Staggered navigation links smoothly fading in on the Z-axis, with physical exit dampening (`easeOut`).
- **Collapsible Suite Expanders**: Custom spring transitions facilitating instant content rendering without introducing visual popping or layout shifting.

---

## ✍️ Typography Pairing

The visual layout prioritizes readability and structural scannability. We pair display-grade geometric sans-serifs with dense monospace accents:

1. **Space Grotesk / Outfit** (Display & Headings):
   - Applied to titles, promotional micro-banners, and primary nav actions.
   - Enforced with `font-black tracking-tight text-glow uppercase` properties to establish a robust, modern technological rhythm.
2. **Inter** (Primary Body Copy):
   - Clean, highly legible sans-serif for course outlines, descriptions, and system notifications.
   - Restricts line height to a comfortable `leading-relaxed` ratio and uses `text-white/60` for comfortable, non-fatiguing reading.
3. **JetBrains Mono / Fira Code** (System Telemetry & Actions):
   - Powering hashes, transcode outputs, file analyzer telemetry, and small metadata cards.
   - Formatted in `text-[10px] tracking-widest font-bold uppercase` styles.

---

## 🛠️ Security State Architectures

### 1. Password Autofill Override
Browsers regularly inject stark white backgrounds and black text on input fields when auto-filling credentials, breaking immersive dark-theme experiences and sometimes hiding icons (e.g., password visibility toggles). We solve this through CSS shadow-inset hardening:
```css
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px #060b11 inset !important;
  -webkit-text-fill-color: #ffffff !important;
}
```

### 2. Ephemeral Local Closures
- The defensive suite utilities maintain their calculations entirely in isolated state buckets.
- To prevent unintentional copy-paste exposures, any user-triggered deletion requires secondary affirmative state confirmations (`Clear? [Yes] [No]`).
- Any transition between course views resets localized transient variables, ensuring complete cache sanitization.

---

## 📊 Component Structure & Separation of Concerns

- **`src/App.tsx`**: Manages global routing, active session state synchronization with Supabase, dashboard headers, and layout transitions.
- **`src/components/LandingPage.tsx`**: Immersive landing portal showcasing features, a clean, high-contrast hero segment, responsive grid features, and unified overlay controls.
- **`src/components/LearningHub.tsx`**: Houses the Academy, containing course syllabi, progress bars matching the updated 10-module bootcamp limit, and dynamic module drawers.
- **`src/components/SecuritySuite.tsx`**: Modular container representing independent defensive apps rendered inside optimized, collapsible tool frames.
