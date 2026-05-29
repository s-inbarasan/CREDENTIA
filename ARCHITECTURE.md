# 🏗️ CREDENTIA: Technical Architecture Guide

This document provides a deep dive into the "Under the Hood" logic of the CREDENTIA platform, designed for technical recruiters and developers interested in high-fidelity, gamified educational systems.

---

## 🧠 1. The Dialogue & Interaction Engine

CREDENTIA utilizes a sophisticated interaction layer that blends real-time AI responses with cinematic UI transitions.

### ⚡ Motion-Synced Streaming
The **AI Mentor** (powered by `gemini-2.0-flash`) doesn't just return text; it streams it.
- **Implementation:** The `ChatPanel.tsx` component handles the response stream, splitting the AI's output into words and simulating a "typing" effect with a 30ms delay per word.
- **Animation:** Every message is wrapped in a `motion.div` from `motion/react`, ensuring that as the dialogue grows, the UI responds with fluid, spring-based physics.

### 🤖 AI Mentor Context
The mentor is initialized with a specialized system instruction that defines its persona as a "Cybersecurity Mentor." It maintains a sliding window of conversation history, normalized into the `role/parts` schema required by the Google Generative AI SDK.

---

## 📚 2. Modular Data & Curriculum Mapping

The learning experience is entirely data-driven, allowing for rapid expansion of the curriculum without touching the core engine.

### 🗺️ The Topic Schema
The curriculum is defined in `src/data/learningTopics.ts` using a strictly typed `Topic[]` array.
- **Sections:** Each topic is broken down into `intro`, `concept`, `decision`, and `summary` sections.
- **Decision Nodes:** The `decision` type triggers interactive exercises where users must apply the "Hacker Mindset" to solve real-world scenarios.
- **Quiz Integration:** Every topic concludes with a `quiz` array, which feeds into the gamification engine to calculate XP rewards.

---

## 🎮 3. Real-Time Progression & Gamification

CREDENTIA leverages **Supabase** as a real-time state orchestrator to manage user progression and global stats.

### ⚡ Real-Time State Sync
The app uses a "Reactive UI" pattern.
- **Postgres Changes:** Persistent listeners on the `profiles`, `chat_sessions`, and `recent_activity` tables ensure the UI reflects database changes instantly without page reloads.
- **XP Thresholds:** As users complete topics and pass quizzes, their `xp` and `stats` are updated via Supabase. The `badges.ts` utility then calculates if the user has crossed thresholds for new "Neural Badges."

### 🛡️ Cryptographic Identity
User profiles are secured via Supabase Auth, with initial progression schemas (XP: 0, Level: 1) initialized during the `Onboarding.tsx` flow.

---

## 🔍 4. Forensic Tools & Browser-Side Logic

Beyond the curriculum, CREDENTIA includes a suite of forensic tools that run entirely in the user's browser.

- **Exif Analysis:** Uses the `exifr` library to parse binary image data, identifying GPS coordinates and device metadata.
- **Privacy Stripping:** Implements a canvas-based redraw method to strip metadata from images before they are downloaded.
- **Security Suite:** Includes local implementations of hashing (Web Crypto API), JWT inspection, and port exploration.

---

<p align="center">
  <em>CREDENTIA Architecture v4.0.0 / Neural Link Stable</em>
</p>
