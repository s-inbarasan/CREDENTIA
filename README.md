# 🛡️ Credentia | Future of AI Defense

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)

**Credentia** is an all-in-one AI-powered cybersecurity mentor designed to empower users with threat analysis, password intelligence, and digital identity protection. Built with a futuristic "Neural Link" interface, it provides an immersive learning experience to help you stay safe in the evolving digital landscape.

---

## 🚀 Key Features

- **🧠 AI Cyber Mentor**: Real-time cybersecurity assistance powered by Google Gemini.
- **🔐 Password Intelligence**: Advanced analysis of password strength and vulnerability.
- **🎣 Phishing Detection**: AI-driven analysis of suspicious links and messages.
- **🎓 Learning Hub**: Interactive modules covering essential cybersecurity topics with XP and badge rewards.
- **🛡️ Security Health Check**: Comprehensive digital posture assessment with personalized recommendations.
- **🌐 Real-time Sync**: Seamless profile and progress synchronization via Supabase.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion (Motion)
- **Backend/Database**: Supabase (Auth, Database, Storage)
- **AI Integration**: Google Gemini AI
- **Visuals**: Three.js for immersive 3D backgrounds
- **Deployment**: Optimized for Vercel

---

## 📦 Project Structure

The repository follows a professional industry-standard structure:

```text
/
├── public/                # Static assets
├── src/                   # Source code
│   ├── components/        # Reusable UI components
│   ├── data/              # Static data and curriculum
│   ├── services/          # API and external service integrations
│   ├── utils/             # Helper functions and logic
│   ├── types.ts           # TypeScript definitions
│   ├── supabase.ts        # Supabase client configuration
│   └── App.tsx            # Main application entry
├── index.html             # Entry HTML file
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

---

## 🛠️ Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/s-inbarasan/CREDENTIA.git
   cd CREDENTIA
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

---

## 🚢 Deployment

This project is optimized for **Vercel**. 

1. Push your changes to GitHub.
2. Connect your repository to Vercel.
3. Add the environment variables in the Vercel dashboard.
4. Deploy with one click!

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Developed by [Inbarasan](https://github.com/s-inbarasan)*
